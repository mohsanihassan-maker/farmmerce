import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Seeding Group Buying deals...');

    // Find some products to use for deals
    const tomato = await prisma.product.findFirst({ where: { name: { contains: 'Tomato' } } });
    const egg = await prisma.product.findFirst({ where: { name: { contains: 'Egg' } } });
    const yam = await prisma.product.findFirst({ where: { name: { contains: 'Yam' } } });

    if (!tomato || !egg || !yam) {
        console.log('Products missing. Please run the main seed first.');
        return;
    }

    const deals = [
        {
            title: "10kg Fresh Tomatoes Deal",
            description: "Team up with 5 people to get premium Ondo tomatoes at wholesale prices!",
            discountPrice: 2000,
            originalPrice: 3500,
            minParticipants: 5,
            productId: tomato.id,
            imageUrl: "https://images.unsplash.com/photo-1595855709915-0b043928a491?w=800"
        },
        {
            title: "50 Fresh Farm Eggs",
            description: "Chowdeck special: Buy 50 eggs with 3 friends and save ₦800 each.",
            discountPrice: 2000,
            originalPrice: 2800,
            minParticipants: 4,
            productId: egg.id,
            imageUrl: "https://images.unsplash.com/photo-1582722134903-b12ee0579198?w=800"
        },
        {
            title: "Tuber Bulk Buy (Yam)",
            description: "Get a tuber of yam for nearly half price when 3 people join.",
            discountPrice: 1500,
            originalPrice: 2500,
            minParticipants: 3,
            productId: yam.id,
            imageUrl: "https://images.unsplash.com/photo-1595053809618-63640b10626b?w=800"
        }
    ];

    for (const deal of deals) {
        await prisma.groupDeal.upsert({
            where: { id: 0 }, // Fake ID for creation
            create: deal,
            update: deal
        }).catch(err => {
            // Upsert with fake ID might fail depending on DB, usage for simple seed:
            prisma.groupDeal.create({ data: deal });
        });
    }

    console.log('Group deals seeded! 🛒✨');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
