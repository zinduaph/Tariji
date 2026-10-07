

import { v2 as cloudinary } from 'cloudinary'
import mongoose from 'mongoose'
import ProductModel from '../model/product.js'
import userModel from '../model/user.js'
import multer from 'multer'
import { canAddProduct } from '../utils/planLimit.js'

// Configure multer for memory storage
const storage = multer.memoryStorage()
const upload = multer({ storage: storage })

// Accept one product image and, for digital products, one downloadable file.
export const uploadImages = upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'pdfFile', maxCount: 1 }
])

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
    
        const { name, description, price, productType, downloadExpiry, fileFormat } = req.body
        const imageFile = req.files?.image?.[0]
        const digitalFile = req.files?.pdfFile?.[0]
        const expiryHours = downloadExpiry === undefined ? 48 : Number(downloadExpiry)

        // Validate required fields
        if (!name || !description || !price) {
            return res.status(400).json({ 
                success: false, 
                message: 'Name, description, and price are required' 
            });
        }

        // Check if file is uploaded (required for all products)
        if (!imageFile) {
            return res.status(400).json({ success: false, message: 'No image uploaded' })
        }

        if (productType && productType !== 'physical' && !digitalFile) {
            return res.status(400).json({ success: false, message: 'PDF file is required for digital products' })
        }

        if (!Number.isFinite(expiryHours) || expiryHours <= 0) {
            return res.status(400).json({ success: false, message: 'Download expiry must be a positive number of hours' })
        }

        // Upload image to Cloudinary
        // Convert buffer to data URI
        const dataUri = `data:${imageFile.mimetype};base64,${imageFile.buffer.toString('base64')}`
        const result = await cloudinary.uploader.upload(dataUri, {
            resource_type: 'image'
        })
        const imageUrl = result.secure_url

        // upload pdf file to cloudinary if productType is not physical
        let downloadPublicId = null;
        if (productType && productType !== 'physical' && digitalFile) {
            const pdfDataUri = `data:${digitalFile.mimetype};base64,${digitalFile.buffer.toString('base64')}`
            const pdfResult = await cloudinary.uploader.upload(pdfDataUri, {
                resource_type: 'image', // cloudinary treats PDFs as images for preview purposes
                type: 'authenticated',
                access_mode: 'authenticated',
                use_filename: true,
                unique_filename: true,
                format: 'pdf'
            });
            downloadPublicId = pdfResult.public_id;
        }

        // Create product data
        const productData = {
            name,
            description,
            price: Number(price),
            image: [imageUrl],
            date: Date.now(),
            userId: userId,
            productType: productType || 'physical',
            pdfFile: null,
            downloadUrl: null,
            downloadPublicId,
            downloadResourceType: productType && productType !== 'physical' ? 'image' : null,
            downloadFormat: productType && productType !== 'physical' ? 'pdf' : null,
            downloadExpiry: expiryHours,
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
         const product = await ProductModel.find({}).select('-downloadUrl -pdfFile -downloadPublicId -downloadResourceType -downloadFormat')
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
        const products = await ProductModel.find({ userId: vendorId })
            .select('-downloadUrl -pdfFile -downloadPublicId -downloadResourceType -downloadFormat')
            .sort({ date: -1 });
        
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
        const products = await ProductModel.find({ userId: vendorId })
            .select('-downloadUrl -pdfFile -downloadPublicId -downloadResourceType -downloadFormat')
            .sort({ date: -1 });
        
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

export const getProductById = async (req, res) => {
    try {
        const { productId } = req.params;
        if (!mongoose.isValidObjectId(productId)) {
            return res.status(400).json({ success: false, message: 'Invalid product ID' });
        }

        const product = await ProductModel.findById(productId)
            .select('name description price image productType fileSize fileFormat');

        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }

        return res.json({ success: true, product });
    } catch (error) {
        console.error('Error fetching product:', error);
        return res.status(500).json({ success: false, message: 'Failed to fetch product' });
    }
};

export const updateProduct = async (req, res) => {
    const { productId } = req.params
    const { name, description, price } = req.body
    try {
        if (!mongoose.isValidObjectId(productId)) {
            return res.status(400).json({ success: false, message: 'Invalid product ID' })
        }

        if (
            typeof name !== 'string' ||
            !name.trim() ||
            typeof description !== 'string' ||
            !description.trim() ||
            price === undefined ||
            price === null ||
            price === '' ||
            !Number.isFinite(Number(price)) ||
            Number(price) < 0
        ) {
            return res.status(400).json({ success: false, message: 'Name, description, and a valid non-negative price are required' })
        }

        const product = await ProductModel.findById(productId)

        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' })
        }

        if (product.userId !== req.userId) {
            return res.status(403).json({ success: false, message: 'You are not authorized to update this product' })
        }

        product.name = name.trim()
        product.description = description.trim()
        product.price = Number(price)
        await product.save()

        return res.json({ success: true, message: 'Product updated successfully' })

    } catch (error) {
        console.error('Update product error:', error)
        return res.status(500).json({ success: false, message: 'Failed to update product' })
    }
}

// deleting the product by the vendor
export const deleteProduct = async (req,res) => {
    const {productId} = req.params
    try {
        if (!mongoose.isValidObjectId(productId)) {
            return res.status(400).json({success:false, message:'Invalid product ID'})
        }

        const product = await ProductModel.findById(productId)

        if(!product){
            return res.status(404).json({success:false, message:'Product not found'})
        }

        // check authentication for the real owner of the product
        if(product.userId !== req.userId) {
            return res.status(403).json({success:false, message:'You are not authorized to delete this product'})
        }

        await ProductModel.findByIdAndDelete(productId)
        return res.json({success:true, message:'product deleted successfully'})

    } catch (error) {
        console.error('Delete product error:', error)
        return res.status(500).json({success:false, message:'Failed to delete product'})
    }
}