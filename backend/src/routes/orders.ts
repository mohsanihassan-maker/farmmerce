import express from 'express';
import { PrismaClient } from '@prisma/client';
import { createNotification } from './notifications';

const router = express.Router();
const prisma = new PrismaClient();

// POST /api/orders - Create a new order
router.post('/', async (req, res) => {
    try {
        const { buyerId, items, shippingAddress, paymentMethod } = req.body;

        // Calculate total amount from database prices to ensure accuracy (security)
        let totalAmount = 0;
        const orderItemsData = [];

        for (const item of items) {
            const product = await prisma.product.findUnique({ where: { id: item.productId } });
            if (!product) {
                return res.status(404).json({ error: `Product ID ${item.productId} not found` });
            }
            // Check stock? For MVP, we skip strictly enforcing stock but logic would go here.

            const itemTotal = Number(product.price) * item.quantity;
            totalAmount += itemTotal;

            orderItemsData.push({
                productId: item.productId,
                quantity: item.quantity,
                price: product.price // Snapshot price
            });
        }

        // Transaction to create order, items, and deduct stock
        const order = await prisma.$transaction(async (tx) => {
            // 1. Create the order
            const newOrder = await tx.order.create({
                data: {
                    buyerId: Number(buyerId),
                    totalAmount: totalAmount,
                    shippingAddress,
                    paymentMethod,
                    status: 'PENDING',
                    items: {
                        create: orderItemsData
                    }
                },
                include: { items: { include: { product: { include: { farmer: true } } } } }
            });

            // 2. Deduct stock for each item
            for (const item of items) {
                await tx.product.update({
                    where: { id: item.productId },
                    data: {
                        stock: {
                            decrement: item.quantity
                        }
                    }
                });
            }

            return newOrder;
        });

        // Notify each unique farmer about the new order
        const farmerIds = [...new Set(order.items.map((i: any) => i.product.farmerId))];
        for (const farmerId of farmerIds) {
            await createNotification(
                farmerId as number,
                '🛒 New Order Received',
                `Order #${order.id} has been placed for your products. Total: ₦${Number(totalAmount).toLocaleString()}.`,
                'ORDER'
            );
        }

        res.status(201).json(order);

    } catch (error) {
        console.error('Create Order Error:', error);
        res.status(500).json({ error: 'Failed to create order' });
    }
});

// GET /api/orders - Get orders with optional filtering
router.get('/', async (req, res) => {
    try {
        const { buyerId, farmerId } = req.query;
        let where: any = {};

        if (buyerId) {
            where.buyerId = Number(buyerId);
        }

        if (farmerId) {
            // Filter orders that contain products from this farmer
            where.items = {
                some: {
                    product: {
                        farmerId: Number(farmerId)
                    }
                }
            };
        }

        const orders = await prisma.order.findMany({
            where,
            include: {
                items: {
                    include: { product: true }
                },
                buyer: {
                    select: { name: true, email: true }
                },
                deliveryAgent: {
                    select: { name: true, phone: true }
                }
            },
            orderBy: { createdAt: 'desc' }
        });

        // If filtering by farmer, we might want to filter the items shown to only those belong to the farmer
        // but for now, showing the whole order is okay for simple logic, or we can filter in JS.
        let result = orders;
        if (farmerId) {
            result = orders.map(order => ({
                ...order,
                // Optional: Filter items to only show those belonging to this farmer
                // items: order.items.filter(item => item.product.farmerId === Number(farmerId))
            }));
        }

        res.json(result);
    } catch (error) {
        console.error('Fetch Orders Error:', error);
        res.status(500).json({ error: 'Failed to fetch orders' });
    }
});

// GET /api/orders/user/:userId - Get orders for a user (Legacy/Helper)
router.get('/user/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const orders = await prisma.order.findMany({
            where: { buyerId: Number(userId) },
            include: {
                items: {
                    include: { product: true }
                }
            },
            orderBy: { createdAt: 'desc' }
        });
        res.json(orders);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch user orders' });
    }
});

// GET /api/orders/:id - Get specific order details
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const order = await prisma.order.findUnique({
            where: { id: Number(id) },
            include: {
                items: {
                    include: { product: true }
                },
                buyer: {
                    select: { name: true, email: true }
                },
                deliveryAgent: {
                    select: { name: true, phone: true }
                }
            }
        });
        if (!order) return res.status(404).json({ error: 'Order not found' });
        res.json(order);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch order' });
    }
});

// PUT /api/orders/:id/status - Update order status or tracking note
router.put('/:id/status', async (req, res) => {
    try {
        const { id } = req.params;
        const { status, trackingNote } = req.body;

        const updatedOrder = await prisma.order.update({
            where: { id: Number(id) },
            data: {
                ...(status && { status }),
                ...(trackingNote !== undefined && { trackingNote })
            }
        });

        // Notify buyer about status change
        if (status) {
            const statusMessages: Record<string, string> = {
                CONFIRMED: '✅ Your order has been confirmed by the farmer.',
                READY_FOR_PICKUP: '📦 Your order is packed and ready for pickup.',
                SHIPPED: '🚚 Your order is on the way!',
                DELIVERED: '🎉 Your order has been delivered. Enjoy your fresh produce!'
            };
            const msg = statusMessages[status];
            if (msg) {
                await createNotification(
                    updatedOrder.buyerId,
                    `Order #${id} — ${status.replace(/_/g, ' ')}`,
                    msg,
                    'ORDER'
                );
            }
        }

        res.json(updatedOrder);
    } catch (error) {
        console.error('Update Order Status Error:', error);
        res.status(500).json({ error: 'Failed to update order status' });
    }
});

export default router;
