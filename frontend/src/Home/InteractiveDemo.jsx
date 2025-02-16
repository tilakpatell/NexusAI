import { useRef, useState, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { Camera, CameraOff, Play, Pause, Clock, AlertTriangle } from 'lucide-react';

export function VideoStream() {
  const ref = useRef();
  const canvasRef = useRef(null);
  const wsRef = useRef(null);
  const isInView = useInView(ref, { margin: "-100px" });
  const [isPlaying, setIsPlaying] = useState(false);
  const [robotIp, setRobotIp] = useState('');
  const [port, setPort] = useState('8765');
  const [isConnected, setIsConnected] = useState(false);
  const [connectionError, setConnectionError] = useState(null);

  const connectToRobot = () => {
    if (!robotIp) {
      setConnectionError('Please enter a robot IP');
      return;
    }

    try {
      const ws = new WebSocket(`ws://${robotIp}:${port}`);
      wsRef.current = ws;

      ws.onopen = () => {
        console.log('Connected to robot');
        setIsConnected(true);
        setConnectionError(null);
      };

      ws.onmessage = (event) => {
        if (!isPlaying) return;

        // Handle different types of incoming data
        if (event.data instanceof Blob) {
          // If the server sends binary data (Blob)
          const imageUrl = URL.createObjectURL(event.data);
          const img = new Image();
          img.onload = () => {
            const canvas = canvasRef.current;
            if (!canvas) return;

            const ctx = canvas.getContext('2d');
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);
            URL.revokeObjectURL(imageUrl);
          };
          img.src = imageUrl;
        } else {
          // If the server sends base64 encoded data
          try {
            const img = new Image();
            img.onload = () => {
              const canvas = canvasRef.current;
              if (!canvas) return;

              const ctx = canvas.getContext('2d');
              canvas.width = img.width;
              canvas.height = img.height;
              ctx.drawImage(img, 0, 0);
            };
            img.src = event.data;
          } catch (error) {
            console.error('Error processing image data:', error);
          }
        }
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        setConnectionError('Failed to connect to robot');
        setIsConnected(false);
      };

      ws.onclose = () => {
        console.log('Disconnected from robot');
        setIsConnected(false);
        setConnectionError('Connection closed');
      };

    } catch (error) {
      console.error('Error connecting to robot:', error);
      setConnectionError('Failed to initialize connection');
      setIsConnected(false);
    }
  };

  useEffect(() => {
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, []);

  return (
      <section ref={ref} className="relative py-32 bg-gray-50 dark:bg-black">
        <div className="container mx-auto px-4">
          <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              className="relative"
          >
            <div className="bg-white/80 dark:bg-black/80 rounded-lg p-8 shadow-xl">
              {/* Connection Form */}
              <div className="mb-6">
                <div className="flex gap-4 items-end">
                  <div className="flex-1">
                    <label htmlFor="robotIp" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Robot IP Address
                    </label>
                    <input
                        type="text"
                        id="robotIp"
                        value={robotIp}
                        onChange={(e) => setRobotIp(e.target.value)}
                        placeholder="Enter robot IP (e.g., 192.168.1.100)"
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md
                             bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label htmlFor="port" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Port
                    </label>
                    <input
                        type="text"
                        id="port"
                        value={port}
                        onChange={(e) => setPort(e.target.value)}
                        placeholder="WebSocket port"
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md
                             bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    />
                  </div>
                  <button
                      onClick={connectToRobot}
                      disabled={isConnected}
                      className={`px-6 py-2 rounded-md ${
                          isConnected
                              ? 'bg-green-500 text-white cursor-not-allowed'
                              : 'bg-blue-500 hover:bg-blue-600 text-white'
                      }`}
                  >
                    {isConnected ? 'Connected' : 'Connect'}
                  </button>
                </div>
              </div>

              {connectionError && (
                  <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                    <div className="flex items-center gap-2 text-red-700 dark:text-red-400">
                      <AlertTriangle className="w-5 h-5" />
                      <span>{connectionError}</span>
                    </div>
                  </div>
              )}

              <div className="relative aspect-video rounded-lg overflow-hidden group">
                <canvas
                    ref={canvasRef}
                    className="w-full h-full object-cover rounded-lg"
                />

                <div className="absolute inset-0 bg-black/30" />

                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute top-4 left-4 flex items-center gap-2 bg-black/80 px-3 py-1.5 rounded-full">
                    <div className="animate-pulse w-2 h-2 rounded-full bg-blue-500" />
                    <span className="text-sm text-white">LIVE</span>
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
                      <span className="text-sm text-white">LIVE</span>
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

export default VideoStream;