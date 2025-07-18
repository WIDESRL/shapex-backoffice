import React, { useEffect, useState, useMemo } from 'react';
import { Box, Typography, Paper, Button, InputBase, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, CircularProgress, FormControl, InputLabel, Select, MenuItem, SelectChangeEvent } from '@mui/material';
import MagnifierIcon from '../icons/MagnifierIcon';
import BannerFormDialog, { BannerForm } from '../components/BannerFormDialog';
import DeleteConfirmationDialog from '../screens/Subscription/DeleteConfirmationDialog';
import EditIcon from '../icons/EditIcon';
import DeleteIcon from '../icons/DeleteIcon';
import { useBanners, Banner } from '../Context/BannersContext';
import { useTranslation } from 'react-i18next';
import FullscreenImageDialog from '../components/FullscreenImageDialog';
import ImageCustom from '../components/ImageCustom';
import { BANNER_SIZES } from '../constants/bannerSizes';

const styles = {
	pageContainer: {
		p: 4,
		background: '#fff',
		minHeight: '100vh',
	},
	pageTitle: {
		fontSize: 38,
		fontWeight: 400,
		color: '#616160',
		fontFamily: 'Montserrat, sans-serif',
		mb: 3,
	},
	searchContainer: {
		display: 'flex',
		alignItems: 'center',
		mb: 3,
		gap: 1,
		maxWidth: '100%',
	},
	searchBox: {
		display: 'flex',
		alignItems: 'center',
		flex: 1,
		maxWidth: 500,
	},
	searchInput: {
		background: '#fff',
		borderRadius: 2,
		px: 2.5,
		py: 1.2,
		fontSize: 18,
		fontFamily: 'Montserrat, sans-serif',
		width: '100%',
		boxShadow: '0 0 0 1px #eee',
	},
	filterContainer: {
		display: 'flex',
		alignItems: 'center',
		gap: 1,
	},
	sizeFilter: {
		minWidth: 160,
		backgroundColor: '#fff',
		borderRadius: 2,
		'& .MuiOutlinedInput-root': {
			borderRadius: 2,
		},
	},
	buttonContainer: {
		flex: 1,
		display: 'flex',
		justifyContent: 'flex-end',
	},
	addButton: {
		background: 'linear-gradient(90deg, #E6BB4A 0%, #FFD700 100%)',
		color: '#fff',
		fontWeight: 700,
		borderRadius: 3,
		textTransform: 'none',
		fontSize: 20,
		boxShadow: '0 4px 16px 0 rgba(230,187,74,0.15)',
		px: 4,
		py: 1.5,
		letterSpacing: 0.5,
		display: 'flex',
		alignItems: 'center',
		gap: 1.5,
		minWidth: 220,
	},
	tableContainer: {
		background: '#F6F6F6',
		borderRadius: 3,
		boxShadow: 'none',
		maxWidth: '100%',
		overflowX: 'auto',
		mt: 2,
	},
	tableHeaderCell: {
		fontWeight: 500,
		fontSize: 18,
		color: '#888',
		fontFamily: 'Montserrat, sans-serif',
		background: '#EDEDED',
		border: 0,
	},
	tableHeaderCellCenter: {
		fontWeight: 500,
		fontSize: 18,
		color: '#888',
		fontFamily: 'Montserrat, sans-serif',
		background: '#EDEDED',
		border: 0,
		textAlign: 'center',
	},
	tableRow: {
		background: '#fff',
		borderBottom: '1px solid #ededed',
	},
	tableCell: {
		fontSize: 18,
		color: '#616160',
		fontFamily: 'Montserrat, sans-serif',
		border: 0,
	},
	tableCellBorderOnly: {
		border: 0,
	},
	tableCellCenter: {
		border: 0,
		textAlign: 'center',
	},
	loadingCell: {
		py: 8,
	},
	emptyStateContainer: {
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		gap: 2,
	},
	emptyStateTitle: {
		color: '#bdbdbd',
		fontSize: 22,
		fontWeight: 500,
		fontFamily: 'Montserrat, sans-serif',
	},
	emptyStateSubtitle: {
		color: '#bdbdbd',
		fontSize: 16,
		fontFamily: 'Montserrat, sans-serif',
	},
	colorBox: {
		width: 32,
		height: 32,
		borderRadius: 1,
	},
	imagePreview: {
		width: 48,
		height: 32,
		objectFit: 'cover' as const,
		borderRadius: 4,
		cursor: 'pointer',
	},
	noImageText: {
		color: '#bbb',
		fontStyle: 'italic',
	},
	editIcon: {
		fontSize: 22,
		color: '#E6BB4A',
	},
	deleteIcon: {
		fontSize: 22,
		color: '#E57373',
	},
	circularProgress: {
		color: '#E6BB4A',
	},
};

