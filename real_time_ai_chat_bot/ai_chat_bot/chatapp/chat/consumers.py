import json
from channels.generic.websocket import AsyncWebsocketConsumer
from .openai import open_ai_model

class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        # Accept the WebSocket connection
        await self.accept()
    
    async def disconnect(self, close_code):
        pass 

    async def receive(self, text_data=None, bytes_data=None):
        text_json_data = json.loads(text_data)
        prompt = text_json_data.get("prompt", None)

        if not prompt:
            await self.send(text_data=json.dumps({
                'response': "Please write a valid prompt!"
            }))
            return 

        # Run the prompt through the AI model
        ai_response = await self.run_ai_model(prompt)
        await self.send(text_data=json.dumps({
            'prompt': prompt,
            'response': ai_response
        }))
    
    async def run_ai_model(self, prompt: str) -> str:
        ai_response = open_ai_model(prompt)
        return ai_response

