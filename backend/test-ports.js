const { Client } = require('pg');
const dotenv = require('dotenv');
dotenv.config();

const connectionBase = "postgresql://postgres.nxfptjazsogytfhvxmrb:Mohtop%402829@aws-1-eu-west-1.pooler.supabase.com";

async function testConnection(port) {
    const connectionString = `${connectionBase}:${port}/postgres`;
    const client = new Client({ connectionString, connectionTimeoutMillis: 5000 });
    try {
        console.log(`Testing connection to port ${port}...`);
        await client.connect();
        console.log(`SUCCESS: Connected to port ${port}`);
        const res = await client.query('SELECT version()');
        console.log('Version:', res.rows[0].version);
        await client.end();
        return true;
    } catch (err) {
        console.error(`FAILED: Connection to port ${port} failed - ${err.message}`);
        return false;
    }
}

async function runTests() {
    console.log('DB URL from .env:', process.env.DATABASE_URL);
    await testConnection(5432);
    await testConnection(6543);
}

runTests();
