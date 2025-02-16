import {useUser} from "../../GlobalVariables/UserContext.jsx";
import {useParams} from "react-router-dom";
import {useTheme} from "../ThemeContext.jsx";
import {ThemeToggle} from "../ThemeToggle.jsx";
import {motion} from "framer-motion";

export const ManageRobot = () => {
    const { robotId } = useParams();
    const { isDark } = useTheme();
    const { currentUser } = useUser();

    const robotData = currentUser?.purchased?.find(robot => robot.id === robotId) || {
        id: robotId,
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
            },
            {
                title: "Software",
                description: "Store Bot"
            }
        ]
    };

    return (
        <div className={`min-h-screen overflow-hidden pt-16 ${
            isDark ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'
        }`}>
            <ThemeToggle />
            <div className="relative z-10 container mx-auto px-4 py-12">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-12"
                >
                    <h1 className="text-4xl font-light mb-6 text-gray-900 dark:text-white">
                        {robotData.name}
                    </h1>
                    <p className="text-gray-600 dark:text-gray-300">
                        {robotData.description}
                    </p>
                </motion.div>

                {robotData.features.find(f => f.title === "Software")?.description ?  <div className="mb-8">
                    <div className="bg-white/80 dark:bg-black/80 backdrop-blur-md rounded-lg border border-gray-200/20 dark:border-white/10 p-6">
                        <h2 className="text-2xl font-light mb-4 text-gray-900 dark:text-white">Installed Software</h2>
                         <p className="text-gray-600 dark:text-gray-300">
                        {robotData.features.find(f => f.title === "Software")?.description}
                        </p>
                    </div>
                </div> : null}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    {robotData.specs.map((spec, index) => (
                        <div key={index} className="bg-white/80 dark:bg-black/80 backdrop-blur-md rounded-lg border border-gray-200/20 dark:border-white/10 p-6">
                            <h3 className="font-medium text-gray-900 dark:text-white mb-2">{spec.label}</h3>
                            <p className="text-gray-600 dark:text-gray-300">{spec.value}</p>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {robotData.features.map((feature, index) => (
                        feature.title !== "Software" && (
                            <div key={index} className="bg-white/80 dark:bg-black/80 backdrop-blur-md rounded-lg border border-gray-200/20 dark:border-white/10 p-6">
                                <h3 className="font-medium text-gray-900 dark:text-white mb-2">{feature.title}</h3>
                                <p className="text-gray-600 dark:text-gray-300">{feature.description}</p>
                            </div>
                        )
                    ))}
                </div>
            </div>
        </div>
    );
};