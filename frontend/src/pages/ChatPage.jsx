import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import useMessageStore from '@/store/messageStore';
import { motion } from 'framer-motion';
import MessageList from '@/components/Messaging/MessageList';
import Chat from '@/components/Messaging/Chat';
import { MessageSquare } from 'lucide-react';


const DUMMY_CONTACTS = [
    { _id: 'user_id_1', name: 'Rohan Sharma', avatar: 'https://github.com/shadcn.png' },
    { _id: 'user_id_2', name: 'Priya Patel', avatar: 'https://github.com/shadcn.png' },
];

const ChatPage = () => {
    const { userId } = useParams();
    const { setActiveConversation } = useMessageStore();
    
    useEffect(() => {
        if (userId) {
            setActiveConversation(userId);
        }
    }, [userId, setActiveConversation]);

    const activeContact = DUMMY_CONTACTS.find(c => c._id === userId);

    return (
        <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} 
            className="h-[calc(100vh-8rem)]"
        >
            <div className="grid grid-cols-1 md:grid-cols-4 h-full">
                <div className="hidden md:block md:col-span-1 h-full">
                    <MessageList activeUserId={userId} />
                </div>
                <div className="col-span-1 md:col-span-3 h-full">
                    {userId ? (
                        <Chat activeUserId={userId} contactInfo={activeContact} />
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full text-center bg-card rounded-lg border">
                            <MessageSquare className="h-16 w-16 text-muted-foreground" />
                            <h2 className="mt-4 text-xl font-semibold">Select a conversation</h2>
                            <p className="text-muted-foreground">Choose someone from your list to start chatting.</p>
                        </div>
                    )}
                </div>
            </div>
        </motion.div>
    );
};

export default ChatPage;