import React, { useState } from 'react';
import axios from 'axios';

export default function Chatbot() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  async function sendMessage() {
    setMessages([...messages, { role: 'user', text: input }]);
    const res = await axios.post('http://localhost:5000/api/chatbot/chat', { message: input });
    setMessages([...messages, { role: 'user', text: input }, { role: 'ai', text: res.data.response }]);
    setInput('');
  }

  return (
    <div>
      <div>
        {messages.map((msg, i) => (
          <div key={i}><b>{msg.role}:</b> {msg.text}</div>
        ))}
      </div>
      <input
        value={input}
        onChange={e => setInput(e.target.value)}
        onKeyDown={e => e.key === 'Enter' && sendMessage()}
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
}
