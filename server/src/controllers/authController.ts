import { Request, Response } from 'express';
import User from '../models/User';
import OtpVerification from '../models/OtpVerification';
import { sendEmail } from '../services/emailService'; 
import Blacklist from '../models/Blacklist';
import { validatePhoneNumber } from '../utils/phoneValidation';
import { validateEmail } from '../utils/emailValidation';

export const registerUser = async (req: Request, res: Response) => {
  const session = await User.startSession();
  session.startTransaction();

  try {
    const { name, phone, email } = req.body;

    // Validate phone and email
    if (!validatePhoneNumber(phone)) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ message: 'Invalid phone number format' });
    }

    if (!validateEmail(email)) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ message: 'Invalid email format' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email }).session(session);
    if (existingUser) {
      await session.abortTransaction();
      session.endSession();
      return res.status(409).json({ message: 'User already registered' });
    }

    // Create new user
    const user = new User({ name, phone, email });
    await user.save({ session });

    // Generate OTP and save to OtpVerification
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpVerification = new OtpVerification({ userId: user._id, otp });
    await otpVerification.save({ session });

    // Send OTP email
    try {
      await sendEmail(email, name, otp, 'otpVerification'); // Specify OTP type
    } catch (emailError) {
      await session.abortTransaction();
      session.endSession();
      return res.status(500).json({ message: 'Failed to send OTP email. User not created.', error: emailError });
    }

    // Commit the transaction
    await session.commitTransaction();
    session.endSession();

    res.status(201).json({ message: 'User registered successfully. OTP sent to email.' });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    res.status(500).json({ message: 'Server error', error });
  }
};

export const verifyOtp = async (req: Request, res: Response) => {
  try {
    const { email, otp } = req.body;

    // Find user and OTP verification record
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const otpVerification = await OtpVerification.findOne({ userId: user._id });
    if (!otpVerification) {
      return res.status(400).json({ message: 'OTP record not found' });
    }

    // Check for blacklist
    const blacklist = await Blacklist.findOne({ userId: user._id });
    if (blacklist) {
      const now = new Date();
      const blacklistExpiration = new Date(blacklist.blacklistDate);
      blacklistExpiration.setDate(blacklistExpiration.getDate() + blacklist.durationDays);

      if (now < blacklistExpiration) {
        return res.status(403).json({ message: 'User is blacklisted. Please try again later.' });
      } else {
        // Remove expired blacklist
        await Blacklist.deleteOne({ userId: user._id });
      }
    }

    // Check if OTP was already verified
    if (otpVerification.verified) {
      return res.status(400).json({ message: 'OTP already verified' });
    }

    // Verify OTP
    if (otpVerification.otp !== otp) {
      otpVerification.attempts += 1;
      await otpVerification.save();

      if (otpVerification.attempts >= 4) {
        // Blacklist user
        const blacklistEntry = new Blacklist({
          userId: user._id,
          blacklistDate: new Date(),
          durationDays: 1
        });
        await blacklistEntry.save();

        await sendEmail(email, user.name, undefined, 'blacklist'); // Send blacklist email

        return res.status(403).json({ message: 'Too many failed attempts. User has been blacklisted for 1 day. Please check your email for further details.' });
      }

      return res.status(400).json({ message: 'Invalid OTP' });
    }

    // OTP verified
    otpVerification.verified = true;
    otpVerification.attempts = 0;
    await otpVerification.save();

    // Send welcome email after successful verification
    await sendEmail(email, user.name, undefined, 'welcome'); // Send welcome email

    res.status(200).json({ message: 'OTP verified successfully. Welcome email sent.' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const resendOtp = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const otpVerification = await OtpVerification.findOne({ userId: user._id });
    if (!otpVerification) {
      return res.status(400).json({ message: 'OTP record not found' });
    }

    // Check for blacklist
    const blacklist = await Blacklist.findOne({ userId: user._id });
    if (blacklist) {
      const now = new Date();
      const blacklistExpiration = new Date(blacklist.blacklistDate);
      blacklistExpiration.setDate(blacklistExpiration.getDate() + blacklist.durationDays);

      if (now < blacklistExpiration) {
        return res.status(403).json({ message: 'User is blacklisted. Please try again later.' });
      } else {
        await Blacklist.deleteOne({ userId: user._id });
      }
    }

    // Generate new OTP
    const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
    otpVerification.otp = newOtp;
    otpVerification.verified = false;
    otpVerification.attempts = 0;
    await otpVerification.save();

    // Send new OTP email
    try {
      await sendEmail(email, user.name, newOtp, 'otpVerification');
    } catch (emailError) {
      return res.status(500).json({ message: 'Failed to send OTP email', error: emailError });
    }

    res.status(200).json({ message: 'New OTP sent to email.' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};