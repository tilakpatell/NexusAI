from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from config.bot_config import BotType, OPENAI_API_KEY, STORE_API_PROMPT, THREAT_API_PROMPT
import requests  # Add this import

class APIAgent():
    def __init__(self, bot_type: BotType):
        self.llm = ChatOpenAI(
            model_name="gpt-4o-mini",
            openai_api_key=OPENAI_API_KEY,
            temperature=0.3
        )
        
        self.base_url = "http://10.110.120.47:8080"  # Add this line with your Mac's IP
        system_prompt = STORE_API_PROMPT if bot_type == BotType.STORE else THREAT_API_PROMPT
        
        self.prompt = ChatPromptTemplate.from_messages([
            ("system", system_prompt),
            ("human", "{query}")
        ])

    def get_response(self, text: str) -> str:
        # First try to make API call if needed
        try:
            if "NEEDS_API" in text:
                response = requests.get(f"{self.base_url}{text.split('QUERY: ')[1]}")
                return response.text
        except:
            pass
            
        # If no API call or API fails, use original LLM response
        chain = self.prompt | self.llm
        response = chain.invoke({"query": text})
        return response.content
