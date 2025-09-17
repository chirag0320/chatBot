import { useState, useRef, useEffect } from "react";
import { chat } from "../services/api";

export interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

export const useChat = (initialLimit = 10) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [aiTyping, setAiTyping] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const chatContainerRef = useRef<HTMLDivElement>(null);

  /** Scroll helper */
  const scrollToBottom = () => {
    const container = chatContainerRef.current;
    if (container) container.scrollTop = container.scrollHeight;
  };

  /** Load latest messages */
  const loadLatestMessages = async () => {
    setLoadingHistory(true);
    try {
      const res = await chat.getHistory({ limit: initialLimit });
      setMessages(res.data.messages);
      setHasMore(res.data.hasMore);
      scrollToBottom();
    } finally {
      setLoadingHistory(false);
    }
  };

  /** Load older messages for infinite scroll */
  const loadOlderMessages = async () => {
    if (!hasMore || loadingHistory) return;

    const oldestTimestamp = messages[0]?.timestamp;
    setLoadingHistory(true);
    const container = chatContainerRef.current;
    const prevScrollHeight = container?.scrollHeight || 0;

    try {
      const res = await chat.getHistory({
        limit: initialLimit,
        before: oldestTimestamp,
      });
      setMessages((prev) => [...res.data.messages, ...prev]);
      setHasMore(res.data.hasMore);

      requestAnimationFrame(() => {
        if (container)
          container.scrollTop = container.scrollHeight - prevScrollHeight;
      });
    } finally {
      setLoadingHistory(false);
    }
  };

  /** Send user message and AI response */
  const sendMessage = async (content: string) => {
    if (!content.trim()) return;

    const userMessage: Message = {
      role: "user",
      content,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setAiTyping(true);
    requestAnimationFrame(scrollToBottom);

    try {
      const res = await chat.sendMessage(content);
      const aiMessage: Message = {
        role: "assistant",
        content: res.data.response,
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, aiMessage]);
      requestAnimationFrame(scrollToBottom);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "⚠️ Error: Could not get a response from the AI.",
          timestamp: new Date().toISOString(),
        },
      ]);
      requestAnimationFrame(scrollToBottom);
    } finally {
      setAiTyping(false);
    }
  };

  return {
    messages,
    aiTyping,
    loadingHistory,
    chatContainerRef,
    hasMore,
    loadLatestMessages,
    loadOlderMessages,
    sendMessage,
  };
};
