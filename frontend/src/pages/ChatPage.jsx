import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import useMessageStore from '@/store/messageStore';
import { motion } from 'framer-motion';
import MessageList from '@/components/Messaging/MessageList';
import Chat from '@/components/Messaging/Chat';
import { MessageSquare } from 'lucide-react';

const ChatPage = () => {
    const { userId } = useParams();
    // Fetch the dynamic contact list and the function to set the active chat
    const { contacts, setActiveConversation } = useMessageStore();
    
    useEffect(() => {
        if (userId) {
            setActiveConversation(userId);
        }
    }, [userId, setActiveConversation]);

    // Find the currently active contact from the real data fetched from the backend
    const activeContact = contacts.find(c => c._id === userId);

    return (
        <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            // Adjusted height to be more robust
            className="h-[calc(100vh-10rem)] md:h-[calc(100vh-8rem)]"
        >
            <div className="grid grid-cols-1 md:grid-cols-4 h-full border bg-card rounded-2xl shadow-lg">
                <div className="col-span-1 h-full">
                    <MessageList activeUserId={userId} />
                </div>
                <div className="col-span-1 md:col-span-3 h-full">
                    {userId && activeContact ? (
                        <Chat activeUserId={userId} contactInfo={activeContact} />
                    ) : (
                        // Improved empty state design
                        <div className="hidden md:flex flex-col items-center justify-center h-full text-center bg-background rounded-r-2xl">
                            <div className="p-8 rounded-full bg-primary/10">
                               <MessageSquare className="h-16 w-16 text-primary" />
                            </div>
                            <h2 className="mt-6 text-2xl font-semibold">Select a Conversation</h2>
                            <p className="text-muted-foreground mt-2 max-w-xs">Choose someone from your contact list to begin or continue a conversation.</p>
                        </div>
                    )}
                </div>
            </div>
        </motion.div>
    );
};

export default ChatPage;