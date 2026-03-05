import express from 'express';
import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';

const router = express.Router();
const prisma = new PrismaClient();

// Paystack Secret Key (Test)
const PAYSTACK_SECRET = process.env.PAYSTACK_SECRET || 'sk_test_mock_key';

// POST /api/payments/initialize
router.post('/initialize', async (req, res) => {
    try {
        const { orderId, email, amount } = req.body;

        if (!orderId || !email || !amount) {
            return res.status(400).json({ error: 'Missing payment details' });
        }

        // In a real app, you'd call Paystack API here
        // const response = await axios.post('https://api.paystack.co/transaction/initialize', ...)

        // For this demo, we'll return a mock authorization URL and reference
        const reference = `FAM-${Date.now()}-${orderId}`;

        res.json({
            authorization_url: 'https://checkout.paystack.com/mock',
            reference,
            message: 'Payment initialized'
        });
    } catch (error) {
        console.error('Payment Init Error:', error);
        res.status(500).json({ error: 'Failed to initialize payment' });
    }
});

// POST /api/payments/verify
router.post('/verify', async (req, res) => {
    try {
        const { reference, orderId } = req.body;

        // In a real app, you'd verify with Paystack
        // const response = await axios.get(`https://api.paystack.co/transaction/verify/${reference}`, ...)

        // Mock success
        await prisma.order.update({
            where: { id: Number(orderId) },
            data: {
                status: 'CONFIRMED',
                paymentMethod: 'card'
            }
        });

        res.json({ message: 'Payment verified and order updated' });
    } catch (error) {
        console.error('Payment Verify Error:', error);
        res.status(500).json({ error: 'Failed to verify payment' });
    }
});

// Webhook for Paystack
router.post('/webhook', (req, res) => {
    const hash = crypto.createHmac('sha512', PAYSTACK_SECRET).update(JSON.stringify(req.body)).digest('hex');
    if (hash === req.headers['x-paystack-signature']) {
        const event = req.body;
        // Handle charge.success etc.
        console.log('Paystack Webhook Event:', event.event);
    }
    res.sendStatus(200);
});

export default router;
