
// pages/PaymentStatus.jsx
import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { shopContext } from '../context/shopContext';

const PaymentStatus = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { subscriptionId, planType } = location.state || {};
    
    const{backendUrl,token} = useContext(shopContext)
    //const token = localStorage.getItem('token');
    
    const [status, setStatus] = useState('pending');
    const [countdown, setCountdown] = useState(60); // 1 minute

    useEffect(() => {
        if (!subscriptionId) {
            navigate('/pricing');
            return;
        }

        // Poll for payment status
        const pollInterval = setInterval(async () => {
            try {
                const response = await axios.get(
                    `${backendUrl}/api/subscription/status/${subscriptionId}`,
                    {
                        headers: { Authorization: `Bearer ${token}` }
                    }
                );

                if (response.data.success && response.data.subscriptionStatus === 'active') {
                    setStatus('success');
                    clearInterval(pollInterval);
                    toast.success('Payment successful! Subscription activated 🎉');
                    setTimeout(() => navigate('/dashboard'), 2000);
                } else if (response.data.subscriptionStatus === 'payment_failed') {
                    setStatus('failed');
                    clearInterval(pollInterval);
                    toast.error('Payment failed. Please try again.');
                }
            } catch (error) {
                console.error('Status check error:', error);
            }
        }, 3000); // Check every 3 seconds

        // Countdown timer
        const countdownInterval = setInterval(() => {
            setCountdown(prev => {
                if (prev <= 1) {
                    clearInterval(countdownInterval);
                    clearInterval(pollInterval);
                    setStatus('timeout');
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => {
            clearInterval(pollInterval);
            clearInterval(countdownInterval);
        };
    }, [subscriptionId]);

    return (
        <div className="min-h-screen bg-black flex items-center justify-center p-4">
            <div className="bg-gray-900 border-2 border-orange-500 rounded-lg p-8 max-w-md w-full text-center">
                {status === 'pending' && (
                    <>
                        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-orange-500 mx-auto mb-6"></div>
                        <h2 className="text-2xl font-bold text-white mb-4">
                            Waiting for Payment...
                        </h2>
                        <p className="text-gray-400 mb-4">
                            Please check your phone and enter your M-Pesa PIN
                        </p>
                        <p className="text-orange-500 text-sm">
                            Time remaining: {Math.floor(countdown / 60)}:{(countdown % 60).toString().padStart(2, '0')}
                        </p>
                    </>
                )}

                {status === 'success' && (
                    <>
                        <div className="text-6xl mb-4">✅</div>
                        <h2 className="text-2xl font-bold text-green-500 mb-4">
                            Payment Successful!
                        </h2>
                        <p className="text-gray-400">
                            Your {planType} plan has been activated. Redirecting to dashboard...
                        </p>
                    </>
                )}

                {status === 'failed' && (
                    <>
                        <div className="text-6xl mb-4">❌</div>
                        <h2 className="text-2xl font-bold text-red-500 mb-4">
                            Payment Failed
                        </h2>
                        <p className="text-gray-400 mb-6">
                            Your payment could not be processed. Please try again.
                        </p>
                        <button
                            onClick={() => navigate('/pricing')}
                            className="bg-orange-500 hover:bg-orange-600 text-black font-semibold py-3 px-6 rounded-lg"
                        >
                            Try Again
                        </button>
                    </>
                )}

                {status === 'timeout' && (
                    <>
                        <div className="text-6xl mb-4">⏱️</div>
                        <h2 className="text-2xl font-bold text-yellow-500 mb-4">
                            Payment Timeout
                        </h2>
                        <p className="text-gray-400 mb-6">
                            Payment confirmation took too long. Please check your M-Pesa messages or try again.
                        </p>
                        <button
                            onClick={() => navigate('/pricing')}
                            className="bg-orange-500 hover:bg-orange-600 text-black font-semibold py-3 px-6 rounded-lg"
                        >
                            Back to Pricing
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};

export default PaymentStatus;