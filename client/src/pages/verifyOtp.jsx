import { useState, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { shopContext } from "../context/shopContext";
import axios from "axios";
import toast from "react-hot-toast";
import { Mail, ArrowRight, RefreshCw } from "lucide-react";

const VerifyOtp = () => {
    const { backendUrl, setToken, setIsVendor } = useContext(shopContext);
    const navigate = useNavigate();
    const location = useLocation();
    
    // Get email and tempToken from location state (passed from register/login)
    const { email, tempToken } = location.state || {};
    
    const [otp, setOtp] = useState("");
    const [loading, setLoading] = useState(false);
    const [resending, setResending] = useState(false);

    // Redirect if no email or token
    if (!email || !tempToken) {
        navigate('/login');
        return null;
    }

    const handleVerify = async (e) => {
        e.preventDefault();
        
        if (!otp || otp.length !== 6) {
            toast.error("Please enter a 6-digit OTP");
            return;
        }

        setLoading(true);
        try {
            const response = await axios.post(
                `${backendUrl}/api/user/verify-otp`,
                { otp, tempToken }
            );

            if (response.data.success) {
                toast.success("Email verified successfully!");
                navigate('/pricing')
                // Save token and user data
                localStorage.setItem('token', response.data.token);
                setToken(response.data.token);
                setIsVendor(response.data.user?.isVendor || true);
                 
                // Redirect to home or dashboard
                
            } else {
                toast.error(response.data.message || "Invalid OTP");
            }
        } catch (error) {
            console.error('OTP verification error:', error);
            toast.error(error.response?.data?.message || "Verification failed");
        } finally {
            setLoading(false);
        }
    };

    const handleResendOtp = async () => {
        setResending(true);
        try {
            const response = await axios.post(
                `${backendUrl}/api/user/resend-otp`,
                { tempToken }
            );

            if (response.data.success) {
                toast.success("New OTP sent to your email!");
            } else {
                toast.error(response.data.message || "Failed to resend OTP");
            }
        } catch (error) {
            console.error('Resend OTP error:', error);
            toast.error("Failed to resend OTP");
        } finally {
            setResending(false);
        }
    };

    const handleOtpChange = (e) => {
        // Only allow numbers and max 6 digits
        const value = e.target.value.replace(/\D/g, '').slice(0, 6);
        setOtp(value);
    };

    return (
        <div className="min-h-screen bg-black flex items-center justify-center px-4">
            <div className="max-w-md w-full">
                {/* Logo/Header */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl md:text-4xl font-bold text-white">
                        Tariji
                    </h1>
                    <p className="text-gray-400 mt-2">Verify your email</p>
                </div>

                {/* OTP Card */}
                <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 shadow-xl">
                    {/* Icon */}
                    <div className="flex justify-center mb-6">
                        <div className="w-16 h-16 bg-orange-500/10 rounded-full flex items-center justify-center">
                            <Mail size={32} className="text-orange-500" />
                        </div>
                    </div>

                    {/* Title */}
                    <h2 className="text-xl font-semibold text-white text-center mb-2">
                        Check your email
                    </h2>
                    
                    {/* Description */}
                    <p className="text-gray-400 text-center mb-6">
                        We've sent a 6-digit verification code to{" "}
                        <span className="text-orange-500">{email}</span>
                    </p>

                    {/* OTP Input Form */}
                    <form onSubmit={handleVerify}>
                        <div className="mb-6">
                            <input
                                type="text"
                                value={otp}
                                onChange={handleOtpChange}
                                placeholder="Enter 6-digit OTP"
                                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white text-center text-2xl tracking-widest focus:outline-none focus:border-orange-500 transition-colors"
                                maxLength={6}
                                autoFocus
                            />
                        </div>

                        {/* Verify Button */}
                        <button
                            type="submit"
                            disabled={loading || otp.length !== 6}
                            className="w-full bg-orange-500 text-black font-bold py-3 px-4 rounded-lg hover:bg-orange-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <span className="flex items-center gap-2">
                                    <RefreshCw size={18} className="animate-spin" />
                                    Verifying...
                                </span>
                            ) : (
                                <>
                                    Verify Email
                                    <ArrowRight size={18} />
                                </>
                            )}
                        </button>
                    </form>

                    {/* Resend OTP */}
                    <div className="mt-6 text-center">
                        <p className="text-gray-400 text-sm">
                            Didn't receive the email?{" "}
                            <button
                                onClick={handleResendOtp}
                                disabled={resending}
                                className="text-orange-500 hover:text-orange-400 font-medium disabled:opacity-50"
                            >
                                {resending ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <RefreshCw size={14} className="animate-spin" />
                                        Sending...
                                    </span>
                                ) : (
                                    "Resend OTP"
                                )}
                            </button>
                        </p>
                    </div>

                    {/* Back to Login */}
                    <div className="mt-4 text-center">
                        <button
                            onClick={() => navigate('/login')}
                            className="text-gray-500 hover:text-gray-400 text-sm"
                        >
                            ← Back to Login
                        </button>
                    </div>
                </div>

                {/* Footer */}
                <p className="text-gray-500 text-center mt-8 text-sm">
                    Check your spam folder if you don't see the email
                </p>
            </div>
        </div>
    );
};

export default VerifyOtp;
