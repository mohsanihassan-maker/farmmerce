import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.mailtrap.io', // Default for testing
    port: parseInt(process.env.SMTP_PORT || '2525'),
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
});

export const sendResetPasswordEmail = async (email: string, token: string) => {
    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password/${token}`;
    
    const mailOptions = {
        from: process.env.SMTP_FROM || '"Fammerce" <no-reply@fammerce.com>',
        to: email,
        subject: 'Password Reset Request',
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
                <h2 style="color: #013f31;">Reset Your Password</h2>
                <p>Hello,</p>
                <p>We received a request to reset the password for your Fammerce account. Click the button below to proceed:</p>
                <div style="text-align: center; margin: 30px 0;">
                    <a href="${resetUrl}" style="background-color: #013f31; color: white; padding: 15px 25px; text-decoration: none; border-radius: 5px; font-weight: bold;">Reset Password</a>
                </div>
                <p>If you did not request this, please ignore this email or contact support if you have concerns.</p>
                <p>This link will expire in 1 hour.</p>
                <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
                <p style="font-size: 12px; color: #777;">&copy; 2026 Fammerce. All rights reserved.</p>
            </div>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Password reset email sent to: ${email}`);
    } catch (error: any) {
        console.error('Error sending reset email via SMTP:', error.message);
        
        // Development Fallback: Log to console if not in production
        if (process.env.NODE_ENV !== 'production') {
            console.log('\n--- DEVELOPMENT EMAIL FALLBACK ---');
            console.log(`To: ${email}`);
            console.log(`Subject: ${mailOptions.subject}`);
            console.log(`Reset URL: ${resetUrl}`);
            console.log('----------------------------------\n');
            return; // Success for development
        }

        throw new Error('Failed to send reset email');
    }
};
