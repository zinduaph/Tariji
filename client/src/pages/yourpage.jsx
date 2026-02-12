
import { useContext, useEffect, useState } from "react";
import ProductItem from "../components/productItem";
import { Link, useNavigate } from "react-router-dom";
import { shopContext } from "../context/shopContext";
import { Copy, Link as LinkIcon } from "lucide-react";
import toast from "react-hot-toast";

const YourPage = () => {
    const {items, getUserProducts, token, userId, isVendor} = useContext(shopContext)
    const navigate = useNavigate();
    const itemArray = Array.isArray(items) ? items : [];
    const [copied, setCopied] = useState(false);

    // Redirect non-vendors to home
    useEffect(() => {
        if (!token) {
            navigate('/login');
        } else if (isVendor === false) {
            navigate('/');
        }
    }, [token, isVendor, navigate]);

    // Load user's products when component mounts and user is logged in
    useEffect(() => {
        if (token) {
            getUserProducts(token);
        }
    }, [token]);

    // Generate and copy store link
    const copyStoreLink = () => {
        if (!userId) {
            toast.error("Please login to get your store link");
            return;
        }
        const storeLink = `${window.location.origin}/store/${userId}`;
        navigator.clipboard.writeText(storeLink);
        setCopied(true);
        toast.success("Store link copied! Share it with customers.");
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <>
        <div className="mt-17">
           
           <div className="flex justify-between items-center">
             <h1 className="text-2xl md:text-3xl text-orange-500 font-semibold">Your products Page</h1>
             <button 
                onClick={copyStoreLink}
                className="flex items-center gap-2 bg-black text-white p-2 rounded-md hover:bg-orange-400 transition-colors"
             >
                <LinkIcon size={18} />
                {copied ? "Link Copied!" : "Copy Store Link"}
             </button>
           </div>

           <hr className="border border-orange-500 w-full mt-3"/>

           <div className="grid grid-cols-1 p-4 md:p-6 mt-4 md:grid-cols-4 gap-2 p-2 ">

            {itemArray.length > 0 ? (
                itemArray.map((item) => (
                    
                <div key={item._id}>
                    <Link to={`/product/${item._id}`}>
                    <ProductItem  id={item._id} item={item} name={item.name} image={item.image} price={item.price} description={item.description}/>
                    <button className="bg-black text-white text-semibold w-60 hover:bg-orange-400 rounded-md p-2 mt-2">Buy now</button>
                    </Link>
                    

                </div>
            ))
            ) : (
                <p className="text-gray-600 text-lg">You haven't uploaded any products yet. Start by uploading your first product!</p>
            )}
           </div>

        </div>
        </>
    )
}
export default YourPage;
