-- Row Level Security (RLS) Policies for Farmmerce Supabase Tables

-- 1. Enable RLS on all tables
ALTER TABLE "User" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Product" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Order" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "OrderItem" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Profile" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Category" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Review" ENABLE ROW LEVEL SECURITY;

-- 2. User Table Policies
-- Only allow the user to see their own record
CREATE POLICY user_self_select ON "User" 
  FOR SELECT USING (auth.uid()::text = supabaseId);
-- Allow service role (backend) total access
-- (Service role bypasses RLS by default, but we document it here)

-- 3. Product Table Policies
-- Allow anyone to see products (public storefront)
CREATE POLICY product_public_select ON "Product"
  FOR SELECT USING (true);
-- Only the owner (farmer) can modify products
CREATE POLICY product_owner_all ON "Product"
  USING (auth.uid()::text = (SELECT supabaseId FROM "User" WHERE id = farmerId));

-- 4. Order Table Policies
-- Only the buyer or the delivery agent can see the order
CREATE POLICY order_participant_select ON "Order"
  USING (
    auth.uid()::text = (SELECT supabaseId FROM "User" WHERE id = buyerId) OR
    auth.uid()::text = (SELECT supabaseId FROM "User" WHERE id = deliveryAgentId)
  );

-- 5. Profile Table Policies
-- Anyone can see a profile (e.g. farmer details)
CREATE POLICY profile_public_select ON "Profile"
  FOR SELECT USING (true);
-- Only the owner can modify their profile
CREATE POLICY profile_owner_update ON "Profile"
  FOR UPDATE USING (auth.uid()::text = (SELECT supabaseId FROM "User" WHERE id = userId));

-- 6. Restriction Policy (Global)
-- By default, no anonymous user (without a valid JWT) should be able to INSERT/UPDATE/DELETE.
-- Supabase automatically blocks these if no policy matches.
