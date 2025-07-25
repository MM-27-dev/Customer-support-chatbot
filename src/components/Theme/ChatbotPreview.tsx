import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, Send, Bot, User, X, Minimize2, Maximize2 } from 'lucide-react';
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
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
    const BackEndURL = "https://customer-support-chatbot-backend-oqjr.onrender.com";
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
  const [unreadCount, setUnreadCount] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    if (isOpen && !isMinimized && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, isMinimized]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && !isMinimized && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen, isMinimized]);

  // Update unread count
  useEffect(() => {
    if (!isOpen && messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage.isBot) {
        setUnreadCount((prev) => prev + 1);
      }
    }
  }, [messages, isOpen]);

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
      const response = await axios.post(`${BackEndURL}/api/chat/chatResponse`, {
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

  // Format time
  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Get position styles
  const getPositionStyles = () => ({
    position: 'fixed' as const,
    bottom: 24,
    right: 24,
    zIndex: 50,
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'flex-end' as const,
  });

  // Chat toggle button
  const ChatToggleButton = () => (
    <motion.button
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => {
        setIsOpen((open) => !open);
        if (!isOpen) setUnreadCount(0);
        setIsMinimized(false);
      }}
      className="relative flex items-center justify-center w-16 h-16 rounded-full shadow-lg text-white font-bold text-lg transition-all"
      style={{
        background: `linear-gradient(135deg, ${appliedTheme.primaryColor}, ${appliedTheme.secondaryColor})`,
        boxShadow: `0 8px 32px ${appliedTheme.primaryColor}40`,
      }}
      aria-label={isOpen ? 'Close chat' : 'Open chat'}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={isOpen ? 'close' : 'chat'}
          initial={{ rotate: isOpen ? -90 : 90, scale: 0 }}
          animate={{ rotate: 0, scale: 1 }}
          exit={{ rotate: isOpen ? 90 : -90, scale: 0 }}
          transition={{ duration: 0.3, type: 'spring' }}
        >
          <MessageCircle size={32} />
        </motion.div>
      </AnimatePresence>
      {unreadCount > 0 && !isOpen && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-xs font-bold text-white shadow"
        >
          {unreadCount > 9 ? '9+' : unreadCount}
        </motion.div>
      )}
    </motion.button>
  );

  if (!isOpen) {
    return <div style={getPositionStyles()}><ChatToggleButton /></div>;
  }

  return (
    <div style={getPositionStyles()}>
      <ChatToggleButton />
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="w-full max-w-md rounded-2xl shadow-2xl overflow-hidden border border-gray-200 flex flex-col"
            style={{
              background: appliedTheme.backgroundColor,
              marginTop: 16,
              minWidth: 350,
              maxWidth: 400,
            }}
          >
            {/* Header */}
            <div
              className="p-2 flex items-center justify-between"
              style={{ background: `linear-gradient(135deg, ${appliedTheme.primaryColor}, ${appliedTheme.secondaryColor})` }}
            >
              <div className="flex items-center space-x-3">
                {appliedTheme.companyLogo && (
                  <img
                    src={appliedTheme.companyLogo}
                    alt="Logo"
                    className="w-9 h-9 rounded-full border border-white shadow"
                    onError={e => {
                      (e.currentTarget as HTMLImageElement).style.display = 'none';
                    }}
                  />
                )}
                <div>
                  <h3 className="font-semibold text-white text-lg tracking-wide">{appliedTheme.companyName}</h3>
                  <p className="text-xs text-white/80 flex items-center gap-1"><span className="inline-block w-2 h-2 bg-green-400 rounded-full"></span> Online now</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setIsMinimized((m) => !m)}
                  className="p-1 hover:bg-white/10 rounded"
                  title={isMinimized ? 'Maximize' : 'Minimize'}
                >
                  {isMinimized ? <Maximize2 size={24} color="#fff" /> : <Minimize2 size={24} color="#fff" />}
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 hover:bg-white/10 rounded"
                  title="Close"
                >
                  <X size={24} color="#fff" />
                </button>
              </div>
            </div>

            {/* Messages */}
            {!isMinimized && (
              <div
                className="h-80 overflow-y-auto p-4 space-y-4 bg-white/90"
                style={{ background: appliedTheme.backgroundColor }}
              >
                {messages.map(message => (
                  <div
                    key={message.id}
                    className={`flex ${message.isBot ? 'justify-start' : 'justify-end'} items-end gap-2`}
                  >
                    {message.isBot && (
                      <span className="bg-violet-100 rounded-full p-1 border border-violet-200"><Bot size={20} color={appliedTheme.primaryColor} /></span>
                    )}
                    <div
                      className={`max-w-xs p-3 rounded-2xl text-sm shadow ${message.isBot ? 'rounded-bl-none' : 'rounded-br-none'}`}
                      style={{
                        backgroundColor: message.isBot ? appliedTheme.botMessageColor : appliedTheme.userMessageColor,
                        color: message.isBot ? appliedTheme.textColor : '#FFFFFF',
                      }}
                    >
                      {message.text}
                      <div className="text-[10px] text-gray-400 mt-1 text-right">{formatTime(message.timestamp)}</div>
                    </div>
                    {!message.isBot && (
                      <span className="bg-violet-100 rounded-full p-1 border border-violet-200"><User size={20} color={appliedTheme.secondaryColor} /></span>
                    )}
                  </div>
                ))}
                {loading && (
                  <div className="flex justify-start items-end gap-2">
                    <span className="bg-violet-100 rounded-full p-1 border border-violet-200"><Bot size={20} color={appliedTheme.primaryColor} /></span>
                    <div
                      className="max-w-xs p-3 rounded-2xl text-sm shadow rounded-bl-none"
                      style={{
                        backgroundColor: appliedTheme.botMessageColor,
                        color: appliedTheme.textColor,
                      }}
                    >
                      <div className="inline-flex items-center">
                        {[0, 1, 2].map((i) => (
                          <span
                            key={i}
                            className="h-1.5 w-1.5 bg-current rounded-full inline-block mx-0.5 opacity-40 animate-pulse"
                            style={{ animationDelay: `${i * 0.2}s` }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            )}

            {/* Input */}
            {!isMinimized && (
              <div className="p-4 border-t border-gray-200 bg-white/95">
                <div className="flex items-center space-x-2">
                  <input
                    ref={inputRef}
                    type="text"
                    value={inputValue}
                    onChange={e => setInputValue(e.target.value)}
                    onKeyPress={e => e.key === 'Enter' && !loading && sendMessage()}
                    placeholder="Type your message..."
                    className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-400 text-sm"
                    style={{ background: appliedTheme.backgroundColor, color: appliedTheme.textColor }}
                    disabled={loading}
                  />
                  <button
                    onClick={sendMessage}
                    className="p-2 text-white rounded-lg hover:opacity-90 transition duration-200 shadow"
                    style={{ background: `linear-gradient(135deg, ${appliedTheme.primaryColor}, ${appliedTheme.secondaryColor})` }}
                    disabled={loading}
                  >
                    <Send size={18} color="#fff" />
                  </button>
                </div>
              </div>
            )}

            {/* Footer */}
            <div
              className="px-4 py-2 text-xs text-center"
              style={{ background: appliedTheme.primaryColor, color: appliedTheme.textColor + 'b0' }}
            >
              Powered by <span className="font-semibold">{appliedTheme.companyName}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ChatbotPreview;