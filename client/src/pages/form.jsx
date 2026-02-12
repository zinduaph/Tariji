import { useContext } from "react";
import { useState } from "react";
import { shopContext } from "../context/shopContext";
import axios from 'axios';
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const Form = () => {
   const{backendUrl,token}= useContext(shopContext)
   const navigate = useNavigate()
        const [formData,setFormData] = useState({
            firstName: '',
            lastName: '',
            productType: '',
            phoneNumber: '',
            email: '',
            howDidYouHearAboutUs: ''
        })
        const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(backendUrl+'/api/user/personal',
            {firstName:formData.firstName,
            lastName:formData.lastName,
            typeOfProduct:formData.productType,
            phoneNumber:formData.phoneNumber,
            email:formData.email,
            howDidYouHearAboutUs:formData.howDidYouHearAboutUs
        },{ headers: { Authorization: `Bearer ${token}` }})
       
       if(response.data.success) {
        toast.success('personal infomation saved successfuly')
        setFormData({
            firstName: '',
            lastName: '',
            productType: '',
            phoneNumber: '',
            email: '',
            howDidYouHearAboutUs: '',
            
        })
        navigate('/uploadProduct')
    } else {
        toast.error('personal infomation not saved')
    }
        } catch (error) {
            console.log(error)
            toast.error('info not saved')
        }
    }
    return (
        <>
        <div className="flex justify-center mt-20 bg-orange-300 p-7 md:p-10 w-90 md:w-200 m-auto rounded-md border border-2 border-gray-700">
           
           <div className="flex flex-col gap-3 md:gap-6">
             <h1 className="md:text-3xl text-2xl font-semibold">Personal Information</h1>
            <div className="flex gap-2">
                <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} className="p-2  rounded-md border w-30 md:w-60 border-gray-800 outline-none" required placeholder="First name"/>
                    <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} className="p-2 rounded-md border  border-gray-800 outline-none" required placeholder="Last name"/>
            </div>
            <select name="productType" id="" value={formData.productType} onChange={handleChange} className="p-2 rounded-md border  border-gray-800 outline-none">
                <option value="">select type of product</option>
                <option value="digital product">Digital Product</option>
                <option value="physical product">Physical Product</option>
            </select>
            <input type="number" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} className="p-2 rounded-md border  border-gray-800 outline-none" placeholder="Phone number" />

            <input type="email" name="email" value={formData.email} onChange={handleChange} className="p-2 rounded-md border  border-gray-800 outline-none" placeholder="enter your email" />

            <input type="text" name="howDidYouHearAboutUs" value={formData.howDidYouHearAboutUs} onChange={handleChange} className="p-2 rounded-md border  border-gray-800 outline-none" placeholder="how did you here about us" />
            <button onClick={handleSubmit} className="bg-black text-white hover:bg-orange-400 p-2 cursor-pointer rounded-md" type="submit">Submit</button>
           </div>
        </div>
        </>
    )
}
export default Form