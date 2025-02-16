// Home/index.jsx
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Play } from 'lucide-react';
import { BackgroundAnimation } from './BackgroundAnimation';
import { FloatingElement } from './FloatingElement';
import { RobotShowcaseSection } from './RobotShowcaseSection';
import { InteractiveDemo } from './InteractiveDemo';
import { Footer } from './Footer';
import { TestimonialsSection } from './TestimonialsSection';

export default function LandingPage() {
  const { scrollYProgress } = useScroll();
  const heroOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.3], [1, 0.95]);

  return (
    <div className="relative min-h-screen">
      <BackgroundAnimation />

      {/* Content Layer */}
      <div className="relative z-10">
        {/* Hero Section */}
        <motion.section 
          initial={{ opacity: 1, scale: 1 }}
          style={{ opacity: heroOpacity, scale: heroScale }}
          className="relative min-h-screen flex items-center justify-center py-20 mt-16"
        >
          <div className="container mx-auto px-4 text-center">
            <div className="inline-block p-12 rounded-2xl 
                        bg-gradient-to-b from-white/5 to-transparent dark:from-black/5 dark:to-transparent 
                        backdrop-blur-md border border-white/10 dark:border-white/5 
                        shadow-[0_8px_32px_0_rgba(31,38,135,0.2)]
                        dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.3)]
                        hover:shadow-[0_8px_32px_0_rgba(31,38,135,0.3)]
                        dark:hover:shadow-[0_8px_32px_0_rgba(0,0,0,0.4)]
                        transition-all duration-500">
              <FloatingElement>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="mb-8"
                >
                  <h1 className="text-7xl md:text-8xl font-light tracking-tight 
                             bg-clip-text text-transparent 
                             bg-gradient-to-r from-gray-800 to-gray-600 
                             dark:from-white dark:to-gray-400
                             drop-shadow-sm">
                    Nexus AI
                  </h1>
                  <p className="text-2xl text-gray-700 dark:text-gray-200 mt-4 
                               font-light tracking-wide">
                    Robotics & Automation
                  </p>
                </motion.div>
              </FloatingElement>
              
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="text-xl text-gray-600 dark:text-gray-300 mb-16 
                       max-w-2xl mx-auto font-light leading-relaxed
                       px-4"
              >
                Pioneering the convergence of artificial intelligence and industrial robotics 
                for next-generation automation
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="space-x-8"
              >
                <Link 
                  to="/products" 
                  className="inline-flex items-center gap-3 px-8 py-4 
                         bg-gradient-to-r from-blue-600 to-blue-700
                         hover:from-blue-700 hover:to-blue-800
                         rounded-lg text-white font-medium 
                         transition-all duration-300
                         shadow-lg hover:shadow-xl
                         transform hover:-translate-y-0.5"
                >
                  Discover Solutions
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  to="/demo"
                  className="inline-flex items-center gap-3 px-8 py-4 
                         bg-white/10 dark:bg-white/5
                         hover:bg-white/20 dark:hover:bg-white/10
                         backdrop-blur-sm rounded-lg 
                         text-gray-900 dark:text-white font-medium 
                         transition-all duration-300
                         shadow-lg hover:shadow-xl
                         transform hover:-translate-y-0.5
                         border border-white/10 dark:border-white/5"
                >
                  Watch Demo
                  <Play className="w-5 h-5" />
                </Link>
              </motion.div>
            </div>
          </div>
        </motion.section>

        {/* Main Content Sections */}
        <div className="relative">
          <div className="bg-white dark:bg-black">
            <RobotShowcaseSection />
            <InteractiveDemo />
            <TestimonialsSection />
            <Footer />
          </div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-40"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-6 h-10 rounded-full border-2 border-gray-600 dark:border-gray-400 
                      flex items-start justify-center p-1"
          >
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-2 h-2 rounded-full bg-gray-600 dark:bg-gray-400"
            />
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
