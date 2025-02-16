// Home/FloatingElement.jsx
import { motion } from 'framer-motion';

export function FloatingElement({ children, delay = 0 }) {
  return (
    <motion.div
      animate={{ 
        y: [0, -8, 0]
      }}
      transition={{
        duration: 3,
        delay,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    >
      {children}
    </motion.div>
  );
}
