import React, { useState } from 'react';
import { Box, Typography, Paper } from '@mui/material';
import { useTranslation } from 'react-i18next';
import NotificationCard from '../../../../components/NotificationCard';

const styles = {
  container: {
    height: '80%',
    display: 'flex',
    flexDirection: 'column',
  },
  scrollContainer: {
    flex: 1,
    overflowY: 'auto',
    overflowX: 'hidden',
    pr: 1,
    '&::-webkit-scrollbar': {
      width: 2,
    },
    '&::-webkit-scrollbar-track': {
      backgroundColor: '#f1f1f1',
      borderRadius: 4,
    },
    '&::-webkit-scrollbar-thumb': {
      backgroundColor: '#c1c1c1',
      borderRadius: 4,
      '&:hover': {
        backgroundColor: '#a8a8a8',
      },
    },
  },
  notificationGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
    gap: 3,
    pb: 2,
  },
  emptyState: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    textAlign: 'center',
    px: 4,
  },
  emptyStateCard: {
    p: 6,
    borderRadius: 3,
    border: '2px dashed #e0e0e0',
    backgroundColor: '#fafafa',
    maxWidth: 400,
    width: '100%',
  },
  emptyStateIcon: {
    fontSize: 64,
    color: '#bdbdbd',
    mb: 3,
  },
  emptyStateTitle: {
    fontSize: 24,
    fontWeight: 600,
    color: '#424242',
    mb: 2,
  },
  emptyStateDescription: {
    fontSize: 16,
    color: '#757575',
    lineHeight: 1.6,
    mb: 3,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#9e9e9e',
    fontStyle: 'italic',
  },
};

const NotificheTab: React.FC = () => {
  const { t } = useTranslation();
  const [showEmptyState] = useState(false);

  // Mock data for notifications - replace with real data later
  const generateNotifications = () => {
    const titles = [
      'Titolo notifica',
      'Titolo esteso notifica',
      'Promemoria allenamento',
      'Aggiornamento piano alimentare',
      'Nuovo messaggio dal trainer',
      'Scadenza abbonamento',
      'Risultati misurazione',
      'Obiettivo raggiunto',
      'Nuova scheda di allenamento',
      'Controllo periodico',
      'Sessione completata',
      'Invito evento speciale',
      'Promozione attiva',
      'Feedback richiesto',
      'Backup dati completato',
    ];
    
    const descriptions = [
      'Descrizione notifica, ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore.',
      'Promemoria per il tuo allenamento di oggi. Non dimenticare di completare la scheda assegnata dal trainer.',
      'È stato aggiornato il tuo piano alimentare. Controlla le nuove indicazioni nella sezione dedicata.',
      'Hai ricevuto un nuovo messaggio dal tuo personal trainer. Accedi alla chat per visualizzarlo.',
      'Il tuo abbonamento scadrà tra 7 giorni. Rinnova per continuare ad accedere a tutti i servizi.',
      'Sono disponibili i risultati delle tue ultime misurazioni corporee. Visualizzali nel diario.',
      'Complimenti! Hai raggiunto un nuovo obiettivo di fitness. Continua così!',
      'È disponibile una nuova scheda di allenamento personalizzata per te.',
      'È il momento del controllo periodico con il tuo trainer. Prenota un appuntamento.',
      'Ricordati di registrare i tuoi progressi nel diario dopo ogni allenamento.',
      'Sessione di allenamento completata con successo. Ottimo lavoro!',
      'Sei invitato al nostro evento speciale questo weekend. Partecipa per vincere premi esclusivi.',
      'Approfitta della nostra promozione limitata su abbonamenti premium. Sconto del 20%!',
      'Ci aiuteresti a migliorare? Lascia un feedback sulla tua esperienza.',
      'Il backup dei tuoi dati è stato completato con successo. Tutti i progressi sono al sicuro.',
    ];

    const altroValues = [
      'Lorem ipsum',
      'Parametro aggiuntivo',
      'Valore extra',
      'Info supplementare',
      'Dettaglio importante',
      'Nota speciale',
      'Riferimento #12345',
      'Codice promozione: FIT2025',
      'Priorità alta',
      'Azione richiesta',
    ];

    return Array.from({ length: showEmptyState ? 0 : 100 }, (_, index) => { // Toggle between 0 and 100 for empty state
      const isPush = Math.random() > 0.6; // 40% push, 60% mail
      const hasAltro = Math.random() > 0.7; // 30% chance of having "altro"
      const isVisualized = Math.random() > 0.3; // 70% visualized
      
      // Generate random date in the last 90 days
      const daysAgo = Math.floor(Math.random() * 90);
      const date = new Date();
      date.setDate(date.getDate() - daysAgo);
      const formattedDate = date.toLocaleDateString('it-IT', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });

      const titleIndex = Math.floor(Math.random() * titles.length);
      const descIndex = Math.floor(Math.random() * descriptions.length);
      const altroIndex = Math.floor(Math.random() * altroValues.length);
      
      return {
        id: index + 1,
        title: titles[titleIndex],
        description: descriptions[descIndex],
        dataInvio: formattedDate,
        visualizzato: isVisualized ? 'Si' : 'No',
        tipologia: isPush ? 'Notifica Push' : 'Mail',
        type: isPush ? 'push' : 'mail',
        ...(hasAltro && { altro: altroValues[altroIndex] }),
      };
    }).sort((a, b) => {
      // Sort by date (most recent first)
      const dateA = new Date(a.dataInvio.split('/').reverse().join('-'));
      const dateB = new Date(b.dataInvio.split('/').reverse().join('-'));
      return dateB.getTime() - dateA.getTime();
    });
  };

  const notifications = generateNotifications();

  // Empty state component
  const EmptyState = () => (
    <Box sx={styles.emptyState}>
      <Paper sx={styles.emptyStateCard} elevation={0}>
        <Box sx={styles.emptyStateIcon}>
          📬
        </Box>
        <Typography sx={styles.emptyStateTitle}>
          {t('client.altro.notifiche.emptyState.title')}
        </Typography>
        <Typography sx={styles.emptyStateDescription}>
          {t('client.altro.notifiche.emptyState.description')}
        </Typography>
        <Typography sx={styles.emptyStateSubtext}>
          {t('client.altro.notifiche.emptyState.subtitle')}
        </Typography>
      </Paper>
    </Box>
  );

  return (
    <Box sx={styles.container}>
      <Box sx={styles.scrollContainer}>
        {notifications.length === 0 ? (
          <EmptyState />
        ) : (
          <Box sx={styles.notificationGrid}>
            {notifications.map((notification) => (
              <NotificationCard key={notification.id} notification={notification} />
            ))}
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default NotificheTab;
