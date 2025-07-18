import React, { useEffect, useMemo } from 'react';
import { Box, Typography, Paper, CircularProgress } from '@mui/material';
import { useTranslation } from 'react-i18next';
import ClientsIcon from '../icons/ClientsIcon';
import DisabledClientsIcon from '../icons/DisabledClientsIcon';
import CompletedTrainingsIcon from '../icons/CompletedTrainingsIcon';
import ProgramsCompletedIcon from '../icons/ProgramsCompletedIcon';
import ClientsPage from './clients/ClientsPage';
import { useStats, type DashboardStats } from '../Context/StatsContext';

type DashboardStatsKey = keyof DashboardStats;

const dashboardStatsConfig = [
	{
		labelKey: 'dashboard.stats.totalClients',
		icon: <ClientsIcon />,
		variable: 'totalClients' as DashboardStatsKey,
	},
	{
		labelKey: 'dashboard.stats.deactivatedClients',
		icon: <DisabledClientsIcon  />,
		variable: 'deactivatedClients' as DashboardStatsKey,
	},
	{
		labelKey: 'dashboard.stats.totalPrograms',
		icon: <ProgramsCompletedIcon />,
		variable: 'totalPrograms' as DashboardStatsKey,
	},
	{
		labelKey: 'dashboard.stats.completedTrainings',
		icon: <CompletedTrainingsIcon />,
		variable: 'completedTrainings' as DashboardStatsKey,
	},
];

const styles = {
		container: {
			p: 4,
			background: '#fff',
			minHeight: '100vh',
		},
		statsGrid: {
			display: 'grid',
			gridTemplateColumns: {
				xs: '1fr',
				sm: '1fr 1fr',
				md: '1fr 1fr 1fr',
				lg: '1fr 1fr 1fr 1fr',
			},
			gap: 4,
			mb: 5,
		},
		statCard: {
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
			mx: 'auto',
		},
		iconContainer: {
			width: 40,
			height: 40,
			background: '#E6BB4A',
			borderRadius: 2,
			display: 'flex',
			alignItems: 'center',
			justifyContent: 'center',
			mb: 2,
		},
		statContent: {
			display: 'flex',
			alignItems: 'flex-end',
			justifyContent: 'space-between',
			width: '100%',
			flex: 1,
		},
		statLabel: {
			fontSize: 22,
			color: '#616160',
			fontFamily: 'Montserrat, sans-serif',
			fontWeight: 400,
			lineHeight: 1.1,
		},
		statValue: {
			fontSize: 64,
			color: '#616160',
			fontFamily: 'Montserrat, sans-serif',
			fontWeight: 400,
			ml: 2,
			lineHeight: 1,
			whitespace: 'nowrap',
		},
	};

const DashboardPage: React.FC = () => {
	const { t } = useTranslation();
	const { dashboardStats, statsLoading, fetchDashboardStats } = useStats();
	
	useEffect(() => {
		fetchDashboardStats();
	}, []);

	const getStatValue = useMemo(() => {
		return (variable: DashboardStatsKey) => {
			if (statsLoading) {
				return <CircularProgress size={24} sx={{ color: '#E6BB4A' }} />;
			}
			if (!dashboardStats || dashboardStats[variable] === undefined || dashboardStats[variable] === null) {
				return '_';
			}
			return dashboardStats[variable];
		};
	}, [statsLoading, dashboardStats]);

	return (
		<Box sx={styles.container}>
			<Box sx={styles.statsGrid}>
				{dashboardStatsConfig.map((stat) => (
					<Paper
						key={stat.labelKey}
						elevation={0}
						sx={styles.statCard}
					>
						<Box sx={styles.iconContainer}>
							{stat.icon}
						</Box>
						<Box sx={styles.statContent}>
							<Typography sx={styles.statLabel}>
								{t(stat.labelKey)}
							</Typography>
							<Typography sx={styles.statValue}>
								{getStatValue(stat.variable)}
							</Typography>
						</Box>
					</Paper>
				))}
			</Box>
			<ClientsPage dashboard={true} />
		</Box>
	);
};

export default DashboardPage;
