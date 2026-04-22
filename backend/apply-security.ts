import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

async function applySecurityPolicies() {
    console.log('🛡️ Starting Security Policy Application...');

    try {
        const sqlPath = path.join(__dirname, 'prisma', 'security_policies.sql');
        console.log(`Reading SQL from: ${sqlPath}`);
        
        if (!fs.existsSync(sqlPath)) {
            throw new Error(`SQL file not found at ${sqlPath}`);
        }

        const sql = fs.readFileSync(sqlPath, 'utf8');

        // Split SQL into individual statements using the explicit marker
        const statements = sql
            .split(/-- STATEMENT --/)
            .map(s => s.trim())
            .filter(s => s.length > 0);

        console.log(`Executing ${statements.length} SQL statements...`);
        
        for (const statement of statements) {
            try {
                // Semicolons were removed by split, add them back if needed (Prisma usually doesn't need them for single statements)
                await prisma.$executeRawUnsafe(statement);
            } catch (stmtError: any) {
                console.error(`❌ Error in statement: ${statement.substring(0, 50)}...`);
                console.error(`Error message: ${stmtError.message}`);
                // Continue or throw? Let's throw to be safe for security tasks.
                throw stmtError;
            }
        }
        
        console.log('✅ RLS Policies applied successfully.');

        // Verification
        console.log('\n📊 Verifying RLS Status:');
        const verificationResult: any[] = await prisma.$queryRaw`
            SELECT tablename, rowsecurity 
            FROM pg_tables 
            WHERE schemaname = 'public'
            ORDER BY tablename ASC;
        `;

        console.table(verificationResult);
        
        const insecureTables = verificationResult.filter(r => !r.rowsecurity);
        if (insecureTables.length > 0) {
            console.warn('⚠️ WARNING: Some tables still have RLS disabled:', insecureTables.map(t => t.tablename).join(', '));
        } else {
            console.log('🎉 SUCCESS: All public tables have RLS enabled.');
        }

    } catch (error: any) {
        console.error('❌ Error applying security policies:', error.message);
        if (error.stack) console.error(error.stack);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

applySecurityPolicies();
