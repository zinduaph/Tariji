import Footer from "../components/footer";
import Hero from "../components/hero";
import Navbar from "../components/navbar";
import NewsLetter from "../components/newsLetter";
import Preview from "../components/preview";


const Home = () => {
    return (
        <>
        <div className="  p-10  min-h-screen  bg-black">
     <Navbar />
       <Hero />
       <Preview/>
       <NewsLetter />
       <Footer />

        </div>

        </>
    )
}
export default Home;