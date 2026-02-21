import { Link } from "react-router-dom"
import { useContext } from "react"
import { shopContext } from "../context/shopContext"

const productItem = ({_id, id, name, image, price, description}) => {
    const { addtocart } = useContext(shopContext);
    
    // Use _id if available (MongoDB), otherwise use id
    const productId = _id || id;

    const handleAddToCart = () => {
        const productInfo = {
            name,
            price,
            image: Array.isArray(image) ? image[0] : image,
            description
        };
        addtocart(productId, productInfo);
    };

    return (
        <>
            <div className="border border-gray-300 w-64  rounded-md p-4">
                <img src={image} loading="lazy" alt={name} className="w-full h-48 object-cover rounded-md" />
                <h2 className="font-bold text-lg mt-2">{name}</h2>
                <p className="text-gray-600 mt-1">Price: ${price}</p>
                <p className="text-gray-700 mt-2">{description}</p>
        
            </div>
        </>
    )
}
export default productItem
