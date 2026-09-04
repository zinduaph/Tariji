
import AccountModel from "../model/accountModel.js";


export const AddAccount = async(req,res) => {
    const {phoneNumber} = req.body
    try {
        if (!phoneNumber) {
            return res.status(400).json({ success: false, message: 'Phone number is required' });
        }

        const account = await AccountModel.findOneAndUpdate(
            { userId: req.userId },
            { userId: req.userId, phoneNumber: String(phoneNumber).trim() },
            { new: true, upsert: true, runValidators: true }
        );
        res.status(200).json({ success: true, account });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
export const getAccount = async(req,res) => {

    try{
        const account = await AccountModel.findOne({ userId: req.userId })
        return res.json({success:true,account})

    } catch(error){
        res.status(500).json({ message: error.message });
    }
}