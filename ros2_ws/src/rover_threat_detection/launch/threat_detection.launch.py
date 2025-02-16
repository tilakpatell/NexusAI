from launch import LaunchDescription
from launch_ros.actions import Node

def generate_launch_description():
    return LaunchDescription([
        Node(
            package='v4l2_camera',
            executable='v4l2_camera_node',
            name='camera',
            parameters=[
                {'video_device': '/dev/video0'},
                {'pixel_format': 'YUYV'},
                {'image_size': [256, 256]},  # Keep this larger for good camera input
                {'output_encoding': 'bgr8'},
                {'frame_rate': 8.0},
                {'io_method': 'mmap'},
                {'buffer_size': 8},
            ]
        ),
        Node(
            package='rover_threat_detection',
            executable='threat_detection_node',
            parameters=[
                {'debug_preprocessing': False},
                {'confidence_threshold': 0.75},
                {'save_debug_frames': False},
                {'image_size': [32, 32]},  # Changed from 64x64 to 32x32
                {'sequence_length': 4},
                {'model_path': '/home/jetson/threat_detection_project/best_model.keras'},
                {'gpu_memory_limit': 1024},
                {'enable_memory_growth': True}
            ],
            output='screen'
        )
    ])
