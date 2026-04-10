import { sendEmail } from '../../utils/index.js';

export const sendVerificationEmailService = async (user, otp) => {
  const message = `Hi ${user.name || 'User'},

Welcome to Muzly AI! Use the OTP below to verify your email address.
It is valid for 10 minutes.

Your OTP: ${otp}

If you didn't create an account, please ignore this email.

Best,
The Muzly Team`;

  await sendEmail({
    email: user.email,
    subject: 'Muzly AI — Your Email Verification OTP',
    message,
  });
};

export const sendPasswordResetEmailService = async (user, resetUrl) => {
  const message = `Hi ${user.name || 'User'},

You recently requested to reset your password for your Muzly AI account.
Click the link below to reset it (valid for 10 minutes):

${resetUrl}

If you didn't request a password reset, please ignore this email.

Best,
The Muzly Team`;

  await sendEmail({
    email: user.email,
    subject: 'Muzly AI — Password Reset Request',
    message,
  });
};
