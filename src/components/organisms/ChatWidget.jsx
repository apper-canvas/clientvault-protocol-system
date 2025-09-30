import React, { useState, useEffect, useRef } from 'react';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import { sendMessage } from '@/services/api/chatService';

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Load conversation history from localStorage on mount
  useEffect(() => {
    const savedMessages = localStorage.getItem('chatHistory');
    if (savedMessages) {
      try {
        setMessages(JSON.parse(savedMessages));
      } catch (error) {
        console.error('Failed to load chat history:', error);
      }
    }
  }, []);

  // Save conversation history to localStorage whenever messages change
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem('chatHistory', JSON.stringify(messages));
    }
  }, [messages]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleSend = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage = {
      id: Date.now(),
      text: inputValue.trim(),
      sender: 'user',
      timestamp: new Date().toISOString()
    };

    // Add user message immediately
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      // Send to AI with conversation history
      const response = await sendMessage(
        userMessage.text,
        messages.map(msg => ({ text: msg.text, sender: msg.sender }))
      );

      if (response.success) {
        const aiMessage = {
          id: Date.now() + 1,
          text: response.data.response,
          sender: 'ai',
          timestamp: response.data.timestamp
        };
        setMessages(prev => [...prev, aiMessage]);
      } else {
        toast.error(response.error || 'Failed to get AI response');
        // Remove the user message if AI fails
        setMessages(prev => prev.filter(msg => msg.id !== userMessage.id));
        // Restore input value for retry
        setInputValue(userMessage.text);
      }
    } catch (error) {
      toast.error('Failed to send message. Please try again.');
      // Remove the user message on error
      setMessages(prev => prev.filter(msg => msg.id !== userMessage.id));
      // Restore input value for retry
      setInputValue(userMessage.text);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const clearHistory = () => {
    setMessages([]);
    localStorage.removeItem('chatHistory');
    toast.success('Chat history cleared');
  };

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50">
      {/* Chat Window */}
      {isOpen && (
        <div className="bg-white rounded-lg shadow-2xl border border-secondary-200 mb-4 w-[90vw] sm:w-96 flex flex-col"
             style={{ height: 'calc(100vh - 120px)', maxHeight: '600px' }}>
          
          {/* Header */}
          <div className="bg-gradient-to-r from-primary-500 to-primary-600 text-white px-4 py-3 rounded-t-lg flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <ApperIcon name="Bot" size={20} />
              <h3 className="font-semibold">AI Assistant</h3>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={clearHistory}
                className="text-white hover:bg-white/20"
                title="Clear chat history"
              >
                <ApperIcon name="Trash2" size={16} />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleChat}
                className="text-white hover:bg-white/20"
              >
                <ApperIcon name="X" size={18} />
              </Button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-secondary-50">
            {messages.length === 0 ? (
              <div className="text-center text-secondary-500 py-8">
                <ApperIcon name="MessageCircle" size={48} className="mx-auto mb-3 text-secondary-300" />
                <p className="text-sm">Start a conversation with our AI assistant</p>
                <p className="text-xs mt-1">Ask about contacts, deals, or CRM features</p>
              </div>
            ) : (
              messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg px-4 py-2 ${
                      msg.sender === 'user'
                        ? 'bg-primary-500 text-white'
                        : 'bg-white border border-secondary-200 text-secondary-900'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap break-words">{msg.text}</p>
                    <p className={`text-xs mt-1 ${
                      msg.sender === 'user' ? 'text-primary-100' : 'text-secondary-400'
                    }`}>
                      {new Date(msg.timestamp).toLocaleTimeString([], { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </p>
                  </div>
                </div>
              ))
            )}
            
            {/* Loading indicator */}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white border border-secondary-200 rounded-lg px-4 py-2">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-secondary-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-secondary-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-secondary-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-secondary-200 bg-white rounded-b-lg">
            <div className="flex space-x-2">
              <Input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                disabled={isLoading}
                className="flex-1"
              />
              <Button
                onClick={handleSend}
                disabled={!inputValue.trim() || isLoading}
                className="px-4"
              >
                <ApperIcon name="Send" size={18} />
              </Button>
            </div>
            <p className="text-xs text-secondary-400 mt-2">
              Press Enter to send, Shift+Enter for new line
            </p>
          </div>
        </div>
      )}

      {/* Toggle Button */}
      <Button
        onClick={toggleChat}
        className="w-14 h-14 rounded-full shadow-lg flex items-center justify-center"
        title="Toggle AI Chat"
      >
        {isOpen ? (
          <ApperIcon name="X" size={24} />
        ) : (
          <>
            <ApperIcon name="MessageCircle" size={24} />
            {messages.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-accent-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {messages.length > 9 ? '9+' : messages.length}
              </span>
            )}
          </>
        )}
      </Button>
    </div>
  );
};

export default ChatWidget;