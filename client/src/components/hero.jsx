
import { ArrowRightIcon } from 'lucide-react'
import './hero.css'
import { useNavigate } from 'react-router-dom'

const Hero = () => {
        const userId = localStorage.getItem('userId')
        const navigate = useNavigate()
    return (
        
        <>
        <div className=" flex flex-col ml-3 justify-center mt-10 items-center pt-10 ">
            <h1 className="border text-center  border-gray-300 w-80 md:w-100 p-2 rounded-full text-gray-500">sell your digital products in seconds</h1>
            <h2 className="ml-4 mt-10 md:text-6xl text-4xl font-semibold text-white">Turn your <span className="text-orange-500">creations</span> into <span className="text-orange-500">cash</span></h2>

            <h2 className="text-gray-400 mt-10 text-2xl ">upload your digital products, set your price and share your unique link <br /> start earning from your e-book, 
                templates,courses and more
            </h2>

            <div className="flex flex-col mt-6 md:flex-row m-auto gap-4 justify-center items-center">
                {userId  === '' ? (
                    <button onClick={() => navigate('/login')} className="bg-orange-500 text-white hover:cursor-pointer inline-flex px-6 py-3 rounded-lg mr-4 glow-button">start selling now <ArrowRightIcon className="ml-2" /></button>
                    
                )
            : (
                <button onClick={() => navigate('/uploadProduct')} className="bg-orange-500 text-white hover:cursor-pointer inline-flex px-6 py-3 rounded-lg mr-4 glow-button">start selling now <ArrowRightIcon className="ml-2" /></button>
            )}
               
                <button onClick={()=> navigate('/demoPage')} className="border border-orange-300   hover:cursor-pointer hover:bg-orange-400 text-white px-6 py-3 rounded-lg">see a demo</button>
            </div>
            <p className="mt-4 text-green-500">Mpesa payments are supported for seamless transactions.</p>
        </div>
        </>
    )
}
export default Hero