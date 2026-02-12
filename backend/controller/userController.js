import userModel from "../model/user.js"
import lipaNaMpesaModel from "../model/lipaNaMpesa.js"
import productModel from "../model/product.js"
import  validator from "validator"
import bcrypt, { compare } from "bcrypt"

import personalModel from "../model/presonalInfo.js";
import jwt from "jsonwebtoken"
import transporter from "../config/nodemailer.js";

const createToken = (userId) => {
    return jwt.sign({userId}, process.env.JWT_SECRET)
}

// Generate a 6-digit OTP
const generateOtp = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

// Send verification OTP
const sendVerifyOtpEmail = async (email, otp) => {
    const mailOptions = {
        from: process.env.SENDER_EMAIL,
        to: email,
        subject: 'Verify Your Email - Tariji',
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #f97316;">Welcome to Tariji!</h2>
                <p>Thank you for registering. Please use the OTP below to verify your email address:</p>
                <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center;">
                    <h1 style="color: #f97316; font-size: 36px; letter-spacing: 8px; margin: 0;">${otp}</h1>
                </div>
                <p style="color: #6b7280;">This OTP will expire in 10 minutes.</p>
                <p style="margin-top: 20px;">If you didn't register on Tariji, please ignore this email.</p>
                <p>Best regards,<br><strong>Tariji Team</strong></p>
            </div>
        `
    };
    
    try {
        await transporter.sendMail(mailOptions);
        return true;
    } catch (error) {
        console.error('Error sending OTP email:', error);
        return false;
    }
}

// Step 1: Register - create user with OTP (don't verify yet)
export const register = async (req,res) => {
    const {name,email,password} = req.body
    try {
      if(!name || !email || !password) {
          return res.json({success:false, message:'Please fill all fields'})
      }
      
      // Check if user already exists
      const existing = await userModel.findOne({ email });
      if (existing) return res.status(400).json({ success: false, message: "Email already registered" });

      // Validate email format
      if (!validator.isEmail(email)) {
          return res.json({success:false, message:'Invalid email format'})
      }

      // Validate password strength
      if (password.length < 6) {
          return res.json({success:false, message:'Password must be at least 6 characters'})
      }

      // Hash password
      const hash = await bcrypt.hash(password, 10);
      
      // Generate OTP
      const otp = generateOtp();
      const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

      // Create user (not verified yet)
      const user = await userModel.create({
           email,
           name,
           password:hash,
           emailVerified: false,
           isVerified: false,
           verifyOtp: otp,
           verifyOtpExpiry: otpExpiry
      });
       await user.save()

      // Send OTP email
      const emailSent = await sendVerifyOtpEmail(email, otp);
      if (!emailSent) {
          return res.json({success:false, message:'Failed to send OTP. Please try again.'})
      }

      // Return temporary token for OTP verification step
      const tempToken = jwt.sign({userId: user._id, step: 'verify-otp'}, process.env.JWT_SECRET, {expiresIn: '15m'});

      return res.json({
          success:true, 
          message: 'OTP sent to your email. Please verify to complete registration.',
          tempToken,
          email
      });

    } catch (error) {
        console.error('Registration error:', error)
        res.json({success:false, message: error.message || 'Registration failed'})
    }
}

// Step 2: Verify OTP
export const verifyRegisterOtp = async (req, res) => {
    const { otp, tempToken } = req.body;
    
    try {
        if (!otp || !tempToken) {
            return res.json({success:false, message:'OTP and token required'})
        }
        
        // Verify temp token
        const decoded = jwt.verify(tempToken, process.env.JWT_SECRET);
        if (decoded.step !== 'verify-otp') {
            return res.json({success:false, message:'Invalid token'})
        }
        
        // Find user
        const user = await userModel.findById(decoded.userId);
        if (!user) {
            return res.json({success:false, message:'User not found'})
        }
        
        // Check if already verified
        if (user.isVerified) {
            return res.json({success:true, message:'Email already verified. Please login.'})
        }
        
        // Check OTP expiry
        if (user.verifyOtpExpiry && new Date() > user.verifyOtpExpiry) {
            return res.json({success:false, message:'OTP expired. Please request a new one.'})
        }
        
        // Verify OTP
        if (user.verifyOtp !== otp) {
            return res.json({success:false, message:'Invalid OTP'})
        }
        
        // Mark user as verified
        user.isVerified = true;
        user.emailVerified = true;
        user.verifyOtp = '';
        user.verifyOtpExpiry = null;
        await user.save();
        
        // Generate final login token
        const token = createToken(user._id);
        
        return res.json({
            success:true,
            message:'Email verified successfully!',
            token,
            user: {
                name: user.name,
                email: user.email,
                isVendor: user.isVendor,
                plan: user.plan
            }
        });
        
    } catch (error) {
        console.error('OTP verification error:', error);
        if (error.name === 'JsonWebTokenError') {
            return res.json({success:false, message:'Invalid or expired token'})
        }
        res.json({success:false, message:'OTP verification failed'})
    }
}

// Resend OTP
export const resendVerifyOtp = async (req, res) => {
    const { tempToken } = req.body;
    
    try {
        if (!tempToken) {
            return res.json({success:false, message:'Token required'})
        }
        
        const decoded = jwt.verify(tempToken, process.env.JWT_SECRET);
        if (decoded.step !== 'verify-otp') {
            return res.json({success:false, message:'Invalid token'})
        }
        
        const user = await userModel.findById(decoded.userId);
        if (!user) {
            return res.json({success:false, message:'User not found'})
        }
        
        if (user.isVerified) {
            return res.json({success:true, message:'Already verified. Please login.'})
        }
        
        // Generate new OTP
        const otp = generateOtp();
        const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);
        
        user.verifyOtp = otp;
        user.verifyOtpExpiry = otpExpiry;
        await user.save();
        
        const emailSent = await sendVerifyOtpEmail(user.email, otp);
        if (!emailSent) {
            return res.json({success:false, message:'Failed to send OTP'})
        }
        
        return res.json({success:true, message:'New OTP sent to your email'});
        
    } catch (error) {
        console.error('Resend OTP error:', error);
        res.json({success:false, message:'Failed to resend OTP'})
    }
}

// Login - only allow verified users
export const login = async (req,res) => {
    const{email,password} = req.body
    try {
        const user = await userModel.findOne({email})
        if(!user) {
            return res.json({success:false, message:'Invalid credentials'})
        }
        
        // Check if user is verified
        if (!user.isVerified) {
            // Generate temp token for OTP verification
            const tempToken = jwt.sign({userId: user._id, step: 'verify-otp'}, process.env.JWT_SECRET, {expiresIn: '15m'});
            return res.json({
                success:false, 
                message:'Email not verified. Please verify your email.',
                needsVerification: true,
                tempToken,
                email: user.email
            });
        }
        
        const isMatch = await bcrypt.compare(password, user.password)
        if(!isMatch) {
            return res.json({success:false, message:'Invalid credentials'})
        } 
        const token = createToken(user._id)
        console.log('Login successful')
        
     return res.json({
         success:true,
         message:'login successful',
         token,
         user: {
             name: user.name,
             email: user.email,
             isVendor: user.isVendor,
             plan: user.plan
         }
     })
    } catch (error) {
        console.error(error)
        res.json({success:false, message: error.message || 'Login error'})
    }
}

// this is a login route for admin
export const adminLogin = async (req,res) => {
    const{email,password} = req.body
    try {
        if(email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD){
            
            const token = jwt.sign(email+password, process.env.JWT_SECRET )
            console.log(token)
            
            return res.json({success:true,message:'admin login successful',token})
        } else {
            return res.json({success:false, message:'Invalid admin credentials'})
        }
    } catch (error) {
        return res.json({success:false, message:'Admin login error'})
    }
}

export const personalInfo = async (req,res) => {
    const {firstName,  lastName, typeOfProduct, phoneNumber, email, howDidYouHearAboutUs} = req.body

    try {
        if(!firstName || !lastName || !typeOfProduct || !phoneNumber || !email || !howDidYouHearAboutUs) {
            return res.json({success:false, message:'please fill the input fileds'})
            
        }
           
        const personalInfo = new personalModel({
            firstName,lastName,typeOfProduct,phoneNumber,email,howDidYouHearAboutUs
        })
        

        await personalInfo.save()
           
        return res.json({success:true,message:'personal info saved succesfully !'})
              

    } catch (error) {
        console.error(error)
        res.json({success:false, message: error.message || 'information not saved'})
    }
} 

export const getAllUsers = async (req,res) => {
    try {
        
        const users = await userModel.find({}).select('name email isVendor plan createdAt');
        
        return res.json({success: true, users})
    } catch (error) {
        console.error('Error fetching users:', error);
              return res.json({success:false, message: 'error fetching users'})
        
    }
}

  // This API is for the admin to get the list of products sold by a specific user
  // we are getting this information from the lipaNaMpesa transaction data since the buyers are checking out as guests
  export const getUserSoldProducts = async (req,res) => {
      const {userId} = req.params
      try {
          const user = await userModel.findById(userId).select('name email isVendor');
          
          if(!user){
              return res.json({success:false,message:'user not found'})
          }
          
          // Get all completed payments from lipaNaMpesa
          const allPurchases = await lipaNaMpesaModel.find({paymentStatus: 'completed'});
          
          // Filter products that belong to this vendor
          let vendorSoldProducts = [];
          
          for (const purchase of allPurchases) {
              if (purchase.cartItems && purchase.cartItems.length > 0) {
                  for (const item of purchase.cartItems) {
                      try {
                          // Check if productId is a valid MongoDB ObjectId
                          if (item.productId && item.productId.match(/^[0-9a-fA-F]{24}$/)) {
                              const product = await productModel.findById(item.productId);
                              
                              // Only include if product belongs to this vendor
                              if (product && product.userId === userId) {
                                  vendorSoldProducts.push({
                                      _id: purchase._id,
                                      productName: item.productName,
                                      price: item.price,
                                      quantity: item.quantity,
                                      createdAt: purchase.time || purchase.createdAt,
                                      paymentStatus: purchase.paymentStatus,
                                      buyerName: purchase.fullName,
                                      buyerEmail: purchase.email,
                                      mpesaReceipt: purchase.mpesaReceipt
                                  });
                              }
                          }
                      } catch (error) {
                          console.error('Error fetching product:', error);
                      }
                  }
              }
          }
          
          // Calculate summary
          const totalRevenue = vendorSoldProducts.reduce((sum, product) => sum + (product.price * product.quantity), 0);
          const totalItemsSold = vendorSoldProducts.reduce((sum, product) => sum + product.quantity, 0);
          
          if(vendorSoldProducts.length === 0){
              return res.json({
                  success: true, 
                  message: 'No products sold yet', 
                  soldProducts: [],
                  userName: user.name,
                  userEmail: user.email,
                  summary: {
                      totalRevenue: 0,
                      totalItemsSold: 0,
                      totalOrders: 0
                  }
              })
          } else {
              return res.json({
                  success: true, 
                  soldProducts: vendorSoldProducts,
                  userName: user.name,
                  userEmail: user.email,
                  summary: {
                      totalRevenue,
                      totalItemsSold,
                      totalOrders: vendorSoldProducts.length
                  }
              })
          }
      } catch (error) {
          console.error('Error fetching sold products:', error);
          return res.json({success:false, message:'Error fetching sold products'})
      }
  }

// Send password reset OTP
const sendResetOtpEmail = async (email, otp) => {
    const mailOptions = {
        from: process.env.SENDER_EMAIL,
        to: email,
        subject: 'Reset Your Password - Tariji',
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #f97316;">Reset Your Password</h2>
                <p>You requested to reset your password. Please use the OTP below:</p>
                <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center;">
                    <h1 style="color: #f97316; font-size: 36px; letter-spacing: 8px; margin: 0;">${otp}</h1>
                </div>
                <p style="color: #6b7280;">This OTP will expire in 10 minutes.</p>
                <p style="margin-top: 20px;">If you didn't request a password reset, please ignore this email.</p>
                <p>Best regards,<br><strong>Tariji Team</strong></p>
            </div>
        `
    };
    
    try {
        await transporter.sendMail(mailOptions);
        return true;
    } catch (error) {
        console.error('Error sending reset OTP email:', error);
        return false;
    }
}

