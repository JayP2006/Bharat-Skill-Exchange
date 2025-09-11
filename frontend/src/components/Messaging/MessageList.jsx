import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/Avatar';
import useMessageStore from '@/store/messageStore';
import { Loader2 } from 'lucide-react';
import useAuthStore from '@/store/authStore';

const MessageList = ({ activeUserId }) => {
    const navigate = useNavigate();
    const { user } = useAuthStore();
    const { contacts, loading, fetchContacts } = useMessageStore();

    useEffect(() => {
        fetchContacts();
    }, [fetchContacts]);

    const getInitials = (name = '') => name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U';

    return (
        <div className="h-full border-r bg-card rounded-l-2xl flex flex-col">
            <div className="p-4 border-b">
                <h2 className="text-xl font-bold">Conversations</h2>
                <p className="text-sm text-muted-foreground">
                    {user?.role === 'Guru' ? 'Chat with your Shishyas' : 'Chat with your Gurus'}
                </p>
            </div>
            {loading ? (
                <div className="flex justify-center items-center h-full"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
            ) : (
                <div className="flex-grow overflow-y-auto">
                    {contacts.length === 0 && (
                        <p className="p-4 text-sm text-center text-muted-foreground">No contacts found. Book a session to start a chat.</p>
                    )}
                    {contacts.map(contact => (
                        <button
                            key={contact._id}
                            onClick={() => navigate(`/chat/${contact._id}`)}
                            className={`flex items-center gap-4 p-3 text-left w-full transition-colors duration-200 ${
                                activeUserId === contact._id 
                                ? 'bg-primary/10 border-r-4 border-primary' 
                                : 'hover:bg-muted/50'
                            }`}
                        >
                            <Avatar className="h-12 w-12 border-2 border-border">
                                <AvatarImage src={contact.avatar} />
                                <AvatarFallback className="text-lg">{getInitials(contact.name)}</AvatarFallback>
                            </Avatar>
                            <div>
                                <p className="font-semibold">{contact.name}</p>
                                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                                    contact.role === 'Guru' ? 'bg-indigo-500/10 text-indigo-400' : 'bg-amber-500/10 text-amber-400'
                                }`}>
                                    {contact.role}
                                </span>
                            </div>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MessageList;