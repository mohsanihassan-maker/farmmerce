const { Client } = require('pg');
const connectionString = "postgresql://postgres.nxfptjazsogytfhvxmrb:Mohtop%402829@aws-1-eu-west-1.pooler.supabase.com:5432/postgres";

async function test() {
    const client = new Client({ connectionString });
    try {
        console.log('Attempting to connect to database on port 5432...');
        await client.connect();
        console.log('Successfully connected!');
        const res = await client.query('SELECT NOW()');
        console.log('Query result:', res.rows[0]);
    } catch (err) {
        console.error('Connection error:', err.message);
    } finally {
        await client.end();
    }
}
test();
