const { Client } = require('pg');
const connectionString = "postgresql://postgres.nxfptjazsogytfhvxmrb:Mohtop%402829@aws-1-eu-west-1.pooler.supabase.com:5432/postgres";

async function list() {
    const client = new Client({ connectionString });
    try {
        await client.connect();
        const res = await client.query('SELECT id, email, role FROM "User"');
        console.log('Total Users:', res.rows.length);
        console.log('List:', res.rows);
    } catch (err) {
        console.error('List failed:', err.message);
    } finally {
        await client.end();
    }
}
list();
