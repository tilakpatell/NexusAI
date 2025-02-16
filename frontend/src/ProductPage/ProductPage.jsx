import { motion } from 'framer-motion';
import {
    ChevronRight,
    Star
} from 'lucide-react';
import ProductBackground from "./ProductBackground.jsx";

import {useState} from "react";
import ProductDetailModal from "./Product/ProductDetailModal.jsx";
import GetProduct from "./GetProduct.jsx";



const ProductsPage = () => {

    const products = GetProduct();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [productId, setProductId] = useState(0);

    return (
        <div className="min-h-screen overflow-hidden">

            <ProductDetailModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                productId={productId}
            />

            <ProductBackground/>

            <div className="relative z-10 container mx-auto px-4 py-24">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-16"
                >
                    <h1 className="text-4xl lg:text-5xl font-light mb-6 text-gray-900 dark:text-white">
                        Our Solutions
                    </h1>
                    <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto font-light">
                        Cutting-edge autonomous systems and software solutions for the modern industry
                    </p>
                </motion.div>

                {/* Product Categories */}
                {products.map((category) => (
                    <div key={category.category} className="mb-16">
                        <motion.h2
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="text-2xl font-light mb-8 flex items-center gap-2 text-gray-900 dark:text-white"
                        >
                            {category.category}
                            <ChevronRight className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        </motion.h2>

                        <div className="grid md:grid-cols-2 gap-8">
                            {category.items.map((product, productIndex) => (
                                <motion.div
                                    key={product.name}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: productIndex * 0.1 }}
                                    className="relative bg-white/80 dark:bg-black/80 backdrop-blur-md rounded-lg
                                             border border-gray-200/20 dark:border-white/10
                                             hover:border-blue-500/50 dark:hover:border-blue-500/50
                                             transition-all duration-300"
                                >
                                    <div className="p-8">
                                        <div className="flex justify-between items-start mb-6">
                                            <div className="text-blue-600 dark:text-blue-400">{product.icon}</div>
                                            <div className="px-3 py-1 rounded-full text-sm font-medium
                                                          border border-blue-600/20 dark:border-blue-400/20
                                                          text-blue-600 dark:text-blue-400">
                                                {product.price}
                                            </div>
                                        </div>
                                        <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-3">
                                            {product.name}
                                        </h3>
                                        <p className="text-gray-600 dark:text-gray-300 mb-6">
                                            {product.description}
                                        </p>
                                        <div className="space-y-3">
                                            {product.features.map((feature, index) => (
                                                <div key={index} className="flex items-center gap-2">
                                                    <Star className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                                                    <span className="text-gray-600 dark:text-gray-300">{feature.title}</span>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="mt-8">
                                            <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg
                                                           hover:bg-blue-700 dark:hover:bg-blue-500
                                                           transition-colors flex items-center justify-center gap-2"
                                                    onClick={() => {setIsModalOpen(true)
                                                        setProductId(product.id);

                                                    }}>
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
            </div>
        </div>
    );
};

export default ProductsPage;
