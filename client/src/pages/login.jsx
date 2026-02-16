import { Lock, User2Icon } from "lucide-react";
import React, { useEffect, useContext } from "react";
import { useState } from "react";
import { useNavigate,Link } from "react-router-dom";
import { shopContext } from "../context/shopContext";
import toast from "react-hot-toast";
import axios from "axios";

const Login = () => {
    const [state, setState] = useState("login")
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
     const navigate = useNavigate()
    const {backendUrl,token,setToken} = useContext(shopContext)
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: ''
    })

   

  

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        try {
            if(state === 'login') {
                const response = await axios.post(backendUrl+'/api/user/login',{email: formData.email, password: formData.password})
                if(response.data.success) {
                    navigate('/yourpage')
                    setToken(response.data.token)
                    localStorage.setItem('token',response.data.token)
                    toast.success('Login successful!')
                } else if (response.data.needsVerification) {
                    // User needs to verify email - redirect to OTP page
                    navigate('/verify-otp', {
                        state: {
                            email: response.data.email,
                            tempToken: response.data.tempToken
                        }
                    })
                } else {
                    toast.error(response.data.message || 'login failed')
                }
            } else {
                const response = await axios.post(backendUrl+ '/api/user/register', formData)
                console.log(response)
                if (response.data.success) {
                    // Registration successful, redirect to OTP verification
                    navigate('/verify-otp', {
                        state: {
                            email: response.data.email,
                            tempToken: response.data.tempToken
                        }
                    })
                    toast.success('Registration successful! Please verify your email.')
                } else {
                    toast.error(response.data.message || 'Registration failed')
                }
            }
        } catch (error) {
            console.log(error)
            toast.error(error.response?.data?.message || error.message)
        } finally {
            setLoading(false)
        }
    }


    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    return (
      <div className="flex justify-center mt-20 md:mt-24 items-center">
          <form
            
            className="w-80 md:w-100 text-center  bg-gray-900 border border-gray-800 rounded-2xl px-8">
           

            <div className="flex items-center mt-4">
                <hr className="flex-1 border-gray-600" />
                <span className="px-2 text-gray-400 text-sm">or</span>
                <hr className="flex-1 border-gray-600" />
            </div>

            <h1 className="text-white text-3xl mt-4 font-medium">
                {state === "login" ? "Login" : "Sign up"}
            </h1>

            <p className="text-gray-400 text-sm mt-2">Please sign in to continue</p>

            {state === "sign up" && (
                <div className="flex items-center mt-6 w-full bg-gray-800 border border-orange-700 h-12 rounded-full overflow-hidden pl-6 gap-2 ">
                   <User2Icon className="text-gray-400" size={14} />
                    <input type="text" name="name" placeholder="Name" className="w-full  text-white placeholder-gray-400 border-none outline-none " value={formData.name} onChange={handleChange} required />
                </div>
            )}

            <div className="flex items-center w-full mt-4 bg-gray-800 border border-orange-700 h-12 rounded-full overflow-hidden pl-6 gap-2 ">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-gray-400" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"> <path d="m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7" /> <rect x="2" y="4" width="20" height="16" rx="2" /> </svg>
                <input type="email" name="email" placeholder="Email " className="w-full  text-white placeholder-gray-400 border-none outline-none " value={formData.email} onChange={handleChange} required />
            </div>

            <div className=" flex items-center mt-4 w-full bg-gray-800 border border-orange-700 h-12 rounded-full overflow-hidden pl-6 gap-2 ">
                <Lock className="text-gray-400" size={14} />
                <input type="password" name="password" placeholder="Password" className="w-full  text-white placeholder-gray-400 border-none outline-none" value={formData.password} onChange={handleChange} required />
            </div>

            <div className="mt-4 text-left">
                <Link to= '/resetPassword'>
                <button className="text-sm text-orange-400 hover:underline">
                    Forget password?
                </button>
                </Link>
            </div>

            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

            <button onClick={handleSubmit}  disabled={loading} className="mt-2 w-full h-11 rounded-full text-gray-800 bg-white hover:bg-orange-500 transition disabled:opacity-50" >
                {loading ? 'Processing...' : (state === "login" ? "login" : "sign up")}
            </button>

            <p onClick={() => setState(prev => prev === "login" ? "sign up" : "login") } className="text-gray-400 text-sm mt-3 mb-11 cursor-pointer" >
                {state === "login" ? "Don't have an account?" : "Already have an account?"}
                <span className="text-orange-400 hover:underline ml-1">click here</span>
            </p>
        </form>
      </div>
    )
}
export default Login;