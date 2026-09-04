import { useContext } from "react";
import { shopContext } from "../context/shopContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useState } from "react";

const Pricing = () => {
    const { backendUrl, token } = useContext(shopContext);
    const navigate = useNavigate()
    const [loading, setLoading] = useState(null); // Track which plan is loading
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
            // Paid plans use Paystack's hosted checkout.
            submitPayment(planType);
        }
    };
   

    const submitPayment = async (planType) => {
        if (!token) {
            toast.error('Please login first to subscribe to a plan');
            return;
        }

        setLoading(planType);

        try {
            const endpoint = planType === 'growth' 
                ? '/api/subscription/growth' 
                : '/api/subscription/pro-plan';

            const response = await axios.post(
                `${backendUrl}${endpoint}`,
                {},
                {
                   headers: { Authorization: `Bearer ${token}` }
                }
            );
              
            if (response.data.success) {
                window.location.assign(response.data.authorizationUrl);
            } else {
              toast.error(response.data.message || 'Failed to initiate payment');
            }
        } catch (error) {
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
            products: "5 products",
            commission: "10% commission fee",
            payout: " payout within 24 hours",
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
            payout: "payout within 24 hours",
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
            payout: "payout within 12 hours",
            description: "For serious sellers",
            buttonText: "Go Pro",
            popular: true,
            onClick: () => handlePlanClick('pro')
        }
    ];
    return (
        <div className="min-h-screen bg-black mt-20 md:mt-15 text-white py-16 px-4">
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
            
        </div>
    );
};

export default Pricing;