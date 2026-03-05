import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function createAdmin() {
    console.log('--- CREATING ADMIN USER ---');

    try {
        const admin = await prisma.user.upsert({
            where: { email: 'admin@fammerce.com' },
            update: {
                role: 'ADMIN'
            },
            create: {
                email: 'admin@fammerce.com',
                name: 'Platform Admin',
                password: 'adminpassword',
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
