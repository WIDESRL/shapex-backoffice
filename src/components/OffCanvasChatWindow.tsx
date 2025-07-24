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

// ===========================
// TYPES & INTERFACES
// ===========================

interface OffCanvasChatWindowProps {
  chat: OffCanvasChat;
}

// ===========================
// CONSTANTS & STYLED COMPONENTS
// ===========================

const CHAT_WIDTH = 280;
const CHAT_HEIGHT_EXPANDED = 400;
const CHAT_HEIGHT_COLLAPSED = 50;

const ChatWindow = styled(Paper, {
  shouldForwardProp: (prop) => prop !== 'isCollapsed' && prop !== 'position',
})<{ isCollapsed: boolean; position: number }>(({ isCollapsed }) => ({
  position: 'relative', 
  bottom: 'auto',
  right: 'auto', 
  width: CHAT_WIDTH,
  minWidth: CHAT_WIDTH,
  height: isCollapsed ? CHAT_HEIGHT_COLLAPSED : CHAT_HEIGHT_EXPANDED,
  backgroundColor: '#fff',
  borderRadius: '8px 8px 0 0',
  boxShadow: '0 -2px 20px rgba(0,0,0,0.15)',
  border: '1px solid #e0e0e0',
  borderBottom: 'none',
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
  flexShrink: 0, 
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

const MessageBubble = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'isMe',
})<{ isMe: boolean }>(({ isMe }) => ({
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

// Header components
const HeaderUserContainer = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: 8, // 1 * 8px
  minWidth: 0,
});

const HeaderAvatar = styled(AvatarCustom)({
  width: 24,
  height: 24,
  fontSize: '10px',
});

const HeaderUserName = styled(Typography)({
  fontWeight: 600,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  fontSize: '13px',
  fontFamily: 'Montserrat, sans-serif',
});

const OnlineIndicator = styled(Box)({
  width: 8,
  height: 8,
  borderRadius: '50%',
  backgroundColor: '#4caf50',
  border: '1px solid #fff',
});

const HeaderActions = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: 4, // 0.5 * 8px
});

const HeaderButton = styled(IconButton)({
  color: '#fff',
  padding: 4, // 0.5 * 8px
});

// Messages components
const MessagesContainerWithHeight = styled(MessagesContainer)({
  height: 308, 
  overflow: 'hidden',
});

const NoMessagesContainer = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  height: '100%',
  color: '#999',
  fontSize: '12px',
  fontFamily: 'Montserrat, sans-serif',
});

const LoadingContainer = styled(Box)({
  display: 'flex',
  justifyContent: 'center',
  paddingTop: 8, // py: 1
  paddingBottom: 8, // py: 1
});

const LoadingText = styled(Typography)({
  marginLeft: 8, // ml: 1
});

const EndMessageContainer = styled(Box)({
  display: 'flex',
  justifyContent: 'center',
  paddingTop: 24, // pt: 3
  paddingBottom: 16, // py: 2
});

const MessageContainer = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
});

const ImageMessage = styled(ImageCustom)({
  maxWidth: '120px',
  maxHeight: '80px',
  borderRadius: '6px',
  cursor: 'pointer',
});

const FileMessage = styled('a')({
  color: 'inherit',
  textDecoration: 'underline',
  fontSize: '11px',
  display: 'flex',
  alignItems: 'center',
  gap: 4, // 0.5 * 8px
  fontFamily: 'inherit',
});

const FileIcon = styled(AttachFileIcon)({
  fontSize: '12px',
});

const LoadingIndicator = styled(CircularProgress)({
  color: '#E6BB4A',
});

// Input components
const FileUploadButton = styled(IconButton, {
  shouldForwardProp: (prop) => prop !== 'component',
})<{ component?: React.ElementType }>({
  color: '#E6BB4A',
  padding: 4,
});

const SendButton = styled(IconButton)({
  color: '#E6BB4A',
  padding: 4, 
});

