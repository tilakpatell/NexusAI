import React from 'react';
import { motion } from 'framer-motion';
import {
    Box,
    Cpu,
    Shield,
    Workflow,
    ChevronRight,
    Terminal,
    Database,
    Cog,
    Star
} from 'lucide-react';

const products = [
    {
        category: "Hardware",
        items: [
            {
                icon: <Box className="w-12 h-12" />,
                name: "Atlas Pro",
                description: "Advanced autonomous system for complex industrial tasks",
                price: "$75,000",
                features: ["Precision control", "Dynamic balance", "Force feedback", "20kg payload"]
            },
            {
                icon: <Database className="w-12 h-12" />,
                name: "Cargo-Bot X1",
                description: "Autonomous warehouse logistics system",
                price: "$45,000",
                features: ["500kg payload", "12hr battery", "AI pathfinding", "Smart inventory"]
            }
        ]
    },
    {
        category: "Software",
        items: [
            {
                icon: <Workflow className="w-12 h-12" />,
                name: "Neural OS",
                description: "Enterprise automation operating system with advanced AI",
                price: "$2,500/mo",
                features: ["Real-time processing", "Multi-unit control", "Cloud integration", "24/7 support"]
            },
            {
                icon: <Shield className="w-12 h-12" />,
                name: "SecureBot Guard",
                description: "Security and threat detection software suite",
                price: "$1,800/mo",
                features: ["Threat detection", "Perimeter control", "Incident response", "Access management"]
            }
        ]
    }
];

const ProductsPage = () => {
    return (
        <div className="min-h-screen bg-base-100 overflow-hidden">
            {/* Animated Background */}
            <div className="fixed inset-0 z-0">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-secondary/20 to-accent/20" />
                <div className="absolute inset-0 backdrop-blur-3xl">
                    <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:50px_50px]" />
                </div>
            </div>

            <div className="relative z-10 container mx-auto px-4 py-24">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-16"
                >
                    <h1 className="text-4xl lg:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary via-secondary to-accent">
                        Our Solutions
                    </h1>
                    <p className="text-lg text-base-content/70 max-w-2xl mx-auto">
                        Cutting-edge autonomous systems and software solutions for the modern industry
                    </p>
                </motion.div>

                {/* Product Categories */}
                {products.map((category, categoryIndex) => (
                    <div key={category.category} className="mb-16">
                        <motion.h2
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="text-2xl font-bold mb-8 flex items-center gap-2"
                        >
                            {category.category}
                            <ChevronRight className="w-5 h-5 text-primary" />
                        </motion.h2>

                        <div className="grid md:grid-cols-2 gap-8">
                            {category.items.map((product, productIndex) => (
                                <motion.div
                                    key={product.name}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: productIndex * 0.1 }}
                                    className="card bg-base-200/50 backdrop-blur-lg border border-primary/20 hover:border-primary/40 transition-all"
                                >
                                    <div className="card-body">
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="text-primary">{product.icon}</div>
                                            <div className="badge badge-primary badge-outline">{product.price}</div>
                                        </div>
                                        <h3 className="card-title text-xl mb-2">{product.name}</h3>
                                        <p className="text-base-content/70 mb-6">{product.description}</p>
                                        <div className="space-y-2">
                                            {product.features.map((feature, index) => (
                                                <div key={index} className="flex items-center gap-2">
                                                    <Star className="w-4 h-4 text-primary" />
                                                    <span className="text-sm">{feature}</span>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="card-actions justify-end mt-6">
                                            <button className="btn btn-primary">
                                                Learn More
                                                <ChevronRight className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                ))}

                {/* CTA Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mt-16"
                >
                    <div className="card bg-primary text-primary-content">
                        <div className="card-body py-12">
                            <h3 className="text-2xl font-bold mb-4">Ready to transform your operations?</h3>
                            <p className="mb-6">Contact our team for personalized consulting and custom solutions</p>
                            <div className="flex justify-center gap-4">
                                <button className="btn btn-ghost bg-white/10 backdrop-blur">Schedule Demo</button>
                                <button className="btn bg-white text-primary hover:bg-white/90">Contact Sales</button>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default ProductsPage;