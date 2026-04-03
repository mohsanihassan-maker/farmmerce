-- ============================================================
-- Farmmerce: Enable Row Level Security (RLS) on All Tables
-- ============================================================
-- Run this in the Supabase SQL Editor (Dashboard → SQL Editor)
--
-- WHY: Without RLS, anyone with the anon key can access ALL data
-- via Supabase's REST API, bypassing your backend entirely.
--
-- SAFE: Your backend uses Prisma with the `postgres` role,
-- which bypasses RLS automatically. No backend changes needed.
-- ============================================================

-- 1. Enable RLS on every public table
ALTER TABLE "User" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Profile" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Category" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Product" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "JourneyStep" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Order" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "OrderItem" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Settlement" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Recipe" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Ingredient" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "GroupDeal" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "DealGroup" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "GroupMember" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Notification" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Review" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "GlobalSetting" ENABLE ROW LEVEL SECURITY;

-- 2. Grant full access to the service_role (used by backend services)
--    The `postgres` role already bypasses RLS, but service_role needs explicit policies.

CREATE POLICY "service_role_all_User" ON "User"
  FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE POLICY "service_role_all_Profile" ON "Profile"
  FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE POLICY "service_role_all_Category" ON "Category"
  FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE POLICY "service_role_all_Product" ON "Product"
  FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE POLICY "service_role_all_JourneyStep" ON "JourneyStep"
  FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE POLICY "service_role_all_Order" ON "Order"
  FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE POLICY "service_role_all_OrderItem" ON "OrderItem"
  FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE POLICY "service_role_all_Settlement" ON "Settlement"
  FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE POLICY "service_role_all_Recipe" ON "Recipe"
  FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE POLICY "service_role_all_Ingredient" ON "Ingredient"
  FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE POLICY "service_role_all_GroupDeal" ON "GroupDeal"
  FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE POLICY "service_role_all_DealGroup" ON "DealGroup"
  FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE POLICY "service_role_all_GroupMember" ON "GroupMember"
  FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE POLICY "service_role_all_Notification" ON "Notification"
  FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE POLICY "service_role_all_Review" ON "Review"
  FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE POLICY "service_role_all_GlobalSetting" ON "GlobalSetting"
  FOR ALL TO service_role USING (true) WITH CHECK (true);

-- 3. No policies for `anon` or `authenticated` roles.
--    This means the Supabase REST API (using anon key) CANNOT access these tables.
--    All data access goes through your backend (Prisma → postgres role).

-- ============================================================
-- VERIFICATION: Run this query after to confirm RLS is enabled
-- ============================================================
-- SELECT tablename, rowsecurity
-- FROM pg_tables
-- WHERE schemaname = 'public';
-- ============================================================
