import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';


const prisma = new PrismaClient();

async function createAdmin() {
    console.log('--- CREATING ADMIN USER ---');

    try {
        const hashedPassword = await bcrypt.hash('adminpassword', 10);

        const admin = await prisma.user.upsert({
            where: { email: 'admin@fammerce.com' },
            update: {
                role: 'ADMIN',
                password: hashedPassword
            },
            create: {
                email: 'admin@fammerce.com',
                name: 'Platform Admin',
                password: hashedPassword,
                role: 'ADMIN'
            }
        });


        console.log('✅ Admin user ensured:', admin.email);
        console.log('Credentials:');
        console.log('Email: admin@fammerce.com');
        console.log('Password: adminpassword');

    } catch (error) {
        console.error('An error occurred:', error);
    } finally {
        await prisma.$disconnect();
    }
}

createAdmin();
