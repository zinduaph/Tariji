import { useParams } from 'react-router-dom';
import { useState, useEffect, useContext, useCallback } from 'react';
import products from '../components/dummyProduct';
import { PlusCircle, X, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { shopContext } from '../context/shopContext';
import toast from 'react-hot-toast';

// Modal component moved outside to prevent re-creation on parent re-render
const Modal = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;

    return (
        <div 
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
        >
            <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">{title}</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                        <X size={24} />
                    </button>
                </div>
                {children}
            </div>
        </div>
    );
};

const Product = () => {
    const { productId } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [image, setImage] = useState('');
    const { addtocart, currency } = useContext(shopContext);
     const {backendUrl,items} = useContext(shopContext);
    // Modal states
    const itemArray = Array.isArray(items) ? items : [];
    const [showBuyModal, setShowBuyModal] = useState(false);
    const [formData, setFormData] = useState({ 
        name: '', 
        email: '', 
        phone: '' 
    });
    const [isProcessing, setIsProcessing] = useState(false);
    const [paymentResult, setPaymentResult] = useState(null);

    useEffect(() => {
        if (!productId || itemArray.length === 0) {
            setLoading(false);
            return;
        }
        
        const fetchProduct = async () => {
            const item = itemArray.find(p => p._id.toString() === productId.toString());
            setProduct(item);
            setImage(item?.image);
            setLoading(false);
        };
        fetchProduct();
    }, [productId, itemArray]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleBuyClick = () => {
        setFormData({ name: '', email: '', phone: '' });
        setPaymentResult(null);
        setShowBuyModal(true);
    };

    // M-Pesa payment integration
    const handleMpesaPayment = async () => {
        // Validate form
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
            // Format the single product as cartItems array
            // Handle image as array or string
            const imageValue = Array.isArray(product.image) ? product.image[0] : product.image;
            const cartItemsData = [{
                productId: product._id,
                productName: product.name,
                quantity: 1,
                price: product.price,
                image: imageValue
            }];
            
            const response = await fetch(
                `${backendUrl}/api/payment/lipa-online`,
                { 
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        fullName: formData.name,
                        email: formData.email,
                        address: 'Digital Product - No Delivery',
                        phone: formData.phone,
                        amount: product.price,
                        productName: product.name,
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
                
                // Poll for payment status
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
                        message: 'Payment successful! Your product will be delivered to your email.',
                        mpesaReceipt: data.mpesaReceipt
                    });
                    toast.success('Payment received! Check your email for the product.');
                    setTimeout(() => {
                        setShowBuyModal(false);
                    }, 5000);
                } else if (attempts < maxAttempts) {
                    setTimeout(checkStatus, 5000); // Check every 5 seconds
                } 
            } catch (error) {
                // if error occurs during polling, we should stop polling and show an error message
                if (attempts >= maxAttempts) {
                    setPaymentResult({
                        status: 'error',
                        message: 'Payment status check timed out. Please contact support.'
                    });
                } else {
                    setTimeout(checkStatus, 5000);
                }
            }
        };

        // Start polling after 5 seconds (give user time to enter PIN)
        setTimeout(checkStatus, 5000);
    };



    if (loading) return <div className="text-center mt-20">Loading...</div>;
    if (!product) return <div className="text-center mt-20">Product not found</div>;
    
    return (
        <>
            <div className='mt-20'>
                <div className='flex flex-col md:flex-row gap-4 w-70 md:w-220 mx-auto p-4'>
                    <div className="flex-1">
                        <img src={image} alt={product.name} className="w-full max-w-md m-auto rounded-lg shadow-lg" />
                    </div>
                    <div className='flex flex-col mt-10 gap-3 flex-1'>
                        <div className='flex gap-6 items-center items-center'>
                            <h1 className='text-2xl md:text-3xl text-orange-500'>{product.name}</h1>
                            <button 
                                onClick={() => {
                                    const productInfo = {
                                        name: product.name,
                                        price: product.price,
                                        image: Array.isArray(product.image) ? product.image[0] : product.image,
                                        description: product.description
                                    };
                                    addtocart(product.id || product._id, productInfo);
                                }} 
                                className="bg-black text-white hover:bg-orange-600 p-2 inline-flex w-45 md:w-50  gap-2 rounded-md mt-4 transition-colors"
                            >
                                Add to cart <PlusCircle className="" />
                            </button>
                        </div>
                        <p className="price text-2xl font-semibold">{currency}{product.price}</p>
                        <p className="description font-medium text-gray-600">{product.description}</p>
                        <div className="flex justify-center  mt-4">
                            <button 
                                onClick={handleBuyClick} 
                                className="bg-orange-500 text-white hover:bg-orange-600 px-6 py-3 rounded-md mt-4 transition-colors"
                            >
                                Buy Now - Pay with M-Pesa
                            </button>
                        </div>
                        <p className="text-sm text-gray-500 mt-4">
                            Digital product. Payment via M-Pesa. Product delivered instantly to your email.
                        </p>
                    </div>
                </div>
            </div>

            <Modal
                isOpen={showBuyModal}
                onClose={() => { setShowBuyModal(false); setPaymentResult(null); }}
                title="Purchase Digital Product"
            >
                <p className='mb-2 text-lg font-semibold text-orange-600'>{product?.name}</p>
                
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
                    <p className="text-lg font-semibold">Total: <span className="text-orange-600">{currency}{product?.price}</span></p>
                    <p className="text-sm text-gray-600">Digital product - delivered instantly via email</p>
                </div>

                <div className="flex gap-3">
                    <button
                        onClick={() => { setShowBuyModal(false); setPaymentResult(null); }}
                        className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleMpesaPayment}
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
            </Modal>
        </>
    );
};

export default Product;
