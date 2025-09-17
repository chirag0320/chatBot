// server/src/services/aiService.ts
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';
const MODEL_NAME = 'deepseek/deepseek-chat-v3.1:free'; // A free-tier friendly model

interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export const getAiResponse = async (messages: ChatMessage[]): Promise<string> => {
  if (!OPENROUTER_API_KEY) {
    console.error('OPENROUTER_API_KEY is not set.');
    return 'AI service is not configured.';
  }

  try {
    const response = await axios.post(
      OPENROUTER_API_URL,
      {
        model: MODEL_NAME,
        messages: [
          { role: 'system', content: 'You are a helpful customer support assistant.' },
          ...messages,
        ],
      },
      {
        headers: {
          'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://ai-customer-support.vercel.app', // Replace with your deployed frontend URL
          'X-Title': 'AI Customer Support App',
        },
      }
    );
    return response.data.choices[0].message.content;
  } catch (error: any) {
    console.error('Error getting AI response:', error.response?.data || error.message);
    return 'Sorry, I am having trouble connecting to the AI at the moment.';
  }
};