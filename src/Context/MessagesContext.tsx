import React, { createContext, useState, useContext, useEffect, ReactNode, useCallback } from 'react';
import axiosInstance from '../utils/axiosInstance';
import { useAuth } from './AuthContext';
import { deleteFileById, uploadFileAndGetId } from '../utils/uploadFileAndGetId';

export interface Message {
    id: number;
    conversationId: number | null;
    userId: number;
    fromAdminId: number | null;
    sender: string;
    type: 'text' | 'image' | 'file';
    content: string;
    fileId?: number;
    fileName?: string;
    date: string;
    file?: {
        id: number;
        type: string;
        fileName: string;
        signedUrl: string;
        signedUrlExpire: string;
    };
}

export interface ApiConversation {
    id: number;
    userId: number;
    lastMessageId: number;
    firstMessageId: number;
    lastMessageDate: string;
    seen: boolean;
    seenAt: string | null;
    user: {
        id: number;
        firstName: string | null;
        lastName: string | null;
        type: string;
        online: boolean;
        profilePictureFile: {
            id: number;
            type: string;
            fileName: string;
            signedUrl: string;
            signedUrlExpire: string;
        } | null;
    };
    lastMessage: {
        id: number;
        conversationId: number | null;
        userId: number;
        fromAdminId: number | null;
        type: 'text' | 'image' | 'file';
        content: string | null;
        fileId?: number;
        date: string;
        file?: {
            id: number;
            type: string;
            fileName: string;
            signedUrl: string;
            signedUrlExpire: string;
        };
    };
}

export interface UserWithoutConversation {
    id: number;
    firstName: string | null;
    lastName: string | null;
    email: string;
    type: string;
    online: boolean;
    profilePictureFile: {
        id: number;
        type: string;
        fileName: string;
        signedUrl: string;
        signedUrlExpire: string;
    } | null;
}

const MessagesContext = createContext<MessagesContextType | undefined>(undefined);

export const useMessages = () => {
    const ctx = useContext(MessagesContext);
    if (!ctx) throw new Error('useMessages must be used within a MessagesProvider');
    return ctx;
};

interface MessagesContextType {
    conversations: ApiConversation[];
    selectedConversationId: number | null;
    setSelectedConversationId: (id: number | null) => void;
    setConversationSeen: (id: number) => void;
    setConversations: React.Dispatch<React.SetStateAction<ApiConversation[]>>;
    messages: Message[];
    messagesByConversationId: Record<number, Message[]>; // Add this to access all messages by conversation
    sendTextMessage: (convId: number | undefined, content: string, userId?: number) => Promise<void>;
    sendFileMessage: (convId: number | undefined, file: File, userId?: number) => Promise<void>;
    sendingMessage: boolean;
    usersWithoutConversation: UserWithoutConversation[];
    loadingUsersWithoutConversation: boolean;
    fetchUsersWithoutConversation: () => Promise<void>;
    resetUsersWithoutConversation: () => void;
    usersWithoutConversationSearch: string;
    setUsersWithoutConversationSearch: React.Dispatch<React.SetStateAction<string>>;
    usersWithoutConversationPage: number;
    setUsersWithoutConversationPage: React.Dispatch<React.SetStateAction<number>>;
    usersWithoutConversationHasMore: boolean;
    // Conversation search/pagination
    conversationSearch: string;
    setConversationSearch: React.Dispatch<React.SetStateAction<string>>;
    conversationPage: number;
    setConversationPage: React.Dispatch<React.SetStateAction<number>>;
    conversationPageSize: number;
    conversationHasMore: boolean;
    fetchConversations: (opts?: { append?: boolean }) => Promise<void>;
    loadingConversations: boolean;
    resetConversationSearch: () => void;
    loadMoreMessages: (conversationId: number, beforeId: number) => Promise<void>;
    messagesPerPage: number;
    // New message callback for off-canvas chat auto-opening
    onNewMessageReceived: (callback: (message: Message & { conversationId: number }, conversation: ApiConversation | undefined) => void) => () => void;
}

