from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from config.bot_config import BotType, OPENAI_API_KEY, STORE_API_PROMPT, THREAT_API_PROMPT

class APIAgent():
    def __init__(self, bot_type: BotType):
        self.llm = ChatOpenAI(
            model_name="gpt-4o-mini",
            openai_api_key=OPENAI_API_KEY,
            temperature=0.3
        )
        
        system_prompt = STORE_API_PROMPT if bot_type == BotType.STORE else THREAT_API_PROMPT
        
        self.prompt = ChatPromptTemplate.from_messages([
            ("system", system_prompt),
            ("human", "{query}")
        ])

    def get_response(self, text: str) -> str:
        chain = self.prompt | self.llm
        response = chain.invoke({"query": text})
        return response.content