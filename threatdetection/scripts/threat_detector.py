# threat_detection/scripts/threat_detector.py
import rclpy
from rclpy.node import Node
from sensor_msgs.msg import Image, LaserScan
from geometry_msgs.msg import Twist
from cv_bridge import CvBridge
import tensorflow as tf
import numpy as np
import cv2

class ThreatDetectionNode(Node):
    def __init__(self):
        super().__init__('threat_detection_node')
        
        # Initialize CV bridge
        self.bridge = CvBridge()
        
        # Load and optimize model for Jetson
        self.model = self.load_optimized_model()
        
        # Subscribe to camera feed
        self.camera_sub = self.create_subscription(
            Image,
            '/camera/image_raw',
            self.camera_callback,
            10
        )
        
        # Subscribe to LIDAR data
        self.lidar_sub = self.create_subscription(
            LaserScan,
            '/scan',
            self.lidar_callback,
            10
        )
        
        # Publisher for robot movement
        self.cmd_vel_pub = self.create_publisher(
            Twist,
            '/cmd_vel',
            10
        )
        
        # State variables
        self.current_image = None
        self.obstacle_detected = False
        self.threat_detected = False
        
        # Create timer for main loop
        self.create_timer(0.1, self.control_loop)  # 10Hz

    def load_optimized_model(self):
        # Load your Keras model
        model = tf.keras.models.load_model('path_to_your_model.h5')
        
        # Convert to TensorRT for Jetson optimization
        converter = tf.experimental.tensorrt.Converter(
            input_saved_model_dir="path_to_your_model",
            precision_mode="FP16"  # Use FP16 for better performance
        )
        converter.convert()
        converter.save("optimized_model")
        
        return tf.saved_model.load("optimized_model")

    def camera_callback(self, msg):
        try:
            self.current_image = self.bridge.imgmsg_to_cv2(msg, "bgr8")
            self.process_image()
        except Exception as e:
            self.get_logger().error(f'Error processing image: {str(e)}')

    def process_image(self):
        if self.current_image is None:
            return
            
        # Preprocess image for model
        processed_image = cv2.resize(self.current_image, (224, 224))  # adjust size to your model's input
        processed_image = processed_image / 255.0  # normalize
        processed_image = np.expand_dims(processed_image, axis=0)
        
        # Run inference
        predictions = self.model(processed_image)
        
        # Update threat detection status
        self.threat_detected = predictions[0] > 0.5  # adjust threshold as needed
        
        if self.threat_detected:
            self.get_logger().info('Threat detected!')

    def lidar_callback(self, msg):
        # Process LIDAR data for obstacle detection
        # Using a simple approach - check if any reading is too close
        min_distance = min(msg.ranges)
        self.obstacle_detected = min_distance < 0.5  # 50cm threshold

    def control_loop(self):
        # Create Twist message for robot movement
        cmd_vel = Twist()
        
        if self.obstacle_detected:
            # Stop and turn if obstacle detected
            cmd_vel.linear.x = 0.0
            cmd_vel.angular.z = 0.5  # Turn right
        elif self.threat_detected:
            # Stop if threat detected
            cmd_vel.linear.x = 0.0
            cmd_vel.angular.z = 0.0
        else:
            # Move forward if path is clear
            cmd_vel.linear.x = 0.2
            cmd_vel.angular.z = 0.0
        
        # Publish movement command
        self.cmd_vel_pub.publish(cmd_vel)

def main(args=None):
    rclpy.init(args=args)
    node = ThreatDetectionNode()
    rclpy.spin(node)
    node.destroy_node()
    rclpy.shutdown()

if __name__ == '__main__':
    main()
