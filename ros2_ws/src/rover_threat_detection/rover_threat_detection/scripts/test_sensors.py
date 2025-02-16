import rclpy
from rclpy.node import Node
from sensor_msgs.msg import Image, LaserScan
from cv_bridge import CvBridge
import cv2

class SensorTestNode(Node):
    def __init__(self):
        super().__init__('sensor_test')
        
        # For camera
        self.bridge = CvBridge()
        self.camera_sub = self.create_subscription(
            Image,
            '/camera/image_raw',  # This might be different for your camera
            self.camera_callback,
            10)
            
        # For LIDAR
        self.lidar_sub = self.create_subscription(
            LaserScan,
            '/scan',  # This might be different for your LIDAR
            self.lidar_callback,
            10)
    
    def camera_callback(self, msg):
        try:
            # Convert ROS image to OpenCV format
            cv_image = self.bridge.imgmsg_to_cv2(msg, "bgr8")
            # Display the image
            cv2.imshow("Camera Test", cv_image)
            cv2.waitKey(1)
            self.get_logger().info('Camera working!')
        except Exception as e:
            self.get_logger().error(f'Camera error: {str(e)}')
    
    def lidar_callback(self, msg):
        # Print the closest obstacle distance
        min_distance = min(msg.ranges)
        self.get_logger().info(f'Closest obstacle: {min_distance} meters')

def main():
    rclpy.init()
    node = SensorTestNode()
    rclpy.spin(node)
    node.destroy_node()
    rclpy.shutdown()

if __name__ == '__main__':
    main()
