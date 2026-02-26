import { useState, useEffect, useRef, useContext } from "react";
import logo from '../assets/Tariji-removebg-preview.webp';
import { Link, useNavigate } from "react-router-dom";
import {  ShoppingBasketIcon, LayoutDashboard, FileText, Package, User } from "lucide-react";
import { shopContext } from "../context/shopContext";

const Navbar = () => {
     const { getTotalCartItems, token, setToken, userName, isVendor } = useContext(shopContext);
     const navLinks = [
         { name: 'Home', path: '/' },
         { name: 'Pricing', path: '/pricing' },
         { name: 'Contact', path: '/contact' },
         { name: 'About', path: '/about' },
     ];

     const vendorLinks = [
         { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
         { name: 'Your page', path: '/yourpage', icon: FileText },
         { name: 'Products', path: '/uploadProduct', icon: Package },
     ];


     const navigate = useNavigate()
     const [isScrolled, setIsScrolled] = useState(false);
     const [isMenuOpen, setIsMenuOpen] = useState(false);
     const {backendUrl} =useContext(shopContext)

     const logout = () => {
         localStorage.removeItem('token');
         setToken('');
         navigate('/');
     }
      
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    
    return (
        <nav className={`fixed top-0 left-0 bg-orange-500 w-full flex items-center justify-between px-4 md:px-16 lg:px-24 xl:px-32 transition-all duration-500 z-50 ${isScrolled ? "bg-white/80 shadow-md text-gray-700 backdrop-blur-lg py-3 md:py-4" : "py-4 md:py-6"}`}>

                {/* Logo */}
                <a href="/" className="flex items-center gap-2">
                    <img src={logo}  alt="Tariji Logo" width={50} height={50} className="  object-contain" />
                </a>

                {/* Desktop Nav */}
                <div className="hidden md:flex items-center gap-4 lg:gap-8">
                    {navLinks.map((link, i) => (
                        <a key={i} href={link.path} className={`group flex flex-col gap-0.5 ${isScrolled ? "text-gray-700" : "text-white"}`}>
                            {link.name}
                            <div className={`${isScrolled ? "bg-gray-700" : "bg-white"} h-0.5 w-0 group-hover:w-full transition-all duration-300`} />
                        </a>
                    ))}
                   
                </div>

                {/* Desktop Right */}
                <div className="hidden md:flex items-center gap-4">
                   <Link to="/checkout" className="relative">
                        <ShoppingBasketIcon className={`w-6 h-6 ${isScrolled ? "text-gray-700" : "text-white"}`} />
                        <p className="absolute top-full left-1/2 -translate-x-1/2 text-sm bg-black text-white rounded-full w-5 h-5 flex items-center justify-center">{getTotalCartItems()}</p>
                    </Link>

                    {!token ? (
                        /* Show Register/Login buttons for logged out users */
                        <div className="flex items-center gap-3">
                            <Link to="/login" className={`px-4 py-2 rounded-full transition-all duration-500 ${isScrolled ? "text-gray-700 hover:bg-gray-100" : "text-white hover:bg-white/20"}`}>
                                Login
                            </Link>
                            <Link to="/login" className={`px-4 py-2 rounded-full transition-all duration-500 ${isScrolled ? "bg-black text-white hover:bg-gray-800" : "bg-white text-black hover:bg-gray-100"}`}>
                                Register
                            </Link>
                        </div>
                    ) : token && isVendor ? (
                        <div className="relative group">
                            <button className={`flex items-center gap-2 px-4 py-2.5 rounded-full ml-4 transition-all duration-500 ${isScrolled ? "text-white bg-black" : "bg-white text-black"}`}>
                                <User className="w-4 h-4" />
                                {userName || 'Vendor'}
                            </button>

                            {/* Dropdown Menu - Only for Vendors */}
                            <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                                {vendorLinks.map((link, i) => (
                                    <Link key={i} to={link.path} className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors">
                                        <link.icon className="w-4 h-4" />
                                        {link.name}
                                    </Link>
                                ))}
                                <hr className="border-gray-200" />
                                <button onClick={logout} className="flex items-center gap-3 w-full px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors text-left">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                    </svg>
                                    Logout
                                </button>
                            </div>
                        </div>
                    ) : (
                        /* Show logout button for logged in non-vendors */
                        <button onClick={logout} className={`flex items-center gap-2 px-4 py-2.5 rounded-full ml-4 transition-all duration-500 ${isScrolled ? "text-white bg-black" : "bg-white text-black"}`}>
                            <User className="w-4 h-4" />
                            {userName || 'User'}
                        </button>
                    )}


                </div>

                {/* Mobile Menu Button */}
                <div className="flex items-center gap-3 md:hidden">
                    <Link to="/checkout" className="relative">
                        <ShoppingBasketIcon className={`w-6 h-6 ${isScrolled ? "text-gray-700" : "text-white"}`} />
                        <p className="absolute top-full left-1/2 -translate-x-1/2 text-sm bg-black text-white rounded-full w-5 h-5 flex items-center justify-center">{getTotalCartItems()}</p>
                    </Link>
                    <svg aria-label="Toggle menu" onClick={() => setIsMenuOpen(!isMenuOpen)} className={`h-6 w-6 cursor-pointer ${isScrolled ? "invert" : ""}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <line x1="4" y1="6" x2="20" y2="6" />
                        <line x1="4" y1="12" x2="20" y2="12" />
                        <line x1="4" y1="18" x2="20" y2="18" />
                        
                    </svg>
              
                </div>

                {/* Mobile Menu */}
                <div className={`fixed top-0 left-0 w-full h-screen bg-white text-base flex flex-col md:hidden items-center justify-center gap-6 font-medium text-gray-800 transition-all duration-500 ${isMenuOpen ? "translate-x-0" : "-translate-x-full"}`}>
                    <button aria-label="close menu" className="absolute top-4 right-4" onClick={() => setIsMenuOpen(false)}>
                        <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <line x1="18" y1="6" x2="6" y2="18" />
                            <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                    </button>

                    {navLinks.map((link, i) => (
                        <a key={i} href={link.path} onClick={() => setIsMenuOpen(false)}>
                            {link.name}
                        </a>
                    ))}

                    {!token ? (
                        <div className="flex flex-col items-center gap-4">
                            <Link to="/login" onClick={() => setIsMenuOpen(false)} className="px-8 py-2.5 rounded-full bg-gray-100 text-gray-800 transition-all duration-500">
                                Login
                            </Link>
                            <Link to="/register" onClick={() => setIsMenuOpen(false)} className="px-8 py-2.5 rounded-full bg-black text-white transition-all duration-500">
                                Register
                            </Link>
                        </div>
                    ) : token && isVendor ? (
                        <div className="flex flex-col items-center gap-4">
                            <div className="flex items-center gap-2 text-gray-800">
                                <User className="w-5 h-5" />
                                <span>{userName || 'Vendor'}</span>
                            </div>

                            {vendorLinks.map((link, i) => (
                                <Link key={i} to={link.path} onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3 text-gray-700 hover:text-orange-500 transition-colors">
                                    <link.icon className="w-5 h-5" />
                                    {link.name}
                                </Link>
                            ))}

                            <button onClick={() => { logout(); setIsMenuOpen(false); }} className="flex items-center gap-3 px-8 py-2.5 rounded-full bg-black text-white transition-all duration-500">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                </svg>
                                Logout
                            </button>
                        </div>
                    ) : (
                        <button onClick={() => { logout(); setIsMenuOpen(false); }} className="flex items-center gap-3 px-8 py-2.5 rounded-full bg-black text-white transition-all duration-500">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                            Logout
                        </button>
                    )}

                </div>
            </nav>
    );
}
export default Navbar;
