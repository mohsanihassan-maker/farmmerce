import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// GET /api/products - List products with optional search/filter/sort
router.get('/', async (req, res) => {
    try {
        const { search, category, minPrice, maxPrice, sort } = req.query as Record<string, string>;

        const where: any = {};
        if (search) {
            where.OR = [
                { name: { contains: search, mode: 'insensitive' } },
                { description: { contains: search, mode: 'insensitive' } }
            ];
        }
        if (category) where.categoryName = category;
        if (minPrice) where.price = { ...where.price, gte: parseFloat(minPrice) };
        if (maxPrice) where.price = { ...where.price, lte: parseFloat(maxPrice) };

        let orderBy: any = { createdAt: 'desc' };
        if (sort === 'price_asc') orderBy = { price: 'asc' };
        else if (sort === 'price_desc') orderBy = { price: 'desc' };

        const products = await prisma.product.findMany({
            where,
            orderBy,
            include: {
                farmer: { select: { name: true, id: true } },
                reviews: { select: { rating: true } }
            }
        });

        // Attach avgRating to each product
        const result = products.map((p: any) => {
            const avg = p.reviews.length > 0
                ? p.reviews.reduce((s: number, r: any) => s + r.rating, 0) / p.reviews.length
                : 0;
            return {
                ...p,
                avgRating: parseFloat(avg.toFixed(1)),
                reviewCount: p.reviews.length
            };
        });

        res.json(result);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch products' });
    }
});

// POST /api/products - Create a new product
router.post('/', async (req, res) => {
    try {
        // harvestDate is optional string 'YYYY-MM-DD'
        const { name, description, price, unit, stock, category, imageUrl, farmerId, harvestDate } = req.body;

        // Basic validation
        if (!name || !price || !farmerId) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const product = await prisma.product.create({
            data: {
                name,
                description,
                price: parseFloat(price),
                unit: unit || 'kg',
                stock: parseInt(stock) || 0,
                categoryName: category,
                imageUrl,
                farmerId: parseInt(farmerId),
                harvestDate: harvestDate ? new Date(harvestDate) : undefined,
                // Add initial journey step automatically
                journey: {
                    create: [
                        {
                            stage: 'Product Listed',
                            location: 'Farm',
                            date: new Date(),
                            description: 'Product made available on Fammerce'
                        }
                    ]
                }
            }
        });

        res.json(product);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to create product' });
    }
});

// POST /api/products/:id/journey - Add a journey step
router.post('/:id/journey', async (req, res) => {
    try {
        const { id } = req.params;
        const { stage, location, description } = req.body;

        const step = await prisma.journeyStep.create({
            data: {
                stage,
                location,
                description,
                productId: parseInt(id)
            }
        });

        res.json(step);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to add journey step' });
    }
});

export default router;
