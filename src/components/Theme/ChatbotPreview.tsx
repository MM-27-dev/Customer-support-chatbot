import React, { useState } from 'react';
import { Send, Minimize2, X } from 'lucide-react';
import { ChatbotTheme } from '../../contexts/ThemeContext';
import axios from 'axios';

const defaultTheme: ChatbotTheme = {
  primaryColor: '#1d4ed8',
  secondaryColor: '#589ee4',
  backgroundColor: '#ffffff',
  textColor: '#1f2937',
  botMessageColor: '#f8fafc',
  userMessageColor: '#1d4ed8',
  headerColor: '#589ee4',
  buttonColor: '#1d4ed8',
  companyName: 'Your Company',
  companyLogo: '',
  welcomeMessage: 'Hello! How can I help you today?',
};

interface ChatbotPreviewProps {
  theme?: ChatbotTheme;
  clientKey?: string;
}

interface Message {
  id: number;
  text: string;
  isBot: boolean;
  timestamp: Date;
}

const DEMO_CLIENT_KEY = 'demo-key';

const ChatbotPreview: React.FC<ChatbotPreviewProps> = ({ theme, clientKey }) => {
  const appliedTheme = theme || defaultTheme;
  const [isOpen, setIsOpen] = useState(true);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: appliedTheme.welcomeMessage,
      isBot: true,
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);

  // Get clientKey from localStorage if not provided
  const effectiveClientKey = clientKey || localStorage.getItem('clientKey') || DEMO_CLIENT_KEY;
  console.log("effectiveClientKey", effectiveClientKey);
  

  const sendMessage = async () => {
    if (!inputValue.trim() || loading) return;

    const userMessage: Message = {
      id: Date.now(),
      text: inputValue,
      isBot: false,
      timestamp: new Date(),
    };

    setMessages((msgs) => [...msgs, userMessage]);
    setInputValue('');
    setLoading(true);

    try {
      const response = await axios.post('http://localhost:5000/api/chat/chatResponse', {
        clientKey: effectiveClientKey,
        message: userMessage.text,
      });
      const botResponse: Message = {
        id: Date.now() + 1,
        text: response.data.response,
        isBot: true,
        timestamp: new Date(),
      };
      setMessages((msgs) => [...msgs, botResponse]);
    } catch (error) {
      setMessages((msgs) => [
        ...msgs,
        {
          id: Date.now() + 2,
          text: 'Sorry, there was an error contacting the chatbot.',
          isBot: true,
          timestamp: new Date(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) {
    return (
      <div className="fixed bottom-4 right-4">
        <button
          onClick={() => setIsOpen(true)}
          className="w-16 h-16 rounded-full shadow-lg flex items-center justify-center text-white font-bold text-lg"
          style={{ background: `linear-gradient(135deg, ${appliedTheme.primaryColor}, ${appliedTheme.secondaryColor})` }}
        >
          💬
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto rounded-2xl shadow-2xl overflow-hidden border border-gray-200" style={{ background: appliedTheme.backgroundColor }}>
      {/* Header */}
      <div 
        className="p-4 flex items-center justify-between"
        style={{ background: `linear-gradient(135deg, ${appliedTheme.primaryColor}, ${appliedTheme.secondaryColor})` }}
      >
        <div className="flex items-center space-x-3">
          {appliedTheme.companyLogo && (
            <img 
              src={appliedTheme.companyLogo} 
              alt="Logo" 
              className="w-8 h-8 rounded-full border border-white shadow"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          )}
          <div>
            <h3 className="font-semibold text-white text-lg tracking-wide">{appliedTheme.companyName}</h3>
            <p className="text-xs text-white/80 flex items-center gap-1"><span className="inline-block w-2 h-2 bg-green-400 rounded-full"></span> Online now</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button className="p-1 hover:bg-white/10 rounded">
            <Minimize2 size={16} color="#fff" />
          </button>
          <button 
            onClick={() => setIsOpen(false)}
            className="p-1 hover:bg-white/10 rounded"
          >
            <X size={16} color="#fff" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div 
        className="h-80 overflow-y-auto p-4 space-y-3"
        style={{ backgroundColor: appliedTheme.backgroundColor }}
      >
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}
          >
            <div
              className={`max-w-xs p-3 rounded-lg text-sm`}
              style={{
                backgroundColor: message.isBot ? appliedTheme.botMessageColor : appliedTheme.userMessageColor,
                color: message.isBot ? appliedTheme.textColor : '#FFFFFF',
              }}
            >
              {message.text}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div
              className="max-w-xs p-3 rounded-lg text-sm opacity-70"
              style={{
                backgroundColor: appliedTheme.botMessageColor,
                color: appliedTheme.textColor,
              }}
            >
              ...
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex space-x-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && !loading && sendMessage()}
            placeholder="Type your message..."
            className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            style={{ background: appliedTheme.backgroundColor, color: appliedTheme.textColor }}
            disabled={loading}
          />
          <button
            onClick={sendMessage}
            className="p-2 text-white rounded-lg hover:opacity-80 transition duration-200"
            style={{ background: `linear-gradient(135deg, ${appliedTheme.primaryColor}, ${appliedTheme.secondaryColor})` }}
            disabled={loading}
          >
            <Send size={16} />
          </button>
        </div>
      </div>
      {/* Footer */}
      <div
        className="px-4 py-2 text-xs text-center"
        style={{ background: appliedTheme.headerColor, color: appliedTheme.textColor + 'b0' }}
      >
        Powered by <span className="font-semibold">{appliedTheme.companyName}</span>
      </div>
    </div>
  );
};

export default ChatbotPreview;