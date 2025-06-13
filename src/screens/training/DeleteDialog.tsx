import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Fade } from '@mui/material';
import { useTranslation } from 'react-i18next';

interface DeleteExerciseDialogProps {
    open: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
}

const styles = {
    dialogPaper: {
        borderRadius: 4,
        p: 0,
        background: '#fff',
        boxShadow: '0 4px 32px 0 rgba(33,33,33,0.10)',
        padding: 3,
    },
    dialogTitle: {
        fontSize: 22,
        fontWeight: 400,
        color: '#616160',
        fontFamily: 'Montserrat, sans-serif',
        textAlign: 'center',
        pb: 0,
    },
    dialogContent: {
        pt: 2,
    },
    dialogActions: {
        px: 3,
        pb: 3,
        pt: 0,
        justifyContent: 'center',
    },
    cancelButton: {
        borderRadius: 2,
        fontWeight: 500,
        color: '#616160',
        borderColor: '#bdbdbd',
        background: '#fff',
        fontFamily: 'Montserrat, sans-serif',
        px: 4,
        py: 1.2,
        fontSize: 18,
        boxShadow: 0,
        textTransform: 'none',
        '&:hover': { background: '#f5f5f5', borderColor: '#bdbdbd' },
        minWidth: 120,
        mr: 2,
    },
    confirmButton: {
        background: '#EDB528',
        color: '#fff',
        borderRadius: 2,
        fontWeight: 500,
        fontSize: 18,
        px: 4,
        py: 1.2,
        minWidth: 120,
        boxShadow: 0,
        textTransform: 'none',
        fontFamily: 'Montserrat, sans-serif',
        '&:hover': { background: '#d1a53d' },
    },
    backdrop: {
        backgroundColor: 'rgba(33,33,33,0.8)',
        backdropFilter: 'blur(5px)',
    },
};

const DeleteExerciseDialog: React.FC<DeleteExerciseDialogProps> = ({ open, onClose, onConfirm, title }) => {
    const { t } = useTranslation();

    return (
        <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth TransitionComponent={Fade}
            PaperProps={{
                sx: styles.dialogPaper
            }}
            slotProps={{
                backdrop: {
                    timeout: 300,
                    sx: styles.backdrop,
                },

            }}
        >
            <DialogTitle sx={styles.dialogTitle}>
                {title}
            </DialogTitle>
            <DialogContent sx={styles.dialogContent} />
            <DialogActions sx={styles.dialogActions}>
                <Button
                    variant="outlined"
                    onClick={onClose}
                    sx={styles.cancelButton}
                >
                    {t('common.cancel')}
                </Button>
                <Button
                    variant="contained"
                    onClick={onConfirm}
                    sx={styles.confirmButton}
                >
                    {t('common.confirm')}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default DeleteExerciseDialog;
