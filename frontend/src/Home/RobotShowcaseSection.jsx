// Home/RobotShowcaseSection.jsx
import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Box, Factory, Settings } from 'lucide-react';
import { RobotCard } from './RobotCard';

export function RobotShowcaseSection() {
  const ref = useRef();
  const isInView = useInView(ref, { margin: "-100px" });

  const robots = [
    {
      name: "Atlas Pro",
      type: "Industrial Robot",
      description: "Heavy-duty manufacturing and assembly robot with precise control",
      video: "/videos/atlas-pro.mp4",
      icon: <Box className="w-6 h-6" />,
      specs: ["Payload: 500kg", "Precision: 0.1mm", "Reach: 2.5m"]
    },
    {
      name: "Nexus Scout",
      type: "Autonomous Mobile Robot",
      description: "Intelligent navigation and mapping for warehouse operations",
      video: "/videos/nexus-scout.mp4",
      icon: <Factory className="w-6 h-6" />,
      specs: ["Speed: 2m/s", "Battery: 12h", "Payload: 200kg"]
    },
    {
      name: "Quantum Series",
      type: "Collaborative Robot",
      description: "Advanced human-robot collaboration with AI-powered safety",
      video: "/videos/quantum-series.mp4",
      icon: <Settings className="w-6 h-6" />,
      specs: ["Safety Rated", "Force Sensing", "Easy Programming"]
    }
  ];

  return (
    <section ref={ref} className="relative py-32 bg-white dark:bg-black">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-light mb-6 text-gray-900 dark:text-white">
            Our Robotic Solutions
          </h2>
          <p className="text-xl text-gray-600 dark:text-white/80 max-w-2xl mx-auto font-light">
            Cutting-edge robotics technology designed for the future of automation
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {robots.map((robot, index) => (
            <RobotCard 
              key={robot.name} 
              robot={robot} 
              index={index} 
              isInView={isInView}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
