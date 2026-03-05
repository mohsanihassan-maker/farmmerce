import express from 'express';
import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const router = express.Router();
const prisma = new PrismaClient();

// File for persisting the group-buy panel toggle state
const PANEL_STATE_FILE = path.join(__dirname, '../../group_panel_state.json');

// Get floating panel enabled state
router.get('/panel-enabled', async (req, res) => {
    try {
        const setting = await prisma.globalSetting.findUnique({
            where: { key: 'group_buy_panel_enabled' }
        });
        res.json({ enabled: setting?.value === 'true' });
    } catch (error) {
        res.json({ enabled: false });
    }
});

// Toggle floating panel (admin only)
router.patch('/panel-enabled', async (req, res) => {
    const { enabled } = req.body;
    try {
        const setting = await prisma.globalSetting.upsert({
            where: { key: 'group_buy_panel_enabled' },
            update: { value: String(enabled) },
            create: { key: 'group_buy_panel_enabled', value: String(enabled) }
        });
        res.json({ enabled: setting.value === 'true' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to update panel state' });
    }
});

// Get all active group deals
router.get('/', async (req, res) => {
    try {
        const deals = await prisma.groupDeal.findMany({
            where: { active: true },
            include: {
                product: {
                    include: {
                        farmer: {
                            select: { name: true }
                        }
                    }
                },
                groups: {
                    where: { status: 'ACTIVE' },
                    include: {
                        members: true
                    }
                }
            }
        });
        res.json(deals);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch deals' });
    }
});

// Create a new group deal
router.post('/', async (req, res) => {
    const { title, description, discountPrice, originalPrice, minParticipants, durationHours, productId, imageUrl } = req.body;

    try {
        const deal = await prisma.groupDeal.create({
            data: {
                title,
                description,
                discountPrice: parseFloat(discountPrice),
                originalPrice: parseFloat(originalPrice),
                minParticipants: parseInt(minParticipants),
                durationHours: parseInt(durationHours),
                productId: parseInt(productId),
                imageUrl,
                active: true
            }
        });
        res.status(201).json(deal);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to create deal' });
    }
});

// Start a new group for a deal
router.post('/:dealId/start', async (req, res) => {
    const { dealId } = req.params;
    const { userId } = req.body;

    try {
        const deal = await prisma.groupDeal.findUnique({
            where: { id: parseInt(dealId) }
        });

        if (!deal) return res.status(404).json({ error: 'Deal not found' });

        const expiresAt = new Date();
        expiresAt.setHours(expiresAt.getHours() + deal.durationHours);

        const group = await prisma.dealGroup.create({
            data: {
                dealId: parseInt(dealId),
                creatorId: parseInt(userId),
                expiresAt,
                members: {
                    create: { userId: parseInt(userId) }
                }
            },
            include: {
                members: true,
                deal: true
            }
        });

        res.json(group);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to start group' });
    }
});

// Join an existing group
router.post('/groups/:groupId/join', async (req, res) => {
    const { groupId } = req.params;
    const { userId } = req.body;

    try {
        const group = await prisma.dealGroup.findUnique({
            where: { id: parseInt(groupId) },
            include: {
                members: true,
                deal: true
            }
        });

        if (!group) return res.status(404).json({ error: 'Group not found' });
        if (group.status !== 'ACTIVE') return res.status(400).json({ error: 'Group is no longer active' });

        // Check if user is already a member
        const isMember = group.members.some(m => m.userId === parseInt(userId));
        if (isMember) return res.status(400).json({ error: 'User already in group' });

        const member = await prisma.groupMember.create({
            data: {
                groupId: parseInt(groupId),
                userId: parseInt(userId)
            }
        });

        // Check if group is now full
        const updatedGroup = await prisma.dealGroup.findUnique({
            where: { id: parseInt(groupId) },
            include: { members: true }
        });

        if (updatedGroup && updatedGroup.members.length >= group.deal.minParticipants) {
            await prisma.dealGroup.update({
                where: { id: parseInt(groupId) },
                data: { status: 'SUCCESS' }
            });

            // Create orders for all members
            for (const member of updatedGroup.members) {
                await prisma.order.create({
                    data: {
                        buyerId: member.userId,
                        totalAmount: group.deal.discountPrice,
                        status: 'CONFIRMED',
                        items: {
                            create: {
                                productId: group.deal.productId,
                                quantity: 1,
                                price: group.deal.discountPrice
                            }
                        }
                    }
                });
            }
        }

        res.json(member);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to join group' });
    }
});

// Get group stats
router.get('/groups/:groupId', async (req, res) => {
    try {
        const group = await prisma.dealGroup.findUnique({
            where: { id: parseInt(req.params.groupId) },
            include: {
                members: {
                    include: {
                        user: {
                            select: { name: true }
                        }
                    }
                },
                deal: {
                    include: { product: true }
                }
            }
        });
        res.json(group);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch group' });
    }
});

// Deactivate an active group deal
router.patch('/:dealId/deactivate', async (req, res) => {
    try {
        const deal = await prisma.groupDeal.update({
            where: { id: parseInt(req.params.dealId) },
            data: { active: false }
        });
        res.json(deal);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to deactivate deal' });
    }
});

export default router;
