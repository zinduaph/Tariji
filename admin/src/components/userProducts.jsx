

import axios from 'axios';
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Package, DollarSign, ShoppingCart, Calendar, ArrowLeft, User } from 'lucide-react';
import toast from 'react-hot-toast';
import { backendUrl } from '../App';

const UserProducts = ({ token }) => {
    const { userId } = useParams();
    const [user, setUser] = useState(null);
    const [soldProducts, setSoldProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch user and their sold products
    const fetchUserSoldProducts = async () => {
        try {
            const response = await axios.get(`${backendUrl}/api/user/admin/sold-products/${userId}`, {
     
                headers: {
                    Authorization: `Bearer ${token}`
                }
                
            });
        
            if (response.data.success) {
                setUser({
                    name: response.data.userName || 'Unknown User',
                    email: response.data.userEmail || ''
                });
                           
                setSoldProducts(response.data.soldProducts || []);
            } else {
                toast.error(response.data.message || 'Failed to fetch user products');
            }
        } catch (error) {
            console.error('Error fetching user products:', error);
            toast.error(error.response?.data?.message || 'Error fetching user products');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
          if(userId) {
            fetchUserSoldProducts()
          }
            
        
    }, [token, userId]);

    // Calculate totals
    const totalRevenue = soldProducts.reduce((sum, product) => sum + (product.price * product.quantity), 0);
    const totalItemsSold = soldProducts.reduce((sum, product) => sum + product.quantity, 0);

    // Format date
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
            </div>
        );
    }

    return (
        <div className="p-6">
            {/* Header */}
            <div className="flex items-center gap-4 mb-6">
                <Link to="/users" className="p-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors">
                    <ArrowLeft className="text-white" size={20} />
                </Link>
                <div>
                    <h2 className="text-2xl font-bold text-white">User's Sold Products</h2>
                    {user && (
                        <p className="text-gray-400 flex items-center gap-2 mt-1">
                            <User size={16} />
                            {user.name} ({user.email})
                        </p>
                    )}
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                    <p className="text-gray-400 text-sm flex items-center gap-2">
                        <DollarSign size={16} /> Total Revenue
                    </p>
                    <p className="text-3xl font-bold text-green-500">
                        KES {totalRevenue.toLocaleString()}
                    </p>
                </div>
                <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                    <p className="text-gray-400 text-sm flex items-center gap-2">
                        <ShoppingCart size={16} /> Total Items Sold
                    </p>
                    <p className="text-3xl font-bold text-orange-500">{totalItemsSold}</p>
                </div>
                <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                    <p className="text-gray-400 text-sm flex items-center gap-2">
                        <Package size={16} /> Total Orders
                    </p>
                    <p className="text-3xl font-bold text-blue-500">{soldProducts.length}</p>
                </div>
            </div>

            {/* Sold Products Table */}
            <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-700">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                    Product
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                    Price
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                    Quantity
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                    Total
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                    Date
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-700">
                            {soldProducts.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-12 text-center text-gray-400">
                                        No products sold yet
                                    </td>
                                </tr>
                            ) : (
                                soldProducts.map((product, index) => (
                                    <tr key={product._id || index} className="hover:bg-gray-750">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center">
                                                <Package className="text-orange-500 mr-3" size={20} />
                                                <span className="text-white font-medium">
                                                    {product.productName || 'Unknown Product'}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-gray-300">
                                                KES {product.price?.toLocaleString() || 0}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded-full text-sm font-medium">
                                                {product.quantity || 1}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-green-400 font-semibold">
                                                KES {((product.price || 0) * (product.quantity || 1)).toLocaleString()}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center text-gray-400">
                                                <Calendar size={14} className="mr-2" />
                                                <span className="text-sm">
                                                    {formatDate(product.createdAt || product.purchaseDate)}
                                                </span>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default UserProducts;
