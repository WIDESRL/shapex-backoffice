import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, List, ListItem, ListItemAvatar, ListItemText, IconButton, InputBase, Paper, CircularProgress, Button, Tooltip } from '@mui/material';
import { styled } from '@mui/material/styles';
import FullscreenImageDialog from '../components/FullscreenImageDialog';
import { useTranslation } from 'react-i18next';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import SendIcon from '@mui/icons-material/Send';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { format, parseISO } from 'date-fns';
import { ApiConversation, Message, useMessages } from '../Context/MessagesContext';
import { useOffCanvasChat } from '../Context/OffCanvasChatContext';
import ImagePreviewIcon from '../icons/ImagePreviewIcon';
import StartConversationDialog from '../components/StartConversationDialog';
import StartNewConversationDialogs from '../components/StartNewConversationDialogs';
import AddIcon from '@mui/icons-material/Add';
import ImageCustom from '../components/ImageCustom';
import AvatarCustom from '../components/AvatarCustom';
import { handleApiError } from '../utils/errorUtils';
import { useSnackbar } from '../Context/SnackbarContext';

const styles = {
  searchInput: {
    background: '#f7f6f3',
    borderRadius: 8,
    px: 2,
    py: 1,
    fontFamily: 'Montserrat, sans-serif',
    fontSize: 16,
    mb: 1,
  },
  loadingContainer: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 120,
  },
  loadingSpinner: {
    color: '#FFD600',
  },
  emptyStateContainer: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 120,
    py: 4,
  },
  emptyStateImage: {
    width: 80,
    height: 80,
    opacity: 0.7,
    marginBottom: 16,
  },
  emptyStateTitle: {
    color: '#bdbdbd',
    fontWeight: 600,
    fontSize: 20,
    mb: 1,
    fontFamily: 'Montserrat, sans-serif',
  },
  emptyStateDescription: {
    color: '#bdbdbd',
    fontSize: 15,
    textAlign: 'center',
    maxWidth: 220,
    fontFamily: 'Montserrat, sans-serif',
  },
  conversationItemSelected: {
    background: '#f7e7b6',
  },
  avatarContainer: {
    position: 'relative',
    display: 'inline-block',
  },
  avatar: {
    width: 48,
    height: 48,
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 13,
    height: 13,
    borderRadius: '50%',
    border: '2px solid #fff',
    boxShadow: '0 0 0 1px #ececec',
  },
  userNamePrimary: {
    fontWeight: 600,
    fontSize: 17,
    color: '#616160',
    fontFamily: 'Montserrat, sans-serif',
  },
  conversationSecondary: {
    display: 'flex',
    alignItems: 'center',
    gap: 1,
  },
  lastMessageText: {
    fontSize: 14,
    fontFamily: 'Montserrat, sans-serif',
    flex: 1,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  messageTimestamp: {
    fontSize: 12,
    fontFamily: 'Montserrat, sans-serif',
    minWidth: 60,
    textAlign: 'right',
  },
  listItemText: {
    minWidth: 0,
    maxWidth: 180,
  },
  loadMoreButton: {
    borderRadius: 2,
    fontWeight: 600,
    color: '#E6BB4A',
    borderColor: '#FFD600',
    '&:hover': {
      borderColor: '#E6BB4A',
      background: '#fffbe6',
    },
  },
  loadMoreContainer: {
    display: 'flex',
    justifyContent: 'center',
    py: 1,
    m: 5,
  },
  floatingButtonContainer: {
    position: 'sticky',
    bottom: 0,
    left: 0,
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    py: 2,
    zIndex: 2,
    background: 'rgba(255,255,255,0.95)',
  },
  floatingButton: {
    background: '#FFD600',
    color: '#222',
    fontWeight: 700,
    borderRadius: '50%',
    minWidth: 0,
    width: 48,
    height: 48,
    boxShadow: 3,
    '&:hover': {
      background: '#ffe066',
    },
  },
  floatingButtonIcon: {
    fontSize: 32,
  },
  progressIndicator: {
    position: 'relative',
    width: '100%',
    zIndex: 10,
  },
  progressBar: {
    width: '100%',
    height: 4,
    background: '#FFD600',
    position: 'absolute',
    top: 0,
    left: 0,
  },
  progressSpinner: {
    color: '#FFD600',
    position: 'absolute',
    left: '50%',
    top: 2,
    transform: 'translateX(-50%)',
  },
  mainLoadingContainer: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 200,
  },
  mainLoadingSpinner: {
    color: '#FFD600',
  },
  emptyConversationContainer: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 200,
  },
  emptyConversationText: {
    color: '#bdbdbd',
    fontSize: 22,
    fontWeight: 500,
    fontFamily: 'Montserrat, sans-serif',
    textAlign: 'center',
  },
  loadingMoreContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    py: 1,
  },
  loadingMoreSpinner: {
    color: '#FFD600',
  },
  dateSeparatorContainer: {
    textAlign: 'center',
    my: 2,
  },
  dateSeparator: {
    display: 'inline-block',
    background: '#fffbe6',
    color: '#bfa100',
    px: 2,
    py: 0.5,
    borderRadius: 8,
    fontWeight: 600,
    fontSize: 14,
    boxShadow: '0 1px 4px 0 rgba(230,187,74,0.08)',
  },
  imageMessage: {
    maxWidth: 180,
    maxHeight: 180,
    borderRadius: 8,
    cursor: 'pointer',
    margin: 2,
  },
  fileMessageContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: 1,
  },
  fileIcon: {
    color: '#E6BB4A',
  },
  fileLink: {
    fontWeight: 500,
    textDecoration: 'underline',
    fontSize: 15,
  },
  messageMetaTitle: (date: string) => format(parseISO(date), 'dd/MM/yyyy HH:mm:ss'),
  messageMeta: (date: string) => format(parseISO(date), 'HH:mm'),
  scrollToBottomContainer: {
    position: 'fixed',
    bottom: 90,
    right: 32,
    zIndex: 1200,
  },
  scrollToBottomButton: {
    background: '#FFD600',
    boxShadow: 3,
  },
  scrollToBottomIcon: {
    color: '#fff',
  },
  chatInputContainer: {
    flex: 1,
    fontSize: 17,
    fontFamily: 'Montserrat, sans-serif',
    px: 1,
  },
  chatInputProps: {
    maxLength: 1000,
  },
  attachButton: {
    color: '#E6BB4A',
    mx: 1,
  },
  sendButton: {
    color: '#E6BB4A',
    ml: 1,
  },
  imagePreviewIcon: {
    fontSize: 18,
    verticalAlign: 'middle',
    mr: 0.5,
  },
  attachFileIcon: {
    fontSize: 18,
    verticalAlign: 'middle',
    color: '#E6BB4A',
  },
};

