


import subscriptionModel from '../model/subscription.js';
import userModel from '../model/user.js'
import axios from 'axios'
import nodemailer from 'nodemailer'
import { getNgrokUrl } from '../utils/ngrok-config.js';
import { sendEmail } from '../config/nodemailer.js';

const getAccessToken = async () => {
    const consumerKey = process.env.SAFARICOM_CONSUMER_KEY;
    const consumerSecret = process.env.SAFARICOM_CONSUMER_SECRET;
    const auth = Buffer.from(`${consumerKey}:${consumerSecret}`).toString('base64');
    
    try {
        const response = await axios.get(
            'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials',
            {
                headers: {
                    'Authorization': `Basic ${auth}`
                }
            }
        );
        return response.data.access_token;
    } catch (error) {
        throw new Error('Failed to get access token');
    }
};

const formatPhoneNumber = (phone) => {
    let formatted = phone.replace(/[\s\-+]/g, '');
    if (formatted.startsWith('0')) {
        formatted = '254' + formatted.substring(1);
    }
    if (!formatted.startsWith('254')) {
        formatted = '254' + formatted;
    }
    return formatted;
};

// Email transporter configuration
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Send subscription payment initiated email
const sendPaymentInitiatedEmail = async (user, subscription) => {
    try {
        const planName = subscription.plan.charAt(0).toUpperCase() + subscription.plan.slice(1);

        const sendMail = {
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: `📱 Payment Request Sent - ${planName} Plan`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #2563eb;">Payment Request Sent!</h2>
                    <p>Dear ${user.name},</p>
                    <p>We've sent a payment request to your phone. Please complete the following steps:</p>
                    
                    <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
                        <p><strong>1.</strong> Check your phone for an M-Pesa STK push notification</p>
                        <p><strong>2.</strong> Enter your M-Pesa PIN to authorize the payment</p>
                        <p><strong>3.</strong> Wait for confirmation SMS from M-Pesa</p>
                    </div>
                    
                    <div style="background-color: #fef3c7; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #f59e0b;">
                        <p style="margin: 0; color: #92400e;"><strong>Plan:</strong> ${planName} Plan - KES ${subscription.amount}</p>
                        <p style="margin: 10px 0 0 0; color: #92400e;"><strong>Subscription ID:</strong> ${subscription._id}</p>
                    </div>
                    
                    <p>Your subscription will be activated immediately after payment is confirmed.</p>
                    
                    <p style="margin-top: 30px;">
                        Best regards,<br>
                        <strong>Tariji Team</strong>
                    </p>
                </div>
            `
        };

        await sendEmail(sendMail);
        console.log(`✅ Payment initiated email sent to ${user.email}`);
    } catch (error) {
        console.error('Failed to send payment initiated email:', error);
    }
};
// Send subscription ACTIVATED email (only sent after M-Pesa payment confirmed)
const sendSubscriptionActivatedEmail = async (user, subscription) => {
    try {
        const planName = subscription.plan.charAt(0).toUpperCase() + subscription.plan.slice(1);
        const expiresDate = subscription.expiresAt 
            ? new Date(subscription.expiresAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })
            : 'Never (Lifetime)';

        const sendMail = {
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: `✅ Payment Confirmed - ${planName} Plan Activated!`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #22c55e;">🎉 Payment Confirmed!</h2>
                    <p>Dear ${user.name},</p>
                    <p>Great news! Your payment has been <strong>CONFIRMED</strong> and your subscription is now <strong>ACTIVE</strong>.</p>
                    
                    <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
                        <p><strong>Plan:</strong> ${planName} Plan</p>
                        <p><strong>Subscription ID:</strong> ${subscription._id}</p>
                        <p><strong>M-Pesa Receipt:</strong> ${subscription.mpesaReceipt || 'N/A'}</p>
                        <p><strong>Activated On:</strong> ${new Date(subscription.activatedAt).toLocaleDateString()}</p>
                        <p><strong>Expires On:</strong> ${expiresDate}</p>
                        <p><strong>Amount Paid:</strong> KES ${subscription.amount}</p>
                    </div>
                    
                    <p>You now have access to all ${planName} Plan features!</p>
                    
                    <p style="margin-top: 30px;">
                        Best regards,<br>
                        <strong>Tariji Team</strong>
                    </p>
                    
                    <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
                    <p style="color: #6b7280; font-size: 12px;">
                        This is an automated message. Please do not reply directly to this email.
                    </p>
                </div>
            `
        };

        await sendEmail(sendMail);
        console.log(`✅ Activation email sent to ${user.email}`);
    } catch (error) {
        console.error('Failed to send activation email:', error);
    }
};

