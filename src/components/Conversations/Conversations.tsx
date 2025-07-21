import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, Mail, Clock, User } from 'lucide-react';
import axios from 'axios';

interface Message {
  text: string;
  isBot: boolean;
  timestamp: Date;
}

interface Conversation {
  _id: string;
  userEmail: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
}

const Conversations: React.FC = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [expandedConversation, setExpandedConversation] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchConversations();
  }, []);

  const fetchConversations = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/conversations/get-conversations');
      setConversations(response.data);
    } catch (error) {
      console.error('Failed to fetch conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleConversation = (conversationId: string) => {
    setExpandedConversation(
      expandedConversation === conversationId ? null : conversationId
    );
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(date));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Conversations</h1>
        <p className="text-gray-600 mt-2">View and analyze customer interactions with your chatbot</p>
      </div>

      {conversations.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No conversations found yet.</p>
          <p className="text-gray-400 mt-2">Conversations will appear here once users start chatting with your bot.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {conversations.map((conversation) => (
            <div key={conversation._id} className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div
                className="p-6 cursor-pointer hover:bg-gray-50 transition duration-200"
                onClick={() => toggleConversation(conversation._id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="bg-blue-100 p-2 rounded-lg">
                      <User className="text-blue-600" size={20} />
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <Mail className="text-gray-400" size={16} />
                        <span className="font-medium text-gray-800">{conversation.userEmail}</span>
                      </div>
                      <div className="flex items-center space-x-2 mt-1">
                        <Clock className="text-gray-400" size={16} />
                        <span className="text-sm text-gray-600">{formatDate(conversation.createdAt)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                      {conversation.messages.length} messages
                    </span>
                    {expandedConversation === conversation._id ? (
                      <ChevronUp className="text-gray-400" size={20} />
                    ) : (
                      <ChevronDown className="text-gray-400" size={20} />
                    )}
                  </div>
                </div>
              </div>

              {expandedConversation === conversation._id && (
                <div className="border-t border-gray-200 p-6 bg-gray-50">
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {conversation.messages.map((message, index) => (
                      <div
                        key={index}
                        className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}
                      >
                        <div
                          className={`max-w-xs lg:max-w-md p-3 rounded-lg ${
                            message.isBot
                              ? 'bg-white text-gray-800 border border-gray-200'
                              : 'bg-blue-600 text-white'
                          }`}
                        >
                          <p className="text-sm">{message.text}</p>
                          <p className={`text-xs mt-1 ${
                            message.isBot ? 'text-gray-500' : 'text-blue-100'
                          }`}>
                            {formatDate(message.timestamp)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Conversations;