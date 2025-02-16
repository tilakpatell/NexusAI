import 'react';
import { motion } from 'framer-motion';
import {
    User,
    Settings,
    AlertCircle,
    LogOut
} from 'lucide-react';
import { useNavigate } from "react-router-dom";
import { useUser } from "../../GlobalVariables/UserContext.jsx";
import { useAuth } from "../../GlobalVariables/AuthContext.jsx";

const UserProfile = () => {
    const navigate = useNavigate();
    const { currentUser, logoutUser } = useUser();
    const { setLoginHappened } = useAuth();

    const handleSignOut = () => {
        logoutUser();
        setLoginHappened(false);
        navigate('/');
    };

    const handleManage = (robotId) => {
        navigate(`/ManageRobot/${currentUser?.userId}/${robotId}`);
    };

    const userData = currentUser ? {
        name: currentUser.name,
        username: "Not available",
        purchasedRobots: currentUser?.purchased
    } : {
        name: "Guest User",
        username: "Not available",
        purchasedRobots: [
            {
                id: "atlas-pro",
                name: "Atlas Pro",
                description: "The Atlas Pro represents the pinnacle of industrial automation, combining advanced AI capabilities with precise mechanical control. Designed for complex manufacturing and warehouse operations, it delivers unprecedented efficiency and adaptability.",
                specs: [
                    {
                        label: "Payload",
                        value: "20kg maximum capacity"
                    },
                    {
                        label: "Battery Life",
                        value: "12 hours continuous operation"
                    },
                    {
                        label: "Processor",
                        value: "Neural Engine X12"
                    },
                    {
                        label: "Safety",
                        value: "ISO 13482 Certified"
                    }
                ],
                features: [
                    {
                        title: "Precision Control",
                        description: "Sub-millimeter accuracy with advanced force feedback systems"
                    },
                    {
                        title: "Dynamic Balance",
                        description: "Real-time stability adjustment for uneven surfaces and varying loads"
                    },
                    {
                        title: "AI Learning",
                        description: "Continuous operation optimization through machine learning"
                    },
                    {
                        title: "Smart Integration",
                        description: "Seamless connectivity with existing industrial systems"
                    }
                ]
            }
        ]
    };

    return (
        <div className="min-h-screen overflow-hidden pt-16 bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-black dark:to-blue-900">
            <div className="fixed inset-0 z-0">
                <div className="absolute w-96 h-96 bg-blue-200/20 dark:bg-blue-500/10 rounded-full blur-3xl -top-20 -left-20 animate-pulse"></div>
                <div className="absolute w-96 h-96 bg-purple-200/20 dark:bg-purple-500/10 rounded-full blur-3xl -bottom-20 -right-20 animate-pulse"></div>
            </div>

            <div className="relative z-10 container mx-auto px-4 py-12">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-12 flex justify-between items-center"
                >
                    <h1 className="text-4xl font-light text-gray-900 dark:text-white">
                        My Profile
                    </h1>
                    <button
                        onClick={handleSignOut}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
                    >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                    </button>
                </motion.div>

                <div className="grid lg:grid-cols-3 gap-8">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="lg:col-span-1"
                    >
                        <div className="bg-white/90 dark:bg-black/90 backdrop-blur-md rounded-lg border border-gray-200/20 dark:border-white/10 p-6 shadow-xl">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="p-3 bg-blue-600 rounded-full">
                                    <User className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-medium text-gray-900 dark:text-white">
                                        {currentUser?.name || userData.name}
                                    </h2>
                                    <p className="text-gray-600 dark:text-gray-300">
                                        Personal Info
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-6 p-4 rounded-lg bg-white dark:bg-gray-800 shadow-sm">
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center">
                                        <svg className="w-5 h-5 text-gray-500 dark:text-gray-400 mr-2"
                                             fill="none"
                                             stroke="currentColor"
                                             viewBox="0 0 24 24">
                                            <path strokeLinecap="round"
                                                  strokeLinejoin="round"
                                                  strokeWidth="2"
                                                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                        <span className="font-medium text-gray-700 dark:text-gray-200">
                {currentUser?.username || userData.username}
            </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="lg:col-span-2"
                    >
                        <div className="bg-white/90 dark:bg-black/90 backdrop-blur-md rounded-lg border border-gray-200/20 dark:border-white/10 p-6 shadow-xl">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="p-3 bg-blue-600 rounded-full">
                                    <User className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-medium text-gray-900 dark:text-white">
                                        My Robots
                                    </h2>
                                    <p className="text-gray-600 dark:text-gray-300">
                                        {userData.purchasedRobots.length} units
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                {userData.purchasedRobots.map((robot) => (
                                    <div
                                        key={robot.id}
                                        className="bg-white dark:bg-black/50 rounded-lg border border-gray-200/20 dark:border-white/10 p-4"
                                    >
                                        <div className="flex justify-between items-start mb-4">
                                            <div>
                                                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">
                                                    {robot.name}
                                                </h3>
                                                <p className="text-sm text-gray-600 dark:text-gray-300">
                                                    {robot.description}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4 mb-4">
                                            {robot.specs?.map((spec, index) => (
                                                <div key={index} className="flex items-center gap-2">
                                                    <span className="text-blue-600 dark:text-blue-400 font-medium">
                                                        {spec.label}:
                                                    </span>
                                                    <span className="text-gray-600 dark:text-gray-300">
                                                        {spec.value}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>

                                        <div className="space-y-2">
                                            {robot.features?.map((feature, index) => (
                                                <div key={index} className="flex flex-col">
                                                    <span className="text-gray-900 dark:text-white font-medium">
                                                        {feature.title}
                                                    </span>
                                                    <span className="text-gray-600 dark:text-gray-300 text-sm">
                                                        {feature.description}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>

                                        <div className="mt-4 flex gap-2">
                                            <button
                                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-500 transition-colors flex items-center gap-2"
                                                onClick={() => handleManage(robot.id)}
                                            >
                                                <Settings className="w-4 h-4" />
                                                Manage
                                            </button>
                                            <button className="px-4 py-2 bg-gray-100 dark:bg-white/10 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-white/20 transition-colors flex items-center gap-2">
                                                <AlertCircle className="w-4 h-4" />
                                                Report Issue
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default UserProfile;