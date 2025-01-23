from openai import OpenAI
from dotenv import load_dotenv
import os

load_dotenv()

client = OpenAI(
  api_key=os.getenv("OPEN_AI_KEY")
)

def open_ai_model(prompt: str) -> str:
    completion = client.chat.completions.create(
        model="gpt-4o-mini",
        store=True,
        messages=[
            {"role": "user", "content": f"{prompt}"}
        ]
    )
    
    return completion.choices[0].message.content
