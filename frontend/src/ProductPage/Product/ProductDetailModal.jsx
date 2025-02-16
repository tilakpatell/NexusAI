import 'react';
import {
    Box,
    Star,
    X
} from 'lucide-react';
import GetProduct from "../GetProduct.jsx";
import {useUser} from "../../GlobalVariables/UserContext.jsx";

// eslint-disable-next-line react/prop-types
export default function ProductDetailModal({ isOpen, onClose, productId }) {
    const { addOrder } = useUser();
    const products = GetProduct();
    const product = products
        .flatMap(category => category.items)
        .find(item => item.id === productId);

    const handleOrder = (product) => {
        addOrder(product)
    }


    if (!isOpen) return null;

    return (
        <div className="modal modal-open">
            <div className="modal-box max-w-4xl bg-white dark:bg-gray-800">
                {/* Header */}
                <div className="flex justify-between items-start mb-6">
                    <h3 className="text-3xl font-light text-gray-900 dark:text-white">
                        {product.name}
                    </h3>
                    <button
                        onClick={onClose}
                        className="btn btn-sm btn-circle btn-ghost"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Product Content */}
                <div className="mt-6">
                    {/* Product Header */}
                    <div className="grid lg:grid-cols-2 gap-8 mb-8">
                        <div className="space-y-4">
                            <p className="text-xl text-gray-600 dark:text-gray-300 font-light">
                                {product.tagline}
                            </p>
                            <p className="text-gray-600 dark:text-gray-300">
                                {product.description}
                            </p>
                            <div className="flex items-center gap-4">
                                <span className="text-2xl font-light text-gray-900 dark:text-white">
                                    {product.price}
                                </span>
                                <button className="btn btn-primary"
                                onClick={() => handleOrder(product)}>
                                    Order
                                </button>
                            </div>
                        </div>

                        <div className="bg-base-200 rounded-lg p-6">
                            <Box className="w-full h-48 text-primary" />
                        </div>
                    </div>

                    {/* Specifications */}
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                        {product.specs.map((spec, index) => (
                            <div key={index} className="bg-base-200 rounded-lg p-4">
                                <div className="text-primary mb-3">
                                    {spec.icon}
                                </div>
                                <div className="space-y-1">
                                    <h3 className="font-medium text-gray-900 dark:text-white">
                                        {spec.label}
                                    </h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-300">
                                        {spec.value}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Features */}
                    <div className="grid md:grid-cols-2 gap-4">
                        {product.features.map((feature, index) => (
                            <div key={index} className="bg-base-200 rounded-lg p-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <Star className="w-4 h-4 text-primary" />
                                    <h3 className="font-medium text-gray-900 dark:text-white">
                                        {feature.title}
                                    </h3>
                                </div>
                                <p className="text-sm text-gray-600 dark:text-gray-300">
                                    {feature.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <div className="modal-backdrop bg-black/50" onClick={onClose}></div>
        </div>
    );
}