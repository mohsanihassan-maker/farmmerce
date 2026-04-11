import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const BUNDLES = [
    {
        name: 'Harvest Lite',
        familySize: '2-3 Persons',
        price: 24500,
        savings: '15% Off',
        color: 'from-brand-dark to-brand-light/40',
        badge: 'bg-brand-light/20 text-brand-dark',
        imageUrl: '/harvest_lite_bundle_1775397493609.png',
        accentColor: '#013f31',
        featured: false,
        items: [
            '5kg Long Grain Rice',
            '2kg Brown Beans',
            '2L Premium Veg Oil',
            '2 Large Tubers of Yam',
            '1 Small Basket Veggies',
            '1kg Red Onions'
        ]
    },
    {
        name: 'Harvest Standard',
        familySize: '4-5 Persons',
        price: 48500,
        savings: '25% Off',
        color: 'from-brand-mars to-brand-mars/40',
        badge: 'bg-brand-mars/10 text-brand-mars font-black',
        imageUrl: '/harvest_standard_bundle_1775397565651.png',
        accentColor: '#ff6f64',
        featured: true,
        items: [
            '10kg Long Grain Rice',
            '5kg Brown Beans',
            '5L Premium Veg Oil',
            '5 Medium Tubers of Yam',
            '1 Large Basket Veggies',
            '3kg Red Onions'
        ]
    },
    {
        name: 'Harvest Pro',
        familySize: '6-8 Persons',
        price: 88000,
        savings: '30% Off',
        color: 'from-brand-yellowDark to-brand-yellow/40',
        badge: 'bg-brand-yellow/20 text-brand-yellowDark font-black',
        imageUrl: '/harvest_pro_bundle_1775397604426.png',
        accentColor: '#f6c744',
        featured: false,
        items: [
            '25kg Long Grain Rice',
            '10kg Brown Beans',
            '10L Premium Veg Oil',
            '10 Large Tubers of Yam',
            '2 Large Baskets Veggies',
            '1 Crate Fresh Farm Eggs',
            '5kg Red Onions'
        ]
    },
    {
        name: 'Harvest Feast',
        familySize: '10+ Persons',
        price: 165000,
        savings: '35% Off',
        color: 'from-brand-purple to-brand-pink/40',
        badge: 'bg-brand-pink/20 text-brand-purple font-black',
        imageUrl: '/harvest_feast_bundle_1775397672304.png',
        accentColor: '#81295c',
        featured: false,
        items: [
            '50kg Long Grain Rice',
            '20kg Brown Beans',
            '20L Premium Veg Oil',
            '20 Large Tubers of Yam',
            '4 Large Baskets Veggies',
            '2 Crates Fresh Farm Eggs',
            '10kg Red Onions',
            '1 Whole Broiler Chicken'
        ]
    }
];

async function main() {
    console.log('Seeding bundles to the new Bundle table...');
    
    // Clear existing
    await prisma.bundle.deleteMany({});
    
    for (const b of BUNDLES) {
        await prisma.bundle.create({
            data: b
        });
    }

    console.log('Bundles seeded successfully.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
