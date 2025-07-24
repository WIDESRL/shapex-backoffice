import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import { ApiConversation, Message, useMessages } from './MessagesContext';

export interface OffCanvasChat {
  id: string;
  conversation: ApiConversation;
  isCollapsed: boolean;
  position: number; // Index position from right (0 = rightmost)
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
    messages, 
    selectedConversationId, 
    setSelectedConversationId 
  } = useMessages();

  // Sync messages from main context to individual chats
  useEffect(() => {
    if (selectedConversationId) {
      setActiveChats(prev => 
        prev.map(chat => 
          chat.conversation.id === selectedConversationId
            ? { ...chat, messages: messages }
            : chat
        )
      );
    }
  }, [messages, selectedConversationId]);

  const openChat = useCallback((conversation: ApiConversation) => {
    setActiveChats(prev => {
      // Check if chat is already open
      const existingChat = prev.find(chat => chat.conversation.id === conversation.id);
      if (existingChat) {
        // If already open, just expand it
        return prev.map(chat => 
          chat.id === existingChat.id 
            ? { ...chat, isCollapsed: false }
            : chat
        );
      }

      // Create new chat window
      const newChat: OffCanvasChat = {
        id: `chat-${conversation.id}-${Date.now()}`,
        conversation,
        isCollapsed: false,
        position: prev.length, // Position from right
        messages: [],
        isLoadingMessages: false,
      };

      // Add new chat and reorder positions
      const newChats = [...prev, newChat];
      return newChats.map((chat, index) => ({
        ...chat,
        position: index,
      }));
    });
  }, []);

  const closeChat = useCallback((chatId: string) => {
    setActiveChats(prev => {
      const filtered = prev.filter(chat => chat.id !== chatId);
      // Reorder positions after removal
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
      // The message will be updated through the main context, 
      // but we could also add it locally for immediate feedback
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

  const loadMessagesForChat = useCallback(async (chatId: string) => {
    const chat = activeChats.find(c => c.id === chatId);
    if (!chat || chat.isLoadingMessages) return;

    // Set loading state
    setActiveChats(prev => 
      prev.map(c => 
        c.id === chatId ? { ...c, isLoadingMessages: true } : c
      )
    );

    try {
      // Set this conversation as selected to load its messages
      setSelectedConversationId(chat.conversation.id);
    } catch (error) {
      console.error('Failed to load messages:', error);
    } finally {
      // Clear loading state
      setActiveChats(prev => 
        prev.map(c => 
          c.id === chatId ? { ...c, isLoadingMessages: false } : c
        )
      );
    }
  }, [activeChats, setSelectedConversationId]);

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
    }}>
      {children}
    </OffCanvasChatContext.Provider>
  );
};
