const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function fixProductionDb() {
  console.log('🛡️ Fixing Production RLS Policies...');

  try {
    // 1. Enable RLS and Create Public Access Policies
    await prisma.$executeRawUnsafe(`ALTER TABLE "Product" ENABLE ROW LEVEL SECURITY;`);
    await prisma.$executeRawUnsafe(`DROP POLICY IF EXISTS "Allow Public Read" ON "Product";`);
    await prisma.$executeRawUnsafe(`CREATE POLICY "Allow Public Read" ON "Product" FOR SELECT USING (true);`);

    await prisma.$executeRawUnsafe(`ALTER TABLE "Category" ENABLE ROW LEVEL SECURITY;`);
    await prisma.$executeRawUnsafe(`DROP POLICY IF EXISTS "Allow Public Read Categories" ON "Category";`);
    await prisma.$executeRawUnsafe(`CREATE POLICY "Allow Public Read Categories" ON "Category" FOR SELECT USING (true);`);

    console.log('✅ RLS Policies Fixed for Products and Categories!');

    // 2. Ensure existing admin record is prepared for sync
    const admin = await prisma.user.updateMany({
      where: { email: 'admin@fammerce.com' },
      data: { role: 'ADMIN' }
    });
    console.log(`✅ Admin user record role confirmed: ${admin.count}`);

  } catch (error) {
    console.error('❌ Error during DB fix:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

fixProductionDb();
