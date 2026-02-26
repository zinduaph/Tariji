
import { Github, Linkedin } from 'lucide-react';
import logo from '../assets/Tariji-removebg-preview.webp';

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
                        <img src={logo} alt="Tariji Logo" width={70} height={70} className='object-contain' />
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
                        
                       <a href="https://github.com/zinduaph" target='_blank'>
                        <Github size={20} />
                       </a>
                        <a href="https://www.linkedin.com/in/martin-ndirangu-105520306/" target="_blank" rel="noreferrer">
                            <Linkedin size={20}/>
                        </a>
                        
                        
                    </div>
                    <p className="mt-3 text-center">© {new Date().getFullYear()} Tarigi.com </p>
                </div>
            </footer>
        </>
    );
};
