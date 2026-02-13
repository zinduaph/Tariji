import axios from 'axios'
import lipaNaMpesaModel from '../model/lipaNaMpesa.js'
import orderModel from '../model/order.js'
import productModel from '../model/product.js'
import { getNgrokUrl } from '../utils/ngrok-config.js';
import { sendEmail } from '../config/nodemailer.js';


// Get M-Pesa Access Token
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
        console.error('Access Token Error:', error.response?.data || error.message);
        throw new Error('Failed to get M-Pesa access token');
    }
};

// Format phone number to M-Pesa format (254XXXXXXXXX)
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

// Generate M-Pesa password
const generatePassword = (shortCode, passkey, timestamp) => {
    return Buffer.from(shortCode + passkey + timestamp).toString('base64');
};

// Main payment endpoint - no auth required
export const lipaOnline = async (req, res) => {
    const { fullName, email, address, phone, amount, productName, cartItems } = req.body
    
    try {
        // Validate required fields
        if (!fullName || !email || !address  || !amount || !productName) {
            return res.status(400).json({ 
                success: false, 
                message: 'Please fill in all required fields' 
            });
        }

        // Validate amount
        if (isNaN(amount) || amount <= 0) {
            return res.status(400).json({ 
                success: false, 
                message: 'Invalid amount' 
            });
        }

        // Format phone number
        const formattedPhone = formatPhoneNumber(phone);

        // Create payment record with cart items
        console.log('Received cartItems:', JSON.stringify(cartItems, null, 2));
        const paymentRecord = await lipaNaMpesaModel.create({
            productName,
            fullName,
            email,
            phone: formattedPhone,
            amount: Number(amount),
            paymentStatus: 'pending',
            cartItems: cartItems || []
        });
        console.log('Payment record created with cartItems:', paymentRecord.cartItems);

        // Get M-Pesa access token
        const accessToken = await getAccessToken();

        // Prepare STK Push
        const timestamp = new Date().toISOString().replace(/[^0-9]/g, '').slice(0, -3);
        const shortCode = process.env.BUSINESS_SHORT_CODE;
        const passkey = process.env.PASS_KEY;
        const password = generatePassword(shortCode, passkey, timestamp);

        // building the callback URL using ngro for local testing
       /*  const ngorkUrl = getNgrokUrl();
         if (ngorkUrl) {
            console.log('Using ngrok URL for callback:', ngorkUrl);
         }*/
         const callbackPath = '/api/payment/lipa-online/callback';
         const callbackURL = `${process.env.BACKEND_URL}${callbackPath}`;

        const stkPushRequest = {
            BusinessShortCode: shortCode,
            Password: password,
            Timestamp: timestamp,
            TransactionType: "CustomerPayBillOnline",
            Amount: Math.round(amount), // Round to nearest integer
            PartyA: formattedPhone,
            PartyB: shortCode,
            PhoneNumber: formattedPhone,
            CallBackURL: callbackURL,
            AccountReference: `TARIJI-${paymentRecord._id}`,
            TransactionDesc: `Payment for ${productName}`
        };

        console.log('STK Push Request:', JSON.stringify(stkPushRequest, null, 2));

        // Send STK Push to M-Pesa
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
            // Update payment record with transaction ID
            paymentRecord.transactionId = response.data.CheckoutRequestID;
            await paymentRecord.save();

            return res.json({
                success: true,
                message: 'Please check your phone and enter your M-Pesa PIN',
                paymentId: paymentRecord._id,
                checkoutRequestId: response.data.CheckoutRequestID
            });
        } else {
            // Payment initiation failed
            paymentRecord.paymentStatus = 'failed';
            await paymentRecord.save();

            return res.status(400).json({
                success: false,
                message: 'Failed to initiate payment. Please try again.'
            });
        }

    } catch (error) {
        console.error('Payment Error:', error.response?.data || error.message);
        res.status(500).json({ 
            success: false, 
            message: 'Payment processing failed. Please try again.' 
        });
    }
};

