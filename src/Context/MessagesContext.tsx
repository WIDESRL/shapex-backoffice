import React, { createContext, useState, useContext, useEffect, ReactNode, useCallback } from 'react';
import axiosInstance from '../utils/axiosInstance';
import { useAuth } from './AuthContext';

// --- Types ---
export interface Message {
    id: number;
    sender: string;
    type: 'text' | 'image' | 'file';
    content: string;
    fileName?: string;
    date: string;
}

// --- API Conversation Type (matches backend) ---
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

// --- Context ---
const MessagesContext = createContext<MessagesContextType | undefined>(undefined);

export const useMessages = () => {
    const ctx = useContext(MessagesContext);
    if (!ctx) throw new Error('useMessages must be used within a MessagesProvider');
    return ctx;
};

// Add to MessagesContextType
interface MessagesContextType {
    conversations: ApiConversation[];
    selectedConversationId: number | null;
    setSelectedConversationId: (id: number | null) => void;
    setConversationSeen: (id: number) => void;
    setConversations: React.Dispatch<React.SetStateAction<ApiConversation[]>>;
    messages: Message[];
    sendTextMessage: (convId: number | undefined, content: string, userId?: number) => Promise<void>;
    sendFileMessage: (convId: number | undefined, file: File, userId?: number) => Promise<void>;
    sendingMessage: boolean;
    usersWithoutConversation: any[];
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
}

export const MessagesProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [conversations, setConversations] = useState<ApiConversation[]>([]);
    const [selectedConversationId, setSelectedConversationId] = useState<number | null>(null);
    const [messagesByConversationId, setMessagesByConversationId] = useState<Record<number, Message[]>>({});
    const [sendingMessage, setSendingMessage] = useState(false); // <-- Initialize sendingMessage state
    const [usersWithoutConversation, setUsersWithoutConversation] = useState<any[]>([]);
    const [loadingUsersWithoutConversation, setLoadingUsersWithoutConversation] = useState(false);
    const [usersWithoutConversationSearch, setUsersWithoutConversationSearch] = useState('');
    const [usersWithoutConversationPage, setUsersWithoutConversationPage] = useState(1);
    const [usersWithoutConversationHasMore, setUsersWithoutConversationHasMore] = useState(true);
    const [conversationSearch, setConversationSearch] = useState('');
    const [conversationPage, setConversationPage] = useState(1);
    const [conversationPageSize] = useState(2);
    const [usersWithoutConversationPageSize] = useState(5);
    const [conversationHasMore, setConversationHasMore] = useState(true);
    const [loadingConversations, setLoadingConversations] = useState(false);
    const [messagesPerPage] = useState(10);
    const { socketInstance } = useAuth();


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

    // Helper to update or add a conversation
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

    // Helper to add or update a message in the correct conversation
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
    }, [socketInstance]);


    // On mount, load conversations from API
    useEffect(() => {
        const fetchConversations = async () => {
            try {
                const res = await axiosInstance.get('/messages/admin/conversations');
                setConversations(res.data);
            } catch (err) {
                setConversations([]);
            }
        };
        fetchConversations();
    }, []);

    // When selectedConversationId changes, mark as seen and fetch messages
    useEffect(() => {
        const fetchAndMarkSeen = async () => {
            if (!selectedConversationId) return;
            const conv = conversations.find(c => c.id === selectedConversationId);
            if (!conv) return;
            try {
                // 1. Mark as seen
                await axiosInstance.patch(`/messages/admin/${selectedConversationId}/seen`);
                setConversations(prev => prev.map(c => c.id === selectedConversationId ? { ...c, seen: true } : c));
            } catch { }
            try {
                // 2. Fetch messages for this conversation (by userId)
                const res = await axiosInstance.get(`/messages/admin/${conv.userId}`);
                // Assume API returns an array of messages in the correct format
                setMessagesByConversationId(prev => ({
                    ...prev,
                    [selectedConversationId]: res.data,
                }));
            } catch { }
        };
        fetchAndMarkSeen();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedConversationId]);

    // Expose messages for the selected conversation
    const messages = selectedConversationId && messagesByConversationId[selectedConversationId]
        ? messagesByConversationId[selectedConversationId]
        : [];

    const setConversationSeen = (id: number) => {
        setConversations(prev => prev.map(c => c.id === id ? { ...c, seen: true } : c));
    };

    // Send text message to API and reload messages
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
            // Optionally handle error
        } finally {
            setSendingMessage(false);
        }
    };

    // Helper to upload file and get fileId (for chat messages)
    const uploadFileAndGetId = async (file: File): Promise<number> => {
        // 1. Get upload url and file object
        const response = await axiosInstance.post('/storage/create-file', { fileName: file.name, contentType: file.type });
        const uploadUrl = response.data.uploadUrl;
        const fileObj = response.data.file;
        // 2. Upload to uploadUrl
        await fetch(uploadUrl, {
            method: 'PUT',
            headers: { 'Content-Type': file.type },
            body: file,
        });
        // 3. Return file id
        return fileObj.id;
    };

    // Send file message to API and append to messages
    const sendFileMessage = async (convId: number | undefined, file: File, userId?: number) => {
        setSendingMessage(true);
        try {
            const fileId = await uploadFileAndGetId(file);
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
            // Optionally handle error
        } finally {
            setSendingMessage(false);
        }
    };

    // Fetch users without conversation
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

    // Reset users without conversation state
    const resetUsersWithoutConversation = useCallback(() => {
        setUsersWithoutConversation([]);
        setUsersWithoutConversationSearch('');
        setUsersWithoutConversationPage(1);
        setUsersWithoutConversationHasMore(true);
    }, []);

    // Fetch conversations with server-side search & pagination
    const fetchConversations = useCallback(async (opts?: { append?: boolean }) => {
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
    }, [conversationSearch, conversationPage, conversationPageSize]);

    // Load more messages for a conversation (pagination)
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
                // Prepend new messages (older) to the top
                return {
                    ...prev,
                    [conversationId]: [...newMessages, ...existing],
                };
            });
        } catch {
        }
    }, [messagesPerPage, conversations]);

    // Reset conversation search state
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
            sendTextMessage,
            sendFileMessage,
            sendingMessage, // expose sendingMessage state
            usersWithoutConversation,
            loadingUsersWithoutConversation,
            fetchUsersWithoutConversation,
            usersWithoutConversationSearch,
            setUsersWithoutConversationSearch,
            usersWithoutConversationPage,
            setUsersWithoutConversationPage,
            usersWithoutConversationHasMore,
            resetUsersWithoutConversation,
            // Conversation search/pagination
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
        }}>
            {children}
        </MessagesContext.Provider>
    );
};
