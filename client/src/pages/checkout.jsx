

import { useContext, useState, useEffect } from "react";
import { shopContext } from "../context/shopContext";
import { X, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import toast from "react-hot-toast";

const CheckoutPage = () => {
    const { getCartItems, currency, getTotalCartAmount, removeFromCart, cartItems: contextCartItems } = useContext(shopContext);
    const [cartItems, setCartItems] = useState([]);
    const [total, setTotal] = useState(0);

    // Update cart items when they change
    useEffect(() => {
        const items = getCartItems();
        setCartItems(items);
        setTotal(getTotalCartAmount());
    }, [contextCartItems, getCartItems, getTotalCartAmount]);

    const [showPlaceOrderModal, setShowPlaceOrderModal] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: ''
    });
    const [isProcessing, setIsProcessing] = useState(false);
    const [paymentResult, setPaymentResult] = useState(null);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handlePlaceOrderClick = () => {
        setShowPlaceOrderModal(true);
        setPaymentResult(null);
    };

    // M-Pesa payment integration for cart checkout
    const handlePlaceOrder = async () => {
        if (!formData.name || !formData.email || !formData.phone) {
            toast.error('Please fill in all required fields');
            return;
        }
        if (!formData.phone.startsWith('07') && !formData.phone.startsWith('254')) {
            toast.error('Please enter a valid Kenyan phone number');
            return;
        }

        setIsProcessing(true);
        setPaymentResult(null);

        try {
            const productNames = cartItems.map(item => item.name).join(', ');
            
            // Format cart items for order creation
            const cartItemsData = cartItems.map(item => ({
                productId: item.id || item._id,
                productName: item.name,
                quantity: item.quantity,
                price: item.price,
                image: item.image
            }));
            
            const response = await fetch(
                `${import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'}/api/payment/lipa-online`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        fullName: formData.name,
                        email: formData.email,
                        address: 'Digital Products - No Delivery',
                        phone: formData.phone,
                        amount: total,
                        productName: productNames,
                        cartItems: cartItemsData
                    })
                }
            );

            const data = await response.json();

            if (data.success) {
                setPaymentResult({
                    status: 'pending',
                    message: 'Please check your phone and enter your M-Pesa PIN',
                    paymentId: data.paymentId
                });
                toast.success('M-Pesa prompt sent! Check your phone.');
                pollPaymentStatus(data.paymentId);
            } else {
                setPaymentResult({
                    status: 'error',
                    message: data.message || 'Payment failed'
                });
                toast.error(data.message || 'Payment failed');
            }
        } catch (error) {
            console.error('Payment error:', error);
            setPaymentResult({
                status: 'error',
                message: 'Failed to connect to payment server'
            });
            toast.error('Failed to connect to payment server');
        } finally {
            setIsProcessing(false);
        }
    };

    // Poll payment status
    const pollPaymentStatus = async (paymentId) => {
        const maxAttempts = 30;
        let attempts = 0;

        const checkStatus = async () => {
            attempts++;
            try {
                const response = await fetch(
                    `${import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'}/api/payment/lipa-online/status/${paymentId}`
                );
                const data = await response.json();

                if (data.success && data.paymentStatus === 'completed') {
                    setPaymentResult({
                        status: 'success',
                        message: 'Payment successful! Your products will be delivered to your email.',
                        mpesaReceipt: data.mpesaReceipt
                    });
                    toast.success('Payment received! Check your email for your products.');
                    // Clear cart after successful payment
                    setTimeout(() => {
                        setShowPlaceOrderModal(false);
                        cartItems.forEach(item => removeFromCart(item.id || item._id));
                    }, 5000);
                } else if (attempts < maxAttempts) {
                    setTimeout(checkStatus, 5000);
                }
            } catch (error) {
                if (attempts < maxAttempts) {
                    setTimeout(checkStatus, 5000);
                }
            }
        };

        setTimeout(checkStatus, 5000);
    };

    const Modal = ({ onOpen, onClose }) => {
        if (!onOpen) return null;
        return (
            <>
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
                        <div className="flex justify-between mb-4">
                            <h2 className="text-xl font-semibold">Complete Purchase</h2>
                            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                                <X size={24} />
                            </button>
                        </div>

                        {/* Payment Result Display */}
                        {paymentResult && (
                            <div className={`mb-4 p-3 rounded-md ${
                                paymentResult.status === 'success' ? 'bg-green-100' :
                                paymentResult.status === 'pending' ? 'bg-yellow-100' :
                                'bg-red-100'
                            }`}>
                                <div className="flex items-center gap-2">
                                    {paymentResult.status === 'success' && <CheckCircle className="text-green-600" size={20} />}
                                    {paymentResult.status === 'pending' && <Loader2 className="text-yellow-600 animate-spin" size={20} />}
                                    {paymentResult.status === 'error' && <AlertCircle className="text-red-600" size={20} />}
                                    <p className={`text-sm ${
                                        paymentResult.status === 'success' ? 'text-green-800' :
                                        paymentResult.status === 'pending' ? 'text-yellow-800' :
                                        'text-red-800'
                                    }`}>
                                        {paymentResult.message}
                                    </p>
                                </div>
                                {paymentResult.status === 'success' && paymentResult.mpesaReceipt && (
                                    <p className="text-xs text-green-600 mt-1">Receipt: {paymentResult.mpesaReceipt}</p>
                                )}
                            </div>
                        )}

                        <div className="space-y-4 mb-6">
                            <input
                                type="text"
                                name="name"
                                placeholder="Full Name *"
                                value={formData.name}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                            />
                            <input
                                type="email"
                                name="email"
                                placeholder="Email Address *"
                                value={formData.email}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                            />
                            <input
                                type="tel"
                                name="phone"
                                placeholder="Phone Number (07XXXXXXXX) *"
                                value={formData.phone}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                            />
                        </div>

                        <div className="mb-4 p-3 bg-orange-50 rounded-md">
                            <p className="text-lg font-semibold">Total: <span className="text-orange-600">{currency}{total.toFixed(2)}</span></p>
                            <p className="text-sm text-gray-600">Digital products - delivered instantly via email</p>
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={onClose}
                                className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handlePlaceOrder}
                                disabled={isProcessing || paymentResult?.status === 'success'}
                                className={`flex-1 px-4 py-2 text-white rounded-md flex items-center justify-center gap-2 ${
                                    isProcessing || paymentResult?.status === 'success'
                                        ? 'bg-gray-400 cursor-not-allowed'
                                        : 'bg-orange-500 hover:bg-orange-600'
                                }`}
                            >
                                {isProcessing ? (
                                    <>
                                        <Loader2 className="animate-spin" size={18} />
                                        Processing...
                                    </>
                                ) : (
                                    'Pay with M-Pesa'
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </>
        );
    };

    return (
        <div className="container mt-5 md:mt-15 mx-auto p-4 max-w-4xl">
            <h1 className="text-3xl font-bold mb-6">Checkout</h1>
            
            {cartItems.length === 0 ? (
                <div className="text-center py-20">
                    <p className="text-xl text-gray-500">Your cart is empty.</p>
                    <p className="text-gray-400 mt-2">Add some digital products to your cart to get started.</p>
                </div>
            ) : (
                <>
                    <div className="mb-6">
                        <h2 className="text-2xl mb-4">Cart Items</h2>
                        {cartItems.map((item) => (
                            <div key={item.id || item._id} className="md:flex md:justify-between md:w-full flex flex-col gap-4 p-4 items-center border-b py-4">
                                <div className="flex gap-4 md:gap-10 items-center">
                                    <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded" />
                                    <div>
                                        <p className="font-semibold">{item.name}</p>
                                        <p className="text-gray-600">Price: {currency}{item.price.toFixed(2)}</p>
                                        <p className="text-gray-600">Quantity: {item.quantity}</p>
                                        <p className="font-semibold text-orange-500">
                                            Subtotal: {currency}{(item.price * item.quantity).toFixed(2)}
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => removeFromCart(item.id || item._id)}
                                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
                                >
                                    Remove
                                </button>
                            </div>
                        ))}
                    </div>

                    {/* Order Summary */}
                    <div className="bg-gray-50 rounded-lg p-6 mb-6">
                        <h3 className="text-xl font-semibold mb-4">Order Summary</h3>
                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Subtotal</span>
                                <span>{currency}{total.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-lg font-bold border-t pt-2">
                                <span>Total</span>
                                <span className="text-orange-500">{currency}{total.toFixed(2)}</span>
                            </div>
                        </div>
                        <p className="text-sm text-gray-500 mt-2">Digital products - no delivery fee</p>
                    </div>

                    <div className="flex justify-center mt-4">
                        <button 
                            onClick={handlePlaceOrderClick}
                            className="bg-orange-500 text-white px-8 py-3 rounded-lg hover:bg-orange-600 transition-colors text-lg font-semibold"
                        >
                            Pay with M-Pesa
                        </button>
                    </div>
                </>
            )}

            <Modal 
                onOpen={showPlaceOrderModal}
                onClose={() => setShowPlaceOrderModal(false)}
            />
        </div>
    );
};

export default CheckoutPage;
