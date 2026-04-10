import nodemailer from 'nodemailer';
import { envVariables } from '../../config/index.js';

export const sendEmail = async (options) => {
    const transporter = nodemailer.createTransport({
        host: envVariables.EMAIL_HOST,
        port: envVariables.EMAIL_PORT,
        auth: {
            user: envVariables.EMAIL_USERNAME,
            pass: envVariables.EMAIL_PASSWORD,
        },
    });

    await transporter.sendMail({
        from: 'Muzly AI <noreply@muzly.ai>',
        to: options.email,
        subject: options.subject,
        text: options.message,
    });
};
