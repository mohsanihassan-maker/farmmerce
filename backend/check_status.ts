import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
    datasources: {
        db: {
            url: "postgresql://postgres.nxfptjazsogytfhvxmrb:Mohtop%402829@18.202.64.2:5432/postgres" // Using IP for reliability
        }
    }
});

async function findUsers() {
    try {
        const users = await prisma.user.findMany({
            where: {
                email: {
                    contains: 'hassen',
                    mode: 'insensitive'
                }
            }
        });
        console.log('Results (hassen):', users);

        const users2 = await prisma.user.findMany({
            where: {
                email: {
                    contains: 'hassan',
                    mode: 'insensitive'
                }
            }
        });
        console.log('Results (hassan):', users2);
    } catch (e: any) {
        console.error('Error:', e.message);
    } finally {
        await prisma.$disconnect();
    }
}
findUsers();
