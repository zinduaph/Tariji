import express from 'express';
import authMiddleware from '../middleware/auth.js';
import { 
    sendDownloadLink, 
    sendAllDownloadLinks, 
    getOrdersNeedingDelivery,
    getAllSellerOrders,
    getMyDigitalProducts 
} from '../controller/deliveryController.js';

const router = express.Router();

// Seller routes
router.post('/send-download-link', authMiddleware, sendDownloadLink);
router.post('/send-all-links', authMiddleware, sendAllDownloadLinks);
router.get('/all-orders', authMiddleware, getAllSellerOrders); // ← New endpoint for all seller orders
router.get('/pending-deliveries', authMiddleware, getOrdersNeedingDelivery);

// Buyer routes
router.get('/my-digital-products', authMiddleware, getMyDigitalProducts);

export default router;