const BannersPage: React.FC = () => {
	const { t } = useTranslation();
	const { banners, isLoading, addBanner, updateBanner, removeBanner, fetchBanners } = useBanners();
	const [search, setSearch] = useState('');
	const [sizeFilter, setSizeFilter] = useState<string>('');
	const [dialogOpen, setDialogOpen] = useState(false);
	const [editBanner, setEditBanner] = useState<Banner | null>(null);
	const [deleteBanner, setDeleteBanner] = useState<Banner | null>(null);
	const [imageDialogOpen, setImageDialogOpen] = useState(false);
	const [imageDialogUrl, setImageDialogUrl] = useState<string | null>(null);

	// Filter banners by title and size using useMemo
	const filteredBanners = useMemo(() => {
		return banners.filter(banner => {
			const searchLower = search.toLowerCase();
			const matchesSearch = banner.title.toLowerCase().includes(searchLower) ||
								  banner.link.toLowerCase().includes(searchLower) ||
								  banner.couponCode.toLowerCase().includes(searchLower);
			const matchesSize = !sizeFilter || banner.size === sizeFilter;
			return matchesSearch && matchesSize;
		});
	}, [banners, search, sizeFilter]);

	// Size options for the filter
	const sizeOptions = useMemo(() => 
		BANNER_SIZES.map(size => ({
			value: size.value,
			label: t(size.translationKey)
		})), 
		[t]
	);

	// Helper function to convert Banner to BannerForm
	const bannerToBannerForm = (banner: Banner): Partial<BannerForm> => ({
		title: banner.title,
		description: banner.description,
		size: banner.size,
		link: banner.link,
		couponCode: banner.couponCode,
		color: banner.color,
		imageId: banner.imageId?.toString() || null,
		image: banner.image || null
	});

	const handleAddBanner = async (banner: BannerForm, file: File | null) => {
		// Convert BannerForm to Banner format
		const bannerData = {
			title: banner.title,
			description: banner.description,
			size: banner.size,
			link: banner.link,
			couponCode: banner.couponCode,
			color: banner.color,
			...(banner.imageId && { imageId: parseInt(banner.imageId) })
		};

		if (editBanner) {
			await updateBanner(editBanner.id, bannerData, file || undefined);
		} else {
			await addBanner(bannerData, file || undefined);
		}
		setEditBanner(null);
		setDialogOpen(false);
	};

	const handleEditClick = (banner: Banner) => {
		setEditBanner(banner);
		setDialogOpen(true);
	};

	const handleDeleteClick = (banner: Banner) => {
		setDeleteBanner(banner);
	};

	const handleDeleteConfirm = async () => {
		if (deleteBanner) {
			await removeBanner(deleteBanner.id);
			setDeleteBanner(null);
		}
	};

	const handleDialogClose = () => {
		setDialogOpen(false);
		setEditBanner(null);
	};

	const handleSizeFilterChange = (event: SelectChangeEvent<string>) => {
		setSizeFilter(event.target.value);
	};

    useEffect(() => {
            fetchBanners();
        }
    , [fetchBanners]);

	return (
		<Box sx={styles.pageContainer}>
			<Typography sx={styles.pageTitle}>
				{t('banners.manageBanners')}
			</Typography>
			{/* Search Bar */}
			<Box sx={styles.searchContainer}>
				<Box sx={styles.searchBox}>
					<InputBase
						placeholder={t('banners.search') + '...'}
						value={search}
						onChange={e => setSearch(e.target.value)}
						sx={styles.searchInput}
						endAdornment={<MagnifierIcon style={{ marginLeft: 8 }} />}
					/>
				</Box>
				<Box sx={styles.filterContainer}>
					<FormControl size="small" sx={styles.sizeFilter}>
						<InputLabel>{t('banners.size')}</InputLabel>
						<Select
							value={sizeFilter}
							onChange={handleSizeFilterChange}
							label={t('banners.size')}
						>
							<MenuItem value="">
								{t('banners.allSizes')}
							</MenuItem>
							{sizeOptions.map(option => (
								<MenuItem key={option.value} value={option.value}>
									{option.label}
								</MenuItem>
							))}
						</Select>
					</FormControl>
				</Box>
				<Box sx={styles.buttonContainer}>
					<Button
						variant="contained"
						sx={styles.addButton}
						startIcon={<svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="22" height="22" rx="6" fill="#fff"/><path d="M11 6V16" stroke="#E6BB4A" strokeWidth="2" strokeLinecap="round"/><path d="M6 11H16" stroke="#E6BB4A" strokeWidth="2" strokeLinecap="round"/></svg>}
						onClick={() => setDialogOpen(true)}
					>
						{t('banners.addBanner')}
					</Button>
				</Box>
			</Box>
			{/* Banner List Table */}
			<TableContainer component={Paper} elevation={0} sx={styles.tableContainer}>
				<Table>
					<TableHead>
						<TableRow>
							<TableCell sx={styles.tableHeaderCell}> {t('banners.title')} </TableCell>
							<TableCell sx={styles.tableHeaderCell}> {t('banners.size')} </TableCell>
							<TableCell sx={styles.tableHeaderCell}> {t('banners.link')} </TableCell>
							<TableCell sx={styles.tableHeaderCell}> {t('banners.couponCode')} </TableCell>
							<TableCell sx={styles.tableHeaderCell}> {t('banners.color')} </TableCell>
							<TableCell sx={styles.tableHeaderCell}> {t('banners.image')} </TableCell>
							<TableCell sx={styles.tableHeaderCell}> {t('banners.description')} </TableCell>
							<TableCell sx={styles.tableHeaderCellCenter}> {t('banners.actions')} </TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{isLoading ? (
							<TableRow>
								<TableCell colSpan={8} align="center" sx={styles.loadingCell}>
									<CircularProgress size={48} sx={styles.circularProgress} />
								</TableCell>
							</TableRow>
						) : filteredBanners.length === 0 ? (
							<TableRow>
								<TableCell colSpan={8} align="center" sx={styles.loadingCell}>
									<Box sx={styles.emptyStateContainer}>
										<svg width="64" height="64" fill="none" viewBox="0 0 64 64"><rect width="64" height="64" rx="16" fill="#F6F6F6"/><path d="M20 44V20h24v24H20Z" stroke="#E6BB4A" strokeWidth="2" strokeLinejoin="round"/><path d="M28 28h8v8h-8v-8Z" stroke="#E6BB4A" strokeWidth="2" strokeLinejoin="round"/></svg>
										<Typography sx={styles.emptyStateTitle}>
											{t('banners.noBanners')}
										</Typography>
										<Typography sx={styles.emptyStateSubtitle}>
											{t('banners.addToGetStarted')}
										</Typography>
									</Box>
								</TableCell>
							</TableRow>
						) : (
							filteredBanners.map(banner => (
								<TableRow key={banner.id} sx={styles.tableRow}>
									<TableCell sx={styles.tableCell}>{banner.title}</TableCell>
									<TableCell sx={styles.tableCell}>{t(`banners.size${banner.size}`)}</TableCell>
									<TableCell sx={styles.tableCell}>{banner.link}</TableCell>
									<TableCell sx={styles.tableCell}>{banner.couponCode}</TableCell>
									<TableCell sx={styles.tableCellBorderOnly}>
										<Box sx={{ ...styles.colorBox, background: banner.color }} />
									</TableCell>
									<TableCell sx={styles.tableCellBorderOnly}>
										{banner.image && banner.image.signedUrl ? (
											<ImageCustom
												src={banner.image.signedUrl}
												alt="banner"
												style={styles.imagePreview}
												onClick={() => {
													setImageDialogUrl(banner.image?.signedUrl || '');
													setImageDialogOpen(true);
												}}
											/>
										) : (
											<Box sx={styles.noImageText}>{t('banners.noImage')}</Box>
										)}
									</TableCell>
									<TableCell sx={styles.tableCell} title={banner.description.replace(/<[^>]+>/g, '')}>
										{banner.description
											? (() => {
													// Remove HTML tags for preview
													const plain = banner.description.replace(/<[^>]+>/g, '');
													return plain.length > 100 ? plain.slice(0, 100) + '...' : plain;
											  })()
											: ''}
									</TableCell>
									<TableCell sx={styles.tableCellCenter}>
										<IconButton onClick={() => handleEditClick(banner)} size="small" sx={{ mr: 1 }}>
											<EditIcon style={styles.editIcon} />
										</IconButton>
										<IconButton onClick={() => handleDeleteClick(banner)} size="small">
											<DeleteIcon style={styles.deleteIcon} />
										</IconButton>
									</TableCell>
								</TableRow>
							))
						)}
					</TableBody>
				</Table>
			</TableContainer>
			<BannerFormDialog 
				open={dialogOpen} 
				onClose={handleDialogClose} 
				onSubmit={handleAddBanner} 
				initialValues={editBanner ? bannerToBannerForm(editBanner) : null} 
			/>
			<DeleteConfirmationDialog open={!!deleteBanner} onClose={() => setDeleteBanner(null)} onConfirm={handleDeleteConfirm} title={t('banners.delete')} description={t('banners.confirmDeletion')} />
			<FullscreenImageDialog open={imageDialogOpen} imageUrl={imageDialogUrl || ''} onClose={() => setImageDialogOpen(false)} />
		</Box>
	);
};

export default BannersPage;
