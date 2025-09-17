// server/src/routes/chatRoutes.ts
import { Router, Request, Response } from 'express';
import auth from '../middlewares/auth';
import ChatMessage, { IChatMessage } from '../models/ChatMessage';
import { getAiResponse } from '../services/aiService';

const router = Router();

// Extend Request to include user property from auth middleware
interface AuthRequest extends Request {
  user?: {
    id: string;
  };
}

// POST /api/chat/send
router.post('/send', auth, async (req: AuthRequest, res: Response) => {
  const { message } = req.body;
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({ message: 'User not authenticated' });
  }

  try {
    // Save user message
    const userChatMessage = new ChatMessage({
      userId,
      role: 'user',
      content: message,
    });
    await userChatMessage.save();

    // Fetch previous messages for context
    const chatHistory = await ChatMessage.find({ userId })
      .sort({ timestamp: 1 })
      .limit(10) // Limit context to last 10 messages
      .select('role content');

    // Prepare messages for AI
    const aiMessages = chatHistory.map(msg => ({
      role: msg.role,
      content: msg.content,
    }));
    aiMessages.push({ role: 'user', content: message }); // Add current message

    // Get AI response
    const aiResponseContent = await getAiResponse(aiMessages);

    // Save AI response
    const aiChatMessage = new ChatMessage({
      userId,
      role: 'assistant',
      content: aiResponseContent,
    });
    await aiChatMessage.save();

    res.json({ response: aiResponseContent });

  } catch (error: any) {
    console.error('Error sending message:', error.message);
    res.status(500).send('Server error');
  }
});

// GET /api/chat/history?before=<timestamp>&limit=20
router.get('/history', auth, async (req: AuthRequest, res: Response) => {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }
  
    const limit = parseInt(req.query.limit as string) || 20;
    const before = req.query.before as string | undefined;
  
    try {
      let query: any = { userId };
  
      // if "before" is given, fetch only older messages
      if (before) {
        query.timestamp = { $lt: new Date(before) };
      }
  
      const messages = await ChatMessage.find(query)
        .sort({ timestamp: -1 }) // newest first
        .limit(limit)
        .select('role content timestamp');
  
      // Count if more exist (older than oldest message we fetched)
      let hasMore = false;
      if (messages.length > 0) {
        const oldest = messages[messages.length - 1].timestamp;
        const olderCount = await ChatMessage.countDocuments({
          userId,
          timestamp: { $lt: oldest },
        });
        hasMore = olderCount > 0;
      }
  
      res.json({
        messages: messages.reverse(), // oldest → newest for frontend
        hasMore,
      });
    } catch (error: any) {
      console.error('Error fetching chat history:', error.message);
      res.status(500).send('Server error');
    }
  });
  
  

export default router;