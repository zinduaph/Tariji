import mongoose from "mongoose";

const AccountSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    phoneNumber:{type:String, default:null},
    payBill:{type:Number, default:null},
    accountNumber:{type:Number,default:null}
})
const AccountModel = mongoose.model('Account',AccountSchema)

export default AccountModel;