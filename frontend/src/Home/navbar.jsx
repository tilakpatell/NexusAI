import React from 'react';
import {Link, useNavigate} from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from './ThemeContext';
import { ThemeToggle } from './ThemeToggle';
import {useAuth} from "../GlobalVariables/AuthContext.jsx";
import { CircleUser } from 'lucide-react';
import { useUser } from "../GlobalVariables/UserContext.jsx";

export default function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = React.useState(false);
    const { isDark } = useTheme();
    const { loginHappened: loginHappened } = useAuth();
    const {currentUser} = useUser()
    const navigate = useNavigate();

    const handleProfileClick = () => {
        navigate('/UserHome');
    }

    return (
        <>
            <nav className="fixed top-0 z-50 w-full border-b 
                         bg-white/70 dark:bg-black/70 
                         border-gray-200/20 dark:border-white/10 
                         backdrop-blur-md">
                <div className="container mx-auto px-4">
                    <div className="flex items-center justify-between h-16">
                        {/* Logo */}
                        <Link to="/" className="text-2xl font-light tracking-tight 
                                            text-gray-900 dark:text-white 
                                            hover:text-blue-600 dark:hover:text-blue-400 
                                            transition-colors">
                            Nexus AI
                        </Link>

                        {/* Desktop Menu */}
                        <div className="hidden lg:flex items-center gap-8">
                            <Link to="/products" className="text-gray-600 dark:text-gray-300 
                                                      hover:text-blue-600 dark:hover:text-blue-400 
                                                      transition-colors">
                                Solutions
                            </Link>
                            {loginHappened ? (
                                <div className={`flex items-center gap-3 ${isDark ? 'text-white' : 'text-black'}`}
                                     onClick={handleProfileClick}>
                                    <CircleUser />
                                    <p>Hello {currentUser?.name}!</p>
                                </div>
                            ) : (
                                <Link
                                    to="/signin"
                                    className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                                >
                                    Sign in
                                </Link>
                            )}
                            <ThemeToggle />

                        </div>

                        {/* Mobile Menu Button */}
                        <div className="lg:hidden flex items-center gap-4">
                            <ThemeToggle />
                            <button
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                                className="p-2 rounded-lg text-gray-600 dark:text-gray-300
                                       hover:bg-gray-100 dark:hover:bg-white/10
                                       transition-colors"
                            >
                                {isMenuOpen ? 
                                    <X className="w-6 h-6" /> : 
                                    <Menu className="w-6 h-6" />
                                }
                            </button>
                        </div>
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
                        className="lg:hidden fixed top-16 left-0 right-0 z-40 
                                 bg-white/90 dark:bg-black/90 
                                 backdrop-blur-md 
                                 border-b border-gray-200/20 dark:border-white/10"
                    >
                        <div className="container mx-auto px-4 py-4 space-y-4">
                            <Link to="/products" className="block px-4 py-2 rounded-lg
                                                      text-gray-600 dark:text-gray-300
                                                      hover:bg-gray-100 dark:hover:bg-white/10
                                                      transition-colors">
                                Solutions
                            </Link>
                            <Link to="/about" className="block px-4 py-2 rounded-lg
                                                   text-gray-600 dark:text-gray-300
                                                   hover:bg-gray-100 dark:hover:bg-white/10
                                                   transition-colors">
                                About
                            </Link>
                            <Link to="/contact" className="block px-4 py-2 rounded-lg
                                                     text-gray-600 dark:text-gray-300
                                                     hover:bg-gray-100 dark:hover:bg-white/10
                                                     transition-colors">
                                Contact
                            </Link>
                            <Link to="/signin" className="block px-4 py-2 rounded-lg
                                                    bg-blue-600 text-white
                                                    hover:bg-blue-700
                                                    transition-colors text-center">
                                Sign in
                            </Link>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
