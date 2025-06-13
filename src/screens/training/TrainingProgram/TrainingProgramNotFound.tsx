import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import RefreshIcon from '../../../icons/RefreshIcon';

interface TrainingProgramNotFoundProps {
  onRetry?: () => void;
}

const styles = {
  root: {
    padding: 32,
    fontFamily: 'Montserrat, sans-serif',
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    minHeight: '60vh',
    background: 'linear-gradient(135deg, #fffbe6 0%, #ffe0b2 100%)',
    borderRadius: 16,
    boxShadow: '0 4px 32px 0 rgba(33,33,33,0.10)',
  },
  iconBox: {
    width: 80,
    height: 80,
    borderRadius: '50%',
    background: '#FFF3CD',
    display: 'flex',
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    marginBottom: 24,
    boxShadow: '0 2px 12px 0 rgba(237,181,40,0.15)'
  },
  title: {
    color: '#EDB528',
    fontWeight: 700,
    fontSize: 28,
    margin: 0,
    marginBottom: 8
  },
  desc: {
    color: '#888',
    fontSize: 18,
    margin: 0,
    marginBottom: 24,
    textAlign: 'center' as const,
    maxWidth: 400
  },
  retryBtn: {
    display: 'flex',
    alignItems: 'center' as const,
    gap: 10,
    background: '#fff',
    color: '#EDB528',
    border: '2px solid #EDB528',
    borderRadius: 6,
    fontWeight: 600,
    fontSize: 18,
    padding: '12px 36px',
    cursor: 'pointer',
    fontFamily: 'Montserrat, sans-serif',
    transition: 'background 0.2s, color 0.2s',
    marginBottom: 18,
  },
  backBtn: {
    background: '#EDB528',
    color: '#fff',
    border: 'none',
    borderRadius: 6,
    fontWeight: 600,
    fontSize: 18,
    padding: '12px 36px',
    cursor: 'pointer',
    boxShadow: '0 2px 8px 0 rgba(237,181,40,0.10)',
    fontFamily: 'Montserrat, sans-serif',
    transition: 'background 0.2s',
  }
};

const TrainingProgramNotFound: React.FC<TrainingProgramNotFoundProps> = ({ onRetry }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  return (
    <div style={styles.root}>
      <div style={styles.iconBox}>
        <svg width="48" height="48" viewBox="0 0 48 48" fill="none"><circle cx="24" cy="24" r="24" fill="#FFE082"/><path d="M24 14V28" stroke="#EDB528" strokeWidth="3.5" strokeLinecap="round"/><circle cx="24" cy="34" r="2.5" fill="#EDB528"/></svg>
      </div>
      <h2 style={styles.title}>{t('trainingPrograms.notFoundTitle')}</h2>
      <p style={styles.desc}>
        {t('trainingPrograms.notFoundDesc').split('\n').map((line, idx) => <span key={idx}>{line}<br /></span>)}
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          style={styles.retryBtn}
        >
          <RefreshIcon style={{ fontSize: 24, marginRight: 6 }} />
          {t('trainingPrograms.retry')}
        </button>
      )}
      <button
        onClick={() => navigate('/training/training-program')}
        style={styles.backBtn}
        onMouseOver={e => (e.currentTarget.style.background = '#d1a53d')}
        onMouseOut={e => (e.currentTarget.style.background = '#EDB528')}
      >
         {t('trainingPrograms.backToPrograms')}
      </button>
    </div>
  );
};

export default TrainingProgramNotFound;
