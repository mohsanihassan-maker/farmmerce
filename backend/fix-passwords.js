const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function fixPasswords() {
    console.log('🔄 Hashing all plain-text passwords in the database...');
    
    try {
        const users = await prisma.user.findMany();
        console.log(`Found ${users.length} users.`);

        for (const user of users) {
            // Check if password looks like a bcrypt hash (starts with $2a$ or $2b$)
            if (!user.password.startsWith('$2a$') && !user.password.startsWith('$2b$')) {
                console.log(`Hashing password for: ${user.email}`);
                const hashedPassword = await bcrypt.hash(user.password, 10);
                await prisma.user.update({
                    where: { id: user.id },
                    data: { password: hashedPassword }
                });
            } else {
                console.log(`User ${user.email} already has a hashed password.`);
            }
        }

        console.log('✅ All passwords fixed!');
    } catch (error) {
        console.error('❌ Error fixing passwords:', error);
    } finally {
        await prisma.$disconnect();
    }
}

fixPasswords();
