import { createContext } from "react"
import { useState,useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import toast from "react-hot-toast";
export const shopContext = createContext();

const currency = 'ksh';
const DeliveryFee = 200;
const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'
const ShopContextProvider =(props) => {
    const [cartItems, setCartItems] = useState({});
    const [cartProducts, setCartProducts] = useState({}); // Store full product details
     const [token,setToken] = useState('')
     const [userId, setUserId] = useState(null);
     const [userName, setUserName] = useState('');
     const [isVendor, setIsVendor] = useState(false);
     const [items, setItems] = useState([])
     const [plan, setPlan] = useState('')
    
    // Add to cart with full product details
    const addtocart = (itemId, productInfo = null) => {
        let cartData = structuredClone(cartItems);
        if (!cartData[itemId]) {
            cartData[itemId] = 1;
        } else {
            cartData[itemId] += 1;
        }
        setCartItems(cartData);
        
        // Store full product info for checkout
        if (productInfo) {
            const cartProductsData = structuredClone(cartProducts);
            cartProductsData[itemId] = {
                id: itemId,
                _id: itemId,
                ...productInfo
            };
            setCartProducts(cartProductsData);
            
            // Save to localStorage for persistence
            localStorage.setItem('cartProducts', JSON.stringify(cartProductsData));
        }
        localStorage.setItem('cart', JSON.stringify(cartData));
    }

    const removeFromCart = (itemId) => {
        let cartData = structuredClone(cartItems);
        cartData[itemId] -= 1;
        if (cartData[itemId] === 0) {
            delete cartData[itemId];
        }
        setCartItems(cartData);
        
        // Remove from cartProducts
        const cartProductsData = structuredClone(cartProducts);
        delete cartProductsData[itemId];
        setCartProducts(cartProductsData);
        
        // Save to localStorage
        localStorage.setItem('cart', JSON.stringify(cartData));
        localStorage.setItem('cartProducts', JSON.stringify(cartProductsData));
    }
    
     // Load cart from localStorage on mount
    useEffect(() => {
        const savedCart = localStorage.getItem('cart');
        const savedCartProducts = localStorage.getItem('cartProducts');
        if (savedCart) {
            setCartItems(JSON.parse(savedCart));
        }
        if (savedCartProducts) {
            setCartProducts(JSON.parse(savedCartProducts));
        }
    }, []);
    
     // get total cart amount
    const getTotalCartAmount = () => {
        let totalAmount = 0;
        for (const itemId in cartItems) {
            if (cartItems[itemId] > 0) {
                // Try to get price from cartProducts first, then from items
                let itemInfo = cartProducts[itemId];
                if (!itemInfo) {
                    itemInfo = items.find((product) => product._id === itemId);
                }
                if (itemInfo) {
                    totalAmount += itemInfo.price * cartItems[itemId];
                }
            }
        }
        return totalAmount;
    }
  //get cart items as array
    const getCartItems = () => {
        let cartItemsArray = [];
        for (const itemId in cartItems) {
            if (cartItems[itemId] > 0) {
                // Try to get item from cartProducts first, then from items
                let itemInfo = cartProducts[itemId];
                if (!itemInfo) {
                    itemInfo = items.find((product) => product._id === itemId);
                }
                if (itemInfo) {
                    cartItemsArray.push({ 
                        ...itemInfo, 
                        id: itemInfo._id || itemInfo.id,
                        quantity: cartItems[itemId] 
                    });
                }
            }
        }
        return cartItemsArray;
    }
       // get total cart items
    const getTotalCartItems = () => {
        let totalItem = 0;
        for (const item in cartItems) {
            if (cartItems[item] > 0) {
                totalItem += cartItems[item];
            }
        }
        return totalItem;
    }

        useEffect(() => {
   if(!token && localStorage.getItem('token')) {
     const storedToken = localStorage.getItem('token')
     setToken(storedToken)
     try {
       const decoded = jwtDecode(storedToken)
       setUserId(decoded.userId)
     } catch (error) {
       console.error('Failed to decode token:', error)
     }
    }
   },[])

   useEffect(() => {
    if(token) {
      getUserPlan()
      getProducts()
      try {
        const decoded = jwtDecode(token)
        setUserId(decoded.userId)
        // Fetch user name from backend
        fetchUserName(decoded.userId, token)
      } catch (error) {
        console.error('Failed to decode token:', error)
      }
    }
   },[token])
      // function for getting the user's name from the backend
    const fetchUserName = async (userId, authToken) => {
      try {
        const response = await fetch(`${backendUrl}/api/user/profile`, {
          headers: {
            'Authorization': `Bearer ${authToken}`,
            'Content-Type': 'application/json'
          }
        })
        const data = await response.json()
        if(data.success && data.user) {
          setUserName(data.user.name || '')
          setIsVendor(data.user.isVendor || false)
        }
      } catch (error) {
        console.error('Failed to fetch user name:', error)
      }
    }
            //function for getting seller's products from the backend
            const getProducts = async () => {
             try {
               const response = await axios.get(backendUrl+'/api/product/my-products', {
                 headers: {
                   'Authorization': `Bearer ${token}`,
                   'Content-Type': 'application/json'
                 }
               })
               if(response.data.success){
                 setItems(response.data.product)
               } else {
                 toast(response.data.message)
               }
             } catch (error) {
               console.log(error)
               toast(error.response?.data?.message || 'Error fetching products')
             }
            }

            // Function to get current user's products only (for /yourpage)
            const getUserProducts = async (authToken) => {
             try {
               const response = await axios.get(backendUrl+'/api/product/my-products', {
                 headers: {
                   'Authorization': `Bearer ${authToken}`,
                   'Content-Type': 'application/json'
                 }
               })
               if(response.data.success){
                 setItems(response.data.product)
               } else {
                 toast.error(response.data.message)
               }
             } catch (error) {
               console.error('Error fetching user products:', error)
               toast.error('Failed to fetch your products')
             }
            }
            // function for getting which payment plan the user is subscirided to
               const getUserPlan = async () => {
                 try {
                   const response = await axios.get(backendUrl+'/api/subscription/plan', {
                     headers: {
                       'Authorization': `Bearer ${token}`,
                       'Content-Type': 'application/json'
                     }
                   })
                   if(response.data.success) {
                     setPlan(response.data.plan)
                   }
                 } catch (error) {
                   console.error('Error fetching user plan:', error)
                 }
               }
               const value = {
                   addtocart,
                   removeFromCart,
                   getTotalCartAmount,
                   getTotalCartItems,
                   getCartItems,
                   setToken,
                   userId,
                   token,
                   userName,
                   currency,
                   DeliveryFee,
                   cartItems,
                   backendUrl,
                   plan,
                   items,
                   setItems,
                   getUserProducts,
                   isVendor,
                   cartProducts,
               }

    return (
        <>


        <shopContext.Provider value={value}>
            {props.children}

        </shopContext.Provider>
        </>
    )
}
export default ShopContextProvider;
