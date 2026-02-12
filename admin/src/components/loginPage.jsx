

import axios from 'axios';
import { Lock, Mail } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { backendUrl } from '../App';

const loginPage = ({setToken}) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('')

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
           const response  = await axios.post(backendUrl + '/api/user/admin', {email,password})
           if(response.data.success){
            setToken(response.data.token)
            toast.success('login successful')
            console.log(response.data.token)

           } else {
             toast.error('login failed')
             return 
           }
        } catch (error) {
            toast.error('An error occurred during login')
        }
         
    }
    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-950">
            <form className="w-full max-w-md bg-gray-900 border border-gray-800 rounded-2xl px-8 py-12">
                
                <div className="text-center mb-8">
                    <h1 className="text-white text-3xl font-medium">Admin Login</h1>
                    <p className="text-gray-400 text-sm mt-2">Please sign in to continue</p>
                </div>

                {/* Email Input */}
                <div className="flex items-center mt-6 w-full bg-gray-800 border border-orange-700 h-12 rounded-full overflow-hidden pl-6 gap-3">
                    <Mail className="text-gray-400" size={14} />
                    <input 
                    onChange={(e) => setEmail(e.target.value)}
                    value={email}
                        type="email" 
                        placeholder="Email" 
                        className="w-full text-white placeholder-gray-400 border-none outline-none bg-transparent" 
                    />
                </div>

                {/* Password Input */}
                <div className="flex items-center mt-4 w-full bg-gray-800 border border-orange-700 h-12 rounded-full overflow-hidden pl-6 gap-3">
                    <Lock className="text-gray-400" size={14} />
                    <input 
                    onChange={(e) => setPassword(e.target.value)}
                    value={password}
                        type="password" 
                        placeholder="Password" 
                        className="w-full text-white placeholder-gray-400 border-none outline-none bg-transparent" 
                    />
                </div>

                {/* Forgot Password Link */}
                <div className="mt-4 text-left">
                    <button type="button" className="text-sm text-orange-400 hover:underline">
                        Forgot password?
                    </button>
                </div>

                {/* Login Button */}
                <button 
                onClick={handleSubmit}
                    type="button" 
                    className="mt-6 w-full h-11 rounded-full text-gray-800 bg-white hover:bg-orange-500 transition duration-300 font-medium"
                >
                    Login
                </button>

            </form>
        </div>
    )
}

export default loginPage