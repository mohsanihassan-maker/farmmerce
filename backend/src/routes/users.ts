import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// GET /api/users/:id - Get user profile
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const user = await prisma.user.findUnique({
            where: { id: parseInt(id) },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                phone: true,
                address: true,
                createdAt: true,
                profile: true
            }
        });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch profile' });
    }
});

// PUT /api/users/:id - Update user profile
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { name, phone, address, profile } = req.body;

        const updatedUser = await prisma.user.update({
            where: { id: parseInt(id) },
            data: {
                name,
                phone,
                address,
                ...(profile && {
                    profile: {
                        upsert: {
                            create: {
                                farmName: profile.farmName,
                                location: profile.location,
                                bio: profile.bio,
                                applicationStatus: profile.applicationStatus
                            },
                            update: {
                                farmName: profile.farmName,
                                location: profile.location,
                                bio: profile.bio,
                                applicationStatus: profile.applicationStatus
                            }
                        }
                    }
                })
            },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                phone: true,
                address: true,
                profile: true
            }
        });

        res.json(updatedUser);
    } catch (error) {
        console.error('Update Profile Error:', error);
        res.status(500).json({ error: 'Failed to update profile' });
    }
});

// GET /api/users/:id/stats - Get user-specific statistics
router.get('/:id/stats', async (req, res) => {
    try {
        const { id } = req.params;
        const userId = parseInt(id);

        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { role: true }
        });

        if (!user) return res.status(404).json({ error: 'User not found' });

        if (user.role === 'FARMER') {
            // Stats for Farmer
            const products = await prisma.product.findMany({
                where: { farmerId: userId },
                select: { id: true, stock: true }
            });

            const lowStockCount = products.filter(p => p.stock < 5).length;

            const orderItems = await prisma.orderItem.findMany({
                where: { product: { farmerId: userId } },
                select: { price: true, quantity: true }
            });

            const totalRevenue = orderItems.reduce((acc, item) => acc + (Number(item.price) * item.quantity), 0);

            const pendingOrdersCount = await prisma.order.count({
                where: {
                    status: 'PENDING',
                    items: {
                        some: {
                            product: { farmerId: userId }
                        }
                    }
                }
            });

            res.json({
                totalRevenue,
                pendingOrders: pendingOrdersCount,
                lowStockCount,
                co2Saved: orderItems.length * 0.5 // Mock: 0.5kg per item sold locally
            });
        } else {
            // Stats for Buyer
            const orders = await prisma.order.findMany({
                where: { buyerId: userId },
                select: { totalAmount: true }
            });

            const totalSpent = orders.reduce((acc, order) => acc + Number(order.totalAmount), 0);

            const totalItemsCount = await prisma.orderItem.count({
                where: { order: { buyerId: userId } }
            });

            res.json({
                totalSpent,
                orderCount: orders.length,
                co2Saved: totalItemsCount * 0.8 // Mock: 0.8kg per item bought locally vs global
            });
        }
    } catch (error) {
        console.error('Fetch Stats Error:', error);
        res.status(500).json({ error: 'Failed to fetch statistics' });
    }
});

// GET /api/farmers/:id/profile - Public farmer profile
router.get('/:id/profile', async (req, res) => {
    try {
        const farmerId = parseInt(req.params.id);

        const farmer = await prisma.user.findFirst({
            where: { id: farmerId, role: 'FARMER' },
            select: {
                id: true,
                name: true,
                profile: true,
                products: {
                    where: { stock: { gt: 0 } },
                    include: {
                        reviews: { select: { rating: true } }
                    }
                }
            }
        });

        if (!farmer) return res.status(404).json({ error: 'Farmer not found' });

        // Compute per-product avg rating and total reviews for the farmer
        let totalRatings = 0;
        let totalReviews = 0;

        const products = farmer.products.map((p: any) => {
            const avg = p.reviews.length > 0
                ? p.reviews.reduce((s: number, r: any) => s + r.rating, 0) / p.reviews.length
                : 0;
            totalRatings += avg * p.reviews.length;
            totalReviews += p.reviews.length;
            return { ...p, avgRating: parseFloat(avg.toFixed(1)), reviewCount: p.reviews.length };
        });

        const avgRating = totalReviews > 0 ? parseFloat((totalRatings / totalReviews).toFixed(1)) : 0;

        res.json({ ...farmer, products, avgRating, totalReviews });
    } catch (error) {
        console.error('Farmer Profile Error:', error);
        res.status(500).json({ error: 'Failed to fetch farmer profile' });
    }
});

// POST /api/users/:id/apply-farmer - Apply to become a farmer
router.post('/:id/apply-farmer', async (req, res) => {
    try {
        const { id } = req.params;
        const { farmName, location, bio, bankName, accountNumber } = req.body;
        const userId = parseInt(id);

        const application = await prisma.profile.upsert({
            where: { userId: userId },
            create: {
                userId,
                farmName,
                location,
                bio,
                bankName,
                accountNumber,
                applicationStatus: 'PENDING_FARMER'
            },
            update: {
                farmName,
                location,
                bio,
                bankName,
                accountNumber,
                applicationStatus: 'PENDING_FARMER'
            }
        });

        // Notify Admins (Mock: In a real app, you'd find admins and send notifications)
        // For now, we just rely on the admin dashboard fetching pending requests.

        res.json(application);
    } catch (error) {
        console.error('Farmer Application Error:', error);
        res.status(500).json({ error: 'Failed to submit application' });
    }
});

export default router;
