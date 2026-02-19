import { useContext, useState } from "react";
import { shopContext } from "../context/shopContext";
import { ShoppingCart, Star, Download, Shield, FileText } from "lucide-react";

const DemoPage = () => {
    const { addtocart, backendUrl } = useContext(shopContext);
    const [added, setAdded] = useState(false);

    // Demo product data
    const demoProduct = {
        _id: "demo-product-001",
        name: "Ultimate Digital Marketing Guide",
        description: "A comprehensive e-book covering SEO, social media marketing, email campaigns, and content strategy. Learn proven strategies that have generated over $1M in sales.",
        price: 500 ,
        image: ["https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&h=400&fit=crop"],
        productType: "ebook",
        downloadUrl: "#",
        downloadExpiry: 30,
        fileFormat: "PDF",
        fileSize: "15 MB",
        rating: 4.8,
        reviews: 124,
        features: [
            "200+ pages of expert content",
            "10 real-world case studies",
            "Downloadable templates included",
            "Lifetime updates free"
        ]
    };

    const handleAddToCart = () => {
        const productInfo = {
            name: demoProduct.name,
            price: demoProduct.price,
            image: demoProduct.image[0],
            description: demoProduct.description,
            productType: demoProduct.productType
        };
        addtocart(demoProduct._id, productInfo);
        setAdded(true);
        setTimeout(() => setAdded(false), 2000);
    };

    return (
        <div className="min-h-screen bg-black text-white pt-20">
            {/* Breadcrumb */}
            <div className="max-w-6xl mx-auto px-4 py-4">
                <p className="text-gray-400 text-sm">
                    Home / Digital Products / eBooks / <span className="text-orange-500">Ultimate Digital Marketing Guide</span>
                </p>
            </div>

            {/* Product Section */}
            <div className="max-w-6xl mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Product Image */}
                    <div className="relative">
                        <div className="rounded-2xl overflow-hidden border border-gray-700 shadow-2xl">
                            <img 
                                src={demoProduct.image[0]} 
                                alt={demoProduct.name}
                                className="w-full h-auto object-cover"
                            />
                        </div>
                        {/* Badges */}
                        <div className="absolute top-4 left-4 flex gap-2">
                            <span className="bg-orange-500 text-black text-xs font-bold px-3 py-1 rounded-full">
                                BESTSELLER
                            </span>
                            <span className="bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                                INSTANT DOWNLOAD
                            </span>
                        </div>
                    </div>

                    {/* Product Details */}
                    <div>
                        {/* Title */}
                        <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
                            {demoProduct.name}
                        </h1>

                        {/* Rating */}
                        <div className="flex items-center gap-4 mb-6">
                            <div className="flex items-center gap-1">
                                {[...Array(5)].map((_, i) => (
                                    <Star 
                                        key={i} 
                                        size={18} 
                                        className={i < Math.floor(demoProduct.rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-600"}
                                    />
                                ))}
                                <span className="ml-2 text-yellow-400 font-semibold">{demoProduct.rating}</span>
                            </div>
                            <span className="text-gray-500">|</span>
                            <span className="text-gray-400">{demoProduct.reviews} reviews</span>
                        </div>

                        {/* Price */}
                        <div className="mb-6">
                            <span className="text-4xl font-bold text-orange-500">${demoProduct.price}KES</span>
                            <span className="text-gray-500 line-through ml-4 text-lg">750 KES</span>
                            <span className="text-green-400 ml-2 text-sm">50% OFF</span>
                        </div>

                        {/* Description */}
                        <p className="text-gray-300 text-lg leading-relaxed mb-6">
                            {demoProduct.description}
                        </p>

                        {/* Features */}
                        <div className="mb-8">
                            <h3 className="text-white font-semibold mb-3">What's Inside:</h3>
                            <ul className="space-y-2">
                                {demoProduct.features.map((feature, index) => (
                                    <li key={index} className="flex items-center gap-2 text-gray-300">
                                        <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                                        {feature}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* File Info */}
                        <div className="flex gap-4 mb-8 text-sm text-gray-400">
                            <div className="flex items-center gap-2">
                                <FileText size={16} />
                                <span>{demoProduct.fileFormat} Format</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Download size={16} />
                                <span>{demoProduct.fileSize}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Shield size={16} className="text-green-400" />
                                <span>Secure Download</span>
                            </div>
                        </div>

                        {/* Add to Cart Button */}
                        <div className="flex gap-4">
                            <button 
                                onClick={handleAddToCart}
                                disabled={added}
                                className={`flex-1 flex items-center justify-center gap-2 py-4 px-8 rounded-lg font-bold text-lg transition-all duration-300 ${
                                    added 
                                    ? "bg-green-500 text-white" 
                                    : "bg-orange-500 text-black hover:bg-orange-400 hover:scale-105"
                                }`}
                            >
                                <ShoppingCart size={22} />
                                {added ? "Added to Cart!" : "Add to Cart"}
                            </button>
                            <button className="px-6 py-4 border border-gray-600 rounded-lg hover:border-orange-500 transition-colors">
                                <Star size={22} className="text-gray-400 hover:text-orange-500" />
                            </button>
                        </div>

                        {/* Trust Badges */}
                        <div className="mt-8 pt-8 border-t border-gray-800">
                            <div className="grid grid-cols-3 gap-4 text-center">
                                <div>
                                    <p className="text-orange-500 font-bold text-xl">500+</p>
                                    <p className="text-gray-500 text-sm">Happy Customers</p>
                                </div>
                                <div>
                                    <p className="text-orange-500 font-bold text-xl">24/7</p>
                                    <p className="text-gray-500 text-sm">Support</p>
                                </div>
                                <div>
                                    <p className="text-orange-500 font-bold text-xl">100%</p>
                                    <p className="text-gray-500 text-sm">Satisfaction</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Additional Info */}
                <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Product Details */}
                    <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
                        <h3 className="text-xl font-bold text-white mb-4">Product Details</h3>
                        <div className="space-y-3 text-gray-300">
                            <div className="flex justify-between">
                                <span className="text-gray-500">Format</span>
                                <span className="text-white">{demoProduct.fileFormat}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">File Size</span>
                                <span className="text-white">{demoProduct.fileSize}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">Pages</span>
                                <span className="text-white">200+ pages</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">Download Expiry</span>
                                <span className="text-white">{demoProduct.downloadExpiry} days</span>
                            </div>
                        </div>
                    </div>

                    {/* What You'll Learn */}
                    <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
                        <h3 className="text-xl font-bold text-white mb-4">What You'll Learn</h3>
                        <ul className="space-y-3 text-gray-300">
                            <li className="flex items-start gap-2">
                                <span className="text-orange-500 mt-1">✓</span>
                                Master SEO fundamentals and advanced strategies
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-orange-500 mt-1">✓</span>
                                Build engaging social media campaigns
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-orange-500 mt-1">✓</span>
                                Create high-converting email sequences
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-orange-500 mt-1">✓</span>
                                Develop content that drives sales
                            </li>
                        </ul>
                    </div>
                </div>

                {/* CTA */}
                <div className="mt-12 text-center">
                    <p className="text-gray-400 mb-4">Ready to transform your digital presence?</p>
                    <button 
                        onClick={handleAddToCart}
                        className="bg-orange-500 text-black font-bold py-3 px-8 rounded-lg hover:bg-orange-400 transition-colors"
                    >
                        Get Started Now - ${demoProduct.price}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DemoPage;
