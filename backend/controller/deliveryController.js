import crypto from 'crypto';
import { v2 as cloudinary } from 'cloudinary';
import orderModel from '../model/order.js';
import productModel from '../model/product.js';
import userModel from '../model/user.js';
import lipaNaMpesaModel from '../model/lipaNaMpesa.js';
import { addProductDownloadLink } from '../utils/digitalDownloads.js';
import { sendEmail } from '../config/nodemailer.js';

// Email template for digital product delivery
const sendDigitalProductEmail = async (buyer, order, product, downloadUrl, expiresAt) => {
    const productTypeLabels = {
        'ebook': 'eBook',
        'course': 'Course Material',
        'template': 'Template Package',
        'digital': 'Digital Product'
    };

    const sendMail = {
        from: process.env.SENDER_EMAIL,
        to: buyer.email,
        subject: `📦 Your Digital Product: ${product.name}`,
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #22c55e;">🎉 Thank you for your purchase!</h2>
                <p>Dear ${buyer.name},</p>
                <p>Your digital product is ready! Here are your download details:</p>
                
                <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
                    <h3 style="margin-top: 0; color: #1f2937;">${product.name}</h3>
                    <p><strong>Product Type:</strong> ${productTypeLabels[product.productType] || 'Digital Product'}</p>
                    <p><strong>Order ID:</strong> ${order._id}</p>
                    <p><strong>Download Instructions:</strong> Once you click the download link, the product will be automatically downloaded to your device</p>
                    <p><strong>Download Link:</strong> <a href="${downloadUrl}" style="color: #2563eb;">Click here to download</a></p>
                    <p><strong>Link Expires:</strong> ${new Date(expiresAt).toLocaleString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: '2-digit' })}</p>
                </div>
                
                <div style="background-color: #fef3c7; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #f59e0b;">
                    <p style="margin: 0; color: #92400e;"><strong>⚠️ Important:</strong></p>
                    <ul style="margin: 10px 0 0 0; color: #92400e;">
                        <li>Download your product before the link expires</li>
                        <li>Do not share this link with others</li>
                        <li>Save your files to a secure location</li>
                    </ul>
                </div>
                
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
};

// Send download link for a digital product
export const sendDownloadLink = async (req, res) => {
    try {
        const { orderId, productId } = req.body;
        const sellerId = req.userId;

        // Find the order
        const order = await orderModel.findById(orderId);
        if (!order) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }

        if (!order.payment) {
            return res.status(400).json({ success: false, message: 'Download links can only be sent for paid orders' });
        }

        // Verify the seller owns this order
        if (order.sellerId !== sellerId) {
            return res.status(403).json({ success: false, message: 'Unauthorized access to this order' });
        }

        // Find the product
        const product = await productModel.findById(productId);
        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }
        if (
            product.userId !== sellerId ||
            !order.items.some(item => item.productId?.toString() === product._id.toString())
        ) {
            return res.status(403).json({ success: false, message: 'This product is not part of your order' });
        }

        const buyerUser = await userModel.findOne({ email: order.buyerEmail });
        if (!buyerUser) {
            return res.status(404).json({ success: false, message: 'Buyer not found' });
        }

        if (!product.downloadPublicId || !product.downloadResourceType || !product.downloadFormat || product.productType === 'physical') {
            return res.status(400).json({
                success: false,
                message: 'This product must be re-uploaded as a private digital product before it can be delivered'
            });
        }

        const downloadLinkInfo = addProductDownloadLink(order, product);
        order.deliveryStatus = 'delivered';
        order.deliverySentAt = new Date();
        await order.save();

        // Send email to buyer
        await sendDigitalProductEmail(buyerUser, order, product, downloadLinkInfo.downloadUrl, downloadLinkInfo.expiresAt);

        res.json({
            success: true,
            message: 'Download link sent successfully',
            downloadLink: {
                productId: downloadLinkInfo.productId,
                productName: downloadLinkInfo.productName,
                downloadUrl: downloadLinkInfo.downloadUrl,
                expiresAt: downloadLinkInfo.expiresAt,
                delivered: downloadLinkInfo.delivered
            }
        });

    } catch (error) {
        console.error('Send download link error:', error);
        res.status(500).json({ success: false, message: 'Error sending download link' });
    }
};

