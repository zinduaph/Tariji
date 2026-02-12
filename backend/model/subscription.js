import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    plan: { type: String, enum: ['starter', 'growth', 'proPlan'], required: true },
    amount: { type: Number, required: true },
     subscriptionStatus: { 
        type: String, 
        enum: ['pending_payment', 'active', 'expired', 'cancelled', 'payment_failed'], 
        default: 'pending_payment' },
        // M-Pesa details
    mpesaReceipt: { type: String },
    checkoutRequestId: { type: String },
    merchantRequestId: { type: String },
    phoneNumber: { type: String },
    
    // Subscription dates
    activatedAt: { type: Date },
    expiresAt: { type: Date },
    cancelledAt: { type: Date },
    
    // Metadata
    isRenewal: { type: Boolean, default: false },
    previousSubscriptionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Subscription' }
},[])
const subscriptionModel = mongoose.model('subscription', subscriptionSchema)

export default subscriptionModel;