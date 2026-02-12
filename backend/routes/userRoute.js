import express from 'express'
import {getUserSoldProducts,getAllUsers,  adminLogin, login, personalInfo, register, verifyRegisterOtp, resendVerifyOtp, forgotPassword, resetPassword, resendResetOtp } from '../controller/userController.js'
import { deleteUser } from '../controller/adminController.js'
import { getAllSellerOrders } from '../controller/deliveryController.js'
import userModel from '../model/user.js'
import authMiddleware from '../middleware/auth.js'
import adminAuthMiddleware from '../middleware/adminAuth.js'
import { loginRateLimiter } from '../middleware/loginRateLimiter.js'


const Router = express.Router()

Router.post('/register', register)
Router.post('/verify-otp', verifyRegisterOtp)
Router.post('/resend-otp', resendVerifyOtp)
Router.post('/forgot-password', forgotPassword)
Router.post('/reset-password', resetPassword)
Router.post('/resend-reset-otp', resendResetOtp)
Router.get('/users',  getAllUsers)
Router.get('/admin/sold-products/:userId', adminAuthMiddleware, getUserSoldProducts)
Router.post('/admin', adminLogin)
Router.get('/sold',getAllSellerOrders)
Router.post('/personal', authMiddleware, personalInfo)
Router.post('/login',loginRateLimiter,login)
Router.get('/profile', authMiddleware, async (req, res) => {
    try {
        const user = await userModel.findById(req.userId).select('name email isVendor');
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        res.json({ success: true, user });
    } catch (error) {
        console.error('Profile fetch error:', error);
        res.status(500).json({ success: false, message: 'Error fetching profile' });
    }
});

// Admin routes - protected by adminAuthMiddleware
Router.get('/admin/users', adminAuthMiddleware, getAllUsers);
Router.delete('/admin/users/:userId', adminAuthMiddleware, deleteUser);

export default Router
