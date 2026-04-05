const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log('Seeding tentative bundles and items...');

    // 1. Create 'Bundles' category if not exists
    const bundlesCategory = await prisma.category.upsert({
        where: { name: 'Bundles' },
        update: {},
        create: { name: 'Bundles' }
    });

    const farmerId = 1; // Joe's Organic Farm

    // 2. Create Bundles
    const bundles = [
        {
            name: 'Harvest Lite Bundle (2-3 People)',
            description: 'Rice, Beans, Oil, Yam, Veggies, Onions - Perfectly sized for small families.',
            price: 24500,
            unit: 'Bundle',
            stock: 50,
            categoryName: 'Bundles',
            imageUrl: '/harvest_lite_bundle_1775397493609.png'
        },
        {
            name: 'Harvest Standard Bundle (4-5 People)',
            description: 'The average family harvester bundle with double staples and large veggies basket.',
            price: 48500,
            unit: 'Bundle',
            stock: 100,
            categoryName: 'Bundles',
            imageUrl: '/harvest_standard_bundle_1775397565651.png'
        },
        {
            name: 'Harvest Pro Bundle (6-8 People)',
            description: 'Pro volume for large families: Includes extra grains and a crate of farm-fresh eggs.',
            price: 88000,
            unit: 'Bundle',
            stock: 30,
            categoryName: 'Bundles',
            imageUrl: '/harvest_pro_bundle_1775397604426.png'
        },
        {
            name: 'Harvest Feast Bundle (10+ People)',
            description: 'Maximum volume for communities: Whole poultry, bulk grains, and massive vegetable variety.',
            price: 165000,
            unit: 'Bundle',
            stock: 10,
            categoryName: 'Bundles',
            imageUrl: '/harvest_feast_bundle_1775397672304.png'
        }
    ];

    for (const bundle of bundles) {
        await prisma.product.upsert({
            where: { traceabilityId: `bundle-${bundle.name.split(' ')[1].toLowerCase()}` },
            update: bundle,
            create: {
                ...bundle,
                farmerId,
                traceabilityId: `bundle-${bundle.name.split(' ')[1].toLowerCase()}`
            }
        });
    }

    // 3. Create Individual Marketplace Items
    const items = [
        {
            name: 'Sun-Ripened Tomatoes (Basket)',
            description: 'A large basket of hand-picked tomatoes, firm and juicy.',
            price: 4500,
            unit: 'Basket',
            stock: 200,
            categoryName: 'Vegetables',
            imageUrl: 'https://images.unsplash.com/photo-1546470427-e26264be0b11?w=400&h=300&fit=crop'
        },
        {
            name: 'White Yam (Medium-Large)',
            description: 'Smooth-skin white yams, harvested this week.',
            price: 2200,
            unit: 'Tuber',
            stock: 500,
            categoryName: 'Tubers',
            imageUrl: 'https://images.unsplash.com/photo-1596450514735-2410a52ea09e?w=400&h=300&fit=crop'
        },
        {
            name: 'Purity Brown Beans (5kg Bag)',
            description: 'Cleaned and preserved brown beans from northern farms.',
            price: 9000,
            unit: 'Bag',
            stock: 300,
            categoryName: 'Grains',
            imageUrl: 'https://images.unsplash.com/photo-1512058560366-5bb3967385ad?w=400&h=300&fit=crop'
        }
    ];

    for (const item of items) {
        await prisma.product.upsert({
            where: { traceabilityId: `item-${item.name.split(' ')[0].toLowerCase()}` },
            update: item,
            create: {
                ...item,
                farmerId,
                traceabilityId: `item-${item.name.split(' ')[0].toLowerCase()}`
            }
        });
    }

    console.log('Seed success: Marketplace is now live with tentative harvest bundles!');
    process.exit(0);
}

main().catch(err => {
    console.error(err);
    process.exit(1);
});