const infiniteScrollStyles = {
  display: 'flex',
  flexDirection: 'column-reverse' as const, 
  gap: '4px',
  padding: '8px',
  paddingTop: '16px', 
  backgroundColor: '#f7f6f3',
  overscrollBehavior: 'contain' as const, 
};
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

  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [fullscreenImage, setFullscreenImage] = useState<string | null>(null);
  const [loadingMoreMessages, setLoadingMoreMessages] = useState(false);
  const [hasMoreMessages, setHasMoreMessages] = useState(true);


  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const justSentMessageRef = useRef(false);
  const hasLoadedMessagesRef = useRef(false);
  const shouldScrollToBottomRef = useRef(true); 
  const lastLoadedMessageIdRef = useRef<number | null>(null); 

  const conversationMessages = React.useMemo(() => chat.messages, [chat.messages]);

  const reversedMessages = React.useMemo(() => {
    const uniqueMessages = conversationMessages.filter((message, index, arr) => 
      arr.findIndex(m => m.id === message.id) === index
    );
    
    const sorted = uniqueMessages.sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return dateA - dateB; 
    });

    return sorted.reverse(); 
  }, [conversationMessages]);

  useEffect(() => {
    if (reversedMessages.length > 0 && chat.conversation.firstMessageId) {
      const lowestId = Math.min(...reversedMessages.map(m => m.id));
      const canLoadMore = lowestId > chat.conversation.firstMessageId;
      setHasMoreMessages(canLoadMore);
    } else if (reversedMessages.length === 0) {
      setHasMoreMessages(true);
    }
  }, [reversedMessages, chat.conversation.firstMessageId]);

  useEffect(() => {
    if (!chat.isCollapsed && conversationMessages.length === 0 && !chat.isLoadingMessages && !hasLoadedMessagesRef.current) {
      hasLoadedMessagesRef.current = true;
      shouldScrollToBottomRef.current = true;
      loadMessagesForChat(chat.id);
    }
  }, [chat.id, chat.isCollapsed, chat.isLoadingMessages, conversationMessages.length, loadMessagesForChat]);

  useEffect(() => {
    if (!chat.isCollapsed && reversedMessages.length > 0 && shouldScrollToBottomRef.current && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ block: 'end' });
    }
  }, [reversedMessages.length, chat.isCollapsed]);

  useEffect(() => {
    if (!chat.isCollapsed && messagesEndRef.current && justSentMessageRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
      justSentMessageRef.current = false;
      shouldScrollToBottomRef.current = true;
    }
  }, [reversedMessages.length, chat.isCollapsed]); 

  useEffect(() => {
    if (!chat.isCollapsed && messagesEndRef.current && !loadingMoreMessages && shouldScrollToBottomRef.current) {
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  }, [reversedMessages.length, chat.isCollapsed, loadingMoreMessages]);

  useEffect(() => {
    if (!chat.isCollapsed && messagesEndRef.current && shouldScrollToBottomRef.current) {
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ block: 'end' });
      }, 300); 
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

  const loadMoreMessagesHandler = useCallback(async () => {
    if (loadingMoreMessages) return;
    if (reversedMessages.length === 0) return;
    if (!hasMoreMessages) return;

    const lowestId = Math.min(...reversedMessages.map(m => m.id));
    if (lastLoadedMessageIdRef.current === lowestId) return;
    
    if (lowestId <= chat.conversation.firstMessageId) {
      setHasMoreMessages(false);
      return;
    }

    lastLoadedMessageIdRef.current = lowestId;
    setLoadingMoreMessages(true);
    
    try {
      await loadMoreMessagesForChat(chat.id, lowestId);
    }  
    finally {
      setLoadingMoreMessages(false);
    }
  }, [chat.conversation.firstMessageId, reversedMessages, loadingMoreMessages, loadMoreMessagesForChat, hasMoreMessages, chat.id]);


  useEffect(() => {
    if (reversedMessages.length > 0) {
      const lowestId = Math.min(...reversedMessages.map(m => m.id));
      setHasMoreMessages(lowestId > chat.conversation.firstMessageId);
    }
  }, [reversedMessages, chat.conversation.firstMessageId]);

  useEffect(() => {
    if (!chat.isCollapsed && 
        reversedMessages.length > 0 && 
        hasMoreMessages && 
        !loadingMoreMessages && 
        !chat.isLoadingMessages) {
      
      const container = messagesContainerRef.current?.querySelector('[style*="overflow"]') as HTMLElement;
      if (container) {
        const { scrollHeight, clientHeight } = container;
        
        if (scrollHeight <= clientHeight + 10) { 
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
        <HeaderUserContainer>
          <HeaderAvatar
            src={chat.conversation.user.profilePictureFile?.signedUrl || '/profile.svg'}
            alt={userName}
            fallback={`${chat.conversation.user.firstName?.[0] || ''}${chat.conversation.user.lastName?.[0] || ''}`}
          />
          <HeaderUserName variant="body2">
            {userName}
          </HeaderUserName>
          {/* Online indicator */}
          {chat.conversation.user.online && <OnlineIndicator />}
        </HeaderUserContainer>
        
        <HeaderActions>
          <HeaderButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              toggleChat(chat.id);
            }}
          >
            {chat.isCollapsed ? <ExpandLessIcon fontSize="small" /> : <ExpandMoreIcon fontSize="small" />}
          </HeaderButton>
          <HeaderButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              closeChat(chat.id);
            }}
          >
            <CloseIcon fontSize="small" />
          </HeaderButton>
        </HeaderActions>
      </ChatHeader>

      {/* Messages (only visible when not collapsed) */}
      {!chat.isCollapsed && (
        <>
          <MessagesContainerWithHeight 
            ref={messagesContainerRef}
            id="messagesContainer"
          >
            {conversationMessages.length === 0 ? (
              <NoMessagesContainer>
                {t('chat.noMessages')}
              </NoMessagesContainer>
            ) : (
              <InfiniteScroll
                dataLength={reversedMessages.length}
                next={() => {
                  loadMoreMessagesHandler();
                }}
                hasMore={hasMoreMessages && !loadingMoreMessages}
                loader={
                  <LoadingContainer>
                    <LoadingIndicator size={16} />
                    <LoadingText variant="caption">{t('chat.loadingMore')}</LoadingText>
                  </LoadingContainer>
                }
                endMessage={
                  <EndMessageContainer>
                    <Typography variant="caption" color="text.secondary">
                      {t('chat.noMoreMessages')}
                    </Typography>
                  </EndMessageContainer>
                }
                inverse={true}
                scrollThreshold={0.7} 
                height={308}
                style={infiniteScrollStyles}
              >
                {/* Render messages using memoized reversed array */}
                {reversedMessages.map((msg: Message, index: number) => (
                  <MessageContainer key={`${msg.id}-${msg.date}-${index}`} data-msg-id={msg.id}>
                    <MessageBubble isMe={msg.fromAdminId != null}>
                      {msg.type === 'text' && msg.content}
                      {msg.type === 'file' && msg.file && (
                        <>
                          {msg.file.type?.startsWith('image/') ? (
                            <ImageMessage
                              src={msg.file.signedUrl}
                              alt={msg.file.fileName || t('chat.image')}
                              onClick={() => msg.file && setFullscreenImage(msg.file.signedUrl)}
                            />
                          ) : (
                            <FileMessage
                              href={msg.file.signedUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <FileIcon />
                              {msg.file.fileName || t('chat.file')}
                            </FileMessage>
                          )}
                        </>
                      )}
                      <MessageMeta>
                        {getMessageDateTime(msg.date)}
                      </MessageMeta>
                    </MessageBubble>
                  </MessageContainer>
                ))}
              </InfiniteScroll>
            )}
            {isLoading && (
              <LoadingContainer>
                <LoadingIndicator size={16} />
              </LoadingContainer>
            )}
            <div ref={messagesEndRef} />
          </MessagesContainerWithHeight>

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
            <FileUploadButton
              component="label"
              size="small"
              disabled={isLoading}
            >
              <input
                type="file"
                accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.txt"
                hidden
                onChange={handleFileUpload}
              />
              <AttachFileIcon fontSize="small" />
            </FileUploadButton>
            <SendButton
              onClick={handleSend}
              size="small"
              disabled={!message.trim() || isLoading}
            >
              <SendIcon fontSize="small" />
            </SendButton>
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
