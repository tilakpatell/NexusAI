import 'react';
import {
    Box,
    Star,
    Battery,
    Cpu,
    Shield,
    Weight,
    X,
    Zap,
    Brain,
    Network,
    Eye,
    Workflow
} from 'lucide-react';

export default function GetProduct() {
    const products = [
        {
            category: "Hardware",
            items: [
                {
                    id: "atlas-pro",
                    icon: <Box className="w-12 h-12" />,
                    name: "Atlas Pro",
                    tagline: "Advanced Autonomous Industrial Robot",
                    description: "The Atlas Pro represents the pinnacle of industrial automation, combining advanced AI capabilities with precise mechanical control. Designed for complex manufacturing and warehouse operations, it delivers unprecedented efficiency and adaptability.",
                    price: "$75,000",
                    specs: [
                        { icon: <Weight className="w-5 h-5" />, label: "Payload", value: "20kg maximum capacity" },
                        { icon: <Battery className="w-5 h-5" />, label: "Battery Life", value: "12 hours continuous operation" },
                        { icon: <Cpu className="w-5 h-5" />, label: "Processor", value: "Neural Engine X12" },
                        { icon: <Shield className="w-5 h-5" />, label: "Safety", value: "ISO 13482 Certified" }
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
                },
                {
                    id: "sentinel-x",
                    icon: <Shield className="w-12 h-12" />,
                    name: "Sentinel X",
                    tagline: "Intelligent Security Robot",
                    description: "The Sentinel X combines advanced surveillance capabilities with autonomous patrol functions. Perfect for securing large facilities and monitoring critical infrastructure with 24/7 reliability.",
                    price: "$65,000",
                    specs: [
                        { icon: <Eye className="w-5 h-5" />, label: "Vision", value: "360° 4K cameras" },
                        { icon: <Battery className="w-5 h-5" />, label: "Battery Life", value: "16 hours patrol" },
                        { icon: <Brain className="w-5 h-5" />, label: "AI Core", value: "Security Neural Net" },
                        { icon: <Network className="w-5 h-5" />, label: "Range", value: "2km operational" }
                    ],
                    features: [
                        {
                            title: "Autonomous Patrol",
                            description: "AI-driven patrol routes with dynamic adjustment"
                        },
                        {
                            title: "Threat Detection",
                            description: "Real-time analysis of potential security threats"
                        },
                        {
                            title: "Environmental Monitoring",
                            description: "Sensors for temperature, air quality, and hazards"
                        },
                        {
                            title: "Emergency Response",
                            description: "Integrated alert system with command center link"
                        }
                    ]
                }
            ]
        },
        {
            category: "Software",
            items: [
                {
                    id: "neural-os",
                    icon: <Workflow className="w-12 h-12" />,
                    name: "Neural OS",
                    tagline: "Enterprise Automation System",
                    description: "Enterprise automation operating system with advanced AI",
                    price: "$2,500/mo",
                    specs: [
                        { icon: <Cpu className="w-5 h-5" />, label: "Processing", value: "Real-time AI" },
                        { icon: <Network className="w-5 h-5" />, label: "Integration", value: "Universal API" },
                        { icon: <Shield className="w-5 h-5" />, label: "Security", value: "Enterprise-grade" },
                        { icon: <Zap className="w-5 h-5" />, label: "Performance", value: "High throughput" }
                    ],
                    features: [
                        {
                            title: "Real-time Processing",
                            description: "Advanced real-time data processing and analysis"
                        },
                        {
                            title: "Multi-unit Control",
                            description: "Centralized control for multiple robot units"
                        },
                        {
                            title: "Cloud Integration",
                            description: "Seamless cloud connectivity and data sync"
                        },
                        {
                            title: "24/7 Support",
                            description: "Round-the-clock technical assistance"
                        }
                    ]
                },
                {
                    id: "securebot-guard",
                    icon: <Shield className="w-12 h-12" />,
                    name: "SecureBot Guard",
                    tagline: "Advanced Security Suite",
                    description: "Security and threat detection software suite",
                    price: "$1,800/mo",
                    specs: [
                        { icon: <Eye className="w-5 h-5" />, label: "Detection", value: "AI-powered" },
                        { icon: <Brain className="w-5 h-5" />, label: "Learning", value: "Adaptive" },
                        { icon: <Network className="w-5 h-5" />, label: "Coverage", value: "Full perimeter" },
                        { icon: <Shield className="w-5 h-5" />, label: "Response", value: "Automated" }
                    ],
                    features: [
                        {
                            title: "Threat Detection",
                            description: "Advanced AI-driven threat recognition"
                        },
                        {
                            title: "Perimeter Control",
                            description: "Comprehensive facility security management"
                        },
                        {
                            title: "Incident Response",
                            description: "Automated security incident handling"
                        },
                        {
                            title: "Access Management",
                            description: "Sophisticated access control system"
                        }
                    ]
                }
            ]
        }
    ];

    return products;
}