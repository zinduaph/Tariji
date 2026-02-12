

import { v2 as cloudinary } from 'cloudinary'
import ProductModel from '../model/product.js'
import userModel from '../model/user.js'
import multer from 'multer'
import { canAddProduct } from '../utils/planLimit.js'

// Configure multer for memory storage
const storage = multer.memoryStorage()
const upload = multer({ storage: storage })

// Middleware for uploading images
export const uploadImages = upload.single('image')

export const addProduct = async (req, res) => {
    try {
        const userId = req.userId;
        
        // Find user by ID (using JWT userId, not clerkUserId)
        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        
        // Check if user can add product (plan defaults to 'starter' if undefined)
        const canAdd = await canAddProduct(userId, user.plan, user.subscriptionEndDate)

        if(!canAdd.allowed) {
             return res.status(400).json({ 
                success: false, 
                message: canAdd.message,
                reason: canAdd.reason,
                currentCount: canAdd.currentCount,
                limit: canAdd.limit,
                upgradeRequired: canAdd.upgradeRequired
            });
        }
    
        const { name, description, price, productType, downloadUrl, downloadExpiry, fileFormat } = req.body

        // Validate required fields
        if (!name || !description || !price) {
            return res.status(400).json({ 
                success: false, 
                message: 'Name, description, and price are required' 
            });
        }

        // Validate digital product fields
        if (productType && productType !== 'physical') {
            if (!downloadUrl) {
                return res.status(400).json({
                    success: false,
                    message: 'Download URL is required for digital products'
                });
            }
        }

        // Check if file is uploaded (required for all products)
        if (!req.file) {
            return res.status(400).json({ success: false, message: 'No image uploaded' })
        }

        // Upload image to Cloudinary
        // Convert buffer to data URI
        const dataUri = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`
        const result = await cloudinary.uploader.upload(dataUri, {
            resource_type: 'image'
        })
        const imageUrl = result.secure_url

        // Create product data
        const productData = {
            name,
            description,
            price: Number(price),
            image: [imageUrl],
            date: Date.now(),
            userId: userId,
            productType: productType || 'physical',
            downloadUrl: downloadUrl || null,
            downloadExpiry: downloadExpiry ? Number(downloadExpiry) : 7,
            fileFormat: fileFormat || null
        }

        // Save to database
        const product = new ProductModel(productData)
        await product.save()

        res.json({ success: true, message: 'Product added successfully' })

    } catch (error) {
        console.error(error)
        res.status(500).json({ success: false, message: 'Error adding product' })
    }
}


// function for listing products that have been added by the seller

export const listProduct = async (req,res) => {
     try {
         const product = await ProductModel.find({})
      return res.json({success:true,product})
     } catch (error) {
        return res.json({success:false,message:error.message})
     }
} 

// Get products for a specific vendor/seller
export const getVendorProducts = async (req, res) => {
    try {
        const vendorId = req.userId;
        
        // Get only products from the authenticated vendor
        const products = await ProductModel.find({ userId: vendorId }).sort({ date: -1 });
        
        return res.json({
            success: true,
            product: products,
            message: `Found ${products.length} products`
        });
    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
};

// Get products by vendor ID (public endpoint for viewing other vendors' stores)
export const getProductsByVendor = async (req, res) => {
    try {
        const { vendorId } = req.params;
        
        // Get products from specified vendor
        const products = await ProductModel.find({ userId: vendorId }).sort({ date: -1 });
        
        return res.json({
            success: true,
            product: products,
            vendorId: vendorId,
            message: `Found ${products.length} products from vendor`
        });
    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
};