// Send subscription failed email


export const starterPlan = async (req,res) => {
    try {
        const userId = req.userId;
        const user = await userModel.findById(userId);
        if(!user) {
           return res.json({success:false, message:'user not found'})
        }

        // Check for existing active subscription
        const existingSub = await subscriptionModel.findOne({
            userId: user._id,
            subscriptionStatus: 'active'
        });

        if(existingSub){
            return res.status(400).json({
                error: 'Active subscription exists'
            });
        }

        // Create subscription record for starter plan
        const subscription = await subscriptionModel.create({
            userId: user._id,
            plan: 'starter',
            amount: 0, // free plan
            subscriptionStatus: 'active',
            isRenewal: false
        });

        user.plan = "starter"
        user.subscriptionStatus = 'active'
        user.subscriptionEndDate = null // free plan never expires
        await user.save()

        // Send confirmation email for starter plan
        await sendSubscriptionActivatedEmail(user, subscription);

        res.json({
            success: true,
            message: 'Starter plan activated successfully',
            plan: 'starter',
            subscriptionId: subscription._id
        });
    } catch (error) {
        console.error('Starter plan error:', error);
        res.status(500).json({ success: false, message: 'Error activating starter plan' });
    }
}

export const  growthPlan = async (req, res) => {
    const userId = req.userId;
    const phoneNumber = req.body.phoneNumber
    if (!userId) {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
    }
    const user = await userModel.findById(userId);
    if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (!phoneNumber) {
        return res.json({success:false, message:'phone number is required'})
    }

    // checking for existing subscription
    const existingSub = await subscriptionModel.findOne({
        userId:user._id,
        status:'active'
    })

    if(existingSub){
                    return res.status(400).json({
                error: 'Active subscription exists'
            });

    }

    const amount = 1000 // growth plan amount
    const formattedPhone = formatPhoneNumber(phoneNumber)
   // creating a subscription model
    const subscription = await subscriptionModel.create({
       userId:user._id,
       plan: 'growth',
      amount: amount,
      phoneNumber: formattedPhone,
      subscriptionStatus: 'pending_payment'
    })
    console.log(subscription)
   // get mpesa access token
   const accessToken = await getAccessToken()

   // Prepare STK Push
        const timestamp = new Date().toISOString().replace(/[^0-9]/g, '').slice(0, -3);
        const shortCode = process.env.BUSINESS_SHORT_CODE;
        const passkey = process.env.PASS_KEY;
        const password = Buffer.from(shortCode + passkey + timestamp).toString('base64');
        
        // building the callback url using ngrok for local testing
        const ngrokUrl = getNgrokUrl();
        if (ngrokUrl) {
            return res.status(500).json({ success: false, message: 'Ngrok URL not available' });
        }
        const callbackPath = '/api/subscription/callback';
        const callbackURL = `${process.env.BACKEND_URL}${callbackPath}`;

        const stkPushRequest = {
            BusinessShortCode: shortCode,
            Password: password,
            Timestamp: timestamp,
            TransactionType: "CustomerPayBillOnline",
            Amount: amount,
            PartyA: formattedPhone,
            PartyB: shortCode,
            PhoneNumber: formattedPhone,
            CallBackURL: callbackURL,
            AccountReference: `SUB-${subscription._id}`,
            TransactionDesc: `Growth Plan Subscription`
        };

        // Send STK Push
        console.log('STK Push Request:', JSON.stringify(stkPushRequest, null, 2));
        console.log('Access Token:', accessToken);
        const response = await axios.post(
            'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest',
            stkPushRequest,
            {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                }
            }
        );
        console.log('STK Push Response:', JSON.stringify(response.data, null, 2));

        if (response.data.ResponseCode === "0") {
            // Update subscription with checkout details
            subscription.checkoutRequestId = response.data.CheckoutRequestID;
            subscription.merchantRequestId = response.data.MerchantRequestID;
            await subscription.save();
            // Send payment initiated email
            await sendPaymentInitiatedEmail(user, subscription);
            return res.json({
                success: true,
                message: 'Please check your phone and enter your M-Pesa PIN',
                subscriptionId: subscription._id,
                checkoutRequestId: response.data.CheckoutRequestID
            });
        } else {
            subscription.subscriptionStatus = 'payment_failed';
            await subscription.save();
            
            return res.status(400).json({
                success: false,
                message: 'Failed to initiate payment. Please try again.'
            });
        }

}

