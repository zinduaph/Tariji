import { DollarSign, User, Package, Mail } from "lucide-react"
import { useContext, useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { shopContext } from "../context/shopContext"
import axios from "axios"
import toast from "react-hot-toast"

const Dashbord = () => {
    const {userName, plan, backendUrl, token, isVendor} = useContext(shopContext)
    const navigate = useNavigate()
    const [orders, setOrders] = useState([])
    const [summary, setSummary] = useState(null)
    const [loading, setLoading] = useState(false)
    const [initialLoading, setInitialLoading] = useState(true)
    
    // Check token and vendor status on mount
    useEffect(() => {
        const checkAuth = () => {
            // First check localStorage directly (synch)
            const storedToken = localStorage.getItem('token')
            
            // If no stored token and no context token, redirect to login
            if (!storedToken && !token) {
                navigate('/login')
                return
            }
            
            // Give context time to load token and isVendor
            setTimeout(() => {
                setInitialLoading(false)
            }, 100)
        }
        
        checkAuth()
    }, [token, navigate])
    
    // Redirect non-vendors to home
    useEffect(() => {
        if (!initialLoading && token && isVendor === false) {
            navigate('/')
        }
    }, [initialLoading, token, isVendor, navigate])
    
    // Fetch purchases from lipaNaMpesa model
    const fetchPurchases = async () => {
        try {
            setLoading(true)
            const response = await axios.get(
                `${backendUrl}/api/delivery/all-orders`,
                { headers: { Authorization: `Bearer ${token}` } }
            )
            if (response.data.success) {
                setOrders(response.data.orders)
                setSummary(response.data.summary)
            }
        } catch (error) {
            if (error.response?.status === 401) {
                localStorage.removeItem('token')
                navigate('/login')
            }
            console.error('Error fetching purchases:', error)
            toast.error('Failed to fetch purchases')
        } finally {
            setLoading(false)
        }
    }
      // format date function for getting the purchase date and time in a redable fromat
    const formatDate = (dateString) => {
        const date = new Date(dateString)
        return date.toLocaleDateString('en-us', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',

        })
    }
    
    useEffect(() => {
        if (!initialLoading && token) {
            fetchPurchases()
        }
    }, [initialLoading, token, navigate])
    
    // Send download link for a product
    
    if (initialLoading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <p className="text-white">Loading...</p>
            </div>
        )
    }
    
    return (
        <>
        <div className="mt-15 md:mt-19">

           <div className="flex flex-col md:flex-row p-5 items-center gap-20  md:gap-40">
            <div className="border border-gray-500 flex flex-col justify-center items-center gap-3 p-4 shadow-md w-40 md:w-60 rounded-md">
             <User size={40}  className="  text-orange-500" />
             <p className="font-semibold text-2xl">{userName}</p>
             <p className="font-semibold text-gray-600 font-semi-bold text-lg">current plan:{plan}</p>
            </div>
             <p className="font-semibold text-2xl md:text-3xl">welcome to your Dashboard</p>
           </div>
            <hr className="text-orange-500 w-full"/>
            
          <h2 className="text-2xl mt-2 md:text-3xl font-semibold flex justify-center">Products sold</h2>

          <div className="mt-6 flex p-4 flex-col md:flex-row gap-8">
           <div className="bg-green-100 border border-green-400 p-4 rounded-md">
            <p className="text-lg text-green-600 flex items-center gap-2"><DollarSign size={24} />Total Revenue</p>
            <p className="text-3xl md:text-4xl text-orange-500 font-semibold">
              {summary ? `KES ${summary.totalRevenue?.toLocaleString() || '0'}` : 'Loading...'}
            </p>
           </div>
           
           <div className="bg-blue-100 border border-blue-400 p-4 rounded-md">
            <p className="text-lg text-blue-600 flex items-center gap-2"><Package size={24} />Total Items Sold</p>
            <p className="text-3xl md:text-4xl text-orange-500 font-semibold">
              {summary ? summary.totalItems || '0' : 'Loading...'}
            </p>
           </div>

           <div className="bg-purple-100 border border-purple-400 p-4 rounded-md">
            <p className="text-lg text-purple-600">Total Orders</p>
            <p className="text-3xl md:text-4xl text-orange-500 font-semibold">
              {summary ? summary.totalOrders || '0' : 'Loading...'}
            </p>
           </div>
          </div>

          {/* Purchases/Orders Section */}
          <div className="mt-8 p-4">
            <h3 className="text-xl font-semibold flex items-center gap-2">
                <Package className="text-orange-500" />
                Your Purchases
            </h3>
            
            {loading ? (
                <p className="mt-4 text-gray-600">Loading purchases...</p>
            ) : orders.length === 0 ? (
                <p className="mt-4 text-gray-600">No purchases yet.</p>
            ) : (
                <div className="mt-4 overflow-x-auto">
                    <table className="w-full border-collapse bg-white rounded-lg overflow-hidden">
                        <thead>
                            <tr className="bg-gray-200">
                                <th className="border p-2 text-left text-sm font-semibold">Transaction ID</th>
                                <th className="border p-2 text-left text-sm font-semibold">Product Name</th>
                                <th className="border p-2 text-left text-sm font-semibold">Buyer</th>
                                <th className="border p-2 text-left text-sm font-semibold">Quantity</th>
                                <th className="border p-2 text-left text-sm font-semibold">Amount</th>
                                <th className="border p-2 text-left text-sm font-semibold">Type</th>
                                <th className="border p-2 text-left text-sm font-semibold">Status</th>
                                <th className="border p-2 text-left text-sm font-semibold">Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map((order, idx) => (
                                <tr key={`${order._id}-${order.product?.productId || idx}`} className="border-b hover:bg-gray-50">
                                    <td className="border p-2 text-xs font-mono">{order.transactionId?.slice(-8) || order._id?.slice(-8)}</td>
                                    <td className="border p-2 text-sm">
                                        <div className="flex items-center gap-2">
                                            {order.product?.image && (
                                                <img src={order.product.image[0]} alt="product" className="w-8 h-8 rounded object-cover" />
                                            )}
                                            <span>{order.product?.productName || 'N/A'}</span>
                                        </div>
                                    </td>
                                    <td className="border p-2 text-sm">
                                        <div>
                                            <p className="font-semibold">{order.buyerInfo?.fullName}</p>
                                            <p className="text-xs text-gray-600">{order.buyerInfo?.email}</p>
                                        </div>
                                    </td>
                                    <td className="border p-2 text-sm text-center">{order.product?.quantity || 1}</td>
                                    <td className="border p-2 text-sm font-semibold text-orange-500">
                                        {order.amount ? `KES ${order.amount.toLocaleString()}` : 'N/A'}
                                    </td>
                                    <td className="border p-2 text-xs">
                                        <span className={`px-2 py-1 rounded font-semibold ${
                                            order.product?.productType && order.product.productType !== 'physical'
                                                ? 'bg-blue-100 text-blue-600' 
                                                : 'bg-gray-100 text-gray-600'
                                        }`}>
                                            {order.product?.productType || 'physical'}
                                        </span>
                                    </td>
                                    <td className="border p-2">
                                        <span className={`px-2 py-1 text-xs rounded font-semibold ${
                                            order.paymentStatus === 'completed'
                                                ? 'bg-green-100 text-green-600' 
                                                : order.paymentStatus === 'pending'
                                                ? 'bg-yellow-100 text-yellow-600'
                                                : 'bg-red-100 text-red-600'
                                        }`}>
                                            {order.paymentStatus}
                                        </span>
                                    </td>
                                    <td className="border p-2 text-xs text-gray-600">
                                        {formatDate(order.createdAt || order.purchaseDate)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
          </div>
              
        </div>
        
        
        </>
    )
}
export default Dashbord
