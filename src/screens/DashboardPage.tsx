import React from 'react';
import { Box, Typography, Paper, InputBase, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip } from '@mui/material';
import FilterIcon from '../icons/FilterIcon';
import DeleteIcon from '../icons/DeleteIcon';
import EditIcon from '../icons/EditIcon';
import ClientsIcon from '../icons/ClientsIcon';
import DisabledClientsIcon from '../icons/DisabledClientsIcon';
import CompletedTrainingsIcon from '../icons/CompletedTrainingsIcon';
import ProgramsCompletedIcon from '../icons/ProgramsCompletedIcon';
import MagnifierIcon from '../icons/MagnifierIcon';
import WarningDummyDataBanner from '../components/WarningDummyDataBanner';

// Fake data for dashboard summary
const dashboardStats = [
	{
		label: 'Clienti Totali',
		value: 20,
		icon: <ClientsIcon />,
		variable: 'totalClients',
	},
	{
		label: 'Clienti Disattivati',
		value: 2,
		icon: <DisabledClientsIcon  />,
		variable: 'deactivatedClients',
	},
	{
		label: 'Programmi Complessivi',
		value: 60,
		icon: <ProgramsCompletedIcon />,
		variable: 'totalPrograms',
	},
	{
		label: 'Allenamenti Completati',
		value: 190,
		icon: <CompletedTrainingsIcon />,
		variable: 'completedTrainings',
	},
];

// Fake data for clients table
const clients = [
	{ name: 'Sara Rossi', subscription: 'Premium', expiry: '22 . 7 . 2025', requests: 2, messages: 1 },
	{ name: 'Marco Guerini', subscription: 'Premium', expiry: '1 . 8 . 2025', requests: 0, messages: 0 },
	{ name: 'Stefania Bianchi', subscription: 'Premium', expiry: '27 . 9 . 2025', requests: 0, messages: 0 },
	{ name: 'Elena Brignano', subscription: 'Premium', expiry: '30 . 9 . 2025', requests: 4, messages: 4 },
	{ name: 'Samuele Di Vincenzo', subscription: 'Standard', expiry: '13 . 10 . 2025', requests: 1, messages: 1 },
	{ name: 'Mario Verani', subscription: 'Standard', expiry: '6 . 11 . 2025', requests: 0, messages: 0 },
	{ name: 'Sara Rossi', subscription: 'Standard', expiry: '22 . 11 . 2026', requests: 2, messages: 2 },
	{ name: 'Marco Guerini', subscription: 'Standard', expiry: '1 . 8 . 2025', requests: 0, messages: 0 },
	{ name: 'Stefania Bianchi', subscription: 'Standard', expiry: '27 . 9 . 2025', requests: 0, messages: 0 },
	{ name: 'Elena Brignano', subscription: 'Basic', expiry: '30 . 9 . 2025', requests: 4, messages: 4 },
	{ name: 'Samuele Di Vincenzo', subscription: 'Basic', expiry: '13 . 10 . 2025', requests: 1, messages: 1 },
	{ name: 'Mario Verani', subscription: 'Basic', expiry: '6 . 11 . 2025', requests: 0, messages: 0 },
	{ name: 'Teresa Tassoni', subscription: 'Basic', expiry: '22 . 11 . 2026', requests: 2, messages: 2 },
	{ name: 'Sara Rossi', subscription: 'Basic', expiry: '22 . 11 . 2026', requests: 2, messages: 2 },
];

const subscriptionColors: Record<string, string> = {
	Premium: '#E6BB4A',
	Standard: '#6DE1C2',
	Basic: '#7DD6F7',
};

// Define a reusable style object for table header cells
const tableHeaderCellSx = {
	fontWeight: 400,
	fontSize: 18,
	color: '#616160',
	fontFamily: 'Montserrat, sans-serif',
	background: '#EDEDED',
	border: 0,
};

// Define a reusable style object for table body cells
const tableBodyCellSx = {
	fontSize: 18,
	color: '#616160',
	fontFamily: 'Montserrat, sans-serif',
	border: 0,
    textAlign: 'center',
};

const DashboardPage: React.FC = () => {
	return (
		<Box sx={{ p: 4, background: '#fff', minHeight: '100vh' }}>
      		<WarningDummyDataBanner />
			{/* Top stats */}
			<Box
				sx={{
					display: 'grid',
					gridTemplateColumns: {
						xs: '1fr',
						sm: '1fr 1fr',
						md: '1fr 1fr 1fr',
						lg: '1fr 1fr 1fr 1fr',
					},
					gap: 4,
					mb: 5,
				}}
			>
				{dashboardStats.map((stat) => (
					<Paper
						key={stat.label}
						elevation={0}
						sx={{
							minWidth: 180,
							background: '#F6F6F6',
							borderRadius: 3,
							p: 3,
							display: 'flex',
							flexDirection: 'column',
							justifyContent: 'flex-start',
							boxShadow: 'none',
							height: 'auto',
							flex: '0 1 320px',
							maxWidth: 320,
							mx: 'auto', // center the card in its grid cell
						}}
					>
						{/* Icon row */}
						<Box sx={{ width: 40, height: 40, background: '#E6BB4A', borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
							{stat.icon}
						</Box>
						{/* Text and number row (side by side) */}
						<Box sx={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', width: '100%', flex: 1 }}>
							<Typography sx={{ fontSize: 22, color: '#616160', fontFamily: 'Montserrat, sans-serif', fontWeight: 400, lineHeight: 1.1 }}>
								{stat.label}
							</Typography>
							<Typography sx={{ fontSize: 64, color: '#616160', fontFamily: 'Montserrat, sans-serif', fontWeight: 400, ml: 2, lineHeight: 1 }}>
								{stat.value}
							</Typography>
						</Box>
					</Paper>
				))}
			</Box>
			{/* Clients Table Title and Search */}
			<Box sx={{ display: 'flex', alignItems: 'center', mb: 2, gap: 2, justifyContent: 'space-between' }}>
				<Typography
					sx={{
						fontSize: 38,
						fontWeight: 400,
						color: '#616160',
						fontFamily: 'Montserrat, sans-serif',
						mb: 0,
						flex: 1,
						minWidth: 0,
						whiteSpace: 'nowrap',
						overflow: 'hidden',
						textOverflow: 'ellipsis',
					}}
				>
					Elenco Clienti
				</Typography>
				<Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flex: 1, maxWidth: 500 }}>
					<InputBase
						placeholder="Cerca qui ..."
						sx={{
							background: '#fff',
							borderRadius: 2,
							px: 2.5,
							py: 1.2,
							fontSize: 18,
							fontFamily: 'Montserrat, sans-serif',
							width: '100%',
							boxShadow: '0 0 0 1px #eee',
							mr: 0,
						}}
                        
						endAdornment={<MagnifierIcon style={{ marginLeft: 8 }} />}
					/>
					<IconButton
						sx={{
							background: '#F6F6F6',
							borderRadius: 2,
							width: 44,
							height: 44,
							ml: 1,
							boxShadow: '0 0 0 1px #eee',
						}}
					>
						<FilterIcon style={{ color: '#bdbdbd', fontSize: 28 }} />
					</IconButton>
				</Box>
			</Box>
			{/* Clients Table */}
			<TableContainer
				component={Paper}
				elevation={0}
				sx={{
					background: '#F6F6F6',
					borderRadius: 3,
					boxShadow: 'none',
					maxWidth: '100%',
					overflowX: 'auto',
					mt: 2,
				}}
			>
				<Box sx={{ width: '100%', overflowX: 'auto' }}>
					<Table>
						<TableHead>
							<TableRow>
								<TableCell sx={tableHeaderCellSx}>Nome Cliente</TableCell>
								<TableCell sx={tableHeaderCellSx}>Abbonamento</TableCell>
								<TableCell sx={{...tableHeaderCellSx, textAlign: 'center'}}>Scadenza</TableCell>
								<TableCell sx={{...tableHeaderCellSx, textAlign: 'center'}}>Richieste</TableCell>
								<TableCell sx={{...tableHeaderCellSx, textAlign: 'center'}}>Messaggi</TableCell>
								<TableCell sx={tableHeaderCellSx}>Azioni</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{clients.map((client, idx) => (
								<TableRow
									key={idx}
									sx={{
										background: '#fff',
										borderRadius: 2,
										borderBottom: '1px solid #ededed',
										'&:last-child': { borderBottom: 0 },
									}}
								>
									<TableCell sx={{...tableBodyCellSx, textAlign: 'left'}}>{client.name}</TableCell>
									<TableCell sx={{ border: 0 }}>
										<Chip
											label={client.subscription}
											sx={{
												background: subscriptionColors[client.subscription],
												color: '#616160',
												fontWeight: 500,
												fontSize: 18,
												fontFamily: 'Montserrat, sans-serif',
												borderRadius: 1,
												px: 2.5,
												height: 36,
												width: { xs: '100%', lg: '80%' },
												minWidth: 0,
												maxWidth: '100%',
												display: 'flex',
												justifyContent: 'center',
											}}
										/>
									</TableCell>
									<TableCell sx={tableBodyCellSx}>{client.expiry}</TableCell>
									<TableCell sx={tableBodyCellSx}>{client.requests}</TableCell>
									<TableCell sx={tableBodyCellSx}>{client.messages}</TableCell>
									<TableCell sx={{ border: 0 }}>
										<Box sx={{ display: 'flex', gap: 1 }}>
											<IconButton sx={{ p: 1 }}>
												<EditIcon style={{ width: 22, height: 22, color: '#616160' }} />
											</IconButton>
											<IconButton sx={{ p: 1 }}>
												<DeleteIcon style={{ width: 22, height: 22, color: '#616160' }} />
											</IconButton>
										</Box>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</Box>
			</TableContainer>
		</Box>
	);
};

export default DashboardPage;
