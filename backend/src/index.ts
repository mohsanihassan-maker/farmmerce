import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import authRoutes from './routes/auth';
import productRoutes from './routes/products';
import orderRoutes from './routes/orders';
import traceRoutes from './routes/trace';
import recipeRoutes from './routes/recipes';
import userRoutes from './routes/users';
import logisticsRoutes from './routes/logistics';
import groupDealsRoutes from './routes/groupDeals';
import adminRoutes from './routes/admin';
import categoryRoutes from './routes/categories';
import settlementRoutes from './routes/settlements';
import notificationRoutes from './routes/notifications';
import reviewRoutes from './routes/reviews';
import paymentsRoutes from './routes/payments';

dotenv.config();

const app = express();
const prisma = new PrismaClient();
const port = 3000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.json({ message: 'Welcome to Fammerce API', status: 'Running' });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/trace', traceRoutes);
app.use('/api/recipes', recipeRoutes);
app.use('/api/users', userRoutes);
app.use('/api/logistics', logisticsRoutes);
app.use('/api/group-deals', groupDealsRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/settlements', settlementRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/products', reviewRoutes); // nested: /api/products/:id/reviews
app.use('/api/payments', paymentsRoutes);


// Auth Routes Placeholder (Mock) - KEEPING SIMPLE
app.post('/api/auth/register', async (req, res) => {
    try {
        const { email, password, name, role } = req.body;
        const user = await prisma.user.create({
            data: { email, password, name, role }
        });
        // Create empty profile
        await prisma.profile.create({ data: { userId: user.id, farmName: name + "'s Farm", location: "Local Region", bio: "Passionate about fresh food." } });

        res.json({ message: 'User registered', user });
    } catch (error) {
        res.status(400).json({ error: 'Registration failed', details: error });
    }
});

app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user || user.password !== password) return res.status(401).json({ error: 'Invalid credentials' });
        res.json({ message: 'Login successful', user });
    } catch (error) {
        res.status(500).json({ error: 'Login failed' });
    }
});

app.listen(port, async () => {
    console.log(`Server running on http://localhost:${port}`);

    // Auto-initialize seasonal setting if missing
    try {
        await prisma.globalSetting.upsert({
            where: { key: 'group_buy_panel_enabled' },
            update: {}, // Don't overwrite if it exists, just ensure it's there
            create: { key: 'group_buy_panel_enabled', value: 'true' }
        });
        console.log('Global settings initialized');
    } catch (e) {
        console.error('Failed to init settings:', e);
    }
});