export const MessagesProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [conversations, setConversations] = useState<ApiConversation[]>([]);
    const [selectedConversationId, setSelectedConversationId] = useState<number | null>(null);
    const [messagesByConversationId, setMessagesByConversationId] = useState<Record<number, Message[]>>({});
    const [sendingMessage, setSendingMessage] = useState(false); // <-- Initialize sendingMessage state
    const [usersWithoutConversation, setUsersWithoutConversation] = useState<UserWithoutConversation[]>([]);
    const [loadingUsersWithoutConversation, setLoadingUsersWithoutConversation] = useState(false);
    const [usersWithoutConversationSearch, setUsersWithoutConversationSearch] = useState('');
    const [usersWithoutConversationPage, setUsersWithoutConversationPage] = useState(1);
    const [usersWithoutConversationHasMore, setUsersWithoutConversationHasMore] = useState(true);
    const [conversationSearch, setConversationSearch] = useState('');
    const [conversationPage, setConversationPage] = useState(1);
    const [conversationPageSize] = useState(10);
    const [usersWithoutConversationPageSize] = useState(10);
    const [conversationHasMore, setConversationHasMore] = useState(true);
    const [loadingConversations, setLoadingConversations] = useState(false);
    const [messagesPerPage] = useState(10);
    const {socketInstance, isAuth } = useAuth();

    // Callback for new message notifications
    const [newMessageCallbacks, setNewMessageCallbacks] = useState<Array<(message: Message & { conversationId: number }, conversation: ApiConversation | undefined) => void>>([]);


    const updateUserOnlineStatus = useCallback((user: { id: number }, online: boolean) => {
        setConversations(prev =>
            prev.map(c =>
                c.user.id === user.id ? { ...c, user: { ...c.user, online } } : c
            )
        );
    }, []);

    const setUserOnline = useCallback((user: { id: number }) => {
        updateUserOnlineStatus(user, true);
    }, [updateUserOnlineStatus]);

    const setUserOffline = useCallback((user: { id: number }) => {
        updateUserOnlineStatus(user, false);
    }, [updateUserOnlineStatus]);

    const upsertConversation = useCallback((updatedConv: ApiConversation) => {
        setConversations(prev => {
            const idx = prev.findIndex(c => c.id === updatedConv.id);
            if (idx !== -1) {
                const newList = [...prev];
                newList[idx] = updatedConv;
                return newList;
            } else {
                return [updatedConv, ...prev];
            }
        });
    }, []);

    const upsertMessage = useCallback((msg: Message & { conversationId: number }) => {
        setMessagesByConversationId(prev => {
            const convId = msg.conversationId;
            const existing = prev[convId] || [];
            const idx = existing.findIndex(m => m.id === msg.id);
            let newMessages;
            if (idx !== -1) {
                newMessages = [...existing];
                newMessages[idx] = msg;
            } else {
                newMessages = [...existing, msg];
            }
            return { ...prev, [convId]: newMessages };
        });

        // Notify callbacks about new message (for auto-opening off-canvas chats)
        const conversation = conversations.find(c => c.id === msg.conversationId);
        newMessageCallbacks.forEach(callback => {
            callback(msg, conversation);
        });
    }, [conversations, newMessageCallbacks]);

    const onNewMessageReceived = useCallback((callback: (message: Message & { conversationId: number }, conversation: ApiConversation | undefined) => void) => {
        setNewMessageCallbacks(prev => [...prev, callback]);
        
        // Return cleanup function
        return () => {
            setNewMessageCallbacks(prev => prev.filter(cb => cb !== callback));
        };
    }, []);

    useEffect(() => {
        if (socketInstance) {
            socketInstance.on('user_connected', setUserOnline);
            socketInstance.on('user_disconnected', setUserOffline);
            socketInstance.on('conversationUpdated', upsertConversation);
            socketInstance.on('newMessage', upsertMessage);
        }

        return () => {
            if (socketInstance) {
                socketInstance.off('user_connected');
                socketInstance.off('user_disconnected');
                socketInstance.off('conversationUpdated');
                socketInstance.off('newMessage');
            }
        };
    }, [socketInstance, setUserOffline, setUserOnline, upsertConversation, upsertMessage]);


    useEffect(() => {
        const fetchConversations = async () => {
            try {
                const res = await axiosInstance.get('/messages/admin/conversations');
                setConversations(res.data);
            } catch (err) {
                console.error("Error fetching conversations:", err);
                setConversations([]);
            }
        };
        if (isAuth) fetchConversations();
    }, [isAuth]);

    useEffect(() => {
        const fetchAndMarkSeen = async () => {
            if (!selectedConversationId) return;
            const conv = conversations.find(c => c.id === selectedConversationId);
            if (!conv) return;
            try {
                await axiosInstance.patch(`/messages/admin/${selectedConversationId}/seen`);
                setConversations(prev => prev.map(c => c.id === selectedConversationId ? { ...c, seen: true } : c));
            } catch { 
                console.error("Error marking conversation as seen");
            }
            try {
                const res = await axiosInstance.get(`/messages/admin/${conv.userId}`);
                setMessagesByConversationId(prev => ({
                    ...prev,
                    [selectedConversationId]: res.data,
                }));
            } catch {
                console.error("Error fetching messages for conversation:", selectedConversationId);
             }
        };
        fetchAndMarkSeen();
    }, [selectedConversationId]);

    const messages = selectedConversationId && messagesByConversationId[selectedConversationId]
        ? messagesByConversationId[selectedConversationId]
        : [];

    const setConversationSeen = (id: number) => {
        setConversations(prev => prev.map(c => c.id === id ? { ...c, seen: true } : c));
    };

    const sendTextMessage = async (convId: number | undefined, content: string, userId?: number) => {
        setSendingMessage(true);
        try {
            let url: string;
            if (userId) {
                url = `/messages/admin/${userId}`;
            } else {
                const conv = conversations.find(c => c.id === convId);
                if (!conv) return;
                url = `/messages/admin/${conv.userId}`;
            }
            await axiosInstance.post(url, {
                type: 'text',
                content,
            });
        } catch (e) {
            console.error("Error sending text message:", e);
            throw e;
        } finally {
            setSendingMessage(false);
        }
    };

    const sendFileMessage = async (convId: number | undefined, file: File, userId?: number) => {
        setSendingMessage(true);
        let fileId: number | null = null;
        try {
            fileId = await uploadFileAndGetId(file);
            let url: string;
            if (userId) {
                url = `/messages/admin/${userId}`;
            } else {
                const conv = conversations.find(c => c.id === convId);
                if (!conv) return;
                url = `/messages/admin/${conv.userId}`;
            }
            await axiosInstance.post(url, {
                type: 'file',
                fileId,
            });
        } catch (e) {
            console.error("Error sending file message:", e);
            if (fileId !== null) await deleteFileById(fileId);
            throw e;
        } finally {
            setSendingMessage(false);
        }
    };

    const fetchUsersWithoutConversation = useCallback(async () => {
        setLoadingUsersWithoutConversation(true);
        try {
            const res = await axiosInstance.get('/messages/admin/users-without-conversation', {
                params: { search: usersWithoutConversationSearch, page: usersWithoutConversationPage, pageSize: usersWithoutConversationPageSize }
            });
            const users = res.data || [];
            setUsersWithoutConversation(prev => usersWithoutConversationPage > 1 ? [...prev, ...users] : users);
            setUsersWithoutConversationHasMore(users.length > 0 && users.length >= usersWithoutConversationPageSize);
        } catch {
            setUsersWithoutConversation([]);
            setUsersWithoutConversationHasMore(false);
        } finally {
            setLoadingUsersWithoutConversation(false);
        }
    }, [usersWithoutConversationSearch, usersWithoutConversationPage, usersWithoutConversationPageSize]);

    const resetUsersWithoutConversation = useCallback(() => {
        setUsersWithoutConversation([]);
        setUsersWithoutConversationSearch('');
        setUsersWithoutConversationPage(1);
        setUsersWithoutConversationHasMore(true);
    }, []);

    const fetchConversations = useCallback(async (opts?: { append?: boolean }) => {
        if (!isAuth) return;
        setLoadingConversations(true);
        try {
            const res = await axiosInstance.get('/messages/admin/conversations', {
                params: {
                    search: conversationSearch,
                    page: conversationPage,
                    pageSize: conversationPageSize,
                },
            });
            const data = res.data || [];
            setConversations(prev => opts?.append && conversationPage > 1 ? [...prev, ...data] : data);
            setConversationHasMore(data.length > 0 && data.length >= conversationPageSize);
        } catch {
            setConversations([]);
            setConversationHasMore(false);
        } finally {
            setLoadingConversations(false);
        }
    }, [conversationSearch, conversationPage, conversationPageSize, isAuth]);

    const loadMoreMessages = useCallback(async (conversationId: number, lastMessageId: number) => {
        try {
            const conv = conversations.find(c => c.id === conversationId);
            console.log("COnversation:", conv);
            if (!conv) return;
            const res = await axiosInstance.get(`/messages/admin/${conv.userId}`, {
                params: { lastMessageId, perPage: messagesPerPage }
            });
            const newMessages = res.data || [];
            setMessagesByConversationId(prev => {
                const existing = prev[conversationId] || [];
                return {
                    ...prev,
                    [conversationId]: [...newMessages, ...existing],
                };
            });
        } catch {
            console.error("Error loading more messages");
        }
    }, [messagesPerPage, conversations]);

    const resetConversationSearch = useCallback(() => {
        setConversations([]);
        setConversationSearch('');
        setConversationPage(1);
        setConversationHasMore(true);
    }, []);

    return (
        <MessagesContext.Provider value={{
            conversations,
            selectedConversationId,
            setSelectedConversationId,
            setConversationSeen,
            setConversations,
            messages,
            messagesByConversationId, // Add this line
            sendTextMessage,
            sendFileMessage,
            sendingMessage,
            usersWithoutConversation,
            loadingUsersWithoutConversation,
            fetchUsersWithoutConversation,
            usersWithoutConversationSearch,
            setUsersWithoutConversationSearch,
            usersWithoutConversationPage,
            setUsersWithoutConversationPage,
            usersWithoutConversationHasMore,
            resetUsersWithoutConversation,
            conversationSearch,
            setConversationSearch,
            conversationPage,
            setConversationPage,
            conversationPageSize,
            conversationHasMore,
            fetchConversations,
            loadingConversations,
            resetConversationSearch,
            loadMoreMessages,
            messagesPerPage,
            onNewMessageReceived, // Add the callback registration function
        }}>
            {children}
        </MessagesContext.Provider>
    );
};
