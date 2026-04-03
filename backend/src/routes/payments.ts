import express from 'express';
import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';
import axios from 'axios';

const router = express.Router();
const prisma = new PrismaClient();

// Paystack Secret Key (Test)
const PAYSTACK_SECRET = process.env.PAYSTACK_SECRET;

// POST /api/payments/initialize
router.post('/initialize', async (req, res) => {
    try {
        const { orderId, email, amount } = req.body;

        if (!orderId || !email || !amount) {
            return res.status(400).json({ error: 'Missing payment details' });
        }

        const response = await axios.post(
            'https://api.paystack.co/transaction/initialize',
            {
                email,
                amount: Math.round(Number(amount) * 100), // Amount in kobo
                callback_url: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/orders`,
                metadata: {
                    orderId,
                    custom_fields: [
                        {
                            display_name: "Order ID",
                            variable_name: "order_id",
                            value: orderId
                        }
                    ]
                }
            },
            {
                headers: {
                    Authorization: `Bearer ${PAYSTACK_SECRET}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        res.json(response.data.data);
    } catch (error: any) {
        console.error('Payment Init Error:', error.response?.data || error.message);
        res.status(500).json({ error: 'Failed to initialize payment', details: error.response?.data });
    }
});

// POST /api/payments/verify
router.post('/verify', async (req, res) => {
    try {
        const { reference, orderId } = req.body;

        if (!reference || !orderId) {
            return res.status(400).json({ error: 'Missing verification details' });
        }

        const response = await axios.get(
            `https://api.paystack.co/transaction/verify/${reference}`,
            {
                headers: {
                    Authorization: `Bearer ${PAYSTACK_SECRET}`
                }
            }
        );

        if (response.data.data.status === 'success') {
            await prisma.order.update({
                where: { id: Number(orderId) },
                data: {
                    status: 'CONFIRMED',
                    paymentMethod: 'card'
                }
            });
            res.json({ message: 'Payment verified and order updated' });
        } else {
            res.status(400).json({ error: 'Payment verification failed', details: response.data.data });
        }
    } catch (error: any) {
        console.error('Payment Verify Error:', error.response?.data || error.message);
        res.status(500).json({ error: 'Failed to verify payment', details: error.response?.data });
    }
});

// Webhook for Paystack - Ensures async payment verification
router.post('/webhook', async (req, res) => {
    try {
        const secret = PAYSTACK_SECRET || '';
        const hash = crypto.createHmac('sha512', secret).update(JSON.stringify(req.body)).digest('hex');
        
        if (hash === req.headers['x-paystack-signature']) {
            const event = req.body;
            console.log(`[PAYSTACK WEBHOOK] Received event: ${event.event}`);

            if (event.event === 'charge.success') {
                const { orderId } = event.data.metadata;
                const { reference, amount } = event.data;

                console.log(`[PAYSTACK WEBHOOK] Payment success for Order #${orderId}, Ref: ${reference}, Amount: ${amount / 100}`);

                if (orderId) {
                    await prisma.order.update({
                        where: { id: Number(orderId) },
                        data: {
                            status: 'CONFIRMED',
                            paymentMethod: 'card'
                        }
                    });
                    console.log(`[PAYSTACK WEBHOOK] Order #${orderId} marked as CONFIRMED`);
                }
            }
        } else {
            console.warn('[PAYSTACK WEBHOOK] Invalid signature detected');
        }
    } catch (error: any) {
        console.error('[PAYSTACK WEBHOOK] Error processing webhook:', error.message);
    }
    
    // Always return 200 to Paystack
    res.sendStatus(200);
});

export default router;
