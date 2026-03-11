import express from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { supabase } from '../utils/supabase';


const router = express.Router();
const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret';

// Register
router.post('/register', async (req, res) => {
    try {
        const { email, password, name, role, phone, address } = req.body;
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        let supabaseUser = null;
        if (token) {
            const { data: { user }, error } = await supabase.auth.getUser(token);
            if (user && !error) {
                supabaseUser = user;
            }
        }

        const existingUser = await prisma.user.findUnique({ where: { email } });
        
        if (existingUser) {
            if (token && supabaseUser) {
                const { password: _, ...userWithoutPassword } = existingUser;
                return res.status(200).json({
                    message: 'User already exists, linked to registration',
                    user: userWithoutPassword
                });
            }
            return res.status(400).json({ error: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                name,
                role: role || 'BUYER',
                phone,
                address
            }
        });

        // Initialize profile
        await prisma.profile.create({
            data: {
                userId: user.id
            }
        });

        const jwtToken = token || jwt.sign(
            { userId: user.id, role: user.role },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        const { password: _, ...userWithoutPassword } = user;

        res.status(201).json({
            message: 'User registered successfully',
            token: jwtToken,
            user: userWithoutPassword
        });

    } catch (error: any) {
        console.error('Registration error:', error);
        res.status(500).json({ error: 'Registration failed', details: error.message });
    }
});

// Login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        // If a token is provided, verify it with Supabase first
        if (token) {
            const { data: { user: sbUser }, error: sbError } = await supabase.auth.getUser(token);
            if (sbUser && !sbError) {
                const user = await prisma.user.findUnique({
                    where: { email: sbUser.email },
                    include: { profile: true }
                });
                if (user) {
                    const { password: _, ...userWithoutPassword } = user;
                    return res.json({ message: 'Login successful via Supabase', token, user: userWithoutPassword });
                }
            }
        }

        // Fallback to traditional login
        const user = await prisma.user.findUnique({
            where: { email },
            include: { profile: true }
        });

        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // --- Just-In-Time (JIT) Migration to Supabase ---
        /* 
           If the user logged in successfully but isn't in Supabase, we attempt to sign them up.
           Note: This will trigger a confirmation email if configured in Supabase.
        */
        const { data: sbData, error: sbError } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    full_name: user.name,
                    role: user.role
                }
            }
        });

        // If signup failed because user exists in SB, we just ignore it.
        // If it succeeded, they are now "shadow migrated".
        
        const newToken = sbData.session?.access_token || jwt.sign(
            { userId: user.id, role: user.role },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        const { password: _, ...userWithoutPassword } = user;

        res.json({
            message: sbData.session ? 'Login successful and migrated' : 'Login successful',
            token: newToken,
            user: userWithoutPassword,
            migrated: !!sbData.session
        });
    } catch (error: any) {
        console.error('Login error details:', error);
        res.status(500).json({
            error: 'Login failed',
            details: error.message,
            code: error.code
        });
    }
});

import { sendResetPasswordEmail } from '../utils/mailer';

// Forgot Password
router.post('/forgot-password', async (req, res) => {
    try {
        const { email } = req.body;
        const user = await prisma.user.findUnique({ where: { email } });

        if (!user) {
            return res.status(404).json({ error: 'User with this email not found' });
        }

        const resetToken = crypto.randomBytes(32).toString('hex');
        const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour

        await prisma.user.update({
            where: { email },
            data: { resetToken, resetTokenExpiry }
        });

        // Send real email
        try {
            await sendResetPasswordEmail(email, resetToken);
            res.json({
                message: 'Password reset link sent to your email.'
            });
        } catch (emailError) {
            console.error('Email sending failed:', emailError);
            // Even if email fails, we've updated the token, but we should inform the user
            res.status(500).json({ error: 'Failed to send reset email. Please try again later.' });
        }

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to process forgot-password' });
    }
});

// Reset Password
router.post('/reset-password/:token', async (req, res) => {
    try {
        const { token } = req.params;
        const { password } = req.body;

        const user = await prisma.user.findFirst({
            where: {
                resetToken: token,
                resetTokenExpiry: { gt: new Date() }
            }
        });

        if (!user) {
            return res.status(400).json({ error: 'Invalid or expired reset token' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await prisma.user.update({
            where: { id: user.id },
            data: {
                password: hashedPassword,
                resetToken: null,
                resetTokenExpiry: null
            }
        });

        res.json({ message: 'Password reset successful' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to reset password' });
    }
});

export default router;


