import 'react';
import {
    Box,
    Star,
    X
} from 'lucide-react';
import GetProduct from "../GetProduct.jsx";
import {useUser} from "../../GlobalVariables/UserContext.jsx";
import {useState} from "react";

export default function ProductDetailModal({ isOpen, onClose, productId }) {
    const { addOrder, currentUser } = useUser();
    const products = GetProduct();
    const [bought, setBought] = useState(false);
    const product = products
        .flatMap(category => category.items)
        .find(item => item.id === productId);

    const handleOrder = (product) => {
        if (!currentUser) {
            alert("Please log in first");
            return;
        }

        setBought(true);
        console.log(bought);
        addOrder(product);
    }

    if (!isOpen) return null;
    const getSoftwareInfo = (product) => {
        if (!product?.features || !Array.isArray(product.features)) {
            return null
        }

        console.log(product.features[product.features.length]);
        const softwareFeature = product.features.find(
            feature => feature && feature.title === "Software"
        );

        return softwareFeature?.description || null;
    };

// Then use it like this:
    const softwareInfo = getSoftwareInfo(product);

    return (
        <div className="modal modal-open">
            <div className="modal-box max-w-4xl bg-white dark:bg-gray-800">
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

                <div className="mt-6">
                    <div className="grid lg:grid-cols-2 gap-8 mb-8">
                        <div className="space-y-4">
                            <p className="text-xl text-gray-600 dark:text-gray-300 font-light">
                                {product.tagline}
                            </p>
                            <p className="text-gray-600 dark:text-gray-300">
                                {product.description}
                            </p>
                            {softwareInfo ?  <div className="bg-base-200 rounded-lg p-4">
                                <h3 className="font-medium text-gray-900 dark:text-white mb-2">Software Installed</h3>
                                 <p className="text-gray-600 dark:text-gray-300">
                                    {softwareInfo}
                                </p>
                            </div> : null}
                            <div className="flex items-center gap-4">
                                <span className="text-2xl font-light text-gray-900 dark:text-white">
                                    {product.price}
                                </span>
                                <button className="btn btn-primary"
                                        onClick={() => handleOrder(product)}>
                                    Order
                                </button>
                            </div>
                            {bought ? <div className="alert alert-success">You have successfully bought the product!</div> : null}
                        </div>

                        <div className="bg-base-200 rounded-lg p-6">
                            <img src={product.img} className="w-full h-full text-primary" />
                        </div>
                    </div>

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

                    <div className="grid md:grid-cols-2 gap-4">
                        {product.features.map((feature, index) => (
                            feature.title !== "Software" && (
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
                            )
                        ))}
                    </div>
                </div>
            </div>
            <div className="modal-backdrop bg-black/50" onClick={onClose}></div>
        </div>
    );
}