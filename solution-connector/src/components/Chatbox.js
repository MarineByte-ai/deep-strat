import React, { useState } from 'react';

const Chatbox = () => {
  const [messages, setMessages] = useState([]);

  const handleSend = (message) => {
    // Placeholder for AI API call
    setMessages([...messages, { user: message, bot: "Response from AI" }]);
  };

  return (
    <div className="bg-gray-100 p-4 rounded shadow-md mt-6">
      <div className="messages mb-4 max-h-60 overflow-y-auto">
        {messages.map((msg, index) => (
          <div key={index} className="mb-2">
            <strong>User:</strong> {msg.user}
            <br />
            <strong>Bot:</strong> {msg.bot}
          </div>
        ))}
      </div>
      <input
        type="text"
        className="w-full p-2 border rounded"
        placeholder="Type a message..."
        onKeyPress={(e) => e.key === 'Enter' && handleSend(e.target.value)}
      />
    </div>
  );
};

export default Chatbox; 