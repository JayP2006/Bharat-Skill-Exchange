import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/Avatar';
import useMessageStore from '@/store/messageStore';
import { Loader2 } from 'lucide-react';

const MessageList = ({ activeUserId }) => {
    const navigate = useNavigate();
    const { contacts, loading, fetchContacts } = useMessageStore();

    useEffect(() => {
        fetchContacts();
    }, [fetchContacts]);

    const getInitials = (name = '') => name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U';

    return (
        <div className="h-full border-r bg-card rounded-l-lg">
            <div className="p-4 border-b">
                <h2 className="text-xl font-semibold">Conversations</h2>
            </div>
            {loading ? (
                <div className="flex justify-center items-center h-full">
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                </div>
            ) : (
                <div className="flex flex-col">
                    {contacts.length === 0 && (
                        <p className="p-4 text-sm text-muted-foreground">No contacts found to chat with.</p>
                    )}
                    {contacts.map(contact => (
                        <button
                            key={contact._id}
                            onClick={() => navigate(`/chat/${contact._id}`)}
                            className={`flex items-center gap-4 p-4 text-left hover:bg-muted/50 transition-colors w-full ${activeUserId === contact._id ? 'bg-muted' : ''}`}
                        >
                            <Avatar>
                                <AvatarImage src={contact.avatar} />
                                <AvatarFallback>{getInitials(contact.name)}</AvatarFallback>
                            </Avatar>
                            <div className="flex-grow">
                                <p className="font-semibold">{contact.name}</p>
                                {/* ✅ ADD THIS SPAN TO DISPLAY THE ROLE BADGE */}
                                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                                    contact.role === 'Guru' 
                                        ? 'bg-indigo-100 text-indigo-800' 
                                        : 'bg-amber-100 text-amber-800'
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