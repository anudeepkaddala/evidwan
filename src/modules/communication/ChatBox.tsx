import React, { useState, useEffect } from 'react';
import './ChatBox.css';
import Navbar from '../home/Navbar.tsx';

interface ChatMessage {
  id: number;
  sender: string;
  text: string;
  timestamp: string;
}

const CHAT_KEY = "evidwan-chat";

const ChatBox: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const role = localStorage.getItem("evidwan-role") || "null";

  useEffect(() => {
    const stored = localStorage.getItem(CHAT_KEY);
    if (stored) setMessages(JSON.parse(stored));
  }, []);

  const handleSend = () => {
    if (!input.trim()) return;
    const newMsg: ChatMessage = {
      id: Date.now(),
      sender: role,
      text: input,
      timestamp: new Date().toISOString(),
    };
    const updated = [...messages, newMsg];
    setMessages(updated);
    localStorage.setItem(CHAT_KEY, JSON.stringify(updated));
    setInput('');
  };

  return (
    <>
      <Navbar role={role} />
      <div className="chat-box">
        <div className="chat-header">Chat</div>
        <div className="chat-messages">
          {messages.map(msg => (
            <div
              key={msg.id}
              className={`chat-message ${msg.sender === role ? 'own-message' : 'other-message'}`}
            >
              <div className="message-bubble">
                <p>{msg.text}</p>
                <span className="timestamp">{new Date(msg.timestamp).toLocaleTimeString()}</span>
              </div>
            </div>
          ))}
        </div>
        <div className="chat-input-area">
          <input
            type="text"
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button onClick={handleSend}>Send</button>
        </div>
      </div>
    </>
  );
};

export default ChatBox;
