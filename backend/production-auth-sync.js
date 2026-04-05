const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function finalSync() {
  console.log('🛡️ Finalizing Production Sync (Auth & RLS)...');

  try {
    // 1. Force Confirm Admin Email in Supabase Auth
    // Note: We use executeRaw because prisma doesn't manage the 'auth' schema by default
    await prisma.$executeRawUnsafe(`
      UPDATE auth.users 
      SET email_confirmed_at = NOW(), 
          last_sign_in_at = NOW(),
          raw_app_meta_data = raw_app_meta_data || '{"provider":"email","providers":["email"]}'::jsonb
      WHERE email = 'admin@fammerce.com';
    `);
    console.log('✅ Admin Email Force-Confirmed in Supabase Auth.');

    // 2. Ensure Admin Role in Public User Table
    await prisma.user.updateMany({
      where: { email: 'admin@fammerce.com' },
      data: { role: 'ADMIN' }
    });
    console.log('✅ Admin Role Sync Complete.');

    // 3. Enable Public Visibility (RLS Policies)
    await prisma.$executeRawUnsafe(`ALTER TABLE "Product" ENABLE ROW LEVEL SECURITY;`);
    await prisma.$executeRawUnsafe(`DROP POLICY IF EXISTS "Allow Public Read" ON "Product";`);
    await prisma.$executeRawUnsafe(`CREATE POLICY "Allow Public Read" ON "Product" FOR SELECT USING (true);`);

    await prisma.$executeRawUnsafe(`ALTER TABLE "Category" ENABLE ROW LEVEL SECURITY;`);
    await prisma.$executeRawUnsafe(`DROP POLICY IF EXISTS "Allow Public Read Categories" ON "Category";`);
    await prisma.$executeRawUnsafe(`CREATE POLICY "Allow Public Read Categories" ON "Category" FOR SELECT USING (true);`);

    console.log('✅ Marketplace Visibility Policies Active.');

  } catch (error) {
    console.error('❌ Sync Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

finalSync();
