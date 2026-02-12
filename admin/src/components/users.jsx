

import axios from 'axios';
import { useState, useEffect, useContext } from 'react';
import { Trash2, User, Mail, Calendar, Briefcase, Eye } from 'lucide-react';
import toast from 'react-hot-toast';
import { backendUrl } from '../App';
import { useNavigate } from 'react-router-dom';

const Users = ({ token }) => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deletingId, setDeletingId] = useState(null);
    const navigate = useNavigate();

    // Fetch all users
    const fetchUsers = async () => {
        try {

            const response = await axios.get(`${backendUrl}/api/user/users`, {
                
            });
            
            if (response.data.success) {
                setUsers(response.data.users || []);
            } else {
                toast.error(response.data.message || 'Failed to fetch users');
            }
        } catch (error) {
            console.error('Error fetching users:', error);
            console.error('Error response:', error.response);
            toast.error(error.response?.data?.message || 'Error fetching users');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        
            fetchUsers();
        
    }, [token]);

    // Delete user
    const handleDeleteUser = async (userId) => {
        if (!window.confirm('Are you sure you want to delete this user?')) {
            return;
        }

        setDeletingId(userId);
        try {
            const response = await axios.delete(`${backendUrl}/api/user/admin/users/${userId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (response.data.success) {
                toast.success('User deleted successfully');
                // Remove user from list
                setUsers(users.filter(user => user._id !== userId));
            } else {
                toast.error(response.data.message || 'Failed to delete user');
            }
        } catch (error) {
           
            toast.error(error.response?.data?.message || 'Error deleting user');
        } finally {
            setDeletingId(null);
        }
    };

    // Format date
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
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
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">All Users</h2>
                <button 
                    onClick={fetchUsers}
                    className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                >
                    Refresh
                </button>
            </div>

            {/* Users Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                    <p className="text-gray-400 text-sm">Total Users</p>
                    <p className="text-3xl font-bold text-white">{users.length}</p>
                </div>
                <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                    <p className="text-gray-400 text-sm">Vendors</p>
                    <p className="text-3xl font-bold text-orange-500">
                        {users.filter(u => u.isVendor).length}
                    </p>
                </div>
                <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                    <p className="text-gray-400 text-sm">Non-Vendors</p>
                    <p className="text-3xl font-bold text-blue-500">
                        {users.filter(u => !u.isVendor).length}
                    </p>
                </div>
            </div>

            {/* Users Table */}
            <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-700">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                    User
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                    Email
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                    Role
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                    Plan
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                    Joined
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-700">
                            {users.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="px-6 py-12 text-center text-gray-400">
                                        No users found
                                    </td>
                                </tr>
                            ) : (
                                users.map((user) => (
                                    <tr key={user._id} className="hover:bg-gray-750">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0 h-10 w-10">
                                                    <div className="h-10 w-10 rounded-full bg-orange-500 flex items-center justify-center">
                                                        <User className="h-5 w-5 text-white" />
                                                    </div>
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-white">
                                                        {user.name}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center text-gray-300">
                                                <Mail className="h-4 w-4 mr-2" />
                                                <span className="text-sm">{user.email}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                user.isVendor 
                                                    ? 'bg-orange-100 text-orange-800' 
                                                    : 'bg-blue-100 text-blue-800'
                                            }`}>
                                                {user.isVendor ? 'Vendor' : 'Buyer'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center text-gray-300">
                                                <Briefcase className="h-4 w-4 mr-2" />
                                                <span className="text-sm capitalize">{user.plan || 'starter'}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center text-gray-400">
                                                <Calendar className="h-4 w-4 mr-2" />
                                                <span className="text-sm">
                                                    {user.createdAt ? formatDate(user.createdAt) : 'N/A'}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center gap-2">
                                                {user.isVendor && (
                                                    <button
                                                        onClick={() => {
                                                            console.log('Navigating to user products:', user._id);
                                                            navigate(`/userProducts/${user._id}`);
                                                        }}
                                                        className="flex items-center px-3 py-1 text-sm bg-orange-500 text-white rounded hover:bg-orange-600 transition-colors"
                                                    >
                                                        <Eye className="h-4 w-4 mr-1" />
                                                        View Products
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => handleDeleteUser(user._id)}
                                                    disabled={deletingId === user._id}
                                                    className="flex items-center px-3 py-1 text-sm text-red-400 hover:text-red-300 transition-colors disabled:opacity-50"
                                                >
                                                    <Trash2 className="h-4 w-4 mr-1" />
                                                    {deletingId === user._id ? 'Deleting...' : 'Delete'}
                                                </button>
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

export default Users;
