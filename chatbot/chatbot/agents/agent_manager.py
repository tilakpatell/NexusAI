import speech_recognition as sr
import pygame
import time
from config.bot_config import BotType
from .user_agent import UserAgent
from .api_agent import APIAgent

class AgentManager:
    def __init__(self, bot_type: BotType):
        self.user_agent = UserAgent(bot_type)
        self.api_agent = APIAgent(bot_type)
        self.wake_word = "sage"
        self.is_active = False
        self.bot_type = bot_type

    def listen_for_wake_word(self) -> bool:
        with sr.Microphone() as source:
            print("\nListening for wake word 'Sage'...")
            self.user_agent.recognizer.adjust_for_ambient_noise(source)
            try:
                audio = self.user_agent.recognizer.listen(source, timeout=1, phrase_time_limit=3)
                with open("temp_audio.wav", "wb") as f:
                    f.write(audio.get_wav_data())
                
                with open("temp_audio.wav", "rb") as audio_file:
                    transcript = self.user_agent.client.audio.transcriptions.create(
                        model="whisper-1",
                        file=audio_file
                    )
                text = transcript.text.lower()
                print(f"Heard: {text}")
                
                # Just look for "sage" anywhere in the text
                return "sage" in text.lower()
                
            except sr.WaitTimeoutError:
                return False
            except Exception as e:
                print(f"Error: {e}")
                return False

    def handle_message(self, text: str) -> str:
        try:
            print("Processing request...")
            user_response = self.user_agent.get_response(text)
            print(f"User Agent response: {user_response}")
            
            if "NEEDS_API" in user_response:
                print("Making API call...")
                api_response = self.api_agent.get_response(user_response)
                print(f"API response: {api_response}")
                final_response = self.user_agent.get_response(
                    f"Convert this API response to natural language: {api_response}"
                )
                return final_response
            
            return user_response
            
        except Exception as e:
            print(f"Error in handling message: {e}")
            import traceback
            print(traceback.format_exc())
            return "I'm having trouble processing that request. Could you try again?"

    def process_conversation(self):
        if not self.is_active:
            if self.listen_for_wake_word():
                print("\n🎵 Ready to help!")
                chime_response = "I'm listening, how can I help you?"
                self.user_agent.text_to_speech(chime_response)
                self.is_active = True
            return

        text = self.user_agent.listen_command()
        if text and text.strip():
            # Check for exit commands
            if any(word in text.lower() for word in ["goodbye", "bye", "that's all", "thats all", "thank you", "thanks"]):
                self.is_active = False
                farewell = "Goodbye! Say 'Hey Sage' when you need me again."
                print(f"\nFinal response: {farewell}")
                self.user_agent.text_to_speech(farewell)
                return

            print("\nProcessing your request...")
            response = self.handle_message(text)

            if response:
                print(f"\nFinal response: {response}")
                self.user_agent.text_to_speech(response)

                # If the response is a question (asking for more details)
                if any(q in response.lower() for q in ["can you", "could you", "what", "when", "where", "who", "how", "please provide", "tell me"]):
                    # Add a small delay before listening for the follow-up
                    time.sleep(1)
                    print("\nWaiting for your response...")
                    follow_up = self.user_agent.listen_command()

                    if follow_up and follow_up.strip():
                        print("\nProcessing follow-up...")
                        follow_up_response = self.handle_message(follow_up)
                        if follow_up_response:
                            print(f"\nFinal response: {follow_up_response}")
                            self.user_agent.text_to_speech(follow_up_response)

                # Check for exit command after response
                time.sleep(0.5)
                final_text = self.user_agent.listen_command()
                if final_text and any(word in final_text.lower() for word in ["goodbye", "bye", "that's all", "thats all", "thank you", "thanks"]):
                    self.is_active = False
                    farewell = "Goodbye! Say 'Hey Sage' when you need me again."
                    print(f"\nFinal response: {farewell}")
                    self.user_agent.text_to_speech(farewell)
            else:
                print("No response received")
        else:
            print("No valid input detected. Please try again.")
            if not self.is_active:
                if self.listen_for_wake_word():
                    print("\n🎵 Ready to help!")
                    chime_response = "I'm listening, how can I help you?"
                    self.user_agent.text_to_speech(chime_response)
                    self.is_active = True
                return

            text = self.user_agent.listen_command()
            if text and text.strip():
                if any(word in text.lower() for word in ["goodbye", "bye", "that's all", "thats all", "thank you", "thanks"]):
                    self.is_active = False
                    farewell = "Goodbye! Say 'Hey Sage' when you need me again."
                    print(f"\nFinal response: {farewell}")
                    self.user_agent.text_to_speech(farewell)
                    return

                print("\nProcessing your request...")
                response = self.handle_message(text)
                if response:
                    print(f"\nFinal response: {response}")
                    self.user_agent.text_to_speech(response)

                    text = self.user_agent.listen_command()
                    if text and any(word in text.lower() for word in ["goodbye", "bye", "that's all", "thats all", "thank you", "thanks"]):
                        self.is_active = False
                        farewell = "Goodbye! Say 'Hey Sage' when you need me again."
                        print(f"\nFinal response: {farewell}")
                        self.user_agent.text_to_speech(farewell)
                    time.sleep(0.5)
                else:
                    print("No response received")
            else:
                print("No valid input detected. Please try again.")