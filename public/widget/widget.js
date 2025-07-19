(function() {
  'use strict';
  
  const WIDGET_API_BASE = 'http://localhost:5000/api';
  
  class ChatbotWidget {
    constructor(clientKey) {
      this.clientKey = clientKey;
      this.sessionId = this.generateSessionId();
      this.isOpen = false;
      this.theme = {};
      this.userEmail = null;
      this.messages = [];
      
      this.init();
    }
    
    generateSessionId() {
      return 'session_' + Math.random().toString(36).substr(2, 9);
    }
    
    async init() {
      await this.loadTheme();
      this.createWidget();
      this.attachEventListeners();
    }
    
    async loadTheme() {
      try {
        const response = await fetch(`${WIDGET_API_BASE}/theme/public/${this.clientKey}`);
        this.theme = await response.json();
      } catch (error) {
        console.error('Failed to load theme:', error);
        this.theme = this.getDefaultTheme();
      }
    }
    
    getDefaultTheme() {
      return {
        primaryColor: '#3B82F6',
        secondaryColor: '#EFF6FF',
        backgroundColor: '#FFFFFF',
        textColor: '#1F2937',
        botMessageColor: '#F3F4F6',
        userMessageColor: '#3B82F6',
        headerColor: '#1F2937',
        buttonColor: '#3B82F6',
        companyName: 'Support',
        companyLogo: '',
        welcomeMessage: 'Hello! How can I help you today?',
      };
    }
    
    createWidget() {
      // Create widget container
      this.container = document.createElement('div');
      this.container.id = 'chatbot-widget';
      this.container.innerHTML = this.getWidgetHTML();
      document.body.appendChild(this.container);
      
      // Add styles
      this.addStyles();
    }
    
    getWidgetHTML() {
      return `
        <div id="chatbot-bubble" class="chatbot-bubble">
          💬
        </div>
        <div id="chatbot-window" class="chatbot-window">
          <div class="chatbot-header">
            <div class="chatbot-header-content">
              ${this.theme.companyLogo ? `<img src="${this.theme.companyLogo}" alt="Logo" class="chatbot-logo">` : ''}
              <div>
                <div class="chatbot-company-name">${this.theme.companyName}</div>
                <div class="chatbot-status">Online now</div>
              </div>
            </div>
            <div class="chatbot-controls">
              <button id="chatbot-minimize" class="chatbot-control-btn">−</button>
              <button id="chatbot-close" class="chatbot-control-btn">×</button>
            </div>
          </div>
          
          <div id="email-form" class="chatbot-email-form">
            <div class="chatbot-email-content">
              <h3>Welcome!</h3>
              <p>Please enter your email to start chatting:</p>
              <input type="email" id="email-input" placeholder="your@email.com" required>
              <button id="email-submit">Start Chat</button>
            </div>
          </div>
          
          <div id="chat-interface" class="chatbot-chat-interface" style="display: none;">
            <div id="chatbot-messages" class="chatbot-messages"></div>
            <div class="chatbot-input-container">
              <input type="text" id="chatbot-input" placeholder="Type your message...">
              <button id="chatbot-send">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <line x1="22" y1="2" x2="11" y2="13"></line>
                  <polygon points="22,2 15,22 11,13 2,9"></polygon>
                </svg>
              </button>
            </div>
          </div>
        </div>
      `;
    }
    
    addStyles() {
      const style = document.createElement('style');
      style.textContent = `
        #chatbot-widget {
          position: fixed;
          bottom: 20px;
          right: 20px;
          z-index: 10000;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }
        
        .chatbot-bubble {
          width: 60px;
          height: 60px;
          background: ${this.theme.buttonColor};
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
          font-size: 24px;
          transition: transform 0.2s ease;
        }
        
        .chatbot-bubble:hover {
          transform: scale(1.05);
        }
        
        .chatbot-window {
          width: 350px;
          height: 500px;
          background: white;
          border-radius: 12px;
          box-shadow: 0 8px 32px rgba(0,0,0,0.12);
          display: none;
          flex-direction: column;
          overflow: hidden;
        }
        
        .chatbot-header {
          background: ${this.theme.headerColor};
          color: white;
          padding: 16px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        
        .chatbot-header-content {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        
        .chatbot-logo {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          object-fit: cover;
        }
        
        .chatbot-company-name {
          font-weight: 600;
          font-size: 14px;
        }
        
        .chatbot-status {
          font-size: 12px;
          opacity: 0.8;
        }
        
        .chatbot-controls {
          display: flex;
          gap: 8px;
        }
        
        .chatbot-control-btn {
          background: none;
          border: none;
          color: white;
          cursor: pointer;
          padding: 4px 8px;
          border-radius: 4px;
          transition: background 0.2s ease;
        }
        
        .chatbot-control-btn:hover {
          background: rgba(255,255,255,0.2);
        }
        
        .chatbot-email-form {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
        }
        
        .chatbot-email-content {
          text-align: center;
          width: 100%;
        }
        
        .chatbot-email-content h3 {
          color: ${this.theme.textColor};
          margin: 0 0 8px 0;
          font-size: 18px;
        }
        
        .chatbot-email-content p {
          color: ${this.theme.textColor};
          margin: 0 0 20px 0;
          font-size: 14px;
        }
        
        .chatbot-email-content input {
          width: 100%;
          padding: 12px;
          border: 1px solid #ddd;
          border-radius: 8px;
          margin-bottom: 16px;
          font-size: 14px;
          outline: none;
          transition: border-color 0.2s ease;
        }
        
        .chatbot-email-content input:focus {
          border-color: ${this.theme.primaryColor};
        }
        
        .chatbot-email-content button {
          width: 100%;
          padding: 12px;
          background: ${this.theme.buttonColor};
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s ease;
        }
        
        .chatbot-email-content button:hover {
          opacity: 0.9;
        }
        
        .chatbot-chat-interface {
          flex: 1;
          display: flex;
          flex-direction: column;
        }
        
        .chatbot-messages {
          flex: 1;
          padding: 16px;
          overflow-y: auto;
          background: ${this.theme.backgroundColor};
        }
        
        .chatbot-message {
          margin-bottom: 12px;
          display: flex;
        }
        
        .chatbot-message.bot {
          justify-content: flex-start;
        }
        
        .chatbot-message.user {
          justify-content: flex-end;
        }
        
        .chatbot-message-content {
          max-width: 70%;
          padding: 8px 12px;
          border-radius: 12px;
          font-size: 14px;
          line-height: 1.4;
        }
        
        .chatbot-message.bot .chatbot-message-content {
          background: ${this.theme.botMessageColor};
          color: ${this.theme.textColor};
        }
        
        .chatbot-message.user .chatbot-message-content {
          background: ${this.theme.userMessageColor};
          color: white;
        }
        
        .chatbot-input-container {
          padding: 16px;
          border-top: 1px solid #eee;
          display: flex;
          gap: 8px;
        }
        
        .chatbot-input-container input {
          flex: 1;
          padding: 8px 12px;
          border: 1px solid #ddd;
          border-radius: 20px;
          outline: none;
          font-size: 14px;
        }
        
        .chatbot-input-container input:focus {
          border-color: ${this.theme.primaryColor};
        }
        
        .chatbot-input-container button {
          width: 36px;
          height: 36px;
          background: ${this.theme.buttonColor};
          color: white;
          border: none;
          border-radius: 50%;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.2s ease;
        }
        
        .chatbot-input-container button:hover {
          opacity: 0.9;
        }
        
        .chatbot-typing {
          display: flex;
          align-items: center;
          gap: 4px;
          padding: 8px 12px;
          background: ${this.theme.botMessageColor};
          border-radius: 12px;
          max-width: 70%;
        }
        
        .chatbot-typing-dot {
          width: 6px;
          height: 6px;
          background: ${this.theme.textColor};
          border-radius: 50%;
          animation: chatbot-typing 1.4s infinite ease-in-out;
          opacity: 0.4;
        }
        
        .chatbot-typing-dot:nth-child(2) {
          animation-delay: 0.2s;
        }
        
        .chatbot-typing-dot:nth-child(3) {
          animation-delay: 0.4s;
        }
        
        @keyframes chatbot-typing {
          0%, 80%, 100% {
            opacity: 0.4;
          }
          40% {
            opacity: 1;
          }
        }
      `;
      document.head.appendChild(style);
    }
    
    attachEventListeners() {
      const bubble = document.getElementById('chatbot-bubble');
      const window = document.getElementById('chatbot-window');
      const minimizeBtn = document.getElementById('chatbot-minimize');
      const closeBtn = document.getElementById('chatbot-close');
      const emailSubmit = document.getElementById('email-submit');
      const emailInput = document.getElementById('email-input');
      const chatInput = document.getElementById('chatbot-input');
      const sendBtn = document.getElementById('chatbot-send');
      
      bubble.addEventListener('click', () => this.toggleWidget());
      minimizeBtn.addEventListener('click', () => this.minimizeWidget());
      closeBtn.addEventListener('click', () => this.closeWidget());
      
      emailSubmit.addEventListener('click', () => this.submitEmail());
      emailInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') this.submitEmail();
      });
      
      sendBtn.addEventListener('click', () => this.sendMessage());
      chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') this.sendMessage();
      });
    }
    
    toggleWidget() {
      const bubble = document.getElementById('chatbot-bubble');
      const window = document.getElementById('chatbot-window');
      
      if (this.isOpen) {
        bubble.style.display = 'flex';
        window.style.display = 'none';
        this.isOpen = false;
      } else {
        bubble.style.display = 'none';
        window.style.display = 'flex';
        this.isOpen = true;
      }
    }
    
    minimizeWidget() {
      this.toggleWidget();
    }
    
    closeWidget() {
      this.toggleWidget();
    }
    
    submitEmail() {
      const emailInput = document.getElementById('email-input');
      const email = emailInput.value.trim();
      
      if (!email || !this.isValidEmail(email)) {
        alert('Please enter a valid email address');
        return;
      }
      
      this.userEmail = email;
      this.showChatInterface();
      this.addMessage(this.theme.welcomeMessage, true);
    }
    
    isValidEmail(email) {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }
    
    showChatInterface() {
      document.getElementById('email-form').style.display = 'none';
      document.getElementById('chat-interface').style.display = 'flex';
    }
    
    async sendMessage() {
      const input = document.getElementById('chatbot-input');
      const message = input.value.trim();
      
      if (!message) return;
      
      this.addMessage(message, false);
      input.value = '';
      
      // Save user message
      await this.saveMessage(message, false);
      
      // Show typing indicator
      this.showTypingIndicator();
      
      // Get AI response
      const response = await this.getAIResponse(message);
      
      // Hide typing indicator and show response
      this.hideTypingIndicator();
      this.addMessage(response, true);
      
      // Save bot response
      await this.saveMessage(response, true);
    }
    
    addMessage(text, isBot) {
      const messagesContainer = document.getElementById('chatbot-messages');
      const messageDiv = document.createElement('div');
      messageDiv.className = `chatbot-message ${isBot ? 'bot' : 'user'}`;
      
      messageDiv.innerHTML = `
        <div class="chatbot-message-content">${text}</div>
      `;
      
      messagesContainer.appendChild(messageDiv);
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
    
    showTypingIndicator() {
      const messagesContainer = document.getElementById('chatbot-messages');
      const typingDiv = document.createElement('div');
      typingDiv.className = 'chatbot-message bot';
      typingDiv.id = 'typing-indicator';
      
      typingDiv.innerHTML = `
        <div class="chatbot-typing">
          <div class="chatbot-typing-dot"></div>
          <div class="chatbot-typing-dot"></div>
          <div class="chatbot-typing-dot"></div>
        </div>
      `;
      
      messagesContainer.appendChild(typingDiv);
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
    
    hideTypingIndicator() {
      const typingIndicator = document.getElementById('typing-indicator');
      if (typingIndicator) {
        typingIndicator.remove();
      }
    }
    
    async getAIResponse(message) {
      try {
        const response = await fetch(`${WIDGET_API_BASE}/chat`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            clientKey: this.clientKey,
            message: message,
          }),
        });
        
        const data = await response.json();
        return data.response || 'Sorry, I could not process your request.';
      } catch (error) {
        console.error('Failed to get AI response:', error);
        return 'Sorry, I\'m experiencing technical difficulties. Please try again later.';
      }
    }
    
    async saveMessage(message, isBot) {
      try {
        await fetch(`${WIDGET_API_BASE}/conversations`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            clientKey: this.clientKey,
            userEmail: this.userEmail,
            sessionId: this.sessionId,
            message: message,
            isBot: isBot,
          }),
        });
      } catch (error) {
        console.error('Failed to save message:', error);
      }
    }
  }
  
  // Initialize widget when DOM is ready
  function initWidget() {
    const script = document.currentScript || 
                   document.querySelector('script[data-client-key]');
    
    if (!script) {
      console.error('Chatbot widget: Could not find script tag with data-client-key');
      return;
    }
    
    const clientKey = script.getAttribute('data-client-key');
    
    if (!clientKey) {
      console.error('Chatbot widget: data-client-key attribute is required');
      return;
    }
    
    new ChatbotWidget(clientKey);
  }
  
  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initWidget);
  } else {
    initWidget();
  }
})();