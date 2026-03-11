const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env') });

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Error: SUPABASE_URL or SUPABASE_ANON_KEY is missing from .env');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkUser(email) {
    console.log(`Checking if user ${email} exists in Supabase (Attempting reset)...`);
    
    // resetPasswordForEmail returns success even if user doesn't exist
    const { data, error } = await supabase.auth.resetPasswordForEmail(email);
    
    if (error) {
        console.error('Supabase Error:', error.message);
    } else {
        console.log('Reset request sent to Supabase successfully.');
        console.log('API Response:', data);
        console.log('\n--- Analysis ---');
        console.log('1. If the email doesn\'t arrive, the user likely DOES NOT exist in Supabase Auth Students/Internal Users list.');
        console.log('2. Check your Supabase Dashboard > Authentication > Users to see if the email is there.');
        console.log('3. If it\'s NOT there, "Forgot Password" will never work for that email until they Sign Up.');
    }
}

const targetEmail = process.argv[2] || 'admin@fammerce.com';
checkUser(targetEmail);
