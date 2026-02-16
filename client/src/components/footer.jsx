
import logo from '../assets/Tariji-removebg-preview.png';

export default function Footer() {
    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap');
            
                * {
                    font-family: 'Poppins', sans-serif;
                }
            `}</style>
            
            <footer className=" flex-wrap justify-center lg:justify-between overflow-hidden gap-10 md:gap-20 py-16 px-6 md:px-16 lg:px-24 xl:px-32 text-[13px] text-gray-500 bg-black">
                <div className="flex flex-col md:flex-row flex-wrap items-start gap-10 md:gap-[60px] xl:gap-[140px]">
                    <a href="/">
                        <img src={logo} className='w-34' alt="" />
                    </a>
                   <div className='flex flex-col md:flex-row gap-10 md:gap-13'>
                     <div>
                        <p className="text-slate-100 font-semibold">Product</p>
                        <ul className="mt-2 space-y-2">
                            <li className="hover:text-indigo-600 transition">Home</li>
                            <li className="hover:text-indigo-600 transition">Support</li>
                            <li className="hover:text-indigo-600 transition">Pricing</li>
                            <li className="hover:text-indigo-600 transition">Affiliate</li>
                        </ul>
                    </div>
                    <div>
                        <p className="text-slate-100 font-semibold">Resources</p>
                        <ul className="mt-2 space-y-2">
                            <li className="hover:text-indigo-600 transition">Company</li>
                            <li className="hover:text-indigo-600 transition">Blogs</li>
                            <li className="hover:text-indigo-600 transition">Community</li>
                            <li className="hover:text-indigo-600 transition">About</li>
                        </ul>
                    </div>
                    <div>
                        <p className="text-slate-100 font-semibold">Legal</p>
                        <ul className="mt-2 space-y-2">
                            <li className="hover:text-indigo-600 transition">Privacy</li>
                            <li className="hover:text-indigo-600 transition">Terms</li>
                        </ul>
                    </div>
                </div>
                <div className="flex flex-col max-md:items-center max-md:text-center gap-2 items-end">
                    <p className="max-w-60">Making every customer feel valued—no matter the size of your audience.</p>
                   </div>
                    <div className="flex items-center gap-4 mt-3">
                        <a href="" target="_blank" rel="noreferrer">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-dribbble size-5 hover:text-indigo-500" aria-hidden="true">
                                <circle cx="12" cy="12" r="10"></circle>
                                <path d="M19.13 5.09C15.22 9.14 10 10.44 2.25 10.94"></path>
                                <path d="M21.75 12.84c-6.62-1.41-12.14 1-16.38 6.32"></path>
                                <path d="M8.56 2.75c4.37 6 6 9.42 8 17.72"></path>
                            </svg>
                        </a>
                        <a href="https://www.linkedin.com/in/martin-ndirangu-105520306/" target="_blank" rel="noreferrer">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-linkedin size-5 hover:text-indigo-500" aria-hidden="true">
                                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                                <rect width="4" height="12" x="2" y="9"></rect>
                                <circle cx="4" cy="4" r="2"></circle>
                            </svg>
                        </a>
                        <a href="" target="_blank" rel="noreferrer">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-twitter size-5 hover:text-indigo-500" aria-hidden="true">
                                <path
                                    d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z">
                                </path>
                            </svg>
                        </a>
                        
                    </div>
                    <p className="mt-3 text-center">© {new Date().getFullYear()} Tarigi.com </p>
                </div>
            </footer>
        </>
    );
};
