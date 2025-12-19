import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import { ApiConversation, Message, useMessages } from './MessagesContext';
import axiosInstance from '../utils/axiosInstance';

export interface OffCanvasChat {
  id: string;
  conversation: ApiConversation;
  isCollapsed: boolean;
  position: number;
  messages: Message[];
  isLoadingMessages: boolean;
}

interface OffCanvasChatContextType {
  activeChats: OffCanvasChat[];
  openChat: (conversation: ApiConversation) => void;
  closeChat: (chatId: string) => void;
  toggleChat: (chatId: string) => void;
  isChatOpen: (conversationId: number) => boolean;
  sendMessageToChat: (chatId: string, message: string) => Promise<void>;
  sendFileToChat: (chatId: string, file: File) => Promise<void>;
  loadMessagesForChat: (chatId: string) => Promise<void>;
  loadMoreMessagesForChat: (chatId: string, beforeId: number) => Promise<void>;
}

const OffCanvasChatContext = createContext<OffCanvasChatContextType | undefined>(undefined);

export const useOffCanvasChat = () => {
  const context = useContext(OffCanvasChatContext);
  if (!context) {
    throw new Error('useOffCanvasChat must be used within an OffCanvasChatProvider');
  }
  return context;
};

export const OffCanvasChatProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [activeChats, setActiveChats] = useState<OffCanvasChat[]>([]);
  const { 
    sendTextMessage, 
    sendFileMessage, 
    messagesByConversationId, // Only use this for initial sync, not ongoing updates
    onNewMessageReceived, // Add this to listen for new messages
    conversations // Add this to sync online status
  } = useMessages();

  useEffect(() => {
    setActiveChats(prev => 
      prev.map(chat => {
        const updatedConversation = conversations.find(c => c.id === chat.conversation.id);
        if (updatedConversation) {
          // Only log when online status actually changes
          if (chat.conversation.user.online !== updatedConversation.user.online) {
            console.log(`👤 User ${updatedConversation.user.firstName} is now ${updatedConversation.user.online ? 'online' : 'offline'}`);
          }
          return {
            ...chat,
            conversation: updatedConversation // This includes the updated user.online status
          };
        }
        return chat;
      })
    );
  }, [conversations]);

  const loadMessagesForChatDirect = async (chatId: string, userId: number) => {
    console.log('🔄 Direct loading messages for chat:', chatId, 'userId:', userId);

    try {
      const response = await axiosInstance.get(`/messages/admin/${userId}`);
      
      const messages = response.data || [];
      console.log('✅ Direct loaded', messages.length, 'messages for chat:', chatId);
      
      setActiveChats(prev => 
        prev.map(c => 
          c.id === chatId 
            ? { ...c, messages: messages, isLoadingMessages: false }
            : c
        )
      );
    } catch (error) {
      console.error('❌ Failed to direct load messages for chat:', chatId, error);
      setActiveChats(prev => 
        prev.map(c => 
          c.id === chatId ? { ...c, isLoadingMessages: false } : c
        )
      );
    }
  };

  const loadMessagesForChat = useCallback(async (chatId: string) => {
    const chat = activeChats.find(c => c.id === chatId);
    if (!chat) return;
    
    setActiveChats(prev => 
      prev.map(c => 
        c.id === chatId ? { ...c, isLoadingMessages: false } : c
      )
    );

    try {
      const response = await axiosInstance.get(`/messages/admin/${chat.conversation.userId}`);      
      const messages = response.data || []
      setActiveChats(prev => 
        prev.map(c => 
          c.id === chatId 
            ? { ...c, messages: messages, isLoadingMessages: false }
            : c
        )
      );
    } catch (error) {
      console.error('❌ Failed to load messages for chat:', chatId, error);
      setActiveChats(prev => 
        prev.map(c => 
          c.id === chatId ? { ...c, isLoadingMessages: false } : c
        )
      );
    }
  }, [activeChats]);

  useEffect(() => {
    activeChats.forEach(chat => {
      if (chat.isLoadingMessages && !chat.isCollapsed && chat.messages.length === 0) {
        console.log('🔄 Fallback auto-loading for chat:', chat.id);
        loadMessagesForChat(chat.id);
      }
    });
  }, [activeChats, loadMessagesForChat]);

  const openChat = useCallback((conversation: ApiConversation) => {
    console.log('🔵 Opening chat for conversation:', conversation.id, 'userId:', conversation.userId);
    
    setActiveChats(prev => {
      const existingChat = prev.find(chat => chat.conversation.id === conversation.id);
      if (existingChat) {
        return prev.map(chat => 
          chat.id === existingChat.id 
            ? { ...chat, isCollapsed: false }
            : chat
        );
      }

      const initialMessages = messagesByConversationId[conversation.id] || [];
      console.log('📝 Initial messages for conversation', conversation.id, ':', initialMessages.length);
      
      const newChat: OffCanvasChat = {
        id: `chat-${conversation.id}-${Date.now()}`,
        conversation,
        isCollapsed: false,
        position: prev.length,
        messages: initialMessages,
        isLoadingMessages: false,
      };

      if (initialMessages.length === 0) {
        console.log('🚀 Triggering immediate message load for:', newChat.id);
        setTimeout(() => {
          loadMessagesForChatDirect(newChat.id, conversation.userId);
        }, 0);
      }

      const newChats = [...prev, newChat];
      return newChats.map((chat, index) => ({
        ...chat,
        position: index,
      }));
    });
  }, [messagesByConversationId]);

  const closeChat = useCallback((chatId: string) => {
    setActiveChats(prev => {
      const filtered = prev.filter(chat => chat.id !== chatId);
      return filtered.map((chat, index) => ({
        ...chat,
        position: index,
      }));
    });
  }, []);

  const toggleChat = useCallback((chatId: string) => {
    setActiveChats(prev => 
      prev.map(chat => 
        chat.id === chatId ? { ...chat, isCollapsed: !chat.isCollapsed } : chat
      )
    );
  }, []);

  const isChatOpen = useCallback((conversationId: number) => {
    return activeChats.some(chat => chat.conversation.id === conversationId);
  }, [activeChats]);

  const sendMessageToChat = useCallback(async (chatId: string, message: string) => {
    const chat = activeChats.find(c => c.id === chatId);
    if (!chat) return;

    try {
      await sendTextMessage(chat.conversation.id, message);
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  }, [activeChats, sendTextMessage]);

  const sendFileToChat = useCallback(async (chatId: string, file: File) => {
    const chat = activeChats.find(c => c.id === chatId);
    if (!chat) return;

    try {
      await sendFileMessage(chat.conversation.id, file);
    } catch (error) {
      console.error('Failed to send file:', error);
    }
  }, [activeChats, sendFileMessage]);

  const loadMoreMessagesForChat = useCallback(async (chatId: string, beforeId: number) => {
    const chat = activeChats.find(c => c.id === chatId);
    if (!chat || chat.isLoadingMessages) return;

    try {
      const response = await axiosInstance.get(`/messages/admin/${chat.conversation.userId}`, {
        params: { 
          lastMessageId: beforeId,
          perPage: 100
        }
      });
      
      const newMessages = response.data || [];
      
      if (newMessages.length > 0) {
        setActiveChats(prev => 
          prev.map(c => 
            c.id === chatId 
              ? { ...c, messages: [...newMessages, ...c.messages] }
              : c
          )
        );
      }
    } catch (error) {
      console.error('❌ Failed to load more messages for chat:', chatId, error);
    }
  }, [activeChats]);

  useEffect(() => {
    const cleanup = onNewMessageReceived((message, conversation) => {
      if (!conversation) return;
      
      setActiveChats(prev => 
        prev.map(chat => {
          if (chat.conversation.id === conversation.id) {
            const messageExists = chat.messages.some(m => m.id === message.id);
            if (!messageExists) {
              return {
                ...chat,
                messages: [...chat.messages, message]
              };
            }
          }
          return chat;
        })
      );
      
      const isOnChatPage = window.location.pathname.startsWith('/chat');
      if (isOnChatPage) return;
      
      const isAlreadyOpen = activeChats.some(chat => chat.conversation.id === conversation.id);
      
      if (!isAlreadyOpen) {
        openChat(conversation);
      } else {
        setActiveChats(prev => 
          prev.map(chat => 
            chat.conversation.id === conversation.id 
              ? { ...chat, isCollapsed: false }
              : chat
          )
        );
      }
    });

    return cleanup;
  }, [onNewMessageReceived, activeChats, openChat]);

  return (
    <OffCanvasChatContext.Provider value={{
      activeChats,
      openChat,
      closeChat,
      toggleChat,
      isChatOpen,
      sendMessageToChat,
      sendFileToChat,
      loadMessagesForChat,
      loadMoreMessagesForChat,
    }}>
      {children}
    </OffCanvasChatContext.Provider>
  );
};
