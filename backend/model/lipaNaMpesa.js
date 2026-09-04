import mongoose from "mongoose";
import axios from 'axios';

const lipaNaMpesaSchema = new mongoose.Schema({
    productName:{type:String,require:true},
    fullName:{type:String,require:true},
    email:{type:String,require:true},
    phone:{type:String,require:true},
    amount:{type:Number,require:true},
    transactionId:{type:String},
    paymentProvider: { type: String, enum: ['mpesa', 'paystack'], default: 'mpesa' },
    paystackReference: { type: String, unique: true, sparse: true },
    paystackTransactionId: { type: String },
    mpesaReceipt:{type:String},
    paymentStatus:{type:String,default:'pending',enum:['pending','completed','failed']},
    cartItems: [{
        productId: String,
        productName: String,
        quantity: Number,
        price: Number,
        image: { type: mongoose.Schema.Types.Mixed }
    }],
    time: {type:Date,require:true,default:Date.now()}
})

const lipaNaMpesaModel = mongoose.model('lipaNaMpesa', lipaNaMpesaSchema)

export default lipaNaMpesaModel
