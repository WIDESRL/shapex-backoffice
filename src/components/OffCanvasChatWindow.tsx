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

const ChatWindow = styled(Paper)<{ isCollapsed: boolean; position: number }>(({ isCollapsed }) => ({
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
    loadMessagesForChat 
  } = useOffCanvasChat();

  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [fullscreenImage, setFullscreenImage] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const justSentMessageRef = useRef(false);
  const hasLoadedMessagesRef = useRef(false);

  // Use messages from the chat object instead of global context
  const conversationMessages = chat.messages;

  // Load messages for this conversation when chat opens (only once)
  useEffect(() => {
    if (!chat.isCollapsed && conversationMessages.length === 0 && !chat.isLoadingMessages && !hasLoadedMessagesRef.current) {
      hasLoadedMessagesRef.current = true;
      loadMessagesForChat(chat.id);
    }
  }, [chat.id, chat.isCollapsed, chat.isLoadingMessages, conversationMessages.length, loadMessagesForChat]);

  // Auto-scroll to bottom when new messages arrive or when expanding
  useEffect(() => {
    if (!chat.isCollapsed && messagesEndRef.current && (justSentMessageRef.current || conversationMessages.length > 0)) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
      justSentMessageRef.current = false;
    }
  }, [conversationMessages, chat.isCollapsed]);

  // Scroll to bottom when expanding chat
  useEffect(() => {
    if (!chat.isCollapsed && messagesEndRef.current) {
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'auto' });
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

  const userName = `${chat.conversation.user.firstName || ''} ${chat.conversation.user.lastName || ''}`.trim() 
    || t('chat.user');

  const getMessageTime = (dateString: string) => {
    try {
      return format(parseISO(dateString), 'HH:mm');
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
          <MessagesContainer>
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
              conversationMessages.map((msg: Message) => (
                <Box key={msg.id} sx={{ display: 'flex', flexDirection: 'column' }}>
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
                      {getMessageTime(msg.date)}
                    </MessageMeta>
                  </MessageBubble>
                </Box>
              ))
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
              onChange={(e) => setMessage(e.target.value)}
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
