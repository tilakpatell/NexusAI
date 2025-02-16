from launch import LaunchDescription
from launch_ros.actions import Node

def generate_launch_description():
    return LaunchDescription([
        # Start SLAM node
        Node(
            package='slam_toolbox',
            executable='async_slam_toolbox_node',
            name='slam_toolbox',
            parameters=[{
                'use_sim_time': False,
                'max_laser_range': 20.0,
                'map_update_interval': 5.0
            }]
        ),
        
        # Start Navigation Stack
        Node(
            package='nav2_bringup',
            executable='navigation_launch.py',
            name='nav2_stack'
        ),
        
        # Start our threat detection node
        Node(
            package='rover_threat_detection',
            executable='threat_detector.py',
            name='threat_detection_node'
        ),
    ])
