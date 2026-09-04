

// this File is for admin to get the list of all users and their products and also to delete any user

import lipaNaMpesaModel from "../model/lipaNaMpesa.js";
import userModel from "../model/user.js";
import transporter from "../config/nodemailer.js";
import validator from "validator";

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

export const sendUserEmail = async (req, res) => {
    const { recipient, subject, message } = req.body;

    if (!recipient || !subject?.trim() || !message?.trim()) {
        return res.status(400).json({
            success: false,
            message: 'Recipient, subject, and message are required'
        });
    }

    try {
        let recipients;
        if (recipient === 'all') {
            const users = await userModel.find({}).select('email -_id').lean();
            recipients = users.map((user) => user.email).filter(Boolean);
        } else if (validator.isEmail(recipient)) {
            recipients = [recipient];
        } else {
            return res.status(400).json({ success: false, message: 'Invalid recipient email' });
        }

        if (recipients.length === 0) {
            return res.status(404).json({ success: false, message: 'No recipient users found' });
        }

        await transporter.sendMail({
            from: process.env.SENDER_EMAIL,
            to: recipients,
            subject: subject.trim(),
            text: message.trim(),
            html: `<div style="white-space: pre-wrap; font-family: Arial, sans-serif;">${message.trim()}</div>`
        });

        return res.json({ success: true, message: `Email sent to ${recipients.length} recipient(s)` });
    } catch (error) {
        console.error('Error sending admin email:', error);
        return res.status(500).json({ success: false, message: 'Failed to send email' });
    }
};



