import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// GET /api/products/:id/reviews
router.get('/:id/reviews', async (req, res) => {
    try {
        const { id } = req.params;
        const reviews = await prisma.review.findMany({
            where: { productId: Number(id) },
            include: {
                user: { select: { name: true } }
            },
            orderBy: { createdAt: 'desc' }
        });
        const avg = reviews.length
            ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
            : 0;
        res.json({ reviews, avgRating: parseFloat(avg.toFixed(1)), count: reviews.length });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch reviews' });
    }
});

// POST /api/products/:id/reviews
router.post('/:id/reviews', async (req, res) => {
    try {
        const { id } = req.params;
        const { userId, rating, comment } = req.body;

        if (!userId || !rating) {
            return res.status(400).json({ error: 'userId and rating are required' });
        }
        if (rating < 1 || rating > 5) {
            return res.status(400).json({ error: 'Rating must be between 1 and 5' });
        }

        // Check user has a delivered order with this product
        const deliveredOrder = await prisma.orderItem.findFirst({
            where: {
                productId: Number(id),
                order: {
                    buyerId: Number(userId),
                    status: 'DELIVERED'
                }
            }
        });

        if (!deliveredOrder) {
            return res.status(403).json({ error: 'You can only review products from delivered orders' });
        }

        const review = await prisma.review.upsert({
            where: { userId_productId: { userId: Number(userId), productId: Number(id) } },
            update: { rating: Number(rating), comment },
            create: {
                userId: Number(userId),
                productId: Number(id),
                rating: Number(rating),
                comment
            },
            include: { user: { select: { name: true } } }
        });

        res.status(201).json(review);
    } catch (error) {
        console.error('Create Review Error:', error);
        res.status(500).json({ error: 'Failed to create review' });
    }
});

export default router;
