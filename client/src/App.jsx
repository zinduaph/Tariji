import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

import Navbar from './components/navbar'
import { Routes, Route } from 'react-router-dom'
import Home from './pages/home'
import Login from './pages/login'
import Form from './pages/form'
import UploadProduct from './pages/uploadProduct'
import YourPage from './pages/yourpage'
import Product from './pages/product'
import CheckoutPage from './pages/checkout'
import About from './components/about'
import Pricing from './pages/pricing'
import Contact from './pages/contact'
import { useUser, useAuth } from '@clerk/clerk-react'
import { useContext } from 'react'
import { shopContext } from './context/shopContext'
import {Toaster} from 'react-hot-toast'
import StoreFront from './pages/storeFront'
import Dashbord from './pages/dashboard'
import PaymentStatus from './pages/paymentStatus'
import DemoPage from './pages/demoPage'
import VerifyOtp from './pages/verifyOtp'
import ResetPassword from './pages/resetPassword'
import PrivateRoutes from './pages/private'
function App() {
   

  return (
    <>
    <Toaster/>
   
     <main>
      <Routes>
      
      {/** User Router */}
      
       <Route element={<PrivateRoutes/>} >
        <Route path='/' element={<Home />} />
      <Route path='/login' element={< Login/>} />
      <Route path='/form' element={<Form />}/>
      <Route path='/uploadProduct' element={<UploadProduct />}/>
       <Route path='/yourpage' element={<YourPage />} />
       <Route path='/demoPage' element={<DemoPage/>}/>
       <Route path='/verify-otp' element={<VerifyOtp/>}/>
       <Route path='/resetPassword' element={<ResetPassword />} />
       <Route path='/pricing' element={<Pricing />} />
       <Route path='/contact' element={<Contact />} />
       <Route path='/payment-status' element={<PaymentStatus/>}/>
       <Route path='/dashboard' element={<Dashbord/>}/>
       <Route path='/about' element={<About />} />
       
      </Route>
      
      
      
       <Route path='/store/:vendorId' element={<StoreFront />}/>
       <Route path='/product/:productId' element={<Product />} />
       <Route path='/checkout' element={<CheckoutPage />} />
       
      
       
       
       
     </Routes>
   
     </main>
    </>
  )
}

export default App
