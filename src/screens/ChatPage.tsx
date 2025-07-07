import React, { useState, useEffect, useRef } from 'react';
import { Box, Typography, List, ListItem, ListItemAvatar, ListItemText, IconButton, InputBase, Paper, CircularProgress, Button } from '@mui/material';
import { styled } from '@mui/material/styles';
import FullscreenImageDialog from '../components/FullscreenImageDialog';
import { useTranslation } from 'react-i18next';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import SendIcon from '@mui/icons-material/Send';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import { format, parseISO } from 'date-fns';
import { ApiConversation, Message, useMessages } from '../Context/MessagesContext';
import ImagePreviewIcon from '../icons/ImagePreviewIcon';
import StartConversationDialog from '../components/StartConversationDialog';
import AddIcon from '@mui/icons-material/Add';
import ImageCustom from '../components/ImageCustom';
import AvatarCustom from '../components/AvatarCustom';
import { AxiosError } from 'axios';
import { getServerErrorMessage } from '../utils/errorUtils';
import { useSnackbar } from '../Context/SnackbarContext';

// --- Styled Components ---
const ChatContainer = styled(Box)({
	display: 'flex',
	height: '100vh',
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
	overflow: 'hidden',
	padding: 0,
	[theme.breakpoints.down('sm')]: {
		display: 'flex',
		flexDirection: 'row',
		overflowX: 'auto',
		height: 90,
	},
}));

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
        resetConversationSearch,
		loadMoreMessages,
	} = useMessages();
	const [message, setMessage] = useState('');
	const [fullscreenImage, setFullscreenImage] = useState<string | null>(null);
	const [searchInput, setSearchInput] = useState(conversationSearch);
	const [startDialogOpen, setStartDialogOpen] = useState(false);
	const messagesEndRef = useRef<HTMLDivElement | null>(null);
	const messagesContainerRef = useRef<HTMLDivElement | null>(null);
	const [showScrollToBottom, setShowScrollToBottom] = useState(false);
	const justSentMessageRef = useRef(false);
	const [loadingMoreMessages, setLoadingMoreMessages] = useState(false);
	const firstVisibleMsgRef = useRef<{ id: number; offset: number } | null>(null);
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

    // Reset conversation search state on sidebar close (unmount)
    useEffect(() => {
        return () => {
            resetConversationSearch();
            setSearchInput('');
        };
    }, [resetConversationSearch]);

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
			const axiosError = error as AxiosError<{ errorCode?: string }>;
			const errorCode = axiosError?.response?.data?.errorCode;
			const errorMessage = getServerErrorMessage(errorCode, t);
			showSnackbar(errorMessage, 'error');
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
			const axiosError = error as AxiosError<{ errorCode?: string }>;
			const errorCode = axiosError?.response?.data?.errorCode;
			const errorMessage = getServerErrorMessage(errorCode, t);
			showSnackbar(errorMessage, 'error');
			console.error('Error sending message');
		} finally {
			e.target.value = '';
		}
	};

	const handleSelectConversation = (conv: ApiConversation) => {
		if (selectedConversationId === conv.id) return;
		setSelectedConversationId(conv.id);
		setConversationSeen(conv.id);
		justSentMessageRef.current = true;
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

	return (
		<ChatContainer>
			{/* Sidebar: Conversation List */}
			<Sidebar>
				<Box sx={{ p: 2, pb: 0, display: 'flex', alignItems: 'center', gap: 1 }}>
					<InputBase
						placeholder={t('Search people with name or email...')}
						value={searchInput}
						onChange={e => setSearchInput(e.target.value)}
						fullWidth
						sx={{
							background: '#f7f6f3',
							borderRadius: 8,
							px: 2,
							py: 1,
							fontFamily: 'Montserrat, sans-serif',
							fontSize: 16,
							mb: 1,
						}}
					/>
				</Box>
				{/* Conversation List and Floating New Button */}
				<Box sx={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column' }}>
					{loadingConversations && conversations.length === 0 ? (
						<Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 120 }}>
							<CircularProgress size={40} thickness={4} sx={{ color: '#FFD600' }} />
						</Box>
					) : conversations.length === 0 && !loadingConversations ? (
						<Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 120, py: 4 }}>
							<img src="/profile.svg" alt="No conversations" style={{ width: 80, height: 80, opacity: 0.7, marginBottom: 16 }} />
							<Typography sx={{ color: '#bdbdbd', fontWeight: 600, fontSize: 20, mb: 1, fontFamily: 'Montserrat, sans-serif' }}>
								{t('No conversations found')}
							</Typography>
							<Typography sx={{ color: '#bdbdbd', fontSize: 15, textAlign: 'center', maxWidth: 220, fontFamily: 'Montserrat, sans-serif' }}>
								{t('Try a different name or email.')}
							</Typography>
						</Box>
					) : (
						<ConversationList>
							{conversations.map(conv => (
								<ConversationItem
									key={conv.id}
									onClick={() => handleSelectConversation(conv)}
									sx={{ background: selectedConversationId === conv.id ? '#f7e7b6' : undefined }}
								>
									<ListItemAvatar>
										<Box sx={{ position: 'relative', display: 'inline-block' }}>
											<AvatarCustom
												src={conv.user.profilePictureFile?.signedUrl || '/profile.svg'}
												alt={((conv.user.firstName || '') + ' ' + (conv.user.lastName || '')).trim() || 'User'}
												sx={{ width: 48, height: 48 }}
												fallback={((conv.user.firstName || '')[0] || '') + ((conv.user.lastName || '')[0] || '')}
											/>
											<Box
												sx={{
													position: 'absolute',
													bottom: 2,
													right: 2,
													width: 13,
													height: 13,
													borderRadius: '50%',
													border: '2px solid #fff',
													background: conv.user.online ? '#4caf50' : '#bdbdbd',
													boxShadow: '0 0 0 1px #ececec',
												}}
											/>
										</Box>
									</ListItemAvatar>
									<ListItemText
										primary={<Typography sx={{ fontWeight: 600, fontSize: 17, color: '#616160', fontFamily: 'Montserrat, sans-serif' }} component="span">{((conv.user.firstName || '') + ' ' + (conv.user.lastName || '')).trim() || 'User'}</Typography>}
										secondary={
											<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }} component="span">
												<Typography
													sx={{
														fontSize: 14,
														color: !conv.seen ? '#222' : '#bdbdbd',
														fontWeight: !conv.seen ? 700 : 400,
														fontFamily: 'Montserrat, sans-serif',
														flex: 1,
														whiteSpace: 'nowrap',
														overflow: 'hidden',
														textOverflow: 'ellipsis',
													}}
													component="span"
												>
													{conv.lastMessage?.type === 'text' && conv.lastMessage.content
														? conv.lastMessage.content
														: conv.lastMessage?.type === 'file'
															? (conv.lastMessage.file && conv.lastMessage.file.type && conv.lastMessage.file.type.startsWith('image/')
																? <ImagePreviewIcon sx={{ fontSize: 18, verticalAlign: 'middle', mr: 0.5 }} colorOverride={conv.seen ? '#bdbdbd' : '#222'} />
																: <AttachFileIcon sx={{ fontSize: 18, verticalAlign: 'middle', color: '#E6BB4A' }} />)
														: ''}
												</Typography>
												<Typography
													sx={{
														fontSize: 12,
														color: !conv.seen ? '#222' : '#bdbdbd',
														fontWeight: !conv.seen ? 700 : 400,
														fontFamily: 'Montserrat, sans-serif',
														minWidth: 60,
														textAlign: 'right',
													}}
													component="span"
												>
													{conv.lastMessage?.date || conv.lastMessageDate
															? format(parseISO(conv.lastMessage?.date || conv.lastMessageDate), 'dd/MM/yyyy HH:mm')
															: ''}
												</Typography>
											</Box>
										}
										sx={{ minWidth: 0, maxWidth: 180 }}
									/>
								</ConversationItem>
							))}
						</ConversationList>
					)}
                    {/* Load More Button */}
                    {conversations.length > 0 && conversationHasMore && !loadingConversations && (
                        <Box sx={{ display: 'flex', justifyContent: 'center', py: 1, m: 5 }}>
                            <Button onClick={() => setConversationPage(page => page + 1)} variant="outlined" sx={{ borderRadius: 2, fontWeight: 600, color: '#E6BB4A', borderColor: '#FFD600', '&:hover': { borderColor: '#E6BB4A', background: '#fffbe6' } }}>
                                {t('Load more')}
                            </Button>
                        </Box>
                    )}
					{/* Floating New Conversation Button at the bottom */}
					<Box sx={{ position: 'sticky', bottom: 0, left: 0, width: '100%', display: 'flex', justifyContent: 'center', py: 2, zIndex: 2, background: 'rgba(255,255,255,0.95)' }}>
						<Button
							variant="contained"
							sx={{
								background: '#FFD600',
								color: '#222',
								fontWeight: 700,
								borderRadius: '50%',
								minWidth: 0,
								width: 48,
								height: 48,
								boxShadow: 3,
								'&:hover': { background: '#ffe066' },
							}}
							onClick={() => {
								setStartDialogOpen(true);
							}}
						>
							<AddIcon sx={{ fontSize: 32 }} />
						</Button>
					</Box>
				</Box>
			</Sidebar>
			{/* Main Section: Messages */}
			<MainSection>
				{/* Progress indicator at top of messages list while sending message */}
				{sendingMessage && (
					<Box sx={{ position: 'relative', width: '100%', zIndex: 10 }}>
						<Box sx={{ width: '100%', height: 4, background: '#FFD600', position: 'absolute', top: 0, left: 0 }}>
							<CircularProgress size={16} thickness={4} sx={{ color: '#FFD600', position: 'absolute', left: '50%', top: 2, transform: 'translateX(-50%)' }} />
						</Box>
					</Box>
				)}
				{loadingConversations ? (
					<Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 200 }}>
						<CircularProgress size={48} thickness={4} sx={{ color: '#FFD600' }} />
					</Box>
				) : !selectedConversation ? (
					<Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 200 }}>
						<Typography sx={{ color: '#bdbdbd', fontSize: 22, fontWeight: 500, fontFamily: 'Montserrat, sans-serif', textAlign: 'center' }}>
							{t('Please select a conversation')}
						</Typography>
					</Box>
				) : (
					<MessagesContainer ref={messagesContainerRef} onScroll={debouncedHandleMessagesScroll}>
						{/* Loading more spinner at top */}
						{loadingMoreMessages && (
							<Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 1 }}>
								<CircularProgress size={24} thickness={4} sx={{ color: '#FFD600' }} />
							</Box>
						)}
						{dateSections.map(([date, msgs]) => (
							<React.Fragment key={date}>
								<Box sx={{ textAlign: 'center', my: 2 }}>
									<Box sx={{ display: 'inline-block', background: '#fffbe6', color: '#bfa100', px: 2, py: 0.5, borderRadius: 8, fontWeight: 600, fontSize: 14, boxShadow: '0 1px 4px 0 rgba(230,187,74,0.08)' }}>
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
													alt={msg.file.fileName || 'image'}
													style={{ maxWidth: 180, maxHeight: 180, borderRadius: 8, cursor: 'pointer', margin: 2 }}
													onClick={() => msg.file && setFullscreenImage(msg.file.signedUrl)}
												/>
											)}
											{msg.type === 'file' && msg.file && (!msg.file.type || !msg.file.type.startsWith('image/')) && (
												<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
													<IconButton href={msg.file.signedUrl} target="_blank" rel="noopener noreferrer" size="small" sx={{ color: '#E6BB4A' }}>
														<AttachFileIcon />
													</IconButton>
													<Typography
														component="a"
														href={msg.file.signedUrl}
														target="_blank"
														rel="noopener noreferrer"
														sx={{ fontWeight: 500, textDecoration: 'underline', fontSize: 15 }}
													>
														{msg.file.fileName || 'File'}
													</Typography>
												</Box>
											)}
											<MessageMeta title={format(parseISO(msg.date), 'dd/MM/yyyy HH:mm:ss')}>
												{format(parseISO(msg.date), 'HH:mm')}
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
							<Box sx={{ position: 'fixed', bottom: 90, right: 32, zIndex: 1200 }}>
								<IconButton color="primary" sx={{ background: '#FFD600', boxShadow: 3 }} onClick={handleScrollToBottom} size="large">
									<ArrowDownwardIcon sx={{ color: '#fff' }} />
								</IconButton>
							</Box>
						)}
					</MessagesContainer>
				)}
				{/* Chat input */}
				{!!selectedConversation && !loadingConversations && (
					<ChatInputContainer elevation={0}>
						<InputBase
							placeholder={t('Type a message...')}
							value={message}
							onChange={e => setMessage(e.target.value)}
							onKeyDown={e => { if (e.key === 'Enter') handleSend(); }}
							sx={{ flex: 1, fontSize: 17, fontFamily: 'Montserrat, sans-serif', px: 1 }}
							inputProps={{ maxLength: 1000 }}
						/>
						<IconButton component="label" sx={{ color: '#E6BB4A', mx: 1 }}>
							<input type="file" accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.txt" hidden onChange={handleFileUpload} />
							<AttachFileIcon />
						</IconButton>
						<IconButton onClick={handleSend} sx={{ color: '#E6BB4A', ml: 1 }}>
							<SendIcon fontSize="medium" />
						</IconButton>
					</ChatInputContainer>
				)}
				{/* New conversation dialog */}
				<StartConversationDialog
					open={startDialogOpen}
					onClose={() => setStartDialogOpen(false)}
					onSend={async (userId, message, file) => {
						if (file) {
							await sendFileMessage(undefined, file, userId);
						} else if (message.trim()) {
							await sendTextMessage(undefined, message, userId);
						}
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