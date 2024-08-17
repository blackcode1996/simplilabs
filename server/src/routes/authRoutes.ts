import { Router } from 'express';
import { registerUser, resendOtp, verifyOtp } from '../controllers/authController';

const router = Router();

router.post('/register', registerUser);

router.post('/verify-otp', verifyOtp);

router.post('/resend-otp', resendOtp);

export default router;
