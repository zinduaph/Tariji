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
    const [pdfFile, setPdfFile] = useState(null);
    const [description,setDescription] = useState('')
    const [price,setPrice] = useState('')
    const [image, setImage] = useState(null)
    const [productType, setProductType] = useState('physical')
    const [downloadUrl, setDownloadUrl] = useState('')
    const [downloadExpiry, setDownloadExpiry] = useState('7')
    const [fileFormat, setFileFormat] = useState('')
    const [loading, setLoading] = useState(false)
    const [deletingProductId, setDeletingProductId] = useState(null)
    const [editingProductId, setEditingProductId] = useState(null)
    const{backendUrl, token, items, setItems, getUserProducts, isVendor} = useContext(shopContext)
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
                if(pdfFile) formData.append('pdfFile', pdfFile)
              
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
                    setPdfFile(null)
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

    const startEditingProduct = (product) => {
        setEditingProductId(product._id)
        setName(product.name || '')
        setPrice(String(product.price ?? ''))
        setDescription(product.description || '')
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    const handleUpdateProduct = async (e) => {
        e.preventDefault()
        if (!editingProductId) return

        const numericPrice = Number(price)
        if (!name.trim() || !description.trim() || !Number.isFinite(numericPrice) || numericPrice < 0) {
            toast.error('Enter a product name, description, and valid price')
            return
        }

        try {
            const response = await axios.post(
                `${backendUrl}/api/product/update/${editingProductId}`,
                { name: name.trim(), description: description.trim(), price: numericPrice },
                { headers: { Authorization: 'Bearer ' + token } }
            )

            if (!response.data.success) {
                toast.error(response.data.message || 'Update failed')
                return
            }

            setItems(currentItems => currentItems.map(item =>
                item._id === editingProductId
                    ? { ...item, name: name.trim(), description: description.trim(), price: numericPrice }
                    : item
            ))
            setEditingProductId(null)
            setName('')
            setPrice('')
            setDescription('')
            toast.success(response.data.message || 'Product updated successfully')
        } catch (error) {
            console.error('Error updating product:', error)
            toast.error(error.response?.data?.message || error.message || 'Update failed')
        }
    }

    const cancelEditingProduct = () => {
        setEditingProductId(null)
        setName('')
        setPrice('')
        setDescription('')
    }

       // function for deleting the product
       const handleDeleteProduct = async (productId) => {
        if (!window.confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
            return
        }
        setDeletingProductId(productId)
        try {
           const response = await axios.post(`${backendUrl}/api/product/delete/${productId}`, {},
            { headers: { Authorization: `Bearer ${token}` } }
          )
           if (!response.data.success) {
               toast.error(response.data.message || 'Delete failed')
               return
           }

           setItems(currentItems => currentItems.filter(item => item._id !== productId))
           toast.success(response.data.message || 'Product deleted successfully')
        } catch (error) {
            console.error('Error deleting product:', error)
            toast.error(error.response?.data?.message || error.message || 'Delete failed')
        } finally {
            setDeletingProductId(null)
        }
       }
    return (
        <>
        <div className="mt-24 md:mt-24">

           <div className="flex justify-center w-60 md:w-100 m-auto items-center"> 
            <div className="flex flex-col  mt-4 gap-6">
                <h1 className="text-2xl md:text-3xl text-orange-400 font-semibold">Upload your  Product and start selling now</h1>
            {!editingProductId && <label htmlFor="image" className="cursor-pointer flex items-center justify-center">
                <h1 className="font-semibold">upload image</h1>
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
            </label>}
            <input type="text" onChange={(e) => setName(e.target.value)} value={name} className="p-2 border  border-gray-500 rounded-md" placeholder="product name" required />
            <input type="number" onChange={(e) => setPrice(e.target.value)} value={price} className="p-2 border  border-gray-500 rounded-md" placeholder="enter price ie 400ksh" required />
            
            {/* Product Type Selection */}
            {!editingProductId && <div>
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
            </div>}
            
            {/* Digital Product Fields */}
            {!editingProductId && productType !== 'physical' && (
                <>
                    <input 
                        type="file" 
                        onChange={(e) => setPdfFile(e.target.files?.[0])} 
                        className="p-2 border border-gray-500 rounded-md" 
                        placeholder="" 
                        required 
                    />
                    <div className="flex gap-2">
                       
                        
                    </div>
                </>
            )}
            
            <div>
                <h1 className="font-bold">Description of your product</h1>
            <textarea name="description"  onChange={(e) => setDescription(e.target.value)} value={description} required className="border outline-none rounded-md border-gray-500 p-4" id="" placeholder="Add description about your product" cols="25" rows="10"></textarea>
            </div>
            
            {editingProductId ? (
                <div className="flex gap-2">
                    <button type="button" onClick={handleUpdateProduct} className="bg-black text-white p-2 rounded-md hover:bg-orange-500">
                        Save changes
                    </button>
                    <button type="button" onClick={cancelEditingProduct} className="border border-gray-500 p-2 rounded-md">
                        Cancel
                    </button>
                </div>
            ) : (
                loading
                    ? <p>Uploading...</p>
                    : <button type="button" onClick={handleUpload} className="bg-black text-white p-2 rounded-md hover:bg-orange-500">Add product</button>
            )}

            </div>

           </div>

           <hr className="border border-orange-500 w-full mt-4"/>
           <h1 className="mt-3 text-2xl md:text-3xl text-orange-400">Your products</h1>

           <div className="grid grid-cols-1 gap-2 mt-5 p-2 md:grid-cols-3">

            {
                itemArray.map((items) => (
                    <div key={items._id} className="flex flex-col items-center">
                        <ProductItem id={items._id} item={items} name={items.name} image={items.image} price={items.price} description={items.description}/>
                        <button
                            type="button"
                            onClick={() => startEditingProduct(items)}
                            className="border border-orange-400 text-orange-500 font-semibold w-60 hover:bg-orange-400 hover:text-white rounded-md p-2 mt-2"
                        >
                            Edit product
                        </button>
                        <button
                            type="button"
                            onClick={() => handleDeleteProduct(items._id)}
                            disabled={deletingProductId === items._id}
                            className="bg-black text-white font-semibold w-60 hover:bg-orange-400 disabled:opacity-50 rounded-md p-2 mt-2"
                        >
                            {deletingProductId === items._id ? 'Deleting...' : 'Delete product'}
                        </button>
                    </div>
                ))
            }

           </div>

        </div>

        
        
        </>
    )
}
export default uploadProduct