// --- Styled Components ---
const ChatContainer = styled(Box)({
	display: 'flex',
	height: '100%',
	background: '#f7f6f3',
	fontFamily: 'Montserrat, sans-serif',
});

const Sidebar = styled(Box)(({ theme }) => ({
	width: 340,
	minWidth: 260,
	maxWidth: 400,
	background: '#fff',
	borderRight: '1px solid #ececec',
	display: 'flex',
	flexDirection: 'column',
	[theme.breakpoints.down('sm')]: {
		width: '100vw',
		maxWidth: '100vw',
		minWidth: 0,
		borderRight: 'none',
		borderBottom: '1px solid #ececec',
		height: 90,
		flexDirection: 'row',
		overflowX: 'auto',
	},
}));

const ConversationList = styled(List)(({ theme }) => ({
	flex: 1,
	overflowX: 'hidden',
	padding: 0,
	[theme.breakpoints.down('sm')]: {
		display: 'flex',
		flexDirection: 'row',
		overflowX: 'auto',
		height: 90,
	},
}));

const ConversationListContainer = styled(Box)({
	position: 'relative',
	flex: 1,
	display: 'flex',
	flexDirection: 'column',
	overflow: 'scroll',
});

const ConversationItem = styled(ListItem)(({ theme }) => ({
	cursor: 'pointer',
	borderRadius: 12,
	margin: 4,
	padding: 8,
	transition: 'background 0.2s',
	'&:hover': {
		background: '#f5f5f5',
	},
	[theme.breakpoints.down('sm')]: {
		flexDirection: 'column',
		alignItems: 'center',
		minWidth: 120,
		maxWidth: 160,
		padding: 4,
		margin: 2,
	},
}));

const MainSection = styled(Box)(({ theme }) => ({
	flex: 1,
	display: 'flex',
	flexDirection: 'column',
	background: '#f7f6f3',
	[theme.breakpoints.down('sm')]: {
		width: '100vw',
		minWidth: 0,
		padding: 0,
	},
}));

