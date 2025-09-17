import express from 'express';
import  dotenv from 'dotenv';
import mongoose from 'mongoose';
import  cors from 'cors';
import authRoutes from './routes/authRoutes';
import chatRoutes from './routes/chatRoutes';
import { apiLimiter } from './middlewares/rateLimiter';  // ✅ Import limiter

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/aisupport';

app.use(express.json());
app.use(cors({
  origin: ["http://localhost:5173", 'https://aichatbot-chirag.netlify.app', 'http://localhost:3000'],
  credentials: true,
}));

// ✅ Apply global rate limiter
app.use(apiLimiter);

// Mongo connection
mongoose.connect(MONGO_URI)
  .then(() => console.log('MongoDB Connected successfully!'))
  .catch(err => console.error('MongoDB connection error:', err));

app.get('/', (req, res) => {
  res.send('AI Customer Support Backend is running!');
});

// ✅ Routes
app.use('/api/auth', authRoutes);
app.use('/api/chat', chatRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
