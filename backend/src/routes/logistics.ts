import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// GET /api/logistics/available - Get orders ready for pickup (confirmed but unassigned)
router.get('/available', async (req, res) => {
    try {
        const availableOrders = await prisma.order.findMany({
            where: {
                status: 'READY_FOR_PICKUP',
                deliveryAgentId: null
            },
            include: {
                items: { include: { product: true } },
                buyer: { select: { name: true, address: true } }
            }
        });
        res.json(availableOrders);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch available tasks' });
    }
});

// POST /api/logistics/assign/:id - Assign order to current delivery agent
router.post('/assign/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { agentId } = req.body;

        const updatedOrder = await prisma.order.update({
            where: { id: Number(id) },
            data: {
                deliveryAgentId: Number(agentId),
                status: 'SHIPPED' // Automatically move to SHIPPED when assigned
            }
        });

        res.json(updatedOrder);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to assign order' });
    }
});

// GET /api/logistics/tasks/:agentId - Get tasks for a specific agent
router.get('/tasks/:agentId', async (req, res) => {
    try {
        const { agentId } = req.params;
        const tasks = await prisma.order.findMany({
            where: { deliveryAgentId: Number(agentId) },
            include: {
                items: { include: { product: true } },
                buyer: { select: { name: true, address: true } }
            },
            orderBy: { updatedAt: 'desc' }
        });
        res.json(tasks);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch agent tasks' });
    }
});

// PUT /api/logistics/tasks/:id/status - Update delivery status
router.put('/tasks/:id/status', async (req, res) => {
    try {
        const { id } = req.params;
        const { status, trackingNote } = req.body;

        const updatedTask = await prisma.order.update({
            where: { id: Number(id) },
            data: {
                status,
                trackingNote
            }
        });

        res.json(updatedTask);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to update task status' });
    }
});

export default router;
