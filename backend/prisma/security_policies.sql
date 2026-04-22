-- ============================================================
-- Farmmerce: Unified Row Level Security (RLS) Policies
-- ============================================================
-- This script enables RLS on ALL tables and secures them by default.
-- Access is granted ONLY to the 'service_role' (used for backend tokens).
-- THE 'postgres' role (used by Prisma) bypasses RLS automatically.
-- ============================================================

-- 1. ENABLE RLS ON ALL TABLES
ALTER TABLE "User" ENABLE ROW LEVEL SECURITY; -- STATEMENT --
ALTER TABLE "Profile" ENABLE ROW LEVEL SECURITY; -- STATEMENT --
ALTER TABLE "Category" ENABLE ROW LEVEL SECURITY; -- STATEMENT --
ALTER TABLE "Product" ENABLE ROW LEVEL SECURITY; -- STATEMENT --
ALTER TABLE "JourneyStep" ENABLE ROW LEVEL SECURITY; -- STATEMENT --
ALTER TABLE "Order" ENABLE ROW LEVEL SECURITY; -- STATEMENT --
ALTER TABLE "OrderItem" ENABLE ROW LEVEL SECURITY; -- STATEMENT --
ALTER TABLE "Settlement" ENABLE ROW LEVEL SECURITY; -- STATEMENT --
ALTER TABLE "Recipe" ENABLE ROW LEVEL SECURITY; -- STATEMENT --
ALTER TABLE "Ingredient" ENABLE ROW LEVEL SECURITY; -- STATEMENT --
ALTER TABLE "GroupDeal" ENABLE ROW LEVEL SECURITY; -- STATEMENT --
ALTER TABLE "DealGroup" ENABLE ROW LEVEL SECURITY; -- STATEMENT --
ALTER TABLE "GroupMember" ENABLE ROW LEVEL SECURITY; -- STATEMENT --
ALTER TABLE "Notification" ENABLE ROW LEVEL SECURITY; -- STATEMENT --
ALTER TABLE "Review" ENABLE ROW LEVEL SECURITY; -- STATEMENT --
ALTER TABLE "GlobalSetting" ENABLE ROW LEVEL SECURITY; -- STATEMENT --
ALTER TABLE "Bundle" ENABLE ROW LEVEL SECURITY; -- STATEMENT --

-- 2. RESET POLICIES (DROP EXISTING)
DO $$ 
DECLARE 
    r RECORD;
BEGIN
    FOR r IN (SELECT policyname, tablename FROM pg_policies WHERE schemaname = 'public') 
    LOOP
        EXECUTE 'DROP POLICY IF EXISTS "' || r.policyname || '" ON "' || r.tablename || '"';
    END LOOP;
END $$; -- STATEMENT --

-- 3. GRANT ALL PERMISSIONS TO SERVICE_ROLE (BACKEND)
CREATE POLICY "service_role_all_User" ON "User" FOR ALL TO service_role USING (true) WITH CHECK (true); -- STATEMENT --
CREATE POLICY "service_role_all_Profile" ON "Profile" FOR ALL TO service_role USING (true) WITH CHECK (true); -- STATEMENT --
CREATE POLICY "service_role_all_Category" ON "Category" FOR ALL TO service_role USING (true) WITH CHECK (true); -- STATEMENT --
CREATE POLICY "service_role_all_Product" ON "Product" FOR ALL TO service_role USING (true) WITH CHECK (true); -- STATEMENT --
CREATE POLICY "service_role_all_JourneyStep" ON "JourneyStep" FOR ALL TO service_role USING (true) WITH CHECK (true); -- STATEMENT --
CREATE POLICY "service_role_all_Order" ON "Order" FOR ALL TO service_role USING (true) WITH CHECK (true); -- STATEMENT --
CREATE POLICY "service_role_all_OrderItem" ON "OrderItem" FOR ALL TO service_role USING (true) WITH CHECK (true); -- STATEMENT --
CREATE POLICY "service_role_all_Settlement" ON "Settlement" FOR ALL TO service_role USING (true) WITH CHECK (true); -- STATEMENT --
CREATE POLICY "service_role_all_Recipe" ON "Recipe" FOR ALL TO service_role USING (true) WITH CHECK (true); -- STATEMENT --
CREATE POLICY "service_role_all_Ingredient" ON "Ingredient" FOR ALL TO service_role USING (true) WITH CHECK (true); -- STATEMENT --
CREATE POLICY "service_role_all_GroupDeal" ON "GroupDeal" FOR ALL TO service_role USING (true) WITH CHECK (true); -- STATEMENT --
CREATE POLICY "service_role_all_DealGroup" ON "DealGroup" FOR ALL TO service_role USING (true) WITH CHECK (true); -- STATEMENT --
CREATE POLICY "service_role_all_GroupMember" ON "GroupMember" FOR ALL TO service_role USING (true) WITH CHECK (true); -- STATEMENT --
CREATE POLICY "service_role_all_Notification" ON "Notification" FOR ALL TO service_role USING (true) WITH CHECK (true); -- STATEMENT --
CREATE POLICY "service_role_all_Review" ON "Review" FOR ALL TO service_role USING (true) WITH CHECK (true); -- STATEMENT --
CREATE POLICY "service_role_all_GlobalSetting" ON "GlobalSetting" FOR ALL TO service_role USING (true) WITH CHECK (true); -- STATEMENT --
CREATE POLICY "service_role_all_Bundle" ON "Bundle" FOR ALL TO service_role USING (true) WITH CHECK (true); -- STATEMENT --

-- 4. PUBLIC READ POLICIES (OPTIONAL - Enable for specific public tables if needed)
-- Currently, we lock EVERYTHING down so only the backend (via postgres/service_role) can access it.
-- This is the safest way to clear the "Publicly Accessible" warning.

-- To allow public read for products later, you would add:
-- CREATE POLICY "public_read_products" ON "Product" FOR SELECT TO anon USING (true);

-- ============================================================
-- VERIFICATION QUERY:
-- SELECT tablename, rowsecurity FROM pg_tables WHERE schemaname = 'public';
-- ============================================================

