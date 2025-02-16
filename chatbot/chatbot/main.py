import os
import time
import pygame
import argparse
from config.bot_config import BotType
from agents.agent_manager import AgentManager

def parse_arguments():
    parser = argparse.ArgumentParser(description='Store Assistant or Threat Detection Bot')
    parser.add_argument(
        '--type',
        type=str,
        choices=['store', 'threat'],
        help='Type of bot to run (store or threat)'
    )
    return parser.parse_args()

def display_usage_examples(bot_type):
    if bot_type == BotType.STORE:
        print("\n🏪 Store Assistant Started")
        print("\nYou can try commands like:")
        print("• Where can I find apples?")
        print("• How much do eggs cost?")
        print("• Is milk in stock?")
        print("• I need to speak with a manager")
    else:
        print("\n🚨 Threat Detection Started")
        print("\nYou can try commands like:")
        print("• There's a suspicious person")
        print("• Emergency situation")
        print("• Need to clear the area")

def main():
    os.environ['PYGAME_HIDE_SUPPORT_PROMPT'] = "hide"
    os.system('clear' if os.name == 'posix' else 'cls')
    
    args = parse_arguments()
    
    if args.type == 'store':
        bot_type = BotType.STORE
    else:
        bot_type = BotType.THREAT
    
    display_usage_examples(bot_type)
    print("\n" + "="*50 + "\n")
    
    manager = AgentManager(bot_type)
    
    while True:
        try:
            manager.process_conversation()
        except KeyboardInterrupt:
            print("\nStopping application...")
            pygame.mixer.quit()
            pygame.quit()
            break
        except Exception as e:
            print(f"Error occurred: {e}")
            time.sleep(1)

if __name__ == '__main__':
    main()