import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import { ApiConversation, Message, useMessages } from './MessagesContext';
import axiosInstance from '../utils/axiosInstance';

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

  // Initial sync of messages from messagesByConversationId (only when chat is first opened)
  // This ensures we get any messages that were already loaded in the main Chat page
  // Now handled directly in openChat function

  // Sync conversation data (including online status) to individual chats (real-time updates)
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

  // Direct loading function that can be called immediately without dependency issues
  const loadMessagesForChatDirect = async (chatId: string, userId: number) => {
    console.log('🔄 Direct loading messages for chat:', chatId, 'userId:', userId);

    try {
      // Load messages using the correct API endpoint
      const response = await axiosInstance.get(`/messages/admin/${userId}`);
      
      const messages = response.data || [];
      console.log('✅ Direct loaded', messages.length, 'messages for chat:', chatId);
      
      // Update messages for this specific chat only
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
    if (!chat) {
      console.log('❌ Chat not found for ID:', chatId);
      return;
    }
    
    // Check if we're already in a loading process for this specific chat
    const isCurrentlyLoading = activeChats.some(c => c.id === chatId && c.isLoadingMessages);
    if (isCurrentlyLoading) {
      console.log('⏳ Messages are already being loaded for chat:', chatId);
      // Instead of returning, let's check if we can proceed
      // Only return if we're in the middle of an API call
    }

    console.log('🔄 Loading messages for chat:', chatId, 'conversation:', chat.conversation.id, 'userId:', chat.conversation.userId);

    // Set loading state to false first to prevent the auto-loading effect from triggering again
    setActiveChats(prev => 
      prev.map(c => 
        c.id === chatId ? { ...c, isLoadingMessages: false } : c
      )
    );

    try {
      // Load messages using the correct API endpoint (userId, not conversationId)
      const response = await axiosInstance.get(`/messages/admin/${chat.conversation.userId}`);
      
      const messages = response.data || [];
      console.log('✅ Loaded', messages.length, 'messages for chat:', chatId);
      
      // Update messages for this specific chat only
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

  // Auto-load messages for chats that are still in loading state (fallback)
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
      // Check if chat is already open
      const existingChat = prev.find(chat => chat.conversation.id === conversation.id);
      if (existingChat) {
        console.log('💡 Chat already exists, expanding:', existingChat.id);
        // If already open, just expand it
        return prev.map(chat => 
          chat.id === existingChat.id 
            ? { ...chat, isCollapsed: false }
            : chat
        );
      }

      // Create new chat window with initial messages from global context if available
      const initialMessages = messagesByConversationId[conversation.id] || [];
      console.log('📝 Initial messages for conversation', conversation.id, ':', initialMessages.length);
      
      const newChat: OffCanvasChat = {
        id: `chat-${conversation.id}-${Date.now()}`,
        conversation,
        isCollapsed: false,
        position: prev.length, // Position from right
        messages: initialMessages, // Use initial messages but manage separately
        isLoadingMessages: false, // Set to false initially
      };

      console.log('✨ Created new chat:', {
        id: newChat.id,
        conversationId: conversation.id,
        messagesLength: initialMessages.length,
        isLoadingMessages: newChat.isLoadingMessages
      });

      // If no initial messages, load them immediately using setTimeout to avoid state update conflicts
      if (initialMessages.length === 0) {
        console.log('🚀 Triggering immediate message load for:', newChat.id);
        setTimeout(() => {
          loadMessagesForChatDirect(newChat.id, conversation.userId);
        }, 0);
      }

      // Add new chat and reorder positions
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
      // The message will be updated through the socket listener in real-time
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  }, [activeChats, sendTextMessage]);

  const sendFileToChat = useCallback(async (chatId: string, file: File) => {
    const chat = activeChats.find(c => c.id === chatId);
    if (!chat) return;

    try {
      await sendFileMessage(chat.conversation.id, file);
      // The message will be updated through the socket listener in real-time
    } catch (error) {
      console.error('Failed to send file:', error);
    }
  }, [activeChats, sendFileMessage]);

  const loadMoreMessagesForChat = useCallback(async (chatId: string, beforeId: number) => {
    const chat = activeChats.find(c => c.id === chatId);
    if (!chat || chat.isLoadingMessages) return;

    console.log('🔄 Loading more messages for chat:', chatId, 'before message ID:', beforeId);

    try {
      // Load more messages using the correct API endpoint and parameters
      const response = await axiosInstance.get(`/messages/admin/${chat.conversation.userId}`, {
        params: { 
          lastMessageId: beforeId,
          perPage: 100 // Load 100 more messages
        }
      });
      
      const newMessages = response.data || [];
      console.log('✅ Loaded', newMessages.length, 'more messages for chat:', chatId);
      
      if (newMessages.length > 0) {
        // Prepend new messages to existing ones
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

  // Auto-open chats when new messages are received (only when NOT on chat page)
  useEffect(() => {
    const cleanup = onNewMessageReceived((message, conversation) => {
      if (!conversation) return;
      
      // Update existing chats with new messages
      setActiveChats(prev => 
        prev.map(chat => {
          if (chat.conversation.id === conversation.id) {
            // Add new message to this chat's messages
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
      
      // Don't auto-open if user is currently on the chat page
      const isOnChatPage = window.location.pathname === '/chat';
      if (isOnChatPage) {
        return; // Exit early, don't auto-open on chat page
      }
      
      // Check if chat is already open
      const isAlreadyOpen = activeChats.some(chat => chat.conversation.id === conversation.id);
      
      if (!isAlreadyOpen) {
        // Open new chat window automatically
        openChat(conversation);
      } else {
        // If chat exists but is collapsed, expand it
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
