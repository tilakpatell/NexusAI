import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Eye, Brain,  ChevronRight, Bot } from 'lucide-react';

const features = [
    {
        icon: <Shield className="w-8 h-8" />,
        title: "Threat Detection",
        description: "Advanced AI-powered security systems for real-time threat analysis"
    },
    {
        icon: <Eye className="w-8 h-8" />,
        title: "Computer Vision",
        description: "State-of-the-art object detection and scene understanding"
    },
    {
        icon: <Brain className="w-8 h-8" />,
        title: "Neural Processing",
        description: "Cutting-edge neural networks for complex decision making"
    },
    {
        icon: <Bot className="w-8 h-8" />,
        title: "Robotics Control",
        description: "Intelligent control systems for autonomous robots"
    }
];

export default function HomePage() {
    const [isMenuOpen] = useState(false);
    const [activeFeature, setActiveFeature] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setActiveFeature((prev) => (prev + 1) % features.length);
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="min-h-screen bg-base-100 overflow-hidden">
            {/* Animated Background */}
            <div className="fixed inset-0 z-0">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-secondary/20 to-accent/20" />
                <div className="absolute inset-0 backdrop-blur-3xl">
                    <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:50px_50px]" />
                </div>
            </div>

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

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 min-h-screen flex items-center">
                <div className="container mx-auto px-4">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        {/* Text Content */}
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                            className="z-10"
                        >
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.2 }}
                                className="badge badge-secondary badge-lg mb-4"
                            >
                                NEXT-GEN AI SOLUTIONS
                            </motion.div>
                            <motion.h1
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                                className="text-5xl lg:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary via-secondary to-accent"
                            >
                                Empowering Robots with AI
                            </motion.h1>
                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.6 }}
                                className="text-lg text-base-content/70 mb-8 max-w-xl"
                            >
                                Transform your robotics systems with cutting-edge AI solutions.
                                From threat detection to autonomous control, we&#39;re building the future of intelligent machines.
                            </motion.p>
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.8 }}
                                className="flex gap-4"
                            >
                                <Link to="./Signin" className="btn btn-primary btn-lg">
                                    Sign in
                                    <ChevronRight />
                                </Link>
                                <Link to="/demo" className="btn btn-ghost btn-lg">
                                    Products
                                </Link>
                            </motion.div>
                        </motion.div>

                        {/* Animated Feature Cards */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.8 }}
                            className="relative h-[600px]"
                        >
                            <div className="absolute inset-0 grid grid-cols-2 gap-4">
                                {features.map((feature, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0.3, y: 20 }}
                                        animate={{
                                            opacity: activeFeature === index ? 1 : 0.3,
                                            y: activeFeature === index ? 0 : 20,
                                            scale: activeFeature === index ? 1.05 : 1
                                        }}
                                        transition={{ duration: 0.5 }}
                                        className="card bg-base-200/50 backdrop-blur-lg border border-primary/20 hover:border-primary/40 transition-all"
                                    >
                                        <div className="card-body">
                                            <div className="text-primary mb-4">{feature.icon}</div>
                                            <h3 className="card-title text-lg">{feature.title}</h3>
                                            <p className="text-sm text-base-content/70">{feature.description}</p>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    </div>
                </div>


            </section>
        </div>
    );
}