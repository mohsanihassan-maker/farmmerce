const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Seeding farmer: Dada Jibril...\n');

    // 1. Create the farmer user
    const hashedPassword = await bcrypt.hash('dada1234', 10);

    const farmer = await prisma.user.upsert({
        where: { email: 'dada.jibril@farmmerce.com' },
        update: {
            name: 'Dada Jibril',
            role: 'FARMER',
        },
        create: {
            email: 'dada.jibril@farmmerce.com',
            name: 'Dada Jibril',
            password: hashedPassword,
            role: 'FARMER',
            phone: '+2348012345678',
            address: 'Ilorin, Kwara State',
        },
    });

    console.log(`✅ Farmer created: ${farmer.name} (ID: ${farmer.id})`);

    // 2. Create her farm profile
    await prisma.profile.upsert({
        where: { userId: farmer.id },
        update: {
            farmName: 'Dada Organic Farm',
            bio: 'Female-led, family-run organic farm in Kwara State specializing in fresh vegetables, grains, and poultry products. Founded by Dada Jibril.',
            location: 'Ilorin, Kwara State',
            applicationStatus: 'APPROVED',
        },
        create: {
            userId: farmer.id,
            farmName: 'Dada Organic Farm',
            bio: 'Female-led, family-run organic farm in Kwara State specializing in fresh vegetables, grains, and poultry products. Founded by Dada Jibril.',
            location: 'Ilorin, Kwara State',
            phoneNumber: '+2348012345678',
            applicationStatus: 'APPROVED',
        },
    });

    console.log('✅ Farm profile created: Dada Organic Farm');

    // 3. Ensure categories exist
    const categoryNames = ['Vegetables', 'Grains', 'Fruits', 'Livestock', 'Eggs & Dairy', 'Herbs'];
    for (const name of categoryNames) {
        await prisma.category.upsert({
            where: { name },
            update: {},
            create: { name },
        });
    }
    console.log('✅ Categories ensured');

    // 4. Add products for Dada Jibril
    const products = [
        {
            name: 'Fresh Roma Tomatoes',
            description: 'Vine-ripened Roma tomatoes, perfect for stews and sauces. Harvested fresh from Dada Organic Farm.',
            price: 2500,
            unit: 'basket',
            stock: 120,
            categoryName: 'Vegetables',
            imageUrl: 'https://images.unsplash.com/photo-1546470427-e26264be0b11?w=400&q=80',
            harvestDate: new Date('2026-05-07'),
        },
        {
            name: 'Organic Spinach Bundle',
            description: 'Freshly picked organic spinach leaves, rich in iron and vitamins. No pesticides.',
            price: 800,
            unit: 'bundle',
            stock: 200,
            categoryName: 'Vegetables',
            imageUrl: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=400&q=80',
            harvestDate: new Date('2026-05-08'),
        },
        {
            name: 'Red Bell Peppers',
            description: 'Sweet, crunchy red bell peppers. Great for salads, stir-fry, and garnishing.',
            price: 3000,
            unit: 'kg',
            stock: 80,
            categoryName: 'Vegetables',
            imageUrl: 'https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?w=400&q=80',
            harvestDate: new Date('2026-05-06'),
        },
        {
            name: 'Premium Long Grain Rice',
            description: 'Locally grown, stone-free long grain rice. Perfect fluffy texture every time.',
            price: 18000,
            unit: '10kg bag',
            stock: 50,
            categoryName: 'Grains',
            imageUrl: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&q=80',
            harvestDate: new Date('2026-04-20'),
        },
        {
            name: 'Brown Beans (Oloyin)',
            description: 'Clean, premium quality honey beans. Pre-sorted and stone-free.',
            price: 5500,
            unit: '5kg bag',
            stock: 75,
            categoryName: 'Grains',
            imageUrl: 'https://images.unsplash.com/photo-1551462147-ff29053bfc14?w=400&q=80',
            harvestDate: new Date('2026-04-25'),
        },
        {
            name: 'Fresh Free-Range Eggs',
            description: 'Farm-fresh free-range eggs from healthy, well-fed hens. Rich yolks guaranteed.',
            price: 3200,
            unit: 'crate (30)',
            stock: 40,
            categoryName: 'Eggs & Dairy',
            imageUrl: 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=400&q=80',
            harvestDate: new Date('2026-05-08'),
        },
        {
            name: 'Sweet Mangoes (Julie)',
            description: 'Juicy Julie mangoes, naturally ripened on the tree. Sweet and aromatic.',
            price: 4000,
            unit: 'basket',
            stock: 60,
            categoryName: 'Fruits',
            imageUrl: 'https://images.unsplash.com/photo-1553279768-865429fa0078?w=400&q=80',
            harvestDate: new Date('2026-05-05'),
        },
        {
            name: 'Fresh Basil Leaves',
            description: 'Aromatic fresh basil, perfect for soups, garnishes, and traditional cooking.',
            price: 500,
            unit: 'bunch',
            stock: 150,
            categoryName: 'Herbs',
            imageUrl: 'https://images.unsplash.com/photo-1618164436241-4473940d1f5c?w=400&q=80',
            harvestDate: new Date('2026-05-08'),
        },
    ];

    let created = 0;
    for (const p of products) {
        // Check if product already exists for this farmer
        const existing = await prisma.product.findFirst({
            where: { name: p.name, farmerId: farmer.id },
        });

        if (!existing) {
            await prisma.product.create({
                data: {
                    ...p,
                    farmerId: farmer.id,
                },
            });
            created++;
            console.log(`  🥬 Added: ${p.name} — ₦${p.price.toLocaleString()}/${p.unit}`);
        } else {
            console.log(`  ⏭️  Skipped (exists): ${p.name}`);
        }
    }

    console.log(`\n✅ Done! ${created} new products added for Dada Jibril.`);
    console.log('\n📋 Login credentials:');
    console.log('   Email: dada.jibril@farmmerce.com');
    console.log('   Password: dada1234');
}

main()
    .catch((e) => {
        console.error('❌ Error:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
