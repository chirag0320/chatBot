// client/src/components/Message.tsx
import React, { useState } from "react";

interface MessageProps {
  msg: {
    id?: string;
    role: string;
    content: string;
    timestamp: string | number | Date;
  };
}

const Message: React.FC<MessageProps> = ({ msg }) => {
  const [expanded, setExpanded] = useState(false);
  const isLong = msg.content.length > 400;

  return (
    <div className={`message-row ${msg.role}`}>
      <div className="message-bubble">
        <p className="message-text">
          {isLong && !expanded
            ? msg.content.slice(0, 400) + "..."
            : msg.content}
        </p>
        {isLong && !expanded && (
          <button className="read-more" onClick={() => setExpanded(true)}>
            Read more
          </button>
        )}
        <span className="message-timestamp">
          {new Date(msg.timestamp).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
      </div>
    </div>
  );
};

export default Message;
