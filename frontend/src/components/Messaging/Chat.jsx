import React, { useState, useEffect, useRef } from 'react';
import useMessageStore from '@/store/messageStore';
import useAuth from '@/hooks/useAuth';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Send, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/Avatar';

const Chat = ({ activeUserId, contactInfo }) => {
    const { messages, sendMessage, loading } = useMessageStore();
    const { user } = useAuth();
    const [newMessage, setNewMessage] = useState('');
    const messagesEndRef = useRef(null);
    const getInitials = (name = '') => name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U';

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [messages]);

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !activeUserId) return;
        sendMessage({
            sender: user._id,
            receiver: activeUserId,
            content: newMessage,
        });
        setNewMessage('');
    };
    
    return (
        <div className="flex flex-col h-full bg-card border rounded-lg">
            <div className="p-4 border-b flex items-center gap-4">
                <Avatar>
                    <AvatarImage src={contactInfo?.avatar} />
                    <AvatarFallback>{getInitials(contactInfo?.name)}</AvatarFallback>
                </Avatar>
                <h2 className="text-lg font-semibold">{contactInfo?.name || 'Select a chat'}</h2>
            </div>

            <div className="flex-grow overflow-y-auto p-4 space-y-4">
                {loading && (
                    <div className="flex justify-center items-center h-full">
                        <Loader2 className="h-6 w-6 animate-spin text-primary" />
                    </div>
                )}
                <AnimatePresence>
                    {messages.map((msg) => (
                        <motion.div 
                            key={msg._id} 
                            className={`flex items-end gap-2 ${msg.sender === user._id ? 'justify-end' : 'justify-start'}`}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            <div className={`max-w-xs md:max-w-md px-4 py-2 rounded-2xl ${msg.sender === user._id ? 'bg-primary text-primary-foreground rounded-br-none' : 'bg-muted rounded-bl-none'}`}>
                                <p className="text-sm">{msg.content}</p>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
                <div ref={messagesEndRef} />
            </div>
            
            <form onSubmit={handleSendMessage} className="p-4 border-t flex items-center gap-2 bg-background rounded-b-lg">
                <Input 
                    value={newMessage} 
                    onChange={(e) => setNewMessage(e.target.value)} 
                    placeholder="Type a message..."
                    autoComplete="off"
                />
                <Button type="submit" size="icon" disabled={!newMessage.trim()}>
                    <Send className="h-4 w-4" />
                </Button>
            </form>
        </div>
    );
};

export default Chat;