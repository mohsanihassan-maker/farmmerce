import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// GET /api/trace/:id - Get Public Traceability Details
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const product = await prisma.product.findUnique({
            where: { traceabilityId: id },
            include: {
                farmer: {
                    select: {
                        name: true,
                        email: true,
                        profile: {
                            select: {
                                farmName: true,
                                location: true,
                                bio: true
                            }
                        }
                    }
                },
                journey: {
                    orderBy: { date: 'asc' }
                },
                category: true
            }
        });

        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        res.json({
            productName: product.name,
            description: product.description,
            imageUrl: product.imageUrl,
            category: product.category,
            harvestDate: product.harvestDate,
            farm: {
                name: product.farmer.profile?.farmName || product.farmer.name,
                location: product.farmer.profile?.location || 'Local Farm',
                bio: product.farmer.profile?.bio || 'Dedicated to sustainable farming.'
            },
            co2Saved: 1.2,
            journey: product.journey.length > 0 ? product.journey : [
                { stage: 'Harvested', date: product.harvestDate || product.createdAt, location: product.farmer.profile?.location || 'Farm' },
                { stage: 'Ready for Sale', date: product.createdAt, location: 'Marketplace' }
            ]
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to trace product' });
    }
});

export default router;
