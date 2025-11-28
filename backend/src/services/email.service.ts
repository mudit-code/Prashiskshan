import nodemailer from 'nodemailer';
import logger from '../logger.js';

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

export const sendVerificationEmail = async (to: string, token: string) => {
    const verificationUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/verify-email?token=${token}`;

    const mailOptions = {
        from: process.env.SMTP_FROM || '"Prashikshan" <noreply@prashikshan.com>',
        to,
        subject: 'Verify your email address',
        html: `
      <h1>Welcome to Prashikshan!</h1>
      <p>Please click the link below to verify your email address:</p>
      <a href="${verificationUrl}">${verificationUrl}</a>
      <p>If you didn't create an account, you can safely ignore this email.</p>
    `,
    };

    try {
        await transporter.sendMail(mailOptions);
        logger.info(`Verification email sent to ${to}`);
    } catch (error) {
        logger.error('Error sending verification email:', error);
        // Don't throw error to prevent blocking registration, but log it
    }
};
