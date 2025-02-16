from dotenv import load_dotenv
import os
from typing import Optional
import speech_recognition as sr
from openai import OpenAI
from pathlib import Path
import pygame
import time
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_core.messages import HumanMessage, AIMessage

load_dotenv("/Users/tilakpatel/Desktop/horizonai/horizonai/chatbot/secret.env")
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

class UserAgent():
    def __init__(self):
        # Initialize LangChain
        self.llm = ChatOpenAI(
            model_name="gpt-4o-mini",
            openai_api_key=OPENAI_API_KEY,
            temperature=0.7
        )
        
        # Create prompt
        self.prompt = ChatPromptTemplate.from_messages([
            ("system", """You are a helpful store assistant that processes user requests. 
            Include NEEDS_API in your response for requests that require store information, such as:
            - Product information (price, aisle, availability)
            - Customer service requests (calling manager or employee)
            
            Format for API requests:
            NEEDS_API
            TYPE: [product/customer]
            QUERY: [specific request details]
            
            Examples:
            - "Where can I find apples?"
            NEEDS_API
            TYPE: product
            QUERY: findProductAisle?productToFind=apple
            
            - "Is milk in stock?"
            NEEDS_API
            TYPE: product
            QUERY: findProductInStock?productToFind=milk
            
            - "How much are eggs?"
            NEEDS_API
            TYPE: product
            QUERY: findProductPrice?productToFind=eggs
            
            - "I need to speak with a manager"
            NEEDS_API
            TYPE: customer
            QUERY: manager
            
            For general inquiries or greetings, respond naturally without API calls.
            """),
            MessagesPlaceholder(variable_name="chat_history"),
            ("human", "{input}")
        ])
        
        # Initialize chat history
        self.chat_history = []
        
        # OpenAI client for speech
        self.client = OpenAI(api_key=OPENAI_API_KEY)
        self.recognizer = sr.Recognizer()
        
        if pygame.get_init():
            pygame.quit()
        pygame.init()
        pygame.mixer.init(frequency=44100, size=-16, channels=2, buffer=4096)

    def get_response(self, text: str) -> str:
        chain = self.prompt | self.llm
        response = chain.invoke({
            "chat_history": self.chat_history,
            "input": text
        })
        
        self.chat_history.extend([
            HumanMessage(content=text),
            AIMessage(content=response.content)
        ])
        
        return response.content

    def listen_command(self) -> str:
        with sr.Microphone() as source:
            print("\nListening...")
            self.recognizer.adjust_for_ambient_noise(source)
            audio = self.recognizer.listen(source)
            
            try:
                with open("temp_audio.wav", "wb") as f:
                    f.write(audio.get_wav_data())
                
                with open("temp_audio.wav", "rb") as audio_file:
                    transcript = self.client.audio.transcriptions.create(
                        model="whisper-1",
                        file=audio_file
                    )
                text = transcript.text
                print(f"You said: {text}")
                return text
            except Exception as e:
                print(f"Error occurred: {e}")
                return ""

    def text_to_speech(self, text: str) -> None:
        try:
            speech_file_path = Path("speech.mp3")
            response = self.client.audio.speech.create(
                model="tts-1",
                voice="alloy",
                input=text
            )
            
            with open(speech_file_path, 'wb') as file:
                file.write(response.content)
            
            pygame.mixer.quit()
            pygame.mixer.init(frequency=44100, size=-16, channels=2, buffer=4096)
            
            pygame.mixer.music.load(speech_file_path)
            pygame.mixer.music.play()
            
            while pygame.mixer.music.get_busy():
                pygame.time.Clock().tick(10)
                
        except Exception as e:
            print(f"TTS Error: {e}")

class APIAgent():
    def __init__(self):
        self.llm = ChatOpenAI(
            model_name="gpt-4o-mini",
            openai_api_key=OPENAI_API_KEY,
            temperature=0.3
        )
        
        self.prompt = ChatPromptTemplate.from_messages([
            ("system", """You are an API handler. Based on the request type, simulate appropriate API responses for a store system.
            
            For product queries:
            CALLING_API: /product/findProduct?productToFind=[product]
            RESPONSE: {{"name": "[product name]"}}
            
            CALLING_API: /product/findProductPrice?productToFind=[product]
            RESPONSE: {{"price": [price]}}
            
            CALLING_API: /product/findProductAisle?productToFind=[product]
            RESPONSE: {{"aisle": [aisle number]}}
            
            CALLING_API: /product/findProductInStock?productToFind=[product]
            RESPONSE: {{"inStock": [true/false]}}
            
            For customer service:
            CALLING_API: /customer/manager
            RESPONSE: {{"message": "The manager has been called and will be with you shortly"}}
            
            CALLING_API: /customer/employee
            RESPONSE: {{"message": "The nearest employee has been called to assist you"}}
            
            Extract the relevant information from the user query and format the appropriate API call and response.
            """),
            ("human", "{query}")
        ])

    def get_response(self, text: str) -> str:
        chain = self.prompt | self.llm
        response = chain.invoke({"query": text})
        return response.content

class AgentManager:
    def __init__(self):
        self.user_agent = UserAgent()
        self.api_agent = APIAgent()
        self.wake_word = "sage"
        self.is_active = False

    def listen_for_wake_word(self) -> bool:
        with sr.Microphone() as source:
            print("\nListening for wake word 'Hey Sage'...")
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
                return "hey sage" in text or "hey sade" in text
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
  
      # Continue conversation once active
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
              
              # After response, check if user wants to end conversation
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

def main():
    os.environ['PYGAME_HIDE_SUPPORT_PROMPT'] = "hide"
    os.system('clear' if os.name == 'posix' else 'cls')
    
    print("🎤 Store Assistant Started")
    print("\nYou can try commands like:")
    print("• Where can I find apples?")
    print("• How much do eggs cost?")
    print("• Is milk in stock?")
    print("• I need to speak with a manager")
    print("\n" + "="*50 + "\n")
    
    manager = AgentManager()
    
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
