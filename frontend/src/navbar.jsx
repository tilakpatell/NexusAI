import React from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Signin from "./Signin";

export default function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = React.useState(false);


    return (
        <>
            <nav className="navbar fixed top-0 z-50 bg-base-100/50 backdrop-blur-md border-b border-primary/20">
                <div className="container mx-auto">
                    <div className="flex-1">
                        <Link to="/" className="btn btn-ghost text-2xl font-bold text-primary">
                            NexusAI
                        </Link>
                    </div>

                    {/* Theme Switcher and Mobile Menu Button */}
                    <div className="flex-none lg:hidden flex items-center gap-2">
                        <button
                            className="btn btn-square btn-ghost"
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                        >
                            {isMenuOpen ? <X /> : <Menu />}
                        </button>
                    </div>

                    {/* Desktop Menu */}
                    <div className="flex-none hidden lg:flex items-center gap-4">
                        <ul className="menu menu-horizontal px-1 gap-2">
                            <li><Link to="/Products" className="btn btn-ghost">Products</Link></li>
                            <li><Link to="/about" className="btn btn-ghost">About</Link></li>
                            <li><Link to="/contact" className="btn btn-ghost">Contact</Link></li>
                            <li><Link to="./Signin" className="btn btn-primary">Sign in</Link></li>
                        </ul>
                    </div>
                </div>
            </nav>

            {/* Mobile Menu Dropdown */}
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="lg:hidden fixed top-16 left-0 right-0 z-40 bg-base-100/95 backdrop-blur-md border-b border-primary/20"
                    >
                        <ul className="menu menu-vertical p-4">
                            <li><Link to="/solutions" className="btn btn-ghost">Solutions</Link></li>
                            <li><Link to="/about" className="btn btn-ghost">About</Link></li>
                            <li><Link to="/contact" className="btn btn-ghost">Contact</Link></li>
                            <li><Link to="/demo" className="btn btn-primary w-full">Request Demo</Link></li>
                        </ul>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}