// Forgot Password - send OTP
export const forgotPassword = async (req, res) => {
    const { email } = req.body;
    
    try {
        if (!email) {
            return res.json({success:false, message:'Email required'});
        }
        
        // Find user by email
        const user = await userModel.findOne({ email });
        if (!user) {
            // Don't reveal if user exists or not
            return res.json({
                success:true,
                message:'If an account exists with this email, an OTP has been sent.'
            });
        }
        
        // Generate OTP
        const otp = generateOtp();
        const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);
        
        // Save OTP to user
        user.resetOtp = otp;
        user.resetOtpExpiry = otpExpiry;
        await user.save();
        
        // Send OTP email
        const emailSent = await sendResetOtpEmail(email, otp);
        if (!emailSent) {
            return res.json({success:false, message:'Failed to send OTP. Please try again.'});
        }
        
        // Return temp token for password reset
        const tempToken = jwt.sign({userId: user._id, step: 'reset-password'}, process.env.JWT_SECRET, {expiresIn: '15m'});
        
        return res.json({
            success:true,
            message:'If an account exists with this email, an OTP has been sent.',
            tempToken,
            email
        });
        
    } catch (error) {
        console.error('Forgot password error:', error);
        res.json({success:false, message:'Failed to process request'});
    }
};

// Verify OTP and reset password
export const resetPassword = async (req, res) => {
    const { otp, tempToken, newPassword } = req.body;
    
    try {
        if (!otp || !tempToken || !newPassword) {
            return res.json({success:false, message:'OTP, token, and new password required'});
        }
        
        if (newPassword.length < 6) {
            return res.json({success:false, message:'Password must be at least 6 characters'});
        }
        
        // Verify temp token
        const decoded = jwt.verify(tempToken, process.env.JWT_SECRET);
        if (decoded.step !== 'reset-password') {
            return res.json({success:false, message:'Invalid token'});
        }
        
        // Find user
        const user = await userModel.findById(decoded.userId);
        if (!user) {
            return res.json({success:false, message:'User not found'});
        }
        
        // Check OTP expiry
        if (user.resetOtpExpiry && new Date() > user.resetOtpExpiry) {
            return res.json({success:false, message:'OTP expired. Please request a new one.'});
        }
        
        // Verify OTP
        if (user.resetOtp !== otp) {
            return res.json({success:false, message:'Invalid OTP'});
        }
        
        // Hash new password
        const hash = await bcrypt.hash(newPassword, 10);
        
        // Update password and clear OTP
        user.password = hash;
        user.resetOtp = '';
        user.resetOtpExpiry = null;
        await user.save();
        
        return res.json({
            success:true,
            message:'Password reset successfully! You can now login.'
        });
        
    } catch (error) {
        console.error('Reset password error:', error);
        if (error.name === 'JsonWebTokenError') {
            return res.json({success:false, message:'Invalid or expired token'});
        }
        res.json({success:false, message:'Failed to reset password'});
    }
};

// Resend Reset OTP
export const resendResetOtp = async (req, res) => {
    const { tempToken } = req.body;
    
    try {
        if (!tempToken) {
            return res.json({success:false, message:'Token required'});
        }
        
        const decoded = jwt.verify(tempToken, process.env.JWT_SECRET);
        if (decoded.step !== 'reset-password') {
            return res.json({success:false, message:'Invalid token'});
        }
        
        const user = await userModel.findById(decoded.userId);
        if (!user) {
            return res.json({success:false, message:'User not found'});
        }
        
        // Generate new OTP
        const otp = generateOtp();
        const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);
        
        user.resetOtp = otp;
        user.resetOtpExpiry = otpExpiry;
        await user.save();
        
        const emailSent = await sendResetOtpEmail(user.email, otp);
        if (!emailSent) {
            return res.json({success:false, message:'Failed to send OTP'});
        }
        
        return res.json({success:true, message:'New OTP sent to your email'});
        
    } catch (error) {
        console.error('Resend reset OTP error:', error);
        res.json({success:false, message:'Failed to resend OTP'});
    }
};
