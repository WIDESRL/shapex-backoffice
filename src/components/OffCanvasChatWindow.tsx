import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Box,
  Paper,
  Typography,
  IconButton,
  InputBase,
  CircularProgress,
  styled,
} from '@mui/material';
import {
  Close as CloseIcon,
  ExpandLess as ExpandLessIcon,
  ExpandMore as ExpandMoreIcon,
  Send as SendIcon,
  AttachFile as AttachFileIcon,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { format, parseISO } from 'date-fns';
import InfiniteScroll from 'react-infinite-scroll-component';
import { OffCanvasChat, useOffCanvasChat } from '../Context/OffCanvasChatContext';
import { Message } from '../Context/MessagesContext';
import { useSnackbar } from '../Context/SnackbarContext';
import { handleApiError } from '../utils/errorUtils';
import AvatarCustom from './AvatarCustom';
import ImageCustom from './ImageCustom';
import FullscreenImageDialog from './FullscreenImageDialog';

interface OffCanvasChatWindowProps {
  chat: OffCanvasChat;
}

const CHAT_WIDTH = 280;
const CHAT_HEIGHT_EXPANDED = 400;
const CHAT_HEIGHT_COLLAPSED = 50;

const ChatWindow = styled(Paper, {
  shouldForwardProp: (prop) => prop !== 'isCollapsed' && prop !== 'position',
})<{ isCollapsed: boolean; position: number }>(({ isCollapsed }) => ({
  position: 'relative', // Changed from fixed to relative
  bottom: 'auto', // Remove bottom positioning
  right: 'auto', // Remove right positioning
  width: CHAT_WIDTH,
  minWidth: CHAT_WIDTH, // Ensure minimum width for horizontal scrolling
  height: isCollapsed ? CHAT_HEIGHT_COLLAPSED : CHAT_HEIGHT_EXPANDED,
  backgroundColor: '#fff',
  borderRadius: '8px 8px 0 0',
  boxShadow: '0 -2px 20px rgba(0,0,0,0.15)',
  border: '1px solid #e0e0e0',
  borderBottom: 'none',
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
  flexShrink: 0, // Prevent shrinking for horizontal scrolling
  transition: 'all 0.3s ease',
  pointerEvents: 'all'
}));

const ChatHeader = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '8px 12px',
  backgroundColor: '#E6BB4A',
  color: '#fff',
  cursor: 'pointer',
  userSelect: 'none',
  minHeight: 34,
  '&:hover': {
    backgroundColor: '#d1a53d',
  },
});

const MessagesContainer = styled(Box)({
  flex: 1,
  overflowY: 'auto',
  padding: '8px',
  display: 'flex',
  flexDirection: 'column',
  gap: '4px',
  fontSize: '13px',
  backgroundColor: '#f7f6f3',
  '&::-webkit-scrollbar': {
    width: '4px',
  },
  '&::-webkit-scrollbar-thumb': {
    background: '#e0e0e0',
    borderRadius: '4px',
  },
});

const MessageBubble = styled(Box)<{ isMe: boolean }>(({ isMe }) => ({
  alignSelf: isMe ? 'flex-end' : 'flex-start',
  backgroundColor: isMe ? '#E6BB4A' : '#fff',
  color: isMe ? '#fff' : '#333',
  borderRadius: '12px',
  borderTopRightRadius: isMe ? '4px' : '12px',
  borderTopLeftRadius: isMe ? '12px' : '4px',
  padding: '6px 10px',
  maxWidth: '85%',
  wordBreak: 'break-word',
  fontSize: '12px',
  lineHeight: 1.4,
  boxShadow: isMe ? 'none' : '0 1px 4px rgba(0,0,0,0.1)',
}));

const MessageMeta = styled(Typography)({
  fontSize: '10px',
  opacity: 0.8,
  marginTop: '2px',
  textAlign: 'right',
});

const ChatInput = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  padding: '6px 8px',
  borderTop: '1px solid #e0e0e0',
  backgroundColor: '#fff',
  gap: '4px',
});