// Bulk send download links for all products in an order
export const sendAllDownloadLinks = async (req, res) => {
    try {
        const { orderId } = req.body;
        const sellerId = req.userId;

        // Find the order
        const order = await orderModel.findById(orderId);
        if (!order) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }

        // Verify the seller
        if (order.sellerId !== sellerId) {
            return res.status(403).json({ success: false, message: 'Unauthorized access to this order' });
        }

        if (!order.payment) {
            return res.status(400).json({ success: false, message: 'Download links can only be sent for paid orders' });
        }

        // Find the buyer by email
        const buyerUser = await userModel.findOne({ email: order.buyerEmail });
        if (!buyerUser) {
            return res.status(404).json({ success: false, message: 'Buyer not found' });
        }

        const deliveryResults = [];

        // Process each item in the order
        for (const item of order.items) {
            const product = await productModel.findById(item.productId);
            if (!product || product.productType === 'physical') {
                continue;
            }

            if (!product.downloadPublicId || !product.downloadResourceType || !product.downloadFormat) {
                deliveryResults.push({
                    productId: product._id,
                    productName: product.name,
                    status: 'requires_private_reupload'
                });
                continue;
            }

            const downloadLinkInfo = addProductDownloadLink(order, product);
            await sendDigitalProductEmail(buyerUser, order, product, downloadLinkInfo.downloadUrl, downloadLinkInfo.expiresAt);
            deliveryResults.push({
                productId: product._id,
                productName: product.name,
                status: 'delivered'
            });
        }

        const deliveredCount = deliveryResults.filter(result => result.status === 'delivered').length;
        const reuploadCount = deliveryResults.filter(result => result.status === 'requires_private_reupload').length;
        order.deliveryStatus = deliveredCount > 0 ? 'delivered' : 'pending';
        order.deliverySentAt = new Date();
        await order.save();

        res.json({
            success: deliveredCount > 0,
            message: `Delivered ${deliveredCount} product(s)${reuploadCount ? `; ${reuploadCount} digital product(s) require private re-upload` : ''}`,
            deliveries: deliveryResults
        });

    } catch (error) {
        console.error('Send all download links error:', error);
        res.status(500).json({ success: false, message: 'Error sending download links' });
    }
};

// Get all orders for a seller (all purchased products from lipaNaMpesa)
export const getAllSellerOrders = async (req, res) => {
    try {
        const currentVendorId = req.userId;

        // Get all purchases from lipaNaMpesa model where payment status is completed
        const purchases = await lipaNaMpesaModel.find({
            paymentStatus: 'completed'
        }).sort({ time: -1 });

        if (!purchases || purchases.length === 0) {
            return res.json({
                success: true,
                orders: [],
                summary: {
                    totalOrders: 0,
                    totalRevenue: 0,
                    totalItems: 0
                }
            });
        }

        // Get product details and filter by current vendor
        let vendorOrders = [];
        let totalRevenue = 0;
        let uniqueOrderIds = new Set();

        for (const purchase of purchases) {
            if (purchase.cartItems && purchase.cartItems.length > 0) {
                for (const item of purchase.cartItems) {
                    let product = null;
                    
                    try {
                        // Check if productId is a valid MongoDB ObjectId
                        if (item.productId && item.productId.match(/^[0-9a-fA-F]{24}$/)) {
                            product = await productModel.findById(item.productId);
                        }
                    } catch (productError) {
                        console.warn(`Could not fetch product for ID: ${item.productId}`, productError.message);
                    }
                    
                    // Only include this item if the product belongs to the current vendor
                    if (product && product.userId === currentVendorId) {
                        uniqueOrderIds.add(purchase._id.toString());
                        
                        vendorOrders.push({
                            _id: purchase._id,
                            transactionId: purchase.transactionId,
                            mpesaReceipt: purchase.mpesaReceipt,
                            buyerInfo: {
                                fullName: purchase.fullName,
                                email: purchase.email,
                                phone: purchase.phone
                            },
                            product: {
                                productId: item.productId,
                                productName: item.productName,
                                quantity: item.quantity,
                                price: item.price,
                                image: item.image,
                                productType: product.productType || 'physical',
                                downloadUrl: null,
                                downloadExpiry: product.downloadExpiry || 48
                            },
                            amount: item.price * item.quantity,
                            paymentStatus: purchase.paymentStatus,
                            purchaseDate: purchase.time
                        });

                        totalRevenue += (item.price * item.quantity);
                    }
                }
            }
        }

        // Calculate summary stats - only for current vendor's products
        const totalOrders = uniqueOrderIds.size; // Count unique orders that have this vendor's products
        const totalItems = vendorOrders.length;
        const completedCount = purchases.filter(p => 
            p.paymentStatus === 'completed' && 
            [...uniqueOrderIds].includes(p._id.toString())
        ).length;

        res.json({
            success: true,
            orders: vendorOrders,
            summary: {
                totalOrders,
                totalRevenue,
                totalItems,
                completedPayments: completedCount,
                pendingPayments: 0,
                failedPayments: 0
            }
        });
    } catch (error) {
        console.error('Get all seller orders error:', error);
        res.status(500).json({ success: false, message: 'Error fetching orders' });
    }
};