export const proPlan = async (req,res) => {
    const userId = req.userId
    const phoneNumber = req.body.phoneNumber
      try {
         if(!userId) {
                 return res.status(404).json({ success: false, message: 'Unauthorized' })
      }
      const user = await userModel.findOne({clerkUserId:userId})
       if(!user) {
            return res.json({success:false, message:'user not found'})
       }

       if (!phoneNumber) {
         return res.json({success:false, message:'phone number is required'})
     }

     const amount = 1500 // proPlan amount
     const formattedPhone = formatPhoneNumber(phoneNumber)

     // creating subscription
     const subscription = await subscriptionModel.create({
          userId: user._id,
          planType:'proPlan',
          amount:amount,
          phoneNumber:formattedPhone,
          status:'pending_payment'
     })
     
    // Get M-Pesa access token
        const accessToken = await getAccessToken();

        // Prepare STK Push
        const timestamp = new Date().toISOString().replace(/[^0-9]/g, '').slice(0, -3);
        const shortCode = process.env.MPESA_SHORTCODE;
        const passkey = process.env.MPESA_PASSKEY;
        const password = Buffer.from(shortCode + passkey + timestamp).toString('base64');

        const stkPushRequest = {
        BusinessShortCode: shortCode,
        Password: password,
        Timestamp: timestamp,
        TransactionType: "CustomerPayBillOnline",
        Amount: amount,
        PartyA: formattedPhone,
        PartyB: shortCode,
        PhoneNumber: formattedPhone,
        CallBackURL: `${process.env.BACKEND_URL}/api/subscription/callback`,
        AccountReference: `SUB-${subscription._id}`,
        TransactionDesc: `Pro Plan Subscription`
    };

      // Send STK Push
        console.log('STK Push Request:', JSON.stringify(stkPushRequest, null, 2));
        console.log('Access Token:', accessToken);
        const response = await axios.post(
            'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest',
            stkPushRequest,
            {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                }
            }
        );
        console.log('STK Push Response:', JSON.stringify(response.data, null, 2));

        if (response.data.ResponseCode === "0") {
            // Update subscription with checkout details
            subscription.checkoutRequestId = response.data.CheckoutRequestID;
            await subscription.save();
            // Send payment initiated email
            await sendPaymentInitiatedEmail(user, subscription);
            return res.json({
                success: true,
                message: 'Please check your phone and enter your M-Pesa PIN',
                subscriptionId: subscription._id,
                checkoutRequestId: response.data.CheckoutRequestID
            });
        } else {
            subscription.status = 'payment_failed';
            await subscription.save();
            await sendSubscriptionFailedEmail(user, subscription, 'Failed to initiate payment');
            return res.status(400).json({
                success: false,
                message: 'Failed to initiate payment. Please try again.'
            });
        }

 } catch (error) {
     console.log(error)
     res.json({success:false, message:'pro plan is not working'})
 }
 }


