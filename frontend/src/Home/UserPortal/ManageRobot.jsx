import React from 'react';
import { motion } from 'framer-motion';
import { useParams } from 'react-router-dom';
import {
    Battery,
    Activity,
    Settings,
    AlertCircle,
    Cpu,
    WifiIcon,
    Gauge,
    Clock,
    ToggleLeft,
    Power
} from 'lucide-react';

const ManageRobot = () => {
    const { userId, robotId } = useParams();

    // Mock data - replace with actual robot data fetch
    const robotData = {
        id: robotId,
        name: "Atlas Pro",
        serialNumber: "AP-2024-001",
        status: "Active",
        batteryLevel: 85,
        lastMaintenance: "2024-02-01",
        cpuUsage: "45%",
        memoryUsage: "32%",
        networkStrength: "Excellent",
        uptime: "15 days 4 hours",
        temperature: "23°C",
        firmware: "v2.1.4"
    };

    return (
        <div className="min-h-screen overflow-hidden pt-16">
            <div className="relative z-10 container mx-auto px-4 py-12">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-12"
                >
                    <h1 className="text-4xl font-light mb-6 text-gray-900 dark:text-white">
                        {robotData.name}
                    </h1>
                    <p className="text-gray-600 dark:text-gray-300">
                        Serial Number: {robotData.serialNumber}
                    </p>
                </motion.div>

                {/* Status Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Main Status Card */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="lg:col-span-1"
                    >
                        <div className="bg-white/80 dark:bg-black/80 backdrop-blur-md rounded-lg border border-gray-200/20 dark:border-white/10 p-6">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="p-3 bg-blue-600 rounded-full">
                                    <Power className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-medium text-gray-900 dark:text-white">
                                        Status
                                    </h2>
                                    <div className={`px-3 py-1 rounded-full text-sm font-medium inline-block mt-1
                                        ${robotData.status === 'Active'
                                        ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                                        : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                                    }`}>
                                        {robotData.status}
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <Battery className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                        <span className="text-gray-600 dark:text-gray-300">Battery Level</span>
                                    </div>
                                    <span className="font-medium text-gray-900 dark:text-white">{robotData.batteryLevel}%</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <Activity className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                        <span className="text-gray-600 dark:text-gray-300">Last Maintenance</span>
                                    </div>
                                    <span className="font-medium text-gray-900 dark:text-white">{robotData.lastMaintenance}</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* System Stats Card */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="lg:col-span-2"
                    >
                        <div className="bg-white/80 dark:bg-black/80 backdrop-blur-md rounded-lg border border-gray-200/20 dark:border-white/10 p-6">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="p-3 bg-blue-600 rounded-full">
                                    <Cpu className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-medium text-gray-900 dark:text-white">
                                        System Stats
                                    </h2>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                        <Cpu className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                                        <span className="text-gray-600 dark:text-gray-300">CPU Usage</span>
                                    </div>
                                    <p className="text-lg font-medium text-gray-900 dark:text-white">{robotData.cpuUsage}</p>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                        <WifiIcon className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                                        <span className="text-gray-600 dark:text-gray-300">Network</span>
                                    </div>
                                    <p className="text-lg font-medium text-gray-900 dark:text-white">{robotData.networkStrength}</p>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                        <Gauge className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                                        <span className="text-gray-600 dark:text-gray-300">Memory</span>
                                    </div>
                                    <p className="text-lg font-medium text-gray-900 dark:text-white">{robotData.memoryUsage}</p>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                        <Clock className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                                        <span className="text-gray-600 dark:text-gray-300">Uptime</span>
                                    </div>
                                    <p className="text-lg font-medium text-gray-900 dark:text-white">{robotData.uptime}</p>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                        <Settings className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                                        <span className="text-gray-600 dark:text-gray-300">Firmware</span>
                                    </div>
                                    <p className="text-lg font-medium text-gray-900 dark:text-white">{robotData.firmware}</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Action Buttons */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-6 flex gap-4"
                >
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-500 transition-colors flex items-center gap-2">
                        <Settings className="w-4 h-4" />
                        Configure
                    </button>
                    <button className="px-4 py-2 bg-gray-100 dark:bg-white/10 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-white/20 transition-colors flex items-center gap-2">
                        <AlertCircle className="w-4 h-4" />
                        Report Issue
                    </button>
                    <button className="px-4 py-2 bg-gray-100 dark:bg-white/10 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-white/20 transition-colors flex items-center gap-2">
                        <ToggleLeft className="w-4 h-4" />
                        Remote Control
                    </button>
                </motion.div>
            </div>
        </div>
    );
};

export default ManageRobot;