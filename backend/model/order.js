
import mongoose from 'mongoose'

const orderSchema = new mongoose.Schema({
    items :{type :Array, required:true},
    amount :{type :Number, required:true},
    address :{type :Object, required:true},
    status :{type :String, default:"order placed"},
    paymentMethod :{type:String, default:"cash"},
    payment:{type:Boolean, required:true, default:false},
    date: {type:Number, required:true, default:Date.now},
    // Delivery tracking for digital products
    deliveryStatus: { 
        type: String, 
        enum: ['pending', 'processing', 'delivered', 'failed'],
        default: 'pending'
    },
    deliverySentAt: { type: Date },
    downloadLinks: [{
        productId: String,
        productName: String,
        downloadUrl: String,
        expiresAt: Date,
        delivered: { type: Boolean, default: false }
    }],
    sellerId: { type: String },
    buyerEmail: { type: String }
})

const orderModel = mongoose.model("order",orderSchema)
export default orderModel