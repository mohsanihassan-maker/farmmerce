import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '.env') });

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || '';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkUser(email: string) {
    console.log(`Checking if user ${email} exists in Supabase...`);
    
    // We can't list users with anon key, but we can try to reset password
    // Supabase will return a successful response even if user doesn't exist (for security)
    // but often internal errors or logs reveal more.
    
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    
    if (error) {
        console.error('Supabase Error:', error.message);
    } else {
        console.log('Reset request sent to Supabase successfully.');
        console.log('Note: If the email doesn\'t arrive, it might be due to:');
        console.log('1. User doesn\'t exist in Supabase Auth (Users table).');
        console.log('2. Supabase rate limits (3 emails/hour).');
        console.log('3. Spam filter.');
    }
}

const targetEmail = process.argv[2] || 'admin@fammerce.com';
checkUser(targetEmail);