const MessagesContainer = styled(Box)(({ theme }) => ({
	flex: 1,
	overflowY: 'auto',
	padding: theme.spacing(3),
	display: 'flex',
	flexDirection: 'column',
	gap: theme.spacing(2),
	// Custom scrollbar styles
	'&::-webkit-scrollbar': {
		height: '1px', // horizontal scrollbar height
		width: '4px', // vertical scrollbar width (unchanged)
	},
	'&::-webkit-scrollbar-thumb': {
		background: '#e0e0e0',
		borderRadius: 4,
	},
	'&::-webkit-scrollbar-track': {
		background: 'transparent',
	},
	[theme.breakpoints.down('sm')]: {
		padding: theme.spacing(1),
		gap: theme.spacing(1),
	},
}));

const MessageRow = styled(Box, { shouldForwardProp: (prop) => prop !== 'isMe' })<{ isMe: boolean }>(({ isMe }) => ({
	display: 'flex',
	justifyContent: isMe ? 'flex-end' : 'flex-start',
}));

const MessageBubble = styled(Box, { shouldForwardProp: (prop) => prop !== 'isMe' })<{ isMe: boolean }>(({ theme, isMe }) => ({
	background: isMe ? 'linear-gradient(90deg, #E6BB4A 0%, #FFD600 100%)' : '#fff',
	color: isMe ? '#fff' : '#616160',
	borderRadius: 16,
	borderTopRightRadius: isMe ? 4 : 16,
	borderTopLeftRadius: isMe ? 16 : 4,
	boxShadow: isMe ? '0 2px 8px 0 rgba(230,187,74,0.08)' : '0 2px 8px 0 rgba(0,0,0,0.04)',
	padding: theme.spacing(1.5, 2),
	maxWidth: '70vw',
	minWidth: 40,
	fontSize: 16,
	wordBreak: 'break-word',
	marginBottom: 2,
	position: 'relative',
	[theme.breakpoints.down('sm')]: {
		fontSize: 14,
		padding: theme.spacing(1, 1.5),
		maxWidth: '90vw',
	},
}));

const MessageMeta = styled(Box)({
	fontSize: 12,
	color: '#171616',
	marginTop: 2,
	textAlign: 'right',
});

const ChatInputContainer = styled(Paper)(({ theme }) => ({
	display: 'flex',
	alignItems: 'center',
	borderRadius: 24,
	boxShadow: '0 2px 8px 0 rgba(0,0,0,0.04)',
	padding: theme.spacing(1, 2),
	margin: theme.spacing(2, 2, 2, 2),
	background: '#fff',
	[theme.breakpoints.down('sm')]: {
		margin: theme.spacing(1, 1, 1, 1),
		padding: theme.spacing(1, 1),
	},
}));

