import { useEffect, useState } from 'react'
import './App.css'
import { Route, Routes, useNavigate } from 'react-router-dom'
import LoginPage from './components/loginPage'
import Users from './components/users'
import UserProducts from './components/userProducts'
import {Toaster} from 'react-hot-toast'
import { DollarSignIcon } from 'lucide-react'
import Sidebar from './components/sideBar'
export const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'
function App() {
  
  const [token,setToken] = useState(localStorage.getItem('token') || null)
  const navigate = useNavigate()
  
  useEffect(() => {
    if(token){
      localStorage.setItem('token', token)
    } else {
      localStorage.removeItem('token')
    }
  },[token])

   const handleLogout = () => {
    localStorage.removeItem('token')
    setToken(null)
    navigate('/login')
   }  

  return (
    <>
      <Toaster/>
      <Routes>
        <Route path='/login' element={<LoginPage setToken={setToken} />} />
        <Route path='/*' element={
          token === null ? (
            <LoginPage setToken={setToken} />
          ) : (
            <div className='min-h-screen bg-gray-50'>
              <div className='flex'>
                <Sidebar />
                <main className='flex-1 p-8 max-w-6xl mx-auto'>
                  <header className='flex items-center justify-between mb-6'>
                    <div className='flex items-center gap-4'>
                      <h1 className='font-semibold text-2xl'>Welcome to your admin panel</h1>
                      <DollarSignIcon size={28} className='text-orange-500' />
                      <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors">Logout</button>
                    </div>
                  </header>
                  <section className='bg-white rounded-lg shadow px-6 py-6'>
                    <Routes>
                      <Route path='/users' element={<Users token={token} />} />
                      <Route path='/userProducts/:userId' element={<UserProducts token={token} />} />
                      <Route path='/' element={<Users token={token} />} />
                    </Routes>
                  </section>
                </main>
              </div>
            </div>
          )
        } />
      </Routes>
    </>
  )
}

export default App
