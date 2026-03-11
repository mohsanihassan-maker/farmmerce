const { Client } = require('pg');
const connectionString = "postgresql://postgres.nxfptjazsogytfhvxmrb:Mohtop%402829@aws-1-eu-west-1.pooler.supabase.com:5432/postgres";

async function check() {
    const client = new Client({ connectionString });
    try {
        await client.connect();
        const res = await client.query('SELECT email, "resetToken" FROM "User"');
        console.log('Reset tokens:', res.rows);
    } catch (err) {
        console.error('Check failed:', err.message);
    } finally {
        await client.end();
    }
}
check();