// Debounce utility
function debounce<T extends (...args: unknown[]) => void>(fn: T, delay: number) {
  let timer: ReturnType<typeof setTimeout> | null = null;
  return (...args: Parameters<T>) => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

// --- Chat Page ---
const ChatPageContent: React.FC = () => {
	const { t } = useTranslation();
	const { userId } = useParams<{ userId: string }>();
	const navigate = useNavigate();
	const {
		conversations,
		selectedConversationId,
		setSelectedConversationId,
		setConversationSeen,
		messages,
		sendTextMessage,
		sendFileMessage,
		sendingMessage,
        conversationSearch,
        setConversationSearch,
        conversationPage,
        setConversationPage,
        conversationHasMore,
        fetchConversations,
        loadingConversations,
        // resetConversationSearch,
		loadMoreMessages,
	} = useMessages();

	const { openChat } = useOffCanvasChat();
	const [message, setMessage] = useState('');
	const [fullscreenImage, setFullscreenImage] = useState<string | null>(null);
	const [searchInput, setSearchInput] = useState(conversationSearch);
	const [startDialogOpen, setStartDialogOpen] = useState(false);
	const [userIdToMessage, setUserIdToMessage] = useState<number | null>(null);
	const messagesEndRef = useRef<HTMLDivElement | null>(null);
	const messagesContainerRef = useRef<HTMLDivElement | null>(null);
	const [showScrollToBottom, setShowScrollToBottom] = useState(false);
	const justSentMessageRef = useRef(false);
	const [loadingMoreMessages, setLoadingMoreMessages] = useState(false);
	const firstVisibleMsgRef = useRef<{ id: number; offset: number } | null>(null);
	const checkedUserIdRef = useRef<number | null>(null);
  const { showSnackbar } = useSnackbar();

    // Debounce search input for conversations
    useEffect(() => {
        const handler = setTimeout(() => {
            setConversationSearch(searchInput);
            setConversationPage(1);
        }, 700);
        return () => clearTimeout(handler);
    }, [searchInput, setConversationSearch, setConversationPage]);

    // Fetch conversations on mount, search, or page change
    useEffect(() => {
        fetchConversations({ append: conversationPage > 1 });
    }, [conversationSearch, conversationPage, fetchConversations]);

    // Preselect conversation based on userId from URL
    useEffect(() => {
        if (userId && conversations.length > 0) {
            const userIdNum = parseInt(userId, 10);
            const conversation = conversations.find(conv => conv.userId === userIdNum);
            if (conversation && selectedConversationId !== conversation.id) {
                setSelectedConversationId(conversation.id);
                setConversationSeen(conversation.id);
                justSentMessageRef.current = true;
                checkedUserIdRef.current = userIdNum;
            } else if (!conversation && checkedUserIdRef.current !== userIdNum) {
                // Conversation not found for this userId
                setSelectedConversationId(null);
                setUserIdToMessage(userIdNum);
                checkedUserIdRef.current = userIdNum;
            }
        }
    }, [userId, conversations, selectedConversationId, setSelectedConversationId, setConversationSeen, showSnackbar, t]);

    // Reset conversation search state on sidebar close (unmount)
    // useEffect(() => {
    //     return () => {
    //         resetConversationSearch();
    //         setSearchInput('');
    //     };
    // }, [resetConversationSearch]);

	const selectedConversation = selectedConversationId
		? conversations.find(c => c.id === selectedConversationId) || null
		: null;

	// Infinite scroll: load more messages when scrolled to top
	const handleMessagesScroll = React.useCallback(async () => {
		const container = messagesContainerRef.current;
		if (container && selectedConversation) {
			const msgs = messages as { id: number }[];
			if (
				container.scrollTop < 80 &&
				!loadingMoreMessages &&
				msgs.length > 0
			) {
				const lowestId = Math.min(...msgs.map(m => m.id));
				// Only load more if we haven't reached the firstMessageId
				if (lowestId > selectedConversation.firstMessageId) {
					setLoadingMoreMessages(true);
					// Find the first visible message
					const children = Array.from(container.querySelectorAll('[data-msg-id]'));
					let firstVisible: HTMLElement | null = null;
					for (const el of children) {
						const rect = (el as HTMLElement).getBoundingClientRect();
						const containerRect = container.getBoundingClientRect();
						if (rect.bottom > containerRect.top) {
							firstVisible = el as HTMLElement;
							break;
						}
					}
					if (firstVisible) {
						firstVisibleMsgRef.current = {
							id: Number(firstVisible.getAttribute('data-msg-id')),
							offset: firstVisible.offsetTop - container.scrollTop,
						};
					} else {
						firstVisibleMsgRef.current = null;
					}
					await loadMoreMessages(selectedConversation.id, lowestId);
					setLoadingMoreMessages(false);
				}
			}
			const atBottom = container.scrollHeight - container.scrollTop - container.clientHeight < 100;
			setShowScrollToBottom(!atBottom);
		}
	}, [selectedConversation, messages, loadingMoreMessages, loadMoreMessages]);

	// Adjust scroll position after loading more messages
	useEffect(() => {
		if (!loadingMoreMessages && firstVisibleMsgRef.current && messagesContainerRef.current) {
			const container = messagesContainerRef.current;
			const { id, offset } = firstVisibleMsgRef.current;
			const el = container.querySelector(`[data-msg-id="${id}"]`) as HTMLElement | null;
			if (el) {
				container.scrollTop = el.offsetTop - offset;
			}
			firstVisibleMsgRef.current = null;
		}
	}, [loadingMoreMessages, messages]);

	const handleScrollToBottom = () => {
		messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
	};

	// Scroll to bottom ONLY when a new message is sent or conversation changes
	useEffect(() => {
		let timeoutId: ReturnType<typeof setTimeout> | null = null;
		if (selectedConversationId && messagesEndRef.current && justSentMessageRef.current) {
			timeoutId = setTimeout(() => {
				messagesEndRef.current?.scrollIntoView({ behavior: 'auto' });
				justSentMessageRef.current = false;
			}, 100);
		}
		return () => {
			if (timeoutId) clearTimeout(timeoutId);
		};
	}, [messages, selectedConversationId]);

	// Scroll to bottom when sendingMessage transitions from true to false
	useEffect(() => {
		if (!sendingMessage) {
			setTimeout(() => {
                if(messagesEndRef.current) messagesEndRef.current.scrollIntoView({ behavior: 'auto' });
            }, 100); // Small delay to ensure UI updates
		}
	}, [sendingMessage]);

		useEffect(() => {
			setMessage(''); // Clear message input when conversation changes
		}, [selectedConversationId]);

	const handleSend = async () => {
		try{
			if (!message.trim() || !selectedConversationId) return;
			await sendTextMessage(selectedConversationId, message);
			setMessage('');
			justSentMessageRef.current = true;
		}
		catch (error) {
			handleApiError(error, showSnackbar, t);
			console.error('Error sending message');
		}
	};

	const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file || !selectedConversationId) {
			e.target.value = '';
			return;
		}
		try {
			await sendFileMessage(selectedConversationId, file);
			justSentMessageRef.current = true;
		} catch (error) {
			handleApiError(error, showSnackbar, t);
			console.error('Error sending message');
		} finally {
			e.target.value = '';
		}
	};

	const handleSelectConversation = (conv: ApiConversation) => {
		if (selectedConversationId === conv.id) return;
		// Just update the URL - the effect will handle selecting the conversation
		navigate(`/chat/${conv.userId}`, { replace: true });
	};

	// Group messages by date
	const groupedMessages = messages.reduce((acc: Record<string, Message[]>, msg: Message) => {
		const dateKey = format(parseISO(msg.date), 'dd/MM/yyyy');
		if (!acc[dateKey]) acc[dateKey] = [];
		acc[dateKey].push(msg);
		return acc;
	}, {});
	const dateSections: [string, Message[]][] = Object.entries(groupedMessages);

	const debouncedHandleMessagesScroll = React.useMemo(
		() => debounce(handleMessagesScroll, 500),
		[handleMessagesScroll]
	);

	useEffect(() => {
		setTimeout(() => {
			const selectedConversation = conversations.find(conv => conv.id === selectedConversationId)
			if(selectedConversation && selectedConversation.seen === false) setConversationSeen(selectedConversation.id)
		}, 500)
	}, [conversations, selectedConversationId, setConversationSeen])

	return (
		<ChatContainer>
			{/* Sidebar: Conversation List */}
			<Sidebar>
				<Box sx={{ p: 2, pb: 0, display: 'flex', alignItems: 'center', gap: 1 }}>
					<InputBase
						placeholder={t('chat.searchPlaceholder')}
						value={searchInput}
						onChange={e => setSearchInput(e.target.value)}
						fullWidth
						sx={styles.searchInput}
					/>
				</Box>
				{/* Conversation List and Floating New Button */}
				<ConversationListContainer>
					{loadingConversations && conversations.length === 0 ? (
						<Box sx={styles.loadingContainer}>
							<CircularProgress size={40} thickness={4} sx={styles.loadingSpinner} />
						</Box>
					) : conversations.length === 0 && !loadingConversations ? (
						<Box sx={styles.emptyStateContainer}>
							<img src="/profile.svg" alt="No conversations" style={styles.emptyStateImage} />
							<Typography sx={styles.emptyStateTitle}>
								{t('chat.noConversationsFound')}
							</Typography>
							<Typography sx={styles.emptyStateDescription}>
								{t('chat.tryDifferentSearch')}
							</Typography>
						</Box>
					) : (
						<ConversationList>
							{conversations.map(conv => (
								<ConversationItem
									key={conv.id}
									onClick={() => handleSelectConversation(conv)}
									sx={selectedConversationId === conv.id ? styles.conversationItemSelected : undefined}
								>
									<ListItemAvatar>
										<Box sx={styles.avatarContainer}>
											<AvatarCustom
												src={conv.user.profilePictureFile?.signedUrl || '/profile.svg'}
												alt={((conv.user.firstName || '') + ' ' + (conv.user.lastName || '')).trim() || t('chat.user')}
												sx={styles.avatar}
												fallback={((conv.user.firstName || '')[0] || '') + ((conv.user.lastName || '')[0] || '')}
											/>
											<Box
												sx={{
													...styles.onlineIndicator,
													background: conv.user.online ? '#4caf50' : '#bdbdbd',
												}}
											/>
										</Box>
									</ListItemAvatar>
									<ListItemText
										primary={<Typography sx={styles.userNamePrimary} component="span">{((conv.user.firstName || '') + ' ' + (conv.user.lastName || '')).trim() || t('chat.user')}</Typography>}
										secondary={
											<Box sx={styles.conversationSecondary} component="span">
												<Typography
													sx={{
														...styles.lastMessageText,
														color: !conv.seen ? '#222' : '#bdbdbd',
														fontWeight: !conv.seen ? 700 : 400,
													}}
													component="span"
												>
													{conv.lastMessage?.type === 'text' && conv.lastMessage.content
														? conv.lastMessage.content
														: conv.lastMessage?.type === 'file'
															? (conv.lastMessage.file && conv.lastMessage.file.type && conv.lastMessage.file.type.startsWith('image/')
																? <ImagePreviewIcon sx={{...styles.imagePreviewIcon, color: conv.seen ? '#bdbdbd' : '#222'}} />
																: <AttachFileIcon sx={styles.attachFileIcon} />)
														: ''}
												</Typography>
												<Typography
													sx={{
														...styles.messageTimestamp,
														color: !conv.seen ? '#222' : '#bdbdbd',
														fontWeight: !conv.seen ? 700 : 400,
													}}
													component="span"
												>
													{conv.lastMessage?.date || conv.lastMessageDate
															? format(parseISO(conv.lastMessage?.date || conv.lastMessageDate), 'dd/MM/yyyy HH:mm')
															: ''}
												</Typography>
											</Box>
										}
										sx={styles.listItemText}
									/>
									<Tooltip title={t('chat.openOffCanvas', 'Open in floating window')}>
										<IconButton
											onClick={(e) => {
												e.preventDefault();
												e.stopPropagation();
												e.nativeEvent.stopImmediatePropagation();
												openChat(conv);
											}}
											size="small"
											sx={{
												marginLeft: 1,
												color: 'primary.main',
												'&:hover': {
													backgroundColor: 'rgba(25, 118, 210, 0.04)'
												}
											}}
										>
											<OpenInNewIcon fontSize="small" />
										</IconButton>
									</Tooltip>
								</ConversationItem>
							))}
						</ConversationList>
					)}
                    {/* Load More Button */}
                    {conversations.length > 0 && conversationHasMore && !loadingConversations && (
                        <Box sx={styles.loadMoreContainer}>
                            <Button onClick={() => setConversationPage(page => page + 1)} variant="outlined" sx={styles.loadMoreButton}>
                                {t('Load more')}
                            </Button>
                        </Box>
                    )}
					{/* Floating New Conversation Button at the bottom */}
					<Box sx={styles.floatingButtonContainer}>
						<Button
							variant="contained"
							sx={styles.floatingButton}
							onClick={() => {
								setStartDialogOpen(true);
							}}
						>
							<AddIcon sx={styles.floatingButtonIcon} />
						</Button>
					</Box>
				</ConversationListContainer>
			</Sidebar>
			{/* Main Section: Messages */}
			<MainSection>
				{/* Progress indicator at top of messages list while sending message */}
				{sendingMessage && (
					<Box sx={styles.progressIndicator}>
						<Box sx={styles.progressBar}>
							<CircularProgress size={16} thickness={4} sx={styles.progressSpinner} />
						</Box>
					</Box>
				)}
				{loadingConversations ? (
					<Box sx={styles.mainLoadingContainer}>
						<CircularProgress size={48} thickness={4} sx={styles.mainLoadingSpinner} />
					</Box>
				) : !selectedConversation ? (
					<Box sx={styles.emptyConversationContainer}>
						<Typography sx={styles.emptyConversationText}>
							{t('chat.pleaseSelectConversation')}
						</Typography>
					</Box>
				) : (
					<MessagesContainer ref={messagesContainerRef} onScroll={debouncedHandleMessagesScroll}>
						{/* Loading more spinner at top */}
						{loadingMoreMessages && (
							<Box sx={styles.loadingMoreContainer}>
								<CircularProgress size={24} thickness={4} sx={styles.loadingMoreSpinner} />
							</Box>
						)}
						{dateSections.map(([date, msgs]) => (
							<React.Fragment key={date}>
								<Box sx={styles.dateSeparatorContainer}>
									<Box sx={styles.dateSeparator}>
										{date}
									</Box>
								</Box>
								{msgs.map((msg: Message, idx: number) => (
									<MessageRow key={msg.id} isMe={msg.fromAdminId != null} data-msg-id={msg.id}>
										<MessageBubble isMe={msg.fromAdminId != null}>
											{msg.type === 'text' && (
												<span>{msg.content}</span>
											)}
											{msg.type === 'file' && msg.file && msg.file.type && msg.file.type.startsWith('image/') && (	
												<ImageCustom
													src={msg.file.signedUrl}
													alt={msg.file.fileName || t('chat.image')}
													style={styles.imageMessage}
													onClick={() => msg.file && setFullscreenImage(msg.file.signedUrl)}
												/>
											)}
											{msg.type === 'file' && msg.file && (!msg.file.type || !msg.file.type.startsWith('image/')) && (
												<Box sx={styles.fileMessageContainer}>
													<IconButton href={msg.file.signedUrl} target="_blank" rel="noopener noreferrer" size="small" sx={styles.fileIcon}>
														<AttachFileIcon />
													</IconButton>
													<Typography
														component="a"
														href={msg.file.signedUrl}
														target="_blank"
														rel="noopener noreferrer"
														sx={styles.fileLink}
													>
														{msg.file.fileName || t('chat.file')}
													</Typography>
												</Box>
											)}
											<MessageMeta title={styles.messageMetaTitle(msg.date)}>
												{styles.messageMeta(msg.date)}
											</MessageMeta>
										</MessageBubble>
										{/* Place the ref on the very last message */}
										{dateSections[dateSections.length - 1][0] === date && idx === msgs.length - 1 && (
											<div ref={messagesEndRef} />
										)}
									</MessageRow>
								))}
							</React.Fragment>
						))}
						{/* Scroll to bottom indicator */}
						{showScrollToBottom && (
							<Box sx={styles.scrollToBottomContainer}>
								<IconButton color="primary" sx={styles.scrollToBottomButton} onClick={handleScrollToBottom} size="large">
									<ArrowDownwardIcon sx={styles.scrollToBottomIcon} />
								</IconButton>
							</Box>
						)}
					</MessagesContainer>
				)}
				{/* Chat input */}
				{!!selectedConversation && !loadingConversations && (
					<ChatInputContainer elevation={0}>
						<InputBase
							placeholder={t('chat.typePlaceholder')}
							value={message}
							onChange={e => setMessage(e.target.value)}
							onKeyDown={e => { if (e.key === 'Enter') handleSend(); }}
							sx={styles.chatInputContainer}
							inputProps={styles.chatInputProps}
						/>
						<IconButton component="label" sx={styles.attachButton}>
							<input type="file" accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.txt" hidden onChange={handleFileUpload} />
							<AttachFileIcon />
						</IconButton>
						<IconButton onClick={handleSend} sx={styles.sendButton}>
							<SendIcon fontSize="medium" />
						</IconButton>
					</ChatInputContainer>
				)}
				{/* New conversation dialog */}
				<StartConversationDialog
					open={startDialogOpen}
					onClose={() => setStartDialogOpen(false)}
					onSend={async (userId, message, file) => {
						try{
							if (file) {
								await sendFileMessage(undefined, file, userId);
							} else if (message.trim()) {
								await sendTextMessage(undefined, message, userId);
							}
						}
						catch (error) {
							handleApiError(error, showSnackbar, t);
						}	
						
					}}
				/>
				{/* Start new conversation dialogs */}
				<StartNewConversationDialogs
					userId={userIdToMessage}
					onClose={() => setUserIdToMessage(null)}
					onSuccess={() => {
						// Conversation was created, navigate to it if possible
						setUserIdToMessage(null);
					}}
				/>
			</MainSection>
			{/* Fullscreen image dialog */}
			<FullscreenImageDialog open={!!fullscreenImage} imageUrl={fullscreenImage || ''} onClose={() => setFullscreenImage(null)} />
		</ChatContainer>
	);
};

const ChatPage = () => <ChatPageContent />;

export default ChatPage;