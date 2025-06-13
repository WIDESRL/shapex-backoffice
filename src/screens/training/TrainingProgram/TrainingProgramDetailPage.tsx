import React, { useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTraining } from '../../../Context/TrainingContext';
import TrainingProgramNotFound from './TrainingProgramNotFound';

const TrainingProgramDetailPage: React.FC = () => {
    const { trainingProgramId } = useParams<{ trainingProgramId: string }>();
    const { selectedTrainingProgram, fetchTrainingProgramById, isLoading } = useTraining();
    const [fetchingError, setFetchingError] = React.useState<boolean>(false);

    const fetchTrainingProgram = useCallback(() => {
        if (trainingProgramId) {
            fetchTrainingProgramById(trainingProgramId)
                .then(() => {
                    setFetchingError(false);
                })
                .catch(() => {
                    setFetchingError(true);
                })
        }
    }, [fetchTrainingProgramById, trainingProgramId]);

    React.useEffect(() => {
        fetchTrainingProgram();
    }, [trainingProgramId, fetchTrainingProgramById]);

    if (isLoading) {
        return (
            <div style={{ padding: 32, fontFamily: 'Montserrat, sans-serif', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
                <div style={{
                    width: 60,
                    height: 60,
                    border: '6px solid #eee',
                    borderTop: '6px solid #EDB528',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite',
                    marginBottom: 24
                }} />
                <h2 style={{ color: '#616160', fontWeight: 500, fontSize: 28, margin: 0 }}>Caricamento...</h2>
                <p style={{ color: '#888', fontSize: 18, marginTop: 8 }}>Sto caricando il programma di allenamento</p>
                <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
            </div>
        );
    }

    if (!isLoading && selectedTrainingProgram === null && fetchingError) {
        return <TrainingProgramNotFound onRetry={fetchTrainingProgram} />;
    }

    return (
        <div style={{ padding: 32, fontFamily: 'Montserrat, sans-serif' }}>
            <h1>Training Program Detail</h1>
            <p><strong>ID:</strong> {trainingProgramId}</p>
            <pre>{selectedTrainingProgram ? JSON.stringify(selectedTrainingProgram, null, 2) : 'Nessun programma trovato.'}</pre>
        </div>
    );
};

export default TrainingProgramDetailPage;
