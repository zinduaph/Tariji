

import { useContext } from "react";
import { shopContext } from "../context/shopContext";

const CartTotal = () => {
    const { getTotalCartAmount, currency, DeliveryFee } = useContext(shopContext);
    const subtotal = getTotalCartAmount();
    const deliveryFee = subtotal > 0 ? DeliveryFee : 0;
    const total = subtotal + deliveryFee;

    return (
        <>
        <div>

            <div className="bg-black text-white rounded-md p-4 w-50 md:w-80 m-auto">
                <p className="text-2xl font-semibold  md:text-3xl">cart total</p>

             <div className="flex justify-between">
                 <p>subtotal</p>
                 <p>{currency}{subtotal}</p>

             </div>

             <div className="flex justify-between">
                 <p>Delivery fee</p>
                 <p>{currency}{deliveryFee}</p>
             </div>
             <hr className="w-full bg-orange-500"/>
             <div className="flex justify-between">
                 <p>Total</p>
                 <p>{currency}{total}</p>
             </div>

            </div>


        </div>

        </>
    )
}
export default CartTotal;