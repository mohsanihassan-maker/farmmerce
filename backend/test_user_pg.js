const { Client } = require('pg');
const connectionString = "postgresql://postgres.nxfptjazsogytfhvxmrb:Mohtop%402829@aws-1-eu-west-1.pooler.supabase.com:5432/postgres";

async function check() {
    const client = new Client({ connectionString });
    try {
        await client.connect();
        const res = await client.query('SELECT email, password FROM "User" WHERE email = $1', ['mchsari.hassen@gmail.com']);
        if (res.rows.length > 0) {
            console.log('User found:', res.rows[0].email);
            console.log('Hashed password:', res.rows[0].password);
        } else {
            console.log('User NOT found');
        }
    } catch (err) {
        console.error('Check failed:', err.message);
    } finally {
        await client.end();
    }
}
check();
