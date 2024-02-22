import nodemailer from 'nodemailer';
import twilio from 'twilio';

export const transport = nodemailer.createTransport({
    service: 'gmail',
    port: 587,
    auth: {
        user: process.env.EMAIL_NODEEMAILER,
        pass: process.env.PASS_NODEEMAILER
    }
});


export const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);