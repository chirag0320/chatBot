import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import Message from "../components/Message";
import { useChat } from "../hooks/useChat";
import "./Chat.css";

const ChatPage: React.FC = () => {
  const { logout } = useAuth();
  const [input, setInput] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const {
    messages,
    aiTyping,
    loadingHistory,
    chatContainerRef,
    hasMore,
    loadLatestMessages,
    loadOlderMessages,
    sendMessage,
  } = useChat();

  /** Load latest on mount */
  useEffect(() => {
    loadLatestMessages();
  }, []);

  /** Infinite scroll */
  const handleScroll = () => {
    const container = chatContainerRef.current;
    if (container && container.scrollTop < 50) {
      loadOlderMessages();
    }
  };

  /** Auto resize textarea */
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = textareaRef.current.scrollHeight + "px";
    }
  }, [input]);

  /** Handle enter key */
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSend = () => {
    if (!input.trim()) return;
    sendMessage(input);
    setInput("");
  };

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

      <form className="message-input-form" onSubmit={(e) => { e.preventDefault(); handleSend(); }}>
        <textarea
          ref={textareaRef}
          placeholder="Type a message"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          rows={1}
          onKeyDown={handleKeyDown}
        />
        <button type="submit" disabled={aiTyping}>
          ➤
        </button>
      </form>
    </div>
  );
};

export default ChatPage;
