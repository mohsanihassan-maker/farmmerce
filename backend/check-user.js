const { Client } = require('pg');
const connectionString = "postgresql://postgres.nxfptjazsogytfhvxmrb:Mohtop%402829@aws-1-eu-west-1.pooler.supabase.com:6543/postgres?sslmode=require";

async function check() {
    const client = new Client({
        connectionString,
        ssl: { rejectUnauthorized: false }
    });
    try {
        await client.connect();
        const res = await client.query('SELECT email FROM "User" WHERE email = $1', ['mchsari.hassen@gmail.com']);
        if (res.rows.length > 0) {
            console.log('User exists in DB:', res.rows[0].email);
        } else {
            console.log('User does NOT exist in DB');
            const all = await client.query('SELECT email FROM "User" LIMIT 5');
            console.log('Example users:', all.rows);
        }
    } catch (err) {
        console.error('Check failed:', err.message);
    } finally {
        await client.end();
    }
}
check();
