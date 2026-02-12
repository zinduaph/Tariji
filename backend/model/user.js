import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    clerkUserId: { type: String, unique: true, sparse: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    emailVerified: { type: Boolean, default: false },
    verifyOtp: {type: String, default: ''},
    verifyOtpExpiry: { type: Date },
    isVerified: { type: Boolean, default: false },
    resetOtp: { type: String, default: '' },
    resetOtpExpiry: { type: Date },
    plan: { type: String, default: 'starter' },
    isVendor: { type: Boolean, default: true },
    subscriptionEndDate: { type: Date },
    refreshToken: String,
    createdAt: { type: Date, default: Date.now }
}, { minimize: false })

const userModel = mongoose.model('user', userSchema)

export default userModel
