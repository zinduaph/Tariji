

// this File is for admin to get the list of all users and their products and also to delete any user

import lipaNaMpesaModel from "../model/lipaNaMpesa.js";
import userModel from "../model/user.js";

export const getAllUsers = async (req,res) => {
    try {
        console.log('Fetching all users...');
        const users = await userModel.find({}).select('name email isVendor plan createdAt');
        console.log(`Found ${users.length} users`);
        return res.json({success: true, users})
    } catch (error) {
        console.error('Error fetching users:', error);
              return res.json({success:false, message: 'error fetching users'})
        
    }
}


export const deleteUser = async (req,res) => {
    const {userId } = req.params
    try {
        const user = await userModel.findByIdAndDelete(userId);
        if(!user){
            return res.json({success: false, message: 'User not found'})
        }
        return res.json({success: true, message: 'User deleted successfully'})
    } catch (error) {
        return res.json({success:false, message:'Error deleting user'})
    }
}



