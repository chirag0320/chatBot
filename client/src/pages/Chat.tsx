import React, { useState, useEffect, useRef } from "react";
import { chat } from "../services/api";
import "./Chat.css";
import { useAuth } from "../context/AuthContext";
import Message from "../components/Message";

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

const ChatPage: React.FC = () => {
  const { logout } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [aiTyping, setAiTyping] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [input, setInput] = useState("");
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadLatestMessages();
  }, []);

  /** Load newest messages on mount */
  const loadLatestMessages = async () => {
    setLoadingHistory(true);
    try {
      const res = await chat.getHistory({ limit: 10 });
      setMessages(res.data.messages);
      setHasMore(res.data.hasMore);
      scrollToBottom();
    } finally {
      setLoadingHistory(false);
    }
  };

  const scrollToBottom = () => {
    const container = chatContainerRef.current;
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  };

  /** Send user message and wait for AI */
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = {
      role: "user",
      content: input,
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setAiTyping(true);

    // ✅ scroll after sending
    requestAnimationFrame(scrollToBottom);

    try {
      const res = await chat.sendMessage(input);
      const aiMessage: Message = {
        role: "assistant",
        content: res.data.response,
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, aiMessage]);

      // ✅ scroll after receiving
      requestAnimationFrame(scrollToBottom);
    } catch (err) {
      console.error("Failed to send message:", err);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "⚠️ Error: Could not get a response from the AI.",
          timestamp: new Date().toISOString(),
        },
      ]);

      // ✅ also scroll after error response
      requestAnimationFrame(scrollToBottom);
    } finally {
      setAiTyping(false);
    }
  };

  /** Infinite scroll — load older messages */
  const loadOlderMessages = async () => {
    if (!hasMore || loadingHistory) return;

    const oldestTimestamp = messages[0]?.timestamp;
    setLoadingHistory(true);

    const container = chatContainerRef.current;
    const prevScrollHeight = container?.scrollHeight || 0;

    try {
      const res = await chat.getHistory({
        limit: 10,
        before: oldestTimestamp,
      });

      setMessages((prev) => [...res.data.messages, ...prev]); // prepend older msgs
      setHasMore(res.data.hasMore);

      requestAnimationFrame(() => {
        if (container) {
          container.scrollTop = container.scrollHeight - prevScrollHeight;
        }
      });
    } finally {
      setLoadingHistory(false);
    }
  };

  const handleScroll = () => {
    const container = chatContainerRef.current;
    if (container && container.scrollTop < 50) {
      loadOlderMessages();
    }
  };

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"; // reset height
      textareaRef.current.style.height =
        textareaRef.current.scrollHeight + "px";
    }
  }, [input]);

  return (
    <div className="chat-page">
      <div className="chat-header">
        <p>AI Customer Support</p>
        <button onClick={logout} className="logout-button">
          Logout
        </button>
      </div>

      <div
        ref={chatContainerRef}
        className="chat-container"
        onScroll={handleScroll}
      >
        {messages.map((msg, i) => (
            <Message key={i} msg={msg} />
        ))}

        {/* Typing indicator for AI */}
        {aiTyping && (
          <div className="message-row assistant">
            <div className="message-bubble typing">
              <div className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        )}

        {loadingHistory && (
          <div className="loading-indicator">Loading chat history...</div>
        )}
      </div>

      <form className="message-input-form" onSubmit={handleSendMessage}>
        <textarea
          ref={textareaRef}
          placeholder="Type a message"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          rows={1}
        />
        <button type="submit" disabled={aiTyping}>
          ➤
        </button>
      </form>
    </div>
  );
};

export default ChatPage;
