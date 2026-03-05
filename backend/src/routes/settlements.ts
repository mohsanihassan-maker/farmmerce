import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

const COMMISSION_RATE = 0.10; // 10% commission

// GET /api/settlements - List all settlements
router.get('/', async (req, res) => {
    try {
        const settlements = await prisma.settlement.findMany({
            include: {
                farmer: {
                    select: {
                        name: true,
                        email: true,
                        profile: true
                    }
                },
                items: {
                    include: {
                        product: true
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        });
        res.json(settlements);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch settlements' });
    }
});

// GET /api/settlements/pending - Get pending quantities for all farmers
router.get('/pending', async (req, res) => {
    try {
        // Find OrderItems that have:
        // 1. Order status is DELIVERED
        // 2. settlementId is NULL (not yet settled)
        const pendingItems = await prisma.orderItem.findMany({
            where: {
                order: {
                    status: 'DELIVERED'
                },
                settlementId: null
            },
            include: {
                product: {
                    include: {
                        farmer: {
                            include: {
                                profile: true
                            }
                        }
                    }
                }
            }
        });

        // Group by Farmer
        const groupedByFarmer: any = {};

        pendingItems.forEach(item => {
            const farmer = item.product.farmer;
            if (!groupedByFarmer[farmer.id]) {
                groupedByFarmer[farmer.id] = {
                    farmerId: farmer.id,
                    farmerName: farmer.name,
                    bankDetails: farmer.profile ? {
                        bankName: farmer.profile.bankName,
                        accountNumber: farmer.profile.accountNumber,
                        accountName: farmer.profile.accountName
                    } : null,
                    items: [],
                    totalAmount: 0
                };
            }
            groupedByFarmer[farmer.id].items.push(item);
            groupedByFarmer[farmer.id].totalAmount += Number(item.price) * item.quantity;
        });

        const result = Object.values(groupedByFarmer).map((f: any) => ({
            ...f,
            commission: f.totalAmount * COMMISSION_RATE,
            netAmount: f.totalAmount * (1 - COMMISSION_RATE)
        }));

        res.json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch pending earnings' });
    }
});

// POST /api/settlements - Create a settlement for a farmer
router.post('/', async (req, res) => {
    const { farmerId, itemIds, amount, commission, netAmount, reference } = req.body;

    try {
        const result = await prisma.$transaction(async (tx) => {
            // 1. Create the Settlement record
            const settlement = await tx.settlement.create({
                data: {
                    farmerId,
                    amount,
                    commission,
                    netAmount,
                    reference,
                    status: 'PROCESSING'
                }
            });

            // 2. Update OrderItems to link to this settlement
            await tx.orderItem.updateMany({
                where: {
                    id: { in: itemIds }
                },
                data: {
                    settlementId: settlement.id
                }
            });

            return settlement;
        });

        res.json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to create settlement' });
    }
});

// PATCH /api/settlements/:id/status - Update settlement status
router.patch('/:id/status', async (req, res) => {
    const { id } = req.params;
    const { status, reference, settlementDate } = req.body;

    try {
        const updated = await prisma.settlement.update({
            where: { id: parseInt(id) },
            data: {
                status,
                reference: reference || undefined,
                settlementDate: settlementDate ? new Date(settlementDate) : undefined
            }
        });
        res.json(updated);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to update settlement status' });
    }
});

export default router;