const InputField = styled(InputBase)({
  flex: 1,
  fontSize: '13px',
  fontFamily: 'Montserrat, sans-serif',
  '& .MuiInputBase-input': {
    padding: '6px 8px',
    borderRadius: '16px',
    backgroundColor: '#f5f5f5',
    '&:focus': {
      backgroundColor: '#fff',
    },
  },
});

const OffCanvasChatWindow: React.FC<OffCanvasChatWindowProps> = ({ chat }) => {
  const { t } = useTranslation();
  const { showSnackbar } = useSnackbar();
  const { 
    closeChat, 
    toggleChat, 
    sendMessageToChat, 
    sendFileToChat, 
    loadMessagesForChat,
    loadMoreMessagesForChat 
  } = useOffCanvasChat();

  // Remove loadMoreMessages from MessagesContext as we're now using our own
  // const { loadMoreMessages } = useMessages();

  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [fullscreenImage, setFullscreenImage] = useState<string | null>(null);
  const [loadingMoreMessages, setLoadingMoreMessages] = useState(false);
  const [hasMoreMessages, setHasMoreMessages] = useState(true);

  // Debug effect for hasMoreMessages
  useEffect(() => {
    console.log('📋 hasMoreMessages state changed:', hasMoreMessages);
  }, [hasMoreMessages]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const justSentMessageRef = useRef(false);
  const hasLoadedMessagesRef = useRef(false);
  const shouldScrollToBottomRef = useRef(true); // Track if we should auto-scroll
  const lastLoadedMessageIdRef = useRef<number | null>(null); // Track last loaded message to prevent duplicate calls

  // Use messages from the chat object instead of global context
  const conversationMessages = chat.messages;

  // Process messages: deduplicate, sort, and reverse for inverse scroll rendering
  const reversedMessages = React.useMemo(() => {
    // First deduplicate by id, then sort by date
    const uniqueMessages = conversationMessages.filter((message, index, arr) => 
      arr.findIndex(m => m.id === message.id) === index
    );
    
    const sorted = uniqueMessages.sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return dateA - dateB; // Ascending order (oldest first)
    });

    return sorted.reverse(); // Reverse for inverse scroll rendering
  }, [conversationMessages]);

  // Initialize hasMoreMessages based on conversation data
  useEffect(() => {
    if (reversedMessages.length > 0 && chat.conversation.firstMessageId) {
      const lowestId = Math.min(...reversedMessages.map(m => m.id));
      const canLoadMore = lowestId > chat.conversation.firstMessageId;
      console.log('🔄 Initializing hasMoreMessages:', { lowestId, firstMessageId: chat.conversation.firstMessageId, canLoadMore });
      setHasMoreMessages(canLoadMore);
    } else if (reversedMessages.length === 0) {
      // If no messages yet, assume we can load
      setHasMoreMessages(true);
    }
  }, [reversedMessages.length, chat.conversation.firstMessageId]);

  // Load messages for this conversation when chat opens (only once)
  useEffect(() => {
    if (!chat.isCollapsed && conversationMessages.length === 0 && !chat.isLoadingMessages && !hasLoadedMessagesRef.current) {
      hasLoadedMessagesRef.current = true;
      shouldScrollToBottomRef.current = true; // Ensure we scroll to bottom after loading
      loadMessagesForChat(chat.id);
    }
  }, [chat.id, chat.isCollapsed, chat.isLoadingMessages, conversationMessages.length, loadMessagesForChat]);

  // Immediate scroll to bottom when messages first load (without animation)
  useEffect(() => {
    if (!chat.isCollapsed && reversedMessages.length > 0 && shouldScrollToBottomRef.current && messagesEndRef.current) {
      // Use scrollIntoView without behavior for immediate positioning
      messagesEndRef.current.scrollIntoView({ block: 'end' });
    }
  }, [reversedMessages.length, chat.isCollapsed]);

  // Auto-scroll to bottom when new messages arrive or when expanding (but not when loading more)
  useEffect(() => {
    if (!chat.isCollapsed && messagesEndRef.current && justSentMessageRef.current) {
      // Always scroll to bottom when user sends a message
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
      justSentMessageRef.current = false;
      shouldScrollToBottomRef.current = true; // Re-enable auto-scroll
    }
  }, [reversedMessages.length, chat.isCollapsed]); // Only trigger on message count, not entire array

  // Auto-scroll to bottom only when receiving new messages (if user wants auto-scroll)
  useEffect(() => {
    if (!chat.isCollapsed && messagesEndRef.current && !loadingMoreMessages && shouldScrollToBottomRef.current) {
      // Only auto-scroll if user wants to stay at bottom
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  }, [reversedMessages.length, chat.isCollapsed, loadingMoreMessages]); // Only trigger on message COUNT change, not content

  // Scroll to bottom when expanding chat (if should auto-scroll)
  useEffect(() => {
    if (!chat.isCollapsed && messagesEndRef.current && shouldScrollToBottomRef.current) {
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ block: 'end' });
      }, 300); // Wait for animation to complete
    }
  }, [chat.isCollapsed]);

  const handleSend = useCallback(async () => {
    if (!message.trim()) return;
    
    setIsLoading(true);
    try {
      await sendMessageToChat(chat.id, message);
      setMessage('');
      justSentMessageRef.current = true;
    } catch (error) {
      handleApiError(error, showSnackbar, t);
    } finally {
      setIsLoading(false);
    }
  }, [message, chat.id, sendMessageToChat, showSnackbar, t]);

  const handleFileUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    try {
      await sendFileToChat(chat.id, file);
      justSentMessageRef.current = true;
    } catch (error) {
      handleApiError(error, showSnackbar, t);
    } finally {
      setIsLoading(false);
      e.target.value = '';
    }
  }, [chat.id, sendFileToChat, showSnackbar, t]);

  const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }, [handleSend]);

  const handleMessageChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
  }, []);

  // Load more messages function with scroll position preservation
  const loadMoreMessagesHandler = useCallback(async () => {
    console.log('🔄 loadMoreMessagesHandler called', {
      loadingMoreMessages,
      reversedMessagesLength: reversedMessages.length,
      hasMoreMessages,
      conversationId: chat.conversation.id,
      timestamp: Date.now()
    });

    // Multiple guards to prevent repeated calls
    if (loadingMoreMessages) {
      console.log('❌ Already loading messages, skipping');
      return;
    }

    if (reversedMessages.length === 0) {
      console.log('❌ No messages yet, skipping');
      return;
    }

    if (!hasMoreMessages) {
      console.log('❌ No more messages available, skipping');
      return;
    }

    const lowestId = Math.min(...reversedMessages.map(m => m.id));
    console.log('📊 Message info:', {
      lowestId,
      firstMessageId: chat.conversation.firstMessageId,
      canLoadMore: lowestId > chat.conversation.firstMessageId,
      lastLoadedId: lastLoadedMessageIdRef.current
    });

    // Prevent duplicate calls for the same message ID
    if (lastLoadedMessageIdRef.current === lowestId) {
      console.log('❌ Already loaded messages for this ID, skipping');
      return;
    }
    
    // Check if we've reached the first message
    if (lowestId <= chat.conversation.firstMessageId) {
      console.log('🚫 Reached first message, no more to load');
      setHasMoreMessages(false);
      return;
    }

    console.log('✅ Proceeding with load more messages');
    lastLoadedMessageIdRef.current = lowestId; // Mark this ID as being loaded
    setLoadingMoreMessages(true);
    
    try {
      console.log(`🔽 Loading more messages for conversation ${chat.conversation.id}, before message ID ${lowestId}`);
      await loadMoreMessagesForChat(chat.id, lowestId);
      console.log(`✅ Successfully loaded more messages for conversation ${chat.conversation.id}`);
    } catch (error) {
      console.error('❌ Error loading more messages:', error);
    } finally {
      setLoadingMoreMessages(false);
    }
  }, [chat.conversation.id, chat.conversation.firstMessageId, reversedMessages, loadingMoreMessages, loadMoreMessagesForChat, hasMoreMessages, chat.id]);

  // Check if there are more messages to load
  useEffect(() => {
    if (reversedMessages.length > 0) {
      const lowestId = Math.min(...reversedMessages.map(m => m.id));
      setHasMoreMessages(lowestId > chat.conversation.firstMessageId);
    }
  }, [reversedMessages, chat.conversation.firstMessageId]);

  // Auto-load more messages if container is not full (for better UX)
  useEffect(() => {
    if (!chat.isCollapsed && 
        reversedMessages.length > 0 && 
        hasMoreMessages && 
        !loadingMoreMessages && 
        !chat.isLoadingMessages) {
      
      // Check if the container has enough content to be scrollable
      const container = messagesContainerRef.current?.querySelector('[style*="overflow"]') as HTMLElement;
      if (container) {
        const { scrollHeight, clientHeight } = container;
        
        // If content doesn't fill the container (no scrollbar), load more automatically
        if (scrollHeight <= clientHeight + 10) { // 10px tolerance
          console.log('🔄 Container not full, auto-loading more messages', {
            scrollHeight,
            clientHeight,
            messagesCount: reversedMessages.length
          });
          loadMoreMessagesHandler();
        }
      }
    }
  }, [reversedMessages.length, hasMoreMessages, loadingMoreMessages, chat.isCollapsed, chat.isLoadingMessages, loadMoreMessagesHandler]);

  const userName = `${chat.conversation.user.firstName || ''} ${chat.conversation.user.lastName || ''}`.trim() 
    || t('chat.user');

  const getMessageDateTime = (dateString: string) => {
    try {
      const messageDate = parseISO(dateString);
      const today = new Date();
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      
      // Check if it's today
      if (messageDate.toDateString() === today.toDateString()) {
        return format(messageDate, 'HH:mm');
      }
      // Check if it's yesterday
      else if (messageDate.toDateString() === yesterday.toDateString()) {
        return `${t('chat.yesterday')} ${format(messageDate, 'HH:mm')}`;
      }
      // For older messages, show date and time
      else {
        return format(messageDate, 'MMM dd, HH:mm');
      }
    } catch {
      return '';
    }
  };

  return (
    <ChatWindow isCollapsed={chat.isCollapsed} position={chat.position}>
      {/* Header */}
      <ChatHeader onClick={() => toggleChat(chat.id)}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 0 }}>
          <AvatarCustom
            src={chat.conversation.user.profilePictureFile?.signedUrl || '/profile.svg'}
            alt={userName}
            sx={{ width: 24, height: 24, fontSize: '10px' }}
            fallback={`${chat.conversation.user.firstName?.[0] || ''}${chat.conversation.user.lastName?.[0] || ''}`}
          />
          <Typography 
            variant="body2" 
            sx={{ 
              fontWeight: 600, 
              overflow: 'hidden', 
              textOverflow: 'ellipsis', 
              whiteSpace: 'nowrap',
              fontSize: '13px',
              fontFamily: 'Montserrat, sans-serif',
            }}
          >
            {userName}
          </Typography>
          {/* Online indicator */}
          {chat.conversation.user.online && (
            <Box
              sx={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                backgroundColor: '#4caf50',
                border: '1px solid #fff',
              }}
            />
          )}
        </Box>
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              toggleChat(chat.id);
            }}
            sx={{ color: '#fff', p: 0.5 }}
          >
            {chat.isCollapsed ? <ExpandLessIcon fontSize="small" /> : <ExpandMoreIcon fontSize="small" />}
          </IconButton>
          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              closeChat(chat.id);
            }}
            sx={{ color: '#fff', p: 0.5 }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>
      </ChatHeader>

      {/* Messages (only visible when not collapsed) */}
      {!chat.isCollapsed && (
        <>
          <MessagesContainer 
            ref={messagesContainerRef}
            id="messagesContainer"
            sx={{ 
              height: 308, // Calculated: 400 - 50 - 42 (total - header - input)
              overflow: 'hidden', // Let InfiniteScroll handle the scrolling
            }}
          >
            {conversationMessages.length === 0 ? (
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                height: '100%',
                color: '#999',
                fontSize: '12px',
                fontFamily: 'Montserrat, sans-serif',
              }}>
                {t('chat.noMessages')}
              </Box>
            ) : (
              <InfiniteScroll
                dataLength={reversedMessages.length}
                next={() => {
                  console.log('🚀 InfiniteScroll next() called!', {
                    hasMore: hasMoreMessages,
                    loading: loadingMoreMessages,
                    messagesLength: reversedMessages.length
                  });
                  loadMoreMessagesHandler();
                }}
                hasMore={hasMoreMessages && !loadingMoreMessages}
                loader={
                  <Box sx={{ display: 'flex', justifyContent: 'center', py: 1 }}>
                    <CircularProgress size={16} sx={{ color: '#E6BB4A' }} />
                    <Typography variant="caption" sx={{ ml: 1 }}>Loading more...</Typography>
                  </Box>
                }
                endMessage={
                  <Box sx={{ display: 'flex', justifyContent: 'center', py: 2, pt: 3 }}>
                    <Typography variant="caption" color="text.secondary">
                      {t('chat.noMoreMessages', 'No more messages')}
                    </Typography>
                  </Box>
                }
                inverse={true}
                scrollThreshold={0.7} // More sensitive threshold (was 0.9)
                height={308} // Explicit height for InfiniteScroll
                style={{
                  display: 'flex',
                  flexDirection: 'column-reverse', // This ensures newest messages are at bottom
                  gap: '4px',
                  padding: '8px',
                  paddingTop: '16px', // Extra padding at top to prevent content going under header
                  backgroundColor: '#f7f6f3',
                  overscrollBehavior: 'contain', // Prevent scroll chaining to parent
                }}
              >
                {/* Render messages using memoized reversed array */}
                {reversedMessages.map((msg: Message, index: number) => (
                  <Box key={`${msg.id}-${msg.date}-${index}`} data-msg-id={msg.id} sx={{ display: 'flex', flexDirection: 'column' }}>
                    <MessageBubble isMe={msg.fromAdminId != null}>
                      {msg.type === 'text' && msg.content}
                      {msg.type === 'file' && msg.file && (
                        <>
                          {msg.file.type?.startsWith('image/') ? (
                            <ImageCustom
                              src={msg.file.signedUrl}
                              alt={msg.file.fileName || t('chat.image')}
                              style={{ 
                                maxWidth: '120px', 
                                maxHeight: '80px', 
                                borderRadius: '6px',
                                cursor: 'pointer',
                              }}
                              onClick={() => msg.file && setFullscreenImage(msg.file.signedUrl)}
                            />
                          ) : (
                            <Typography
                              component="a"
                              href={msg.file.signedUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              sx={{ 
                                color: 'inherit', 
                                textDecoration: 'underline',
                                fontSize: '11px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 0.5,
                              }}
                            >
                              <AttachFileIcon sx={{ fontSize: '12px' }} />
                              {msg.file.fileName || t('chat.file')}
                            </Typography>
                          )}
                        </>
                      )}
                      <MessageMeta>
                        {getMessageDateTime(msg.date)}
                      </MessageMeta>
                    </MessageBubble>
                  </Box>
                ))}
              </InfiniteScroll>
            )}
            {isLoading && (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 1 }}>
                <CircularProgress size={16} sx={{ color: '#E6BB4A' }} />
              </Box>
            )}
            <div ref={messagesEndRef} />
          </MessagesContainer>

          {/* Input */}
          <ChatInput>
            <InputField
              placeholder={t('chat.typePlaceholder')}
              value={message}
              onChange={handleMessageChange}
              onKeyPress={handleKeyPress}
              multiline
              maxRows={3}
              disabled={isLoading}
            />
            <IconButton
              component="label"
              size="small"
              sx={{ color: '#E6BB4A', p: 0.5 }}
              disabled={isLoading}
            >
              <input
                type="file"
                accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.txt"
                hidden
                onChange={handleFileUpload}
              />
              <AttachFileIcon fontSize="small" />
            </IconButton>
            <IconButton
              onClick={handleSend}
              size="small"
              sx={{ color: '#E6BB4A', p: 0.5 }}
              disabled={!message.trim() || isLoading}
            >
              <SendIcon fontSize="small" />
            </IconButton>
          </ChatInput>
        </>
      )}
      
      {/* Fullscreen Image Dialog */}
      <FullscreenImageDialog 
        open={!!fullscreenImage} 
        imageUrl={fullscreenImage || ''} 
        onClose={() => setFullscreenImage(null)} 
      />
    </ChatWindow>
  );
};

export default OffCanvasChatWindow;
