import { Zap, Link, Mail, Users, DollarSign, MessageCircle, Check, X, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const NewsLetter = () => {
    const navigate = useNavigate();
    
    const tarijiBenefits = [
        {
            icon: <Zap className="w-6 h-6" />,
            title: "Automatic M-Pesa Payments",
            description: "No more chasing customers for payments. Everything happens automatically."
        },
        {
            icon: <Users className="w-6 h-6" />,
            title: "Buyers Don't Need to Register",
            description: "Customers just enter their phone & email to buy instantly."
        },
        {
            icon: <Link className="w-6 h-6" />,
            title: "Your Own Store Link",
            description: "Share your unique store URL with customers - professional and easy."
        },
        {
            icon: <Mail className="w-6 h-6" />,
            title: "Instant Delivery",
            description: "Products are emailed automatically right after payment."
        }
    ];

    const instagramProblems = [
        "Manually request payment from each customer",
        "Wait for M-Pesa confirmation messages",
        "Follow up repeatedly if customers forget",
        "Manually send files after payment",
        "Keep track of orders in spreadsheets",
        "No dedicated store - just DM conversations"
    ];

    return (
        <div className="bg-black py-16 px-4">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
                        Stop Using <span className="text-orange-500">Traditional DMs</span> to Sell
                    </h2>
                    <p className="text-gray-400 max-w-2xl mx-auto text-lg">
                        Selling digital products through DMs is time-consuming and error-prone. 
                        Tariji automates everything so you can focus on creating.
                    </p>
                </div>

                {/* Tariji Benefits - Emphasized */}
                <div className="mb-16">
                    <h3 className="text-2xl md:text-3xl font-bold text-center text-orange-500 mb-8">
                        Why Vendors and Creators Love Tariji
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {tarijiBenefits.map((benefit, index) => (
                            <div 
                                key={index} 
                                className="bg-gray-900 border border-gray-800 rounded-xl p-6 hover:border-orange-500 transition-all duration-300 hover:shadow-lg hover:shadow-orange-500/20"
                            >
                                <div className="w-12 h-12 bg-orange-500/20 rounded-lg flex items-center justify-center text-orange-500 mb-4">
                                    {benefit.icon}
                                </div>
                                <h4 className="text-white font-semibold text-lg mb-2">{benefit.title}</h4>
                                <p className="text-gray-400 text-sm">{benefit.description}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Comparison Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
                    {/* Tariji Side */}
                    <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-8 text-white">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                                <Zap className="w-5 h-5" />
                            </div>
                            <h3 className="text-2xl font-bold">Tariji</h3>
                        </div>
                        <p className="text-orange-100 mb-6 text-lg">
                            Automated digital product sales with M-Pesa payments
                        </p>
                        <ul className="space-y-3">
                            <li className="flex items-center gap-3">
                                <Check className="w-5 h-5 text-white" />
                                <span>Automatic M-Pesa payments</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Check className="w-5 h-5 text-white" />
                                <span>Buyers don't need to register</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Check className="w-5 h-5 text-white" />
                                <span>Unique store link for each vendor</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Check className="w-5 h-5 text-white" />
                                <span>Instant product delivery via email</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Check className="w-5 h-5 text-white" />
                                <span>Built-in payment tracking</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Check className="w-5 h-5 text-white" />
                                <span>Sell 24/7 while you sleep</span>
                            </li>
                        </ul>
                    </div>

                    {/* Instagram DMs Side */}
                    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 bg-gray-700 rounded-lg flex items-center justify-center">
                                <MessageCircle className="w-5 h-5 text-gray-400" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-400">Instagram DMs</h3>
                        </div>
                        <p className="text-gray-500 mb-6 text-lg">
                            Manual process with lots of back-and-forth
                        </p>
                        <ul className="space-y-3">
                            {instagramProblems.map((problem, index) => (
                                <li key={index} className="flex items-start gap-3">
                                    <X className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                                    <span className="text-gray-400">{problem}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* CTA Section */}
                <div className="text-center">
                    <div className="bg-gray-900 border border-orange-500/30 rounded-2xl p-8 max-w-2xl mx-auto">
                        <h3 className="text-2xl font-bold text-white mb-2">
                            Ready to Sell Smarter?
                        </h3>
                        <p className="text-gray-400 mb-6">
                            Join over 200 creators who have switched to Tariji and are making over 10k KES in sales every month without lifting a finger. It's free to get started and takes less than 2 minutes to set up your store.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <button 
                                onClick={() => navigate('/login')}
                                className="bg-orange-500 text-white font-semibold px-8 py-3 rounded-lg hover:bg-orange-600 transition-colors inline-flex items-center justify-center gap-2"
                            >
                                Get Started Free <ArrowRight className="w-5 h-5" />
                            </button>
                            <button 
                                onClick={() => navigate('/demoPage')}
                                className="border border-gray-600 text-white font-semibold px-8 py-3 rounded-lg hover:border-orange-500 hover:text-orange-500 transition-colors"
                            >
                                See Demo Store
                            </button>
                        </div>
                    </div>
                </div>

                {/* Stats Section */}
                <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                    <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
                        <div className="text-4xl font-bold text-orange-500 mb-2">0%</div>
                        <p className="text-gray-400">Manual Work Required</p>
                    </div>
                    <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
                        <div className="text-4xl font-bold text-orange-500 mb-2">24/7</div>
                        <p className="text-gray-400">Automated Sales</p>
                    </div>
                    <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
                        <div className="text-4xl font-bold text-orange-500 mb-2">Instant</div>
                        <p className="text-gray-400">Product Delivery</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NewsLetter;