// Get orders that need delivery (for sellers)
export const getOrdersNeedingDelivery = async (req, res) => {
    try {
        const userId = req.userId;

        const orders = await orderModel.find({
            sellerId: userId,
            deliveryStatus: 'pending',
            payment: true
        }).sort({ date: -1 });

        res.json({ success: true, orders });
    } catch (error) {
        console.error('Get orders needing delivery error:', error);
        res.status(500).json({ success: false, message: 'Error fetching orders' });
    }
};

export const downloadProductFile = async (req, res) => {
    try {
        if (!/^[a-f0-9]{64}$/i.test(req.params.token)) {
            return res.status(404).json({ success: false, message: 'Download link is invalid or expired' });
        }

        const tokenHash = crypto.createHash('sha256').update(req.params.token).digest('hex');
        const order = await orderModel.findOne({
            payment: true,
            downloadLinks: {
                $elemMatch: {
                    downloadTokenHash: tokenHash,
                    expiresAt: { $gt: new Date() }
                }
            }
        });

        if (!order) {
            return res.status(404).json({ success: false, message: 'Download link is invalid or expired' });
        }

        const downloadLink = order.downloadLinks.find(link =>
            link.downloadTokenHash === tokenHash && link.expiresAt > new Date()
        );
        const product = downloadLink
            ? await productModel.findById(downloadLink.productId)
            : null;

        if (!product?.downloadPublicId || !product.downloadResourceType || !product.downloadFormat) {
            return res.status(410).json({ success: false, message: 'This download is no longer available' });
        }

        const cloudinaryExpiry = Math.floor(Math.min(
            Date.now() + 60 * 1000,
            new Date(downloadLink.expiresAt).getTime()
        ) / 1000);
        const privateDownloadUrl = cloudinary.utils.private_download_url(
            product.downloadPublicId,
            product.downloadFormat,
            {
                resource_type: product.downloadResourceType,
                type: 'authenticated',
                expires_at: cloudinaryExpiry,
                attachment: true
            }
        );

        res.set({
            'Cache-Control': 'no-store',
            'Referrer-Policy': 'no-referrer'
        });
        return res.redirect(302, privateDownloadUrl);
    } catch (error) {
        console.error('Download digital product error:', error);
        return res.status(500).json({ success: false, message: 'Unable to download this product' });
    }
};

// Get buyer's purchased digital products
export const getMyDigitalProducts = async (req, res) => {
    try {
        const userId = req.userId;
        const user = await userModel.findById(userId);

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        const orders = await orderModel.find({
            buyerEmail: user.email,
            payment: true,
            'downloadLinks.0': { $exists: true }
        }).sort({ date: -1 });

        const now = new Date();
        const activeProducts = [];
        for (const order of orders) {
            const validLinks = order.downloadLinks
                .filter(link => link.downloadTokenHash && link.expiresAt && new Date(link.expiresAt) > now)
                .map(link => ({
                    productId: link.productId,
                    productName: link.productName,
                    downloadUrl: link.downloadUrl,
                    expiresAt: link.expiresAt,
                    delivered: link.delivered
                }));

            if (validLinks.length > 0) {
                activeProducts.push({
                    orderId: order._id,
                    orderDate: order.date,
                    products: validLinks
                });
            }
        }

        res.json({ success: true, products: activeProducts });
    } catch (error) {
        console.error('Get my digital products error:', error);
        res.status(500).json({ success: false, message: 'Error fetching digital products' });
    }
};
