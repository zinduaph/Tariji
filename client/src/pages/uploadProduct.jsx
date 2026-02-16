import{  UploadCloudIcon} from "lucide-react";
import { useState, useContext, useEffect } from "react";
import ProductItem from "../components/productItem";
import axios from "axios";
import { shopContext } from "../context/shopContext";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const uploadProduct = () => {
    const [upload, setUpload] = useState('')
    const [selectedFile, setSelectedFile] = useState(null)
    const [name,setName] = useState('')
    const [description,setDescription] = useState('')
    const [price,setPrice] = useState('')
    const [image, setImage] = useState(null)
    const [productType, setProductType] = useState('physical')
    const [downloadUrl, setDownloadUrl] = useState('')
    const [downloadExpiry, setDownloadExpiry] = useState('7')
    const [fileFormat, setFileFormat] = useState('')
    const{backendUrl, token, items, getUserProducts, isVendor} = useContext(shopContext)
    const navigate = useNavigate();
    
    const itemArray = Array.isArray(items) ? items : [];

    // Redirect non-vendors to home
    useEffect(() => {
        if (!token) {
            navigate('/login');
        } else if (isVendor === false) {
            navigate('/');
        }
    }, [token, isVendor, navigate]);

    // Load user's products when component mounts
    useEffect(() => {
        if (token) {
            getUserProducts(token);
        }
    }, [token]);

    
    const handleFileChange = (e) => {
        const file = e.target.files[0]
        if (file) {
            setImage(file)
            setUpload(file.name)
        }
    }
    
    const handleUpload = async (e) => {
        e.preventDefault()
        try {
            const formData = new FormData()
            formData.append('name',name)
            formData.append('price',price)
            formData.append('description',description)
            formData.append('productType', productType)
            
            if(productType !== 'physical') {
                formData.append('downloadUrl', downloadUrl)
                formData.append('downloadExpiry', downloadExpiry)
                if(fileFormat) formData.append('fileFormat', fileFormat)
            }

            if(image) formData.append('image',image)

                const response = await axios.post(backendUrl+'/api/product/add',formData,{headers: { Authorization: `Bearer ${token}` }})
                console.log(`${backendUrl}/api/product/add`,formData)
                if(response.data.success) {
                    setName('')
                    setPrice('')
                    setImage(null)
                    setDescription('')
                    setProductType('physical')
                    setDownloadUrl('')
                    setDownloadExpiry('7')
                    setFileFormat('')
                    toast.success('Product uploaded successfully')
                    // Refresh current user's products
                    try {
                        if (token && getUserProducts) await getUserProducts(token)
                    } catch (e) {
                        console.warn('Failed to refresh products after upload', e)
                    }
                } else {
                    toast.error(response.data.message)
                }
        } catch (error) {
            console.log(error)
            toast.error(error.response?.data?.message || error.message || 'Upload failed')
            
        }
        
    }

    return (
        <>
        <div className="mt-15 md:mt-24">

           <div className="flex justify-center w-60 md:w-100 m-auto items-center"> 
            <div className="flex flex-col  mt-4 gap-6">
                <h1 className="text-2xl md:text-3xl text-orange-400 font-semibold">Upload your  Product and start selling now</h1>
            <label htmlFor="image" className="cursor-pointer flex items-center justify-center">
                {image ? (
                    <div className="relative w-40 h-40 border-2 border-orange-500 rounded-md overflow-hidden">
                        <img 
                            src={URL.createObjectURL(image)} 
                            alt="Preview" 
                            className="w-full h-full object-cover"
                        />
                    </div>
                ) : (
                    <UploadCloudIcon className="w-20 h-20 text-orange-500 cursor-pointer" />
                )}
                <input 
                    id="image" 
                    type="file" 
                    onChange={handleFileChange}
                    hidden
                />
            </label>
            <input type="text" onChange={(e) => setName(e.target.value)} value={name} className="p-2 border  border-gray-500 rounded-md" placeholder="product name" required />
            <input type="number" onChange={(e) => setPrice(e.target.value)} value={price} className="p-2 border  border-gray-500 rounded-md" placeholder="enter price ie 400ksh" required />
            
            {/* Product Type Selection */}
            <div>
                <h1 className="font-bold">Product Type</h1>
                <select 
                    onChange={(e) => setProductType(e.target.value)} 
                    value={productType}
                    className="p-2 border border-gray-500 rounded-md w-full"
                >
                    <option value="physical">Physical Product</option>
                    <option value="ebook">eBook</option>
                    <option value="course">Course Material</option>
                    <option value="template">Template</option>
                    <option value="digital">Other Digital Product</option>
                </select>
            </div>
            
            {/* Digital Product Fields */}
            {productType !== 'physical' && (
                <>
                    <input 
                        type="text" 
                        onChange={(e) => setDownloadUrl(e.target.value)} 
                        value={downloadUrl} 
                        className="p-2 border border-gray-500 rounded-md" 
                        placeholder="Download Link (Google Drive, Dropbox, etc.)" 
                        required 
                    />
                    <div className="flex gap-2">
                        <input 
                            type="number" 
                            onChange={(e) => setDownloadExpiry(e.target.value)} 
                            value={downloadExpiry} 
                            className="p-2 border border-gray-500 rounded-md" 
                            placeholder="Days until link expires" 
                            min="1"
                            max="365"
                        />
                        <input 
                            type="text" 
                            onChange={(e) => setFileFormat(e.target.value)} 
                            value={fileFormat} 
                            className="p-2 border border-gray-500 rounded-md" 
                            placeholder="File format (PDF, ZIP, etc.)" 
                        />
                    </div>
                </>
            )}
            
            <div>
                <h1 className="font-bold">Description of your product</h1>
            <textarea name="description"  onChange={(e) => setDescription(e.target.value)} value={description} required className="border outline-none rounded-md border-gray-500 p-4" id="" placeholder="Add description about your product" cols="25" rows="10"></textarea>
            </div>
            <button onClick={handleUpload} className="bg-black text-white p-2 rounded-md hover:bg-orange-500">Add product</button>

            </div>

           </div>

           <hr className="border border-orange-500 w-full mt-4"/>
           <h1 className="mt-3 text-2xl md:text-3xl text-orange-400">Your products</h1>

           <div className="grid grid-cols-1 gap-2 mt-5 p-2 md:grid-cols-3">

            {
                itemArray.map((items) => (
                    <ProductItem key={items._id} id={items._id} item={items} name={items.name} image={items.image} price={items.price} description={items.description}/>
                ))
            }

           </div>

        </div>

        
        
        </>
    )
}
export default uploadProduct
