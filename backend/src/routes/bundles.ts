import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// GET /api/bundles - List all bundles
router.get('/', async (req, res) => {
    try {
        const bundles = await prisma.bundle.findMany({
            orderBy: { price: 'asc' }
        });
        res.json(bundles);
    } catch (error) {
        console.error('Error fetching bundles:', error);
        res.status(500).json({ error: 'Failed to fetch bundles' });
    }
});

// POST /api/bundles - Create a new bundle
router.post('/', async (req, res) => {
    try {
        const { name, familySize, price, savings, color, badge, imageUrl, accentColor, featured, items } = req.body;

        if (!name || !familySize || !price || !items || !Array.isArray(items)) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const bundle = await prisma.bundle.create({
            data: {
                name,
                familySize,
                price: parseFloat(price),
                savings,
                color,
                badge,
                imageUrl,
                accentColor,
                featured: Boolean(featured),
                items
            }
        });

        res.json(bundle);
    } catch (error) {
        console.error('Error creating bundle:', error);
        res.status(500).json({ error: 'Failed to create bundle' });
    }
});

// PUT /api/bundles/:id - Update an existing bundle
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { name, familySize, price, savings, color, badge, imageUrl, accentColor, featured, items } = req.body;

        const bundle = await prisma.bundle.update({
            where: { id: parseInt(id) },
            data: {
                name,
                familySize,
                price: price ? parseFloat(price) : undefined,
                savings,
                color,
                badge,
                imageUrl,
                accentColor,
                featured: featured !== undefined ? Boolean(featured) : undefined,
                items
            }
        });

        res.json(bundle);
    } catch (error) {
        console.error('Error updating bundle:', error);
        res.status(500).json({ error: 'Failed to update bundle' });
    }
});

// DELETE /api/bundles/:id - Delete a bundle
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.bundle.delete({
            where: { id: parseInt(id) }
        });
        res.json({ message: 'Bundle deleted successfully' });
    } catch (error) {
        console.error('Error deleting bundle:', error);
        res.status(500).json({ error: 'Failed to delete bundle' });
    }
});

export default router;
