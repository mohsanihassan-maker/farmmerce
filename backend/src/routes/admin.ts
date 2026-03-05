import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// GET /api/admin/stats - Platform-wide statistics
router.get('/stats', async (req, res) => {
    try {
        const userCount = await prisma.user.count();
        const farmerCount = await prisma.user.count({ where: { role: 'FARMER' } });
        const productCount = await prisma.product.count();
        const orderCount = await prisma.order.count();

        const orders = await prisma.order.findMany({
            select: { totalAmount: true }
        });
        const totalRevenue = orders.reduce((acc, order) => acc + Number(order.totalAmount), 0);

        const activeDeals = await prisma.groupDeal.count({ where: { active: true } });

        res.json({
            userCount,
            farmerCount,
            productCount,
            orderCount,
            totalRevenue,
            activeDeals,
            totalCo2Saved: orderCount * 0.75 // Aggregated mock
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch admin stats' });
    }
});

// GET /api/admin/users - List all users
router.get('/users', async (req, res) => {
    try {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                phone: true,
                address: true,
                createdAt: true,
                profile: true
            },
            orderBy: { createdAt: 'desc' }
        });
        res.json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch users' });
    }
});

// PUT /api/admin/users/:id/role - Update user role
router.put('/users/:id/role', async (req, res) => {
    try {
        const { id } = req.params;
        const { role } = req.body;

        const updatedUser = await prisma.user.update({
            where: { id: parseInt(id) },
            data: { role },
            select: { id: true, email: true, role: true }
        });

        res.json(updatedUser);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to update user role' });
    }
});

// GET /api/admin/orders - Get all orders across the platform
router.get('/orders', async (req, res) => {
    try {
        const orders = await prisma.order.findMany({
            include: {
                buyer: { select: { name: true, email: true } },
                items: {
                    include: { product: { select: { name: true } } }
                }
            },
            orderBy: { createdAt: 'desc' }
        });
        res.json(orders);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch platform orders' });
    }
});

// GET /api/admin/settings - Fetch global configurations
router.get('/settings', async (req, res) => {
    try {
        const settings = await prisma.globalSetting.findMany();
        // Convert to a more usable object format
        const settingsMap = settings.reduce((acc, s) => {
            acc[s.key] = s.value;
            return acc;
        }, {} as Record<string, string>);
        res.json(settingsMap);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch settings' });
    }
});

// POST /api/admin/settings - Update or create global configuration
router.post('/settings', async (req, res) => {
    try {
        const { key, value } = req.body;

        const setting = await prisma.globalSetting.upsert({
            where: { key },
            update: { value: String(value) },
            create: { key, value: String(value) }
        });

        res.json(setting);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to update setting' });
    }
});

export default router;
