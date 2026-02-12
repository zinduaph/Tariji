import { useState, useEffect, useContext } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { shopContext } from "../context/shopContext";
import { ShoppingCart, ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";

const StoreFront = () => {
    const { vendorId } = useParams();
    const navigate = useNavigate();
    const { backendUrl, addtocart, getTotalCartItems } = useContext(shopContext);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [vendor, setVendor] = useState(null);

    useEffect(() => {
        const fetchVendorProducts = async () => {
            try {
                const response = await fetch(`${backendUrl}/api/product/vendor/${vendorId}`);
                const data = await response.json();
                
                if (data.success) {
                    setProducts(data.product || []);
                    // Could fetch vendor info here if you add that endpoint
                } else {
                    toast.error("No products found for this store");
                }
            } catch (error) {
                console.error("Error fetching products:", error);
                toast.error("Failed to load store products");
            } finally {
                setLoading(false);
            }
        };

        fetchVendorProducts();
    }, [vendorId, backendUrl]);

    const handleBuyNow = (productId) => {
        navigate(`/product/${productId}`);
    };

    const handleAddToCart = (product) => {
        // Create item with proper id field for cart
        const cartItem = {
            name: product.name,
            price: product.price,
            image: Array.isArray(product.image) ? product.image[0] : product.image,
            description: product.description
        };
        addtocart(product._id, cartItem);
        toast.success("Added to cart!");
    };

    const handleCartClick = () => {
        navigate("/checkout");
    };

    if (loading) {
        return (
            <div className="mt-20 text-center">
                <p className="text-xl">Loading store...</p>
            </div>
        );
    }

    if (products.length === 0) {
        return (
            <div className="mt-20 text-center">
                <p className="text-xl text-gray-500">This store has no products yet.</p>
                
            </div>
        );
    }

    return (
        <div className="mt-20 p-4 md:p-8">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                        {vendor ? vendor.name : "Digital Products Store"}
                    </h1>
                    <p className="text-gray-500 mt-1">
                        {products.length} products available
                    </p>
                </div>
                
                {/* Cart Button */}
                <button
                    onClick={handleCartClick}
                    className="flex items-center gap-2 bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors"
                >
                    <ShoppingCart size={20} />
                    <span>Cart</span>
                    <span className="bg-white text-orange-500 rounded-full w-5 h-5 flex items-center justify-center text-sm">
                        {getTotalCartItems()}
                    </span>
                </button>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {products.map((product) => (
                    <div
                        key={product._id}
                        className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
                    >
                        {/* Product Image */}
                        <img
                            src={Array.isArray(product.image) ? product.image[0] : product.image}
                            alt={product.name}
                            className="w-full h-48 object-cover"
                        />

                        {/* Product Info */}
                        <div className="p-4">
                            <h3 className="font-bold text-lg text-gray-800 truncate">
                                {product.name}
                            </h3>
                            <p className="text-gray-500 text-sm mt-1 line-clamp-2">
                                {product.description}
                            </p>
                            <p className="text-orange-500 font-bold text-xl mt-2">
                                Ksh {product.price}
                            </p>

                            {/* Buttons */}
                            <div className="flex gap-2 mt-4">
                                <button
                                    onClick={() => handleBuyNow(product._id)}
                                    className="flex-1 bg-black text-white py-2 rounded-lg hover:bg-gray-800 transition-colors"
                                >
                                    Buy Now
                                </button>
                                <button
                                    onClick={() => handleAddToCart(product)}
                                    className="flex-1 bg-orange-500 text-white py-2 rounded-lg hover:bg-orange-600 transition-colors"
                                >
                                    Add to Cart
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Back Link */}
            <div className="mt-8 text-center">
               
            </div>
        </div>
    );
};

export default StoreFront;
