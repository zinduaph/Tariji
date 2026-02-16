import { useContext } from "react";
import { shopContext } from "../context/shopContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useState } from "react";
import { X } from 'lucide-react';

const Pricing = () => {
    const { backendUrl, token } = useContext(shopContext);
    const navigate = useNavigate()
    const [loading, setLoading] = useState(null); // Track which plan is loading
     const [phoneNumber, setPhoneNumber] = useState('');
    const [selectedPlan, setSelectedPlan] = useState(null);
     const [showPhoneModal, setShowPhoneModal] = useState(false);
    const starterPlan = async () => {
        setLoading('starter plan')
        try {
            const response = await axios.post(`${backendUrl}/api/subscription/starter`, {}, {
                headers: { Authorization: `Bearer ${token}` }
                
            });
            
            if(response.data.success) {
                navigate('/form')
                toast.success('your starter plan has been activated')
            } else {
                toast.error('starter plan failed to be activated')
            }
        } catch (error) {
            console.error(error);
            toast.error('Failed to subscribe to starter plan.');
        } finally{
            setLoading(null)
        }
    };
      // Handle plan selection
    const handlePlanClick = (planType) => {
        if (planType === 'starter') {
            // Free plan - activate directly
            starterPlan();
        } else {
            // Paid plans - show phone modal
            setSelectedPlan(planType);
            setShowPhoneModal(true);
        }
    };
   

    // Submit phone number and initiate M-Pesa payment
    const submitPhoneNumber = async (e) => {
        e.preventDefault();

        if (!token) {
            toast.error('Please login first to subscribe to a plan');
            return;
        }

        // Validate phone number
        const phoneRegex = /^(07|01)\d{8}$/;
        if (!phoneRegex.test(phoneNumber)) {
            toast.error('Please enter a valid Kenyan phone number (e.g., 0712345678)');
            return;
        }

        setLoading(selectedPlan);

        try {
            const endpoint = selectedPlan === 'growth' 
                ? '/api/subscription/growth' 
                : '/api/subscription/pro-plan';

            const response = await axios.post(
                `${backendUrl}${endpoint}`,
                { phoneNumber },
                {
                   headers: { Authorization: `Bearer ${token}` }
                }
            );
              
            if (response.data.success) {
                toast.success('Check your phone for M-Pesa prompt! 📱');
                setShowPhoneModal(false);
                setPhoneNumber('');
                
                // Navigate to payment status page or dashboard
                navigate('/payment-status', {
                    state: {
                        subscriptionId: response.data.subscriptionId,
                        planType: selectedPlan
                    }
                });
            } else {
                toast.error(response.data.message || 'Failed to initiate payment');
            }
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || 'Failed to process subscription');
        } finally {
            setLoading(null);
        }
    };
    const plans = [
        {
            name: "Starter Plan",
            price: "Free",
            period: "",
            products: "3 products",
            commission: "10% commission fee",
            payout: "Weekly payout",
            description: "Perfect for testing",
            buttonText: "Get Started",
            popular: false,
            onClick: () => handlePlanClick('starter')
        },
        {
            name: "Growth Plan",
            price: "ksh1000",
            period: "/month",
            products: "10 products",
            commission: "5% commission fee",
            payout: "Weekly payout",
            description: "Ideal for growing businesses",
            buttonText: "Choose Plan",
            popular: false,
            onClick: () => handlePlanClick('growth')
        },
        {
            name: "Pro Plan",
            price: "ksh1500",
            period: "/month",
            products: "Unlimited products",
            commission: "3% commission fee",
            payout: "Weekly payout",
            description: "For serious sellers",
            buttonText: "Go Pro",
            popular: true,
            onClick: () => handlePlanClick('pro')
        }
    ];
    return (
        <div className="min-h-screen bg-black mt-10 md:mt-15 text-white py-16 px-4">
            <div className="container mx-auto">
                <h1 className="text-5xl font-bold text-center mb-4 text-orange-500">Choose Your Plan</h1>
                <p className="text-xl text-center mb-16 text-gray-300">Start selling online with our flexible pricing options</p>

                <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {plans.map((plan, index) => (
                        <div
                            key={index}
                            className={`relative bg-gray-900 rounded-lg p-8 border-2 transition-all duration-300 hover:scale-105 ${
                                plan.popular ? 'border-orange-500 shadow-lg shadow-orange-500/20' : 'border-gray-700'
                            }`}
                        >
                            {plan.popular && (
                                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                                    <span className="bg-orange-500 text-black px-4 py-1 rounded-full text-sm font-semibold">
                                        Most Popular
                                    </span>
                                </div>
                            )}

                            <div className="text-center mb-6">
                                <h3 className="text-2xl font-bold mb-2 text-orange-500">{plan.name}</h3>
                                <div className="text-4xl font-bold mb-1">
                                    {plan.price}
                                    <span className="text-lg text-gray-400">{plan.period}</span>
                                </div>
                                <p className="text-gray-400">{plan.description}</p>
                            </div>

                            <ul className="space-y-4 mb-8">
                                <li className="flex items-center">
                                    <span className="text-orange-500 mr-2">✓</span>
                                    {plan.products}
                                </li>
                                <li className="flex items-center">
                                    <span className="text-orange-500 mr-2">✓</span>
                                    {plan.commission}
                                </li>
                                <li className="flex items-center">
                                    <span className="text-orange-500 mr-2">✓</span>
                                    {plan.payout}
                                </li>
                            </ul>

                            <button
                                onClick={plan.onClick}
                                className={`w-full py-3 px-6 rounded-lg font-semibold transition-all duration-300 ${
                                    plan.popular
                                        ? 'bg-orange-500 text-black hover:bg-orange-600'
                                        : 'bg-gray-800 text-white hover:bg-gray-700 border border-gray-600'
                                }`}
                            >
                                {plan.buttonText}
                            </button>
                        </div>
                    ))}
                </div>

                <div className="text-center mt-16">
                    <p className="text-gray-400 mb-4">Need a custom plan? Contact us for enterprise solutions.</p>
                    <button className="bg-transparent border-2 border-orange-500 text-orange-500 py-2 px-6 rounded-lg hover:bg-orange-500 hover:text-black transition-all duration-300">
                        Contact Sales
                    </button>
                </div>
            </div>
            
             {/* Phone Number Modal */}
            {showPhoneModal && (
                <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
                    <div className="bg-gray-900 border-2 border-orange-500 rounded-lg p-8 max-w-md w-full relative">
                        {/* Close Button */}
                        <button
                            onClick={() => {
                                setShowPhoneModal(false);
                                setPhoneNumber('');
                                setSelectedPlan(null);
                            }}
                            className="absolute top-4 right-4 text-gray-400 hover:text-white"
                        >
                            <X size={24} />
                        </button>

                        {/* Modal Header */}
                        <h2 className="text-2xl font-bold text-orange-500 mb-2 text-center">
                            Complete Your Subscription
                        </h2>
                        <p className="text-gray-400 text-center mb-6">
                            {selectedPlan === 'growth' 
                                ? 'Growth Plan - Ksh 1,000/month' 
                                : 'Pro Plan - Ksh 1,500/month'}
                        </p>

                        {/* Phone Number Form */}
                        <form onSubmit={submitPhoneNumber}>
                            <div className="mb-6">
                                <label className="block text-gray-300 mb-2 font-medium">
                                    M-Pesa Phone Number
                                </label>
                                <input
                                    type="tel"
                                    placeholder="0712345678"
                                    value={phoneNumber}
                                    onChange={(e) => setPhoneNumber(e.target.value)}
                                    className="w-full bg-gray-800 border-2 border-gray-700 focus:border-orange-500 rounded-lg px-4 py-3 text-white placeholder-gray-500 outline-none transition-colors"
                                    required
                                    pattern="^(07|01)\d{8}$"
                                />
                                <p className="text-gray-500 text-sm mt-2">
                                    Enter your Safaricom number to receive M-Pesa payment prompt
                                </p>
                            </div>

                            {/* Payment Info */}
                            <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 mb-6">
                                <p className="text-gray-400 text-sm mb-2">
                                    <strong className="text-white">What happens next:</strong>
                                </p>
                                <ul className="text-gray-400 text-sm space-y-1">
                                    <li>• You'll receive an M-Pesa prompt on your phone</li>
                                    <li>• Enter your M-Pesa PIN to confirm payment</li>
                                    <li>• Your subscription activates immediately</li>
                                </ul>
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={loading === selectedPlan}
                                className="w-full bg-orange-500 hover:bg-orange-600 text-black font-semibold py-3 px-6 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading === selectedPlan 
                                    ? 'Processing...' 
                                    : `Pay ${selectedPlan === 'growth' ? 'Ksh 1,000' : 'Ksh 1,500'}`}
                            </button>

                            {/* Cancel Button */}
                            <button
                                type="button"
                                onClick={() => {
                                    setShowPhoneModal(false);
                                    setPhoneNumber('');
                                    setSelectedPlan(null);
                                }}
                                className="w-full mt-3 text-gray-400 hover:text-white transition-colors"
                            >
                                Cancel
                            </button>
                        </form>
                    </div>
                </div>
            )}

        </div>
    );
};

export default Pricing;