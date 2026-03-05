import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function verifySettlement() {
    console.log('--- STARTING SETTLEMENT VERIFICATION ---');

    try {
        // 1. Find a farmer
        const farmer = await prisma.user.findFirst({
            where: { role: 'FARMER' },
            include: { products: true, profile: true }
        });

        if (!farmer || farmer.products.length === 0) {
            console.error('No farmer with products found for testing.');
            return;
        }

        console.log(`Testing with Farmer: ${farmer.name} (ID: ${farmer.id})`);

        // Update Profile with bank info if missing
        if (!farmer.profile?.bankName) {
            await prisma.profile.upsert({
                where: { userId: farmer.id },
                update: {
                    bankName: 'Test Bank',
                    accountNumber: '1234567890',
                    accountName: farmer.name
                },
                create: {
                    userId: farmer.id,
                    bankName: 'Test Bank',
                    accountNumber: '1234567890',
                    accountName: farmer.name,
                    farmName: farmer.name,
                    location: 'Test Location'
                }
            });
            console.log('Ensured farmer bank details in profile.');
        }

        // 2. Create a Buyer
        const buyer = await prisma.user.upsert({
            where: { email: 'buyer.test@example.com' },
            update: {},
            create: {
                email: 'buyer.test@example.com',
                name: 'Test Buyer',
                password: 'password123',
                role: 'BUYER'
            }
        });

        // 3. Create an Order with items from the farmer
        const product = farmer.products[0];
        const price = Number(product.price);
        const quantity = 2;
        const totalAmount = price * quantity;

        const order = await prisma.order.create({
            data: {
                buyerId: buyer.id,
                totalAmount: totalAmount,
                status: 'DELIVERED', // Direct to delivered for testing
                items: {
                    create: [
                        {
                            productId: product.id,
                            quantity: quantity,
                            price: price
                        }
                    ]
                }
            }
        });

        console.log(`Created DELIVERED order #${order.id} for ₦${totalAmount}`);

        // 4. Check Pending Settlements API logic (simulated by query)
        const pendingItems = await prisma.orderItem.findMany({
            where: {
                order: { status: 'DELIVERED' },
                settlementId: null,
                product: { farmerId: farmer.id }
            }
        });

        console.log(`Found ${pendingItems.length} pending items for farmer.`);

        const calculatedNet = totalAmount * 0.9; // 10% commission
        console.log(`Expected Net (after 10% fee): ₦${calculatedNet}`);

        if (pendingItems.length > 0) {
            console.log('✅ Verification Successful: Items are appearing as pending settlements.');
        } else {
            console.error('❌ Verification Failed: Items not found in pending settlements.');
        }

    } catch (error) {
        console.error('An error occurred during verification:', error);
    } finally {
        await prisma.$disconnect();
    }
}

verifySettlement();
