import { CloudLightning, Share2Icon, Shield } from "lucide-react"


const Preview = () => {
    return (
        <>
        <div className=" flex flex-col md:flex-row mt-10 items-center gap-3 justify-center">

            <div className="flex flex-col p-4 gap-3 rounded-md mt-10 border border-gray-300 w-70 md:w-90 ">
                <div className="flex justify-center">
                    <CloudLightning className="w-10 h-8 p-2 rounded-md flex justify-center bg-orange-500"/>
                </div>
                <h2 className="text-gray-400 text-2xl">Instant setup</h2>
                <h1 className="text-white font-semibold">upload and start selling in under 2 minutes</h1>
            </div>

            <div className="flex flex-col p-4 gap-3 rounded-md mt-10 border border-gray-300 w-70 md:w-90 ">
               <div className="flex justify-center">
                <Shield className="w-10 h-8 p-2 rounded-md flex justify-center bg-orange-500"/>
               </div>
                <h2 className="text-gray-400 text-2xl">Secure  transactions</h2>
                <h1 className="text-white font-semibold">All transactions are encrypted and secure</h1>
            </div>

            <div className="flex flex-col p-4 gap-3 rounded-md mt-10 border border-gray-300 w-70 md:w-90 ">
              <div className="flex justify-center">
                 <Share2Icon className="w-10 h-8 p-2 rounded-md inline-flex justify-center bg-orange-500"/>
              </div>
                <h2 className="text-gray-400 text-2xl">Easy sharing</h2>
                <h1 className="text-white font-semibold">Add your store link to all you social media platforms</h1>
            </div>
        </div>

        </>
    )
}
export default Preview