import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Send, User, ArrowLeft, MessageSquare, AlertCircle } from 'lucide-react';
import Layout from '../components/layout/Layout';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import EmptyState from '../components/ui/EmptyState';
import { useAuth } from '../context/AuthContext';
import { messageService } from '../services/messageService';
import { userService } from '../services/userService';

const MessagesPage = () => {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const preselectedUserId = searchParams.get('user');
  
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [mobileView, setMobileView] = useState('list'); // list or chat
  const [permissionError, setPermissionError] = useState(null);
  
  const messagesEndRef = useRef(null);

  // 1. Fetch Conversations List
  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const response = await messageService.getConversations();
        setConversations(response.conversations || []);
        
        if (preselectedUserId) {
          // Check if we already have a conversation with this user
          const existing = response.conversations?.find(
            c => c.user?._id === preselectedUserId
          );
          
          if (existing) {
            setSelectedConversation(existing);
            setMobileView('chat');
          } else {
            // New conversation setup
            const userData = await userService.getUserById(preselectedUserId);
            setSelectedConversation({ user: userData.user, isNew: true });
            setMobileView('chat');
          }
        }
      } catch (error) {
        console.error('Failed to fetch conversations:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchConversations();
  }, [preselectedUserId]);

  // 2. Fetch Messages for Selected Chat
  useEffect(() => {
    const fetchMessages = async () => {
      setPermissionError(null); // Reset error on change
      if (!selectedConversation?.user?._id) return;
      
      try {
        const response = await messageService.getMessages(selectedConversation.user._id);
        setMessages(response.messages || []);
        await messageService.markAsRead(selectedConversation.user._id);
      } catch (error) {
        console.error('Failed to fetch messages:', error);
      }
    };
    fetchMessages();
  }, [selectedConversation]);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // 3. Handle Send
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedConversation?.user?._id) return;

    try {
      setSending(true);
      setPermissionError(null);

      const response = await messageService.sendMessage(
        selectedConversation.user._id,
        newMessage.trim()
      );
      
      // Update message list
      setMessages([...messages, response.message]);
      setNewMessage('');
      
      // Update sidebar preview logic (optional but good UI)
      // fetchConversations(); 
    } catch (error) {
      // 🔥 Handle Booking Restriction Error
      if (error.response && error.response.status === 403) {
        setPermissionError(error.response.data.message || "Booking required to chat.");
      } else {
        console.error('Failed to send message:', error);
      }
    } finally {
      setSending(false);
    }
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return date.toLocaleDateString('en-US', { weekday: 'short' });
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  if (loading) {
    return (
      <Layout>
        <LoadingSpinner text="Loading messages..." />
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="h-[calc(100vh-200px)] min-h-[500px]">
        <div className="container-app h-full py-6">
          <div className="card-elevated h-full overflow-hidden flex">
            
            {/* --- SIDEBAR: Conversations List --- */}
            <div className={`w-full md:w-80 border-r border-border flex flex-col ${
              mobileView === 'chat' ? 'hidden md:flex' : 'flex'
            }`}>
              <div className="p-4 border-b border-border">
                <h2 className="font-display font-semibold text-foreground">Messages</h2>
              </div>
              
              <div className="flex-1 overflow-y-auto">
                {conversations.length > 0 ? (
                  conversations.map((conv) => (
                    <button
                      key={conv.user?._id}
                      onClick={() => {
                        setSelectedConversation(conv);
                        setMobileView('chat');
                      }}
                      className={`w-full flex items-center gap-3 p-4 hover:bg-secondary/50 transition-colors ${
                        selectedConversation?.user?._id === conv.user?._id ? 'bg-secondary' : ''
                      }`}
                    >
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        {conv.user?.avatar && conv.user.avatar !== 'default_avatar_url' ? (
                          <img
                            src={conv.user.avatar}
                            alt={conv.user.name}
                            className="w-full h-full rounded-full object-cover"
                          />
                        ) : (
                          <User className="w-5 h-5 text-primary" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0 text-left">
                        <div className="flex items-center justify-between">
                          <p className="font-medium text-foreground truncate">{conv.user?.name}</p>
                          <span className="text-xs text-muted-foreground">{formatTime(conv.lastMessage?.createdAt)}</span>
                        </div>
                        <p className="text-sm text-muted-foreground truncate">
                          {conv.lastMessage?.isOwn ? 'You: ' : ''}{conv.lastMessage?.content || 'Start chatting'}
                        </p>
                      </div>
                      {conv.unreadCount > 0 && (
                        <span className="w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
                          {conv.unreadCount}
                        </span>
                      )}
                    </button>
                  ))
                ) : (
                  <div className="p-8 text-center">
                    <MessageSquare className="w-12 h-12 text-muted-foreground/40 mx-auto mb-3" />
                    <p className="text-muted-foreground">No conversations yet</p>
                  </div>
                )}
              </div>
            </div>

            {/* --- MAIN: Chat Area --- */}
            <div className={`flex-1 flex flex-col ${
              mobileView === 'list' ? 'hidden md:flex' : 'flex'
            }`}>
              {selectedConversation ? (
                <>
                  {/* Chat Header */}
                  <div className="p-4 border-b border-border flex items-center gap-3 bg-secondary/10">
                    <button
                      onClick={() => setMobileView('list')}
                      className="md:hidden p-2 rounded-lg hover:bg-secondary transition-colors"
                    >
                      <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      {selectedConversation.user?.avatar && selectedConversation.user.avatar !== 'default_avatar_url' ? (
                        <img
                          src={selectedConversation.user.avatar}
                          alt={selectedConversation.user.name}
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        <User className="w-5 h-5 text-primary" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-foreground">
                        {selectedConversation.user?.name}
                      </p>
                      <p className="text-xs text-muted-foreground capitalize">
                        {selectedConversation.user?.role || 'User'}
                      </p>
                    </div>
                  </div>

                  {/* Messages Feed */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-background">
                    {messages.length > 0 ? (
                      messages.map((msg) => {
                        const isOwn = msg.sender === user?._id || msg.sender?._id === user?._id;
                        return (
                          <div key={msg._id} className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[70%] px-4 py-2 rounded-2xl ${
                              isOwn
                                ? 'bg-primary text-primary-foreground rounded-br-sm'
                                : 'bg-secondary text-foreground rounded-bl-sm'
                            }`}>
                              <p className="text-sm">{msg.content}</p>
                              <p className={`text-[10px] mt-1 text-right ${isOwn ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
                                {formatTime(msg.createdAt)}
                              </p>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="h-full flex flex-col items-center justify-center text-center p-6">
                        <MessageSquare className="w-12 h-12 text-muted-foreground/30 mb-2" />
                        <p className="text-muted-foreground">
                          Start a conversation with {selectedConversation.user?.name}
                        </p>
                        <p className="text-xs text-muted-foreground/70 mt-1">
                          (Messages allowed only if you have a confirmed booking)
                        </p>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Booking Error Alert */}
                  {permissionError && (
                    <div className="mx-4 mt-2 p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-2 text-red-600 text-sm">
                      <AlertCircle className="w-4 h-4" />
                      {permissionError}
                    </div>
                  )}

                  {/* Input Area */}
                  <form onSubmit={handleSendMessage} className="p-4 border-t border-border bg-background">
                    <div className="flex items-center gap-3">
                      <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type a message..."
                        className="flex-1 input-styled px-4 py-3"
                        disabled={sending}
                      />
                      <button
                        type="submit"
                        disabled={!newMessage.trim() || sending}
                        className="btn-gradient p-3 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 transition-transform"
                      >
                        {sending ? <LoadingSpinner size="sm" color="white" /> : <Send className="w-5 h-5" />}
                      </button>
                    </div>
                  </form>
                </>
              ) : (
                <div className="h-full flex items-center justify-center bg-secondary/5">
                  <EmptyState
                    icon={MessageSquare}
                    title="Select a conversation"
                    description="Choose a conversation from the list to start messaging"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default MessagesPage;