// M-Pesa Callback Handler
export const lipaOnlineCallback = async (req, res) => {
    try {
        const callbackData = req.body;
        
        console.log('Payment Callback:', JSON.stringify(callbackData, null, 2));

        const resultCode = callbackData.Body?.stkCallback?.ResultCode;
        const checkoutRequestId = callbackData.Body?.stkCallback?.CheckoutRequestID;

        // Find the payment record
        const paymentRecord = await lipaNaMpesaModel.findOne({ 
            transactionId: checkoutRequestId 
        });

        if (!paymentRecord) {
            console.error('Payment record not found for:', checkoutRequestId);
            return res.status(200).json({ success: true });
        }

        if (resultCode === 0) {
            // Payment successful
            const callbackMetadata = callbackData.Body?.stkCallback?.CallbackMetadata?.Item || [];
            
            const mpesaReceipt = callbackMetadata.find(
                item => item.Name === 'MpesaReceiptNumber'
            )?.Value;

            const transactionDate = callbackMetadata.find(
                item => item.Name === 'TransactionDate'
            )?.Value;

            const amountPaid = callbackMetadata.find(
                item => item.Name === 'Amount'
            )?.Value;

            // Update payment record
            paymentRecord.mpesaReceipt = mpesaReceipt;
            paymentRecord.paymentStatus = 'completed';
            await paymentRecord.save();

            // Get cart items from payment record
            const cartItems = paymentRecord.cartItems || [];
            console.log('Retrieved cartItems from DB:', JSON.stringify(cartItems, null, 2));
            
            // Get sellerId from the first product (all items should have the same seller)
            let sellerId = null;
            if (cartItems.length > 0 && cartItems[0].productId) {
                try {
                    const product = await productModel.findById(cartItems[0].productId);
                    if (product) {
                        sellerId = product.userId;
                        console.log('Found sellerId:', sellerId);
                    }
                } catch (error) {
                    console.error('Error fetching product for sellerId:', error);
                }
            }
            
            // Create order for the purchased products
            const order = await orderModel.create({
                items: cartItems.map(item => ({
                    productId: item.productId,
                    productName: item.productName,
                    quantity: item.quantity,
                    price: item.price
                })),
                amount: Number(amountPaid) || paymentRecord.amount,
                address: {
                    fullName: paymentRecord.fullName,
                    email: paymentRecord.email,
                    phone: paymentRecord.phone
                },
                status: 'order placed',
                paymentMethod: 'mpesa',
                payment: true,
                deliveryStatus: 'processing',
                buyerEmail: paymentRecord.email,
                sellerId: sellerId
            });

            console.log(`✅ Order created: ${order._id} for payment: ${mpesaReceipt}`);
            console.log(`✅ Payment completed for ${paymentRecord.fullName} - KES ${amountPaid}`);
            console.log(`📦 Order contains ${cartItems.length} item(s): ${cartItems.map(i => i.productName).join(', ')}`);

            // Fetch download URLs for all purchased products
            let downloadLinksHtml = '';
            for (const item of cartItems) {
                try {
                    const product = await productModel.findById(item.productId);
                    if (product && product.downloadUrl) {
                        downloadLinksHtml += `
                        <div style="margin: 10px 0; padding: 15px; background: #f5f5f5; border-radius: 8px;">
                            <strong>${item.productName}</strong><br/>
                            <a href="${product.downloadUrl}" style="color: #e67e22; font-weight: bold;">
                                Click here to download your product
                            </a>
                        </div>`;
                    } else {
                        downloadLinksHtml += `
                        <div style="margin: 10px 0; padding: 15px; background: #f5f5f5; border-radius: 8px;">
                            <strong>${item.productName}</strong><br/>
                            <span style="color: #666;">Download link not available</span>
                        </div>`;
                    }
                } catch (error) {
                    console.error('Error fetching product for download URL:', error);
                }
            }
            
            const emailHtml = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #e67e22;">Payment Confirmed!</h2>
                <p>Dear ${paymentRecord.fullName},</p>
                <p>Thank you for your purchase! Your payment of <strong>KES ${amountPaid}</strong> has been received.</p>
                
                <h3>Your Products:</h3>
                ${downloadLinksHtml}
                
                <p style="margin-top: 20px;">Order ID: ${order._id}</p>
                <p>M-Pesa Receipt: ${mpesaReceipt}</p>
                
                <p>Thank you for shopping with Tariji!</p>
            </div>
            `;
            
            await sendEmail(
                paymentRecord.email,
                'Payment Confirmation - Your Download Links',
                `Dear ${paymentRecord.fullName},

Your payment of KES ${amountPaid} has been received.

Your download links:
${cartItems.map(item => `- ${item.productName}: Check your email for the download link`).join('\n')}

Thank you for shopping with Tariji!`,
                emailHtml
            );
            
            console.log('Confirmation email sent to:', paymentRecord.email);
              
        } else {
            // Payment failed or cancelled
            paymentRecord.paymentStatus = 'failed';
            await paymentRecord.save();

            console.log(`❌ Payment failed/cancelled for ${paymentRecord._id}: ${callbackData.Body?.stkCallback?.ResultDesc}`);
        }

        // Always return 200 to M-Pesa
        res.status(200).json({ success: true });

    } catch (error) {
        console.error('Callback Error:', error);
        res.status(200).json({ success: true });
    }
};

// Check payment status
export const checkPaymentStatus = async (req, res) => {
    const { paymentId } = req.params;
    
    try {
        const payment = await lipaNaMpesaModel.findById(paymentId);
        
        if (!payment) {
            return res.status(404).json({ 
                success: false, 
                message: 'Payment not found' 
            });
        }

        return res.json({
            success: true,
            paymentStatus: payment.paymentStatus,
            mpesaReceipt: payment.mpesaReceipt,
            amount: payment.amount,
            productName: payment.productName
        });

    } catch (error) {
        console.error('Status Check Error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error checking payment status' 
        });
    }
};
