// Home/LoadingSpinner.jsx
import { motion } from 'framer-motion';

export function LoadingSpinner() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-black">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ 
          duration: 1.5, 
          repeat: Infinity, 
          ease: "linear" 
        }}
        className="w-12 h-12 border-2 border-gray-900 dark:border-white border-t-transparent rounded-full"
      />
      <motion.p
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="mt-4 text-gray-900 dark:text-white font-light"
      >
        Loading
      </motion.p>
    </div>
  );
}
