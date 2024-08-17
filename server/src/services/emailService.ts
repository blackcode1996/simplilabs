import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import fs from 'fs'; 
import path from 'path';

dotenv.config();

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  secure: true,
  port: 465,
  auth: {
    user: process.env.EMAIL_USER, 
    pass: process.env.EMAIL_PASS 
  }
});

const getEmailTemplate = (name: string, otp: string | undefined, type: 'otpVerification' | 'welcome' | 'blacklist') => {
  const templatePath = type === 'otpVerification'
    ? path.join(__dirname, '../emailTemplates/otpVerificationmail.html')
    : type === 'welcome'
    ? path.join(__dirname, '../emailTemplates/welcomemail.html')
    : path.join(__dirname, '../emailTemplates/blacklistemail.html');

  const template = fs.readFileSync(templatePath, 'utf8');

  // Replace placeholders with actual values
  let emailContent = template.replace('{{name}}', name);
  if (otp) {
    emailContent = emailContent.replace('{{otp}}', otp);
  }

  return emailContent;
};

export const sendEmail = async (email: string, name: string, otp: string | undefined, type: 'otpVerification' | 'welcome' | 'blacklist') => {
  try {
    const htmlContent = getEmailTemplate(name, otp, type);

    const mailOptions = {
      from: process.env.EMAIL_USER, 
      to: email, 
      subject: type === 'welcome' ? 'Welcome to Infollion!' : type === 'otpVerification' ? 'Your OTP Code' : 'Action Required: OTP Verification Attempt Limit Reached',
      html: htmlContent, 
    };

    // Send email
    await transporter.sendMail(mailOptions);
    console.log(`${type === 'welcome' ? 'Welcome email' : type === 'otpVerification' ? 'OTP email' : 'Blacklist notification email'} sent successfully`);
  } catch (error) {
    console.error(`Error sending ${type} email:`, error);
    throw new Error(`Failed to send ${type} email`);
  }
};
