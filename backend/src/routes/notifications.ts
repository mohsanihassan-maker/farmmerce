import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// Helper to create a notification (exported for use in other routes)
export async function createNotification(
    userId: number,
    title: string,
    body: string,
    type: string = 'INFO'
) {
    try {
        return await prisma.notification.create({
            data: { userId, title, body, type }
        });
    } catch (err) {
        console.error('Failed to create notification:', err);
    }
}

// GET /api/notifications/:userId - Get all notifications for a user
router.get('/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const notifications = await prisma.notification.findMany({
            where: { userId: Number(userId) },
            orderBy: { createdAt: 'desc' },
            take: 50
        });
        res.json(notifications);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch notifications' });
    }
});

// PATCH /api/notifications/:id/read - Mark a notification as read
router.patch('/:id/read', async (req, res) => {
    try {
        const { id } = req.params;
        const notification = await prisma.notification.update({
            where: { id: Number(id) },
            data: { read: true }
        });
        res.json(notification);
    } catch (error) {
        res.status(500).json({ error: 'Failed to mark notification as read' });
    }
});

// PATCH /api/notifications/read-all/:userId - Mark all as read
router.patch('/read-all/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        await prisma.notification.updateMany({
            where: { userId: Number(userId), read: false },
            data: { read: true }
        });
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: 'Failed to mark all as read' });
    }
});

export default router;
