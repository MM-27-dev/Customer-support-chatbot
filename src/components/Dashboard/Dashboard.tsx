import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Link } from 'react-router-dom';
import { 
  MessageSquare, 
  Palette, 
  Users, 
  Copy,
  CheckCircle,
  Key,
  Code
} from 'lucide-react';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [copied, setCopied] = useState(false);

  const embedCode = `<script src="https://cdn.chatbotpro.com/widget.js" data-client-key="${user?.clientKey}"></script>`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(embedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const quickActions = [
    {
      title: 'Manage FAQs',
      description: 'Add, edit, or remove frequently asked questions',
      icon: MessageSquare,
      color: 'bg-blue-500',
      link: '/faqs'
    },
    {
      title: 'Customize Theme',
      description: 'Change colors, logos, and styling of your chatbot',
      icon: Palette,
      color: 'bg-purple-500',
      link: '/theme'
    },
    {
      title: 'View Conversations',
      description: 'Monitor customer interactions and chat history',
      icon: Users,
      color: 'bg-green-500',
      link: '/conversations'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Welcome back!</h1>
        <p className="text-gray-600 mt-2">Manage your AI-powered FAQ chatbot</p>
      </div>

      {/* Client Key & Embed Code */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="bg-yellow-100 p-2 rounded-lg">
              <Key className="text-yellow-600" size={24} />
            </div>
            <h3 className="text-lg font-semibold text-gray-800">Your Client Key</h3>
          </div>
          <p className="text-sm text-gray-600 mb-3">
            This unique key identifies your chatbot configuration
          </p>
          <div className="bg-gray-50 p-3 rounded-lg font-mono text-sm text-gray-800">
            {user?.clientKey}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="bg-indigo-100 p-2 rounded-lg">
                <Code className="text-indigo-600" size={24} />
              </div>
              <h3 className="text-lg font-semibold text-gray-800">Embed Code</h3>
            </div>
            <button
              onClick={copyToClipboard}
              className="flex items-center space-x-2 px-3 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition duration-200"
            >
              {copied ? <CheckCircle size={16} /> : <Copy size={16} />}
              <span className="text-sm">{copied ? 'Copied!' : 'Copy'}</span>
            </button>
          </div>
          <p className="text-sm text-gray-600 mb-3">
            Add this script tag to your website to embed the chatbot
          </p>
          <div className="bg-gray-50 p-3 rounded-lg font-mono text-xs text-gray-800 break-all">
            {embedCode}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-3 gap-6">
        {quickActions.map((action, index) => (
          <Link
            key={index}
            to={action.link}
            className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition duration-200 transform hover:-translate-y-1"
          >
            <div className="flex items-center space-x-4 mb-4">
              <div className={`${action.color} p-3 rounded-lg`}>
                <action.icon className="text-white" size={24} />
              </div>
              <h3 className="text-lg font-semibold text-gray-800">{action.title}</h3>
            </div>
            <p className="text-gray-600">{action.description}</p>
          </Link>
        ))}
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-3 gap-6 mt-8">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white">
          <h4 className="text-lg font-semibold mb-2">Total FAQs</h4>
          <p className="text-3xl font-bold">12</p>
        </div>
        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white">
          <h4 className="text-lg font-semibold mb-2">Conversations</h4>
          <p className="text-3xl font-bold">48</p>
        </div>
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl shadow-lg p-6 text-white">
          <h4 className="text-lg font-semibold mb-2">Response Rate</h4>
          <p className="text-3xl font-bold">96%</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;