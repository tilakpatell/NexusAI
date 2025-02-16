import { useRef, useState, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { Camera, CameraOff, BarChart2, Settings, Play, Pause, Clock, AlertTriangle } from 'lucide-react';
import { useTheme } from './ThemeContext';
import ROSLIB from 'roslib';

export function InteractiveDemo({ robotIp }) {
  const ref = useRef();
  const isInView = useInView(ref, { margin: "-100px" });
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeControl, setActiveControl] = useState('camera1');
  const { isDark } = useTheme();
  const [cpuUsage, setCpuUsage] = useState(0);
  const [memoryUsage, setMemoryUsage] = useState(0);
  const [ros, setRos] = useState(null);
  const [connectionError, setConnectionError] = useState(null);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    if (!robotIp) {
      setConnectionError('Robot IP is not provided');
      return;
    }

    let rosInstance;
    try {
      rosInstance = new ROSLIB.Ros({
        url: `ws://${robotIp}:9090`,
        reconnection: true,
        autoConnect: true
      });

      rosInstance.on('connection', () => {
        console.log('Connected to ROS2');
        setConnectionError(null);
        setRos(rosInstance);

        // Set up topics after successful connection
        const cpuTopic = new ROSLIB.Topic({
          ros: rosInstance,
          name: '/cpu_usage',
          messageType: 'std_msgs/Float32'
        });

        const memoryTopic = new ROSLIB.Topic({
          ros: rosInstance,
          name: '/memory_usage',
          messageType: 'std_msgs/Float32'
        });

        cpuTopic.subscribe((message) => setCpuUsage(message.data));
        memoryTopic.subscribe((message) => setMemoryUsage(message.data));
      });

      rosInstance.on('error', (error) => {
        console.error('ROS2 connection error:', error);
        setConnectionError('Failed to connect to ROS');
        setRos(null);
      });

      rosInstance.on('close', () => {
        console.log('Disconnected from ROS2');
        setConnectionError('Connection closed');
        setRos(null);
      });

    } catch (error) {
      console.error('Error initializing ROS connection:', error);
      setConnectionError('Failed to initialize ROS connection');
    }

    return () => {
      if (rosInstance) {
        rosInstance.close();
      }
    };
  }, [robotIp]);

  const controls = [
    { id: 'camera1', label: 'Main View', icon: <Camera className="w-5 h-5" /> },
    { id: 'camera2', label: 'Side View', icon: <CameraOff className="w-5 h-5" /> },
    { id: 'stats', label: 'Performance', icon: <BarChart2 className="w-5 h-5" /> },
    { id: 'settings', label: 'Controls', icon: <Settings className="w-5 h-5" /> }
  ];

  return (
      <section ref={ref} className="relative py-32 bg-gray-50 dark:bg-black">
        <div className="container mx-auto px-4">
          <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              className="relative"
          >
            <div className="bg-white/80 dark:bg-black/80 rounded-lg p-8 shadow-xl">
              {/* Connection Error Display */}
              {connectionError && (
                  <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                    <div className="flex items-center gap-2 text-red-700 dark:text-red-400">
                      <AlertTriangle className="w-5 h-5" />
                      <span>{connectionError}</span>
                    </div>
                  </div>
              )}

              {/* Header */}
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-3xl font-light text-gray-900 dark:text-white">
                    Interactive Control Center
                  </h3>
                  <p className="text-gray-600 dark:text-white/80 mt-2">
                    Experience real-time robot control and monitoring
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <motion.div
                      animate={{ scale: isPlaying ? [1, 1.2, 1] : 1 }}
                      transition={{ duration: 2, repeat: isPlaying ? Infinity : 0 }}
                      className={`w-3 h-3 rounded-full ${isPlaying ? 'bg-blue-400' : 'bg-blue-500'}`}
                  />
                  <span className="text-sm text-gray-600 dark:text-white/80">
                  {isPlaying ? 'System Active' : 'System Idle'}
                </span>
                </div>
              </div>

              {/* Main Content */}
              <div className="grid grid-cols-4 gap-8">
                {/* Video Feed */}
                <div className="col-span-3">
                  <div className="relative aspect-video rounded-lg overflow-hidden group">
                    {!imageError ? (
                        <img
                            src={`http://${robotIp}:8080/stream?topic=/image_raw`}
                            alt="Live Camera Feed"
                            className="w-full h-auto rounded-lg shadow-lg"
                            onError={() => setImageError(true)}
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-gray-800">
                          <div className="text-center">
                            <CameraOff className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                            <p className="text-gray-500">Camera feed unavailable</p>
                          </div>
                        </div>
                    )}
                    <div className="absolute inset-0 bg-black/30" />

                    {/* Overlay Controls */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="absolute top-4 left-4 flex items-center gap-2 bg-black/80 px-3 py-1.5 rounded-full">
                        <div className="animate-pulse w-2 h-2 rounded-full bg-blue-500" />
                        <span className="text-sm text-white">REC</span>
                      </div>

                      <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setIsPlaying(!isPlaying)}
                            className="bg-blue-500 p-3 rounded-full hover:bg-blue-600 transition-colors"
                        >
                          {isPlaying ?
                              <Pause className="w-6 h-6 text-white" /> :
                              <Play className="w-6 h-6 text-white" />
                          }
                        </motion.button>

                        <div className="flex items-center gap-2 bg-black/80 px-4 py-2 rounded-full">
                          <Clock className="w-4 h-4 text-white" />
                          <span className="text-sm text-white">00:42:15</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Side Controls */}
                <div className="space-y-4">
                  {controls.map((control) => (
                      <motion.button
                          key={control.id}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setActiveControl(control.id)}
                          className={`w-full p-4 rounded-lg transition-all duration-300 flex items-center gap-3
                      ${activeControl === control.id ?
                              'bg-blue-500 text-white' :
                              'bg-gray-100 dark:bg-white/10 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-white/20'}`}
                      >
                        {control.icon}
                        <span>{control.label}</span>
                      </motion.button>
                  ))}

                  {/* Status Indicators */}
                  <div className="mt-8 space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600 dark:text-white/80">CPU Usage</span>
                      <span className="text-gray-900 dark:text-white">{cpuUsage}%</span>
                    </div>
                    <div className="h-1.5 bg-gray-200 dark:bg-white/10 rounded-full overflow-hidden">
                      <motion.div
                          initial={{ width: "0%" }}
                          animate={{ width: `${cpuUsage}%` }}
                          transition={{ duration: 1 }}
                          className="h-full bg-blue-500"
                      />
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600 dark:text-white/80">Memory</span>
                      <span className="text-gray-900 dark:text-white">{memoryUsage}%</span>
                    </div>
                    <div className="h-1.5 bg-gray-200 dark:bg-white/10 rounded-full overflow-hidden">
                      <motion.div
                          initial={{ width: "0%" }}
                          animate={{ width: `${memoryUsage}%` }}
                          transition={{ duration: 1 }}
                          className="h-full bg-blue-500"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
  );
}