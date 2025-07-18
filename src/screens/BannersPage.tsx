import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper, Button, InputBase, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, CircularProgress } from '@mui/material';
import MagnifierIcon from '../icons/MagnifierIcon';
import BannerFormDialog, { BannerForm } from '../components/BannerFormDialog';
import DeleteConfirmationDialog from '../screens/Subscription/DeleteConfirmationDialog';
import EditIcon from '../icons/EditIcon';
import DeleteIcon from '../icons/DeleteIcon';
import { useBanners, Banner } from '../Context/BannersContext';
import { useTranslation } from 'react-i18next';
import FullscreenImageDialog from '../components/FullscreenImageDialog';
import ImageCustom from '../components/ImageCustom';

const BannersPage: React.FC = () => {
	const { t } = useTranslation();
	const { banners, isLoading, addBanner, updateBanner, removeBanner, fetchBanners } = useBanners();
	const [search, setSearch] = useState('');
	const [dialogOpen, setDialogOpen] = useState(false);
	const [editBanner, setEditBanner] = useState<Banner | null>(null);
	const [deleteBanner, setDeleteBanner] = useState<Banner | null>(null);
	const [imageDialogOpen, setImageDialogOpen] = useState(false);
	const [imageDialogUrl, setImageDialogUrl] = useState<string | null>(null);

	// Filter banners by title
	const filteredBanners = banners.filter(b => b.title.toLowerCase().includes(search.toLowerCase()));

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


    useEffect(() => {
            fetchBanners();
        }
    , [fetchBanners]);

	return (
		<Box sx={{ p: 4, background: '#fff', minHeight: '100vh' }}>
			<Typography sx={{ fontSize: 38, fontWeight: 400, color: '#616160', fontFamily: 'Montserrat, sans-serif', mb: 3 }}>
				{t('banners.manageBanners')}
			</Typography>
			{/* Search Bar */}
			<Box sx={{ display: 'flex', alignItems: 'center', mb: 3, gap: 1, maxWidth: '100%' }}>
				<Box sx={{ display: 'flex', alignItems: 'center', flex: 1, maxWidth: 500 }}>
					<InputBase
						placeholder={t('banners.title') + '...'}
						value={search}
						onChange={e => setSearch(e.target.value)}
						sx={{
							background: '#fff',
							borderRadius: 2,
							px: 2.5,
							py: 1.2,
							fontSize: 18,
							fontFamily: 'Montserrat, sans-serif',
							width: '100%',
							boxShadow: '0 0 0 1px #eee',
						}}
						endAdornment={<MagnifierIcon style={{ marginLeft: 8 }} />}
					/>
				</Box>
				<Box sx={{ flex: 1, display: 'flex', justifyContent: 'flex-end' }}>
					<Button
						variant="contained"
						sx={{
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
						}}
						startIcon={<svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="22" height="22" rx="6" fill="#fff"/><path d="M11 6V16" stroke="#E6BB4A" strokeWidth="2" strokeLinecap="round"/><path d="M6 11H16" stroke="#E6BB4A" strokeWidth="2" strokeLinecap="round"/></svg>}
						onClick={() => setDialogOpen(true)}
					>
						{t('banners.addBanner')}
					</Button>
				</Box>
			</Box>
			{/* Banner List Table */}
			<TableContainer component={Paper} elevation={0} sx={{ background: '#F6F6F6', borderRadius: 3, boxShadow: 'none', maxWidth: '100%', overflowX: 'auto', mt: 2 }}>
				<Table>
					<TableHead>
						<TableRow>
							<TableCell sx={{ fontWeight: 500, fontSize: 18, color: '#888', fontFamily: 'Montserrat, sans-serif', background: '#EDEDED', border: 0 }}> {t('banners.title')} </TableCell>
							<TableCell sx={{ fontWeight: 500, fontSize: 18, color: '#888', fontFamily: 'Montserrat, sans-serif', background: '#EDEDED', border: 0 }}> {t('banners.size')} </TableCell>
							<TableCell sx={{ fontWeight: 500, fontSize: 18, color: '#888', fontFamily: 'Montserrat, sans-serif', background: '#EDEDED', border: 0 }}> {t('banners.link')} </TableCell>
							<TableCell sx={{ fontWeight: 500, fontSize: 18, color: '#888', fontFamily: 'Montserrat, sans-serif', background: '#EDEDED', border: 0 }}> {t('banners.couponCode')} </TableCell>
							<TableCell sx={{ fontWeight: 500, fontSize: 18, color: '#888', fontFamily: 'Montserrat, sans-serif', background: '#EDEDED', border: 0 }}> {t('banners.color')} </TableCell>
							<TableCell sx={{ fontWeight: 500, fontSize: 18, color: '#888', fontFamily: 'Montserrat, sans-serif', background: '#EDEDED', border: 0 }}> {t('banners.image')} </TableCell>
							<TableCell sx={{ fontWeight: 500, fontSize: 18, color: '#888', fontFamily: 'Montserrat, sans-serif', background: '#EDEDED', border: 0 }}> {t('banners.description')} </TableCell>
							<TableCell sx={{ fontWeight: 500, fontSize: 18, color: '#888', fontFamily: 'Montserrat, sans-serif', background: '#EDEDED', border: 0, textAlign: 'center' }}> {t('banners.actions')} </TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{isLoading ? (
							<TableRow>
								<TableCell colSpan={8} align="center" sx={{ py: 8 }}>
									<CircularProgress size={48} sx={{ color: '#E6BB4A' }} />
								</TableCell>
							</TableRow>
						) : filteredBanners.length === 0 ? (
							<TableRow>
								<TableCell colSpan={8} align="center" sx={{ py: 8 }}>
									<Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
										<svg width="64" height="64" fill="none" viewBox="0 0 64 64"><rect width="64" height="64" rx="16" fill="#F6F6F6"/><path d="M20 44V20h24v24H20Z" stroke="#E6BB4A" strokeWidth="2" strokeLinejoin="round"/><path d="M28 28h8v8h-8v-8Z" stroke="#E6BB4A" strokeWidth="2" strokeLinejoin="round"/></svg>
										<Typography sx={{ color: '#bdbdbd', fontSize: 22, fontWeight: 500, fontFamily: 'Montserrat, sans-serif' }}>
											{t('banners.noBanners')}
										</Typography>
										<Typography sx={{ color: '#bdbdbd', fontSize: 16, fontFamily: 'Montserrat, sans-serif' }}>
											{t('banners.addToGetStarted')}
										</Typography>
									</Box>
								</TableCell>
							</TableRow>
						) : (
							filteredBanners.map(banner => (
								<TableRow key={banner.id} sx={{ background: '#fff', borderBottom: '1px solid #ededed' }}>
									<TableCell sx={{ fontSize: 18, color: '#616160', fontFamily: 'Montserrat, sans-serif', border: 0 }}>{banner.title}</TableCell>
									<TableCell sx={{ fontSize: 18, color: '#616160', fontFamily: 'Montserrat, sans-serif', border: 0 }}>{t(`banners.size${banner.size}`)}</TableCell>
									<TableCell sx={{ fontSize: 18, color: '#616160', fontFamily: 'Montserrat, sans-serif', border: 0 }}>{banner.link}</TableCell>
									<TableCell sx={{ fontSize: 18, color: '#616160', fontFamily: 'Montserrat, sans-serif', border: 0 }}>{banner.couponCode}</TableCell>
									<TableCell sx={{ border: 0 }}>
										<Box sx={{ width: 32, height: 32, background: banner.color, borderRadius: 1 }} />
									</TableCell>
									<TableCell sx={{ border: 0 }}>
										{banner.image && banner.image.signedUrl ? (
											<ImageCustom
												src={banner.image.signedUrl}
												alt="banner"
												style={{ width: 48, height: 32, objectFit: 'cover', borderRadius: 4, cursor: 'pointer' }}
												onClick={() => {
													setImageDialogUrl(banner.image?.signedUrl || '');
													setImageDialogOpen(true);
												}}
											/>
										) : (
											<Box sx={{ color: '#bbb', fontStyle: 'italic' }}>No image</Box>
										)}
									</TableCell>
									<TableCell sx={{ fontSize: 18, color: '#616160', fontFamily: 'Montserrat, sans-serif', border: 0 }} title={banner.description.replace(/<[^>]+>/g, '')}>
										{banner.description
											? (() => {
													// Remove HTML tags for preview
													const plain = banner.description.replace(/<[^>]+>/g, '');
													return plain.length > 100 ? plain.slice(0, 100) + '...' : plain;
											  })()
											: ''}
									</TableCell>
									<TableCell sx={{ border: 0, textAlign: 'center' }}>
										<IconButton onClick={() => handleEditClick(banner)} size="small" sx={{ mr: 1 }}>
											<EditIcon style={{ fontSize: 22, color: '#E6BB4A' }} />
										</IconButton>
										<IconButton onClick={() => handleDeleteClick(banner)} size="small">
											<DeleteIcon style={{ fontSize: 22, color: '#E57373' }} />
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