// M-Pesa Callback Handler for Subscriptions
export const subscriptionCallback = async (req, res) => {
    try {
        const callbackData = req.body;
        
        console.log('Subscription Callback:', JSON.stringify(callbackData, null, 2));

        const resultCode = callbackData.Body.stkCallback.ResultCode;
        const checkoutRequestId = callbackData.Body.stkCallback.CheckoutRequestID;

        // Find the subscription
        const subscription = await subscriptionModel.findOne({ 
            checkoutRequestId: checkoutRequestId 
        });

        if (!subscription) {
            console.error('Subscription not found for checkout request:', checkoutRequestId);
            return res.status(200).json({ success: true }); // Still return 200 to M-Pesa
        }

        if (resultCode === 0) {
            // Payment successful
            const callbackMetadata = callbackData.Body.stkCallback.CallbackMetadata.Item;

            const mpesaReceipt = callbackMetadata.find(
                item => item.Name === 'MpesaReceiptNumber'
            )?.Value;

            const transactionDate = callbackMetadata.find(
                item => item.Name === 'TransactionDate'
            )?.Value;

            // Update subscription
            subscription.subscriptionStatus = 'active';
            subscription.mpesaReceipt = mpesaReceipt;
            subscription.activatedAt = new Date();
            subscription.expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days
            await subscription.save();

            // Update user's plan
            const user = await userModel.findById(subscription.userId);
            user.plan = subscription.plan;
            user.subscriptionStatus = 'active';
            user.subscriptionEndDate = subscription.expiresAt;
            await user.save();

            console.log(`✅ Subscription activated for user ${user._id} - ${subscription.plan}`);

        // Send activation email (only sent after payment is confirmed)
            await sendSubscriptionActivatedEmail(user, subscription);

        } else {
            // Payment failed
            subscription.subscriptionStatus = 'payment_failed';
            await subscription.save();

            // Get user for failed email
            const user = await userModel.findById(subscription.userId);
            if (user) {
                const reason = callbackData.Body.stkCallback.ResultDesc || 'Payment was not completed';
                await sendSubscriptionFailedEmail(user, subscription, reason);
            }

            console.log(`❌ Subscription payment failed for ${subscription._id}: ${callbackData.Body.stkCallback.ResultDesc}`);
        }

        // Always return success to M-Pesa
        res.status(200).json({ success: true });

    } catch (error) {
        console.error('Subscription callback error:', error);
        res.status(200).json({ success: true }); // Still return 200 to prevent retries
    }
};

// check subscription status
export const checkSubscriptionStatus = async (req,res) => {
    const subscriptionId = req.params.subscriptionId
    try {
        const subscription = await subscriptionModel.findById(subscriptionId)
        if(!subscription){
            return res.json({success: false,
                message: 'Subscription not found'})
        } else {
            return res.json({
                success:true,
                plan:subscription.plan,
                subscriptionStatus:subscription.subscriptionStatus,
                mpesaReceipt:subscription.mpesaReceipt,
                expiresAt:subscription.expiresAt
            })
        }
    } catch (error) {
        console.log('checking subscription status',error)
        return res.json({success:false, message:'checking subscription status'})
    }
}

export const getCurrentSubscription = async (req,res) => {
    try {
        const userId = req.userId;
        const user = await userModel.findById(userId);
        if(!user) {
            return res.json({success:false, message:'user not found'})
        }
        const currentSubscription = await subscriptionModel.findOne({
             userId: user._id,
            subscriptionStatus: 'active'

        }).sort({ createdAt: -1 });
        res.json({success:true,plan:user.plan,
             subscriptionStatus:user.subscriptionStatus,
             subscriptionEndDate:user.subscriptionEndDate,
             subscription:currentSubscription
            })
    } catch (error) {
         console.error('Get subscription error:', error);
        res.status(500).json({ success: false, message: 'Error fetching subscription' });
    }
}
