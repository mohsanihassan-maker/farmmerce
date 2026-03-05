import React from 'react';
import { Twitter, Instagram, Linkedin, Heart } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-brand-dark border-t border-white/10 pt-16 pb-8 relative overflow-hidden">
            {/* Pattern Background */}
            <div className="absolute inset-0 opacity-[0.04] pointer-events-none">
                <img src="/pattern.png" alt="" className="w-full h-full object-cover" />
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                    <div className="col-span-1 md:col-span-1">
                        <div className="flex items-center gap-3 mb-4">
                            <img src="/mark.png" alt="Farmmerce Mark" className="h-8 w-8 object-contain" />
                            <img src="/farmmerce-20.png" alt="Farmmerce" className="h-7 w-auto object-contain" />
                        </div>
                        <p className="text-gray-400 mb-6">
                            Reimagining the food supply chain in Africa. Fresh, fair, and transparent.
                        </p>
                        <div className="flex space-x-4">
                            <a href="#" className="text-gray-400 hover:text-brand-light transition-colors"><Twitter size={20} /></a>
                            <a href="#" className="text-gray-400 hover:text-brand-light transition-colors"><Instagram size={20} /></a>
                            <a href="#" className="text-gray-400 hover:text-brand-light transition-colors"><Linkedin size={20} /></a>
                        </div>
                    </div>

                    <div>
                        <h4 className="text-white font-bold mb-6">Company</h4>
                        <ul className="space-y-4">
                            <li><a href="#how-it-works" className="text-gray-400 hover:text-brand-light transition-colors">About Us</a></li>
                            <li><a href="/" className="text-gray-400 hover:text-brand-light transition-colors">Careers</a></li>
                            <li><a href="/" className="text-gray-400 hover:text-brand-light transition-colors">Blog</a></li>
                            <li><a href="/" className="text-gray-400 hover:text-brand-light transition-colors">Press</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-white font-bold mb-6">Support</h4>
                        <ul className="space-y-4">
                            <li><a href="/" className="text-gray-400 hover:text-brand-light transition-colors">Help Center</a></li>
                            <li><a href="/" className="text-gray-400 hover:text-brand-light transition-colors">Safety</a></li>
                            <li><a href="/" className="text-gray-400 hover:text-brand-light transition-colors">Terms of Service</a></li>
                            <li><a href="/" className="text-gray-400 hover:text-brand-light transition-colors">Privacy Policy</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-white font-bold mb-6">Stay Updated</h4>
                        <p className="text-gray-400 mb-4">Subscribe to our newsletter for the latest updates and recipes.</p>
                        <form className="flex gap-2">
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-brand-light w-full"
                            />
                            <button className="bg-brand-light text-brand-dark px-4 py-2 rounded-lg font-bold hover:bg-white transition-colors">
                                Go
                            </button>
                        </form>
                    </div>
                </div>

                <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-gray-500 text-sm">
                        © {new Date().getFullYear()} Farmmerce. All rights reserved.
                    </p>
                    <p className="text-gray-500 text-sm flex items-center gap-1">
                        Made with <Heart size={16} className="text-brand-red fill-current" /> in Lagos
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
