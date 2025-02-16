import { motion } from 'framer-motion';
import { ArrowRight, Cpu } from 'lucide-react';
import {Link} from "react-router-dom";

export function RobotCard({ robot, index, isInView, img }) {
  return (
      <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ delay: index * 0.2 }}
          className="group relative w-full"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
      >
        <div className="relative bg-white/90 dark:bg-black/80 rounded-lg overflow-hidden w-full">
          <div className="relative min-h-56 w-full">
            <img
                src={img}
                alt={robot.name}
                className="w-full h-80 object-cover object-center transform group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-black/50" />
          </div>

          <div className="p-6 relative">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-2 rounded-lg bg-gray-100 dark:bg-white/10 text-gray-900 dark:text-white">
                {robot.icon}
              </div>
              <div>
                <h3 className="text-xl font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {robot.name}
                </h3>
                <p className="text-sm text-gray-600 dark:text-white/80">{robot.type}</p>
              </div>
            </div>

            <p className="text-gray-700 dark:text-white/90 mb-4 line-clamp-2">
              {robot.description}
            </p>

            <div className="space-y-2">
              {robot.specs.map((spec, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm text-gray-600 dark:text-white/70">
                    <Cpu className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    <span>{spec}</span>
                  </div>
              ))}
            </div>

            <Link to="/products">
              <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="mt-6 w-full py-3 px-4 bg-blue-500 rounded-lg flex items-center justify-center gap-2 text-white font-medium group hover:bg-blue-600 transition-colors"
              >
                Learn More
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </motion.button>
            </Link>
          </div>
        </div>
      </motion.div>
  );
}