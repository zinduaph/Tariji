import { useState, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { shopContext } from "../context/shopContext";
import axios from "axios";
import toast from "react-hot-toast";
import { Lock, ArrowRight, RefreshCw } from "lucide-react";

const ResetPassword = () => {
    const { backendUrl } = useContext(shopContext);
    const navigate = useNavigate();
    const location = useLocation();
    
    // Get state from location or use defaults
    const locationState = location.state || {};
    const tempTokenFromState = locationState.tempToken || "";
    const emailFromState = locationState.email || "";
    
    const [email, setEmail] = useState(emailFromState);
    const [tempToken, setTempToken] = useState(tempTokenFromState);
    const [step, setStep] = useState(emailFromState && tempTokenFromState ? "verify-otp" : "email");
    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [resending, setResending] = useState(false);

    // Step 1: Send forgot password OTP
    const handleSendOtp = async (e) => {
        e.preventDefault();
        
        if (!email) {
            toast.error("Please enter your email");
            return;
        }

        setLoading(true);
        try {
            const response = await axios.post(
                `${backendUrl}/api/user/forgot-password`,
                { email }
            );

            if (response.data.success) {
                toast.success("If an account exists, an OTP has been sent");
                setTempToken(response.data.tempToken);
                setStep("verify-otp");
            } else {
                toast.error(response.data.message || "Failed to send OTP");
            }
        } catch (error) {
            console.error('Forgot password error:', error);
            toast.error(error.response?.data?.message || "Failed to send OTP");
        } finally {
            setLoading(false);
        }
    };

    // Step 2: Verify OTP and reset password
    const handleVerifyAndReset = async (e) => {
        e.preventDefault();
        
        if (!otp || otp.length !== 6) {
            toast.error("Please enter the 6-digit OTP");
            return;
        }

        if (!newPassword) {
            toast.error("Please enter a new password");
            return;
        }

        if (newPassword.length < 6) {
            toast.error("Password must be at least 6 characters");
            return;
        }

        if (newPassword !== confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }

        setLoading(true);
        try {
            const response = await axios.post(
                `${backendUrl}/api/user/reset-password`,
                { 
                    otp, 
                    tempToken,
                    newPassword 
                }
            );

            if (response.data.success) {
                toast.success("Password reset successfully!");
                setTimeout(() => {
                    navigate('/login');
                }, 1500);
            } else {
                toast.error(response.data.message || "Failed to reset password");
            }
        } catch (error) {
            console.error('Reset password error:', error);
            toast.error(error.response?.data?.message || "Failed to reset password");
        } finally {
            setLoading(false);
        }
    };

    // Resend OTP
    const handleResendOtp = async () => {
        setResending(true);
        try {
            const response = await axios.post(
                `${backendUrl}/api/user/resend-reset-otp`,
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

    // Handle OTP input
    const handleOtpChange = (e) => {
        const value = e.target.value.replace(/\D/g, '').slice(0, 6);
        setOtp(value);
    };

    return (
        <div className="min-h-screen bg-black flex items-center justify-center px-4">
            <div className="max-w-md w-full">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl md:text-4xl font-bold text-white">
                        Tariji
                    </h1>
                    <p className="text-gray-400 mt-2">
                        {step === "email" ? "Reset your password" : "Enter OTP"}
                    </p>
                </div>

                {/* Reset Password Card */}
                <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 shadow-xl">
                    {/* Icon */}
                    <div className="flex justify-center mb-6">
                        <div className="w-16 h-16 bg-orange-500/10 rounded-full flex items-center justify-center">
                            <Lock size={32} className="text-orange-500" />
                        </div>
                    </div>

                    {step === "email" ? (
                        // Step 1: Email Input
                        <form onSubmit={handleSendOtp}>
                            <p className="text-gray-400 text-center mb-6">
                                Enter your email address and we'll send you an OTP to reset your password.
                            </p>

                            <div className="mb-6">
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Enter your email"
                                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-orange-500 transition-colors"
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-orange-500 text-black font-bold py-3 px-4 rounded-lg hover:bg-orange-400 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {loading ? (
                                    <span className="flex items-center gap-2">
                                        <RefreshCw size={18} className="animate-spin" />
                                        Sending...
                                    </span>
                                ) : (
                                    <>
                                        Send OTP
                                        <ArrowRight size={18} />
                                    </>
                                )}
                            </button>
                        </form>
                    ) : (
                        // Step 2: OTP + New Password
                        <form onSubmit={handleVerifyAndReset}>
                            <p className="text-gray-400 text-center mb-6">
                                We've sent a 6-digit OTP to <span className="text-orange-500">{email}</span>
                            </p>

                            <div className="mb-4">
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

                            <div className="mb-4">
                                <input
                                    type="password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    placeholder="New password"
                                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-orange-500 transition-colors"
                                    required
                                />
                            </div>

                            <div className="mb-6">
                                <input
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="Confirm new password"
                                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-orange-500 transition-colors"
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading || otp.length !== 6}
                                className="w-full bg-orange-500 text-black font-bold py-3 px-4 rounded-lg hover:bg-orange-400 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {loading ? (
                                    <span className="flex items-center gap-2">
                                        <RefreshCw size={18} className="animate-spin" />
                                        Resetting...
                                    </span>
                                ) : (
                                    <>
                                        Reset Password
                                        <ArrowRight size={18} />
                                    </>
                                )}
                            </button>

                            {/* Resend OTP */}
                            <div className="mt-6 text-center">
                                <p className="text-gray-400 text-sm">
                                    Didn't receive the OTP?{" "}
                                    <button
                                        type="button"
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
                        </form>
                    )}

                    {/* Back to Login */}
                    <div className="mt-6 text-center">
                        <button
                            onClick={() => navigate('/login')}
                            className="text-gray-500 hover:text-gray-400 text-sm"
                        >
                            ← Back to Login
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;
