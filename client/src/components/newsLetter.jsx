

const NewsLetter = () => {
    
    return (
        <div className="flex flex-col items-center justify-center mt-10 text-center space-y-2">
            <h1 className="md:text-4xl text-2xl font-semibold">Never Miss a Deal!</h1>
            <p className="md:text-lg text-gray-500 pb-8">
                Subscribe to get the latest offers, new arrivals, and exclusive discounts
            </p>
            <form className="flex items-center w-80 md:w-130 justify-between max-w-2xl  md:h-13 h-12">
                <input
                    className="border border-gray-300 rounded-md h-full border-r-0 outline-none w-full rounded-r-none px-3 text-gray-500"
                    type="text"
                    placeholder="Enter your email "
                    required
                />
                <button type="submit" className="md:px-12 px-8 h-full  text-white bg-orange-300 hover:bg-orange-600 transition-all cursor-pointer rounded-md rounded-l-none">
                    Subscribe
                </button>
            </form>
        </div>
    )
}
export default NewsLetter