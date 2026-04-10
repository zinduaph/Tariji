import Footer from "../components/footer";
import Hero from "../components/hero";
import Navbar from "../components/navbar";
import NewsLetter from "../components/newsLetter";
import Preview from "../components/preview";
import Whatsapp from "../components/whatsapp";


const Home = () => {
    return (
        <>
        <div className="  p-10  min-h-screen  bg-black">
     <Navbar />
       <Hero />
       <Preview/>
       <NewsLetter />
       <Footer />
       <Whatsapp phoneNumber="254746508463" message="Hello! I'm interested in learning more about your digital products. 
" />
        </div>

        </>
    )
}
export default Home;