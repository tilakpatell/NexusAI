import speech_recognition as sr
from openai import OpenAI
from pathlib import Path
import pygame
import time
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_core.messages import HumanMessage, AIMessage
from config.bot_config import BotType, OPENAI_API_KEY, STORE_SYSTEM_PROMPT, THREAT_SYSTEM_PROMPT

class UserAgent():
    def __init__(self, bot_type: BotType):
        self.llm = ChatOpenAI(
            model_name="gpt-4o-mini",
            openai_api_key=OPENAI_API_KEY,
            temperature=0.7
        )
        
        system_prompt = STORE_SYSTEM_PROMPT if bot_type == BotType.STORE else THREAT_SYSTEM_PROMPT
        
        self.prompt = ChatPromptTemplate.from_messages([
            ("system", system_prompt),
            MessagesPlaceholder(variable_name="chat_history"),
            ("human", "{input}")
        ])
        
        self.chat_history = []
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
            self.recognizer.adjust_for_ambient_noise(source, duration=0.5)
            try:
                audio = self.recognizer.listen(source, timeout=5, phrase_time_limit=10)
                
                with open("temp_audio.wav", "wb") as f:
                    f.write(audio.get_wav_data())
                
                with open("temp_audio.wav", "rb") as audio_file:
                    transcript = self.client.audio.transcriptions.create(
                        model="whisper-1",
                        file=audio_file
                    )
                text = transcript.text
                if text and text.strip():
                    print(f"You said: {text}")
                    return text
                return ""
            except sr.WaitTimeoutError:
                print("No speech detected")
                return ""
            except sr.RequestError:
                print("Could not request results")
                return ""
            except Exception as e:
                print(f"Error occurred: {e}")
                return ""

    def text_to_speech(self, text: str) -> None:
        try:
            speech_file_path = Path("speech.mp3")
            
            pygame.mixer.music.unload()
            pygame.mixer.quit()
            pygame.mixer.init(frequency=44100, size=-16, channels=2, buffer=4096)
            
            if speech_file_path.exists():
                try:
                    speech_file_path.unlink()
                except Exception as e:
                    print(f"Could not remove existing file: {e}")
                    speech_file_path = Path(f"speech_{time.time()}.mp3")
            
            response = self.client.audio.speech.create(
                model="tts-1",
                voice="alloy",
                input=text
            )
            
            with open(speech_file_path, 'wb') as file:
                file.write(response.content)
            
            pygame.mixer.music.load(speech_file_path)
            pygame.mixer.music.play()
            
            while pygame.mixer.music.get_busy():
                pygame.time.Clock().tick(10)
                
            pygame.mixer.music.unload()
            
            try:
                speech_file_path.unlink()
            except Exception as e:
                print(f"Could not remove speech file after playing: {e}")
                
        except Exception as e:
            print(f"TTS Error: {e}")