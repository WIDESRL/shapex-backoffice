import React, { useRef, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography,
  IconButton,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Fade,
  CircularProgress
} from '@mui/material';
import DialogCloseIcon from '../../../icons/DialogCloseIcon2';
import VideoUploadIcon from '../../../icons/VideoUploadIcon';
import XIcon from '../../../icons/XIcon';
import VideoPreviewDialog from './VideoPreviewDialog';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { Exercise } from '../../../types/trainingProgram.types';
import { useTranslation } from 'react-i18next';
import { muscleGroups } from '../../../constants/muscleGroups';

const styles = {
  dialogPaper: {
    borderRadius: 4,
    p: 0,
    background: '#fff',
    boxShadow: '0 4px 32px 0 rgba(33,33,33,0.10)',
    width: 520,
    maxWidth: '95vw',
  },
  dialogBackdrop: {
    backgroundColor: 'rgba(33,33,33,0.8)',
    backdropFilter: 'blur(5px)',
  },
  dialogTitle: {
    fontSize: 28,
    fontWeight: 400,
    color: '#616160',
    fontFamily: 'Montserrat, sans-serif',
    textAlign: 'left',
    pb: 0,
    pt: 4,
    pl: 4,
    letterSpacing: 0,
    lineHeight: 1.1,
    position: 'relative',
  },
  closeButton: {
    position: 'absolute',
    right: 24,
    top: 24,
    background: 'transparent',
    boxShadow: 'none',
    p: 0,
  },
  dialogContent: {
    pt: 0,
    px: 4,
    pb: 0,
  },
  textField: {
    mb: 3,
    borderRadius: 2,
    '& .MuiOutlinedInput-root': {
      borderRadius: 2,
      fontSize: 16,
      background: '#fff',
      borderColor: '#E0E0E0',
      minHeight: 45,
      height: 45,
      '& .MuiOutlinedInput-input': {
        padding: '10px 14px',
        fontSize: 16,
        height: '20px',
        boxSizing: 'border-box',
      },
    },
    '& .MuiInputLabel-root': {
      fontSize: 16,
      color: '#888',
      top: '-4px',
    },
  },
  textFieldInput: {
    borderRadius: 2,
    fontSize: 16,
    background: '#fff',
    borderColor: '#E0E0E0',
    minHeight: 45,
    height: 45,
    '& .MuiOutlinedInput-input': {
      padding: '10px 14px',
      fontSize: 16,
      height: '20px',
      boxSizing: 'border-box',
    },
  },
  textFieldLabel: {
    fontSize: 16,
    color: '#888',
  },
  descField: {
    mb: 3,
    borderRadius: 2,
    '& .MuiOutlinedInput-root': {
      borderRadius: 2,
      fontSize: 16,
      background: '#fff',
      borderColor: '#E0E0E0',
    },
    '& .MuiOutlinedInput-input': {
      fontSize: 16,
      padding: '10px 14px',
    },
    '& .MuiInputLabel-root': {
      fontSize: 16,
      color: '#888',
      top: '-4px',
    },
  },
  descFieldInput: {
    borderRadius: 2,
    fontSize: 16,
    background: '#fff',
    borderColor: '#E0E0E0',
    '& .MuiOutlinedInput-input': {
      fontSize: 16,
      padding: '10px 14px',
    },
  },
  formControl: {
    mb: 3,
    borderRadius: 2,
  },
  inputLabel: {
    fontSize: 16,
    color: '#888',
    transform: 'translate(14px, 12px) scale(1)',
    '&.Mui-focused, &.MuiFormLabel-filled': {
      transform: 'translate(14px, -9px) scale(0.75)',
    },
  },
  select: {
    borderRadius: 3,
    fontSize: 16,
    background: '#fff',
    borderColor: '#E0E0E0',
    minHeight: 45,
    height: 45,
    '& .MuiSelect-select': {
      display: 'flex',
      alignItems: 'center',
      padding: '12px 14px',
      fontSize: 16,
      lineHeight: 1,
    },
  },
  selectMenuPaper: {
    borderRadius: 3,
  },
  menuItem: {
    fontSize: 16,
  },
  videoDropBox: (videoPreview: string | null, dragActive: boolean, dragFileType: 'video' | 'not-video' | null) => ({
    border: videoPreview
      ? '2px solid #bdbdbd'
      : dragActive && dragFileType === 'video'
      ? '3px dashed #4CAF50'
      : dragActive && dragFileType === 'not-video'
      ? '3px dashed #d32f2f'
      : '2px dashed #bdbdbd',
    borderRadius: 3,
    background: dragActive ? '#f5f5f5' : '#fff',
    minHeight: 170,
    display: 'flex',
    alignItems: videoPreview ? 'flex-start' : 'center',
    justifyContent: videoPreview ? 'flex-start' : 'center',
    flexDirection: videoPreview ? 'row' : 'column',
    cursor: videoPreview ? 'default' : 'pointer',
    mb: 2,
    mt: 2,
    position: 'relative',
    transition: 'background 0.2s, border 0.2s',
    px: 2,
    py: videoPreview ? 2 : 0,
    boxSizing: 'border-box',
  }),
  videoLabel: {
    color: '#888',
    fontSize: 18,
    mb: 0,
    ml: 1,
    fontFamily: 'Montserrat, sans-serif',
    position: 'absolute',
    top: '-14px',
    left: '7px',
    backgroundColor: 'white',
    paddingLeft: '5px',
    paddingRight: '5px',
    zIndex: 2,
  },
  videoUploadIcon: {
    color: '#bdbdbd',
    fontSize: 64,
    mb: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  videoDropTitle: {
    color: '#616160',
    fontSize: 22,
    textAlign: 'center',
    fontWeight: 500,
    fontFamily: 'Montserrat, sans-serif',
    mb: 0.5,
  },
  videoDropSubtitle: {
    color: '#888',
    fontSize: 15,
    textAlign: 'center',
    fontFamily: 'Montserrat, sans-serif',
    fontWeight: 400,
  },
  videoPreviewBox: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    alignItems: 'flex-start',
    position: 'relative',
  },
  videoThumb: {
    width: 120,
    height: 120,
    borderRadius: 2,
    overflow: 'hidden',
    background: '#000',
    mr: 3,
    ml: 1,
    mt: 1,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  videoTag: {
    maxWidth: '100%',
    maxHeight: '100%',
    borderRadius: 8,
    pointerEvents: 'none',
    objectFit: 'contain',
    background: '#000',
  },
  videoMetaBox: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    mt: 1,
    position: 'relative',
  },
  videoRemoveButton: {
    position: 'absolute',
    right: 0,
    top: 0,
    background: 'transparent',
    p: 0,
  },
  videoMetaLabel: {
    fontSize: 14,
    color: '#888',
    fontFamily: 'Montserrat, sans-serif',
    mt: 0.5,
  },
  videoMetaValue: {
    fontSize: 16,
    color: '#616160',
    fontFamily: 'Montserrat, sans-serif',
    fontWeight: 500,
    mb: 1,
  },
  videoMetaValueNoMargin: {
    fontSize: 16,
    color: '#616160',
    fontFamily: 'Montserrat, sans-serif',
    fontWeight: 500,
  },
  errorText: {
    color: '#E57373',
    fontSize: 15,
    mt: 0.5,
    mb: 1,
    textAlign: 'center',
    fontFamily: 'Montserrat, sans-serif',
  },
  dialogActions: {
    px: 4,
    pb: 4,
    pt: 0,
  },
  saveButton: {
    background: '#EDB528',
    color: '#fff',
    borderRadius: 2.5,
    fontWeight: 500,
    fontSize: 18,
    px: 5,
    py: 1.2,
    minWidth: 120,
    boxShadow: 0,
    textTransform: 'none',
    fontFamily: 'Montserrat, sans-serif',
    '&:hover': { background: '#d1a53d' },
  },
  descLabel: {
    mb: 3,
    fontWeight: 500,
    color: '#616160',
    fontFamily: 'Montserrat, sans-serif',
    fontSize: 15,
  },
  quill: {
    background: '#fff',
    borderRadius: 8,
    minHeight: 100,
    marginBottom: 24,
  },
};

export type ExerciseModalSaveData = {
  title: string;
  description: string;
  muscleGroup: string;
  video?: File;
  videoThumbnail?: File | null;
  videoDuration?: number | null;
  videoName?: string;
};

export type ExerciseModalUpdateData = {
  title: string;
  description: string;
  muscleGroup: string;
  video?: File | null;
  videoThumbnail?: File | null;
  videoDuration?: number | null;
  originalVideoFileName?: string;
};

interface ExerciseModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: ExerciseModalSaveData) => Promise<void>;
  onUpdate?: (data: ExerciseModalUpdateData) => Promise<void>;
  initialData?: Exercise;
}

const ExerciseModal: React.FC<ExerciseModalProps> = ({ open, onClose, onSave, onUpdate, initialData }) => {
  const { t } = useTranslation();
  const [title, setTitle] = useState(initialData?.title || '');
  const [desc, setDesc] = useState(initialData?.description || '');
  const [group, setGroup] = useState(initialData?.muscleGroup || '');
  const [video, setVideo] = useState<File | null>(null);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const [videoThumbnailFile, setVideoThumbnailFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [videoDuration, setVideoDuration] = useState<number | null>(null);
  const [videoPreviewDialogOpen, setVideoPreviewDialogOpen] = useState(false);
  const [dragFileType, setDragFileType] = useState<'video' | 'not-video' | null>(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const generateVideoThumbnail = (file: File) => {
    return new Promise<string>((resolve, reject) => {
      const video = document.createElement('video');
      video.preload = 'metadata';
      video.muted = true;
      video.src = URL.createObjectURL(file);
      video.currentTime = 1;
      video.onloadeddata = () => {
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
          resolve(dataUrl);
        } else {
          reject('Canvas not supported');
        }
        URL.revokeObjectURL(video.src);
      };
      video.onerror = () => {
        reject('Failed to load video');
        URL.revokeObjectURL(video.src);
      };
    });
  };

  const dataURLtoFile = (dataurl: string, filename: string) => {
    const arr = dataurl.split(',');
    const mimeMatch = arr[0].match(/:(.*?);/);
    const mime = mimeMatch ? mimeMatch[1] : 'image/jpeg';
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  };

  const handleVideoSelect = async (file: File) => {
    setError(null);
    if (!file.type.startsWith('video/')) {
      setError('training.errorNotVideo');
      return;
    }
    setVideo(file);
    setVideoPreview(URL.createObjectURL(file));
    try {
      const thumb = await generateVideoThumbnail(file);
      const thumbFile = dataURLtoFile(thumb, 'thumbnail.jpg');
      setVideoThumbnailFile(thumbFile);
    } catch {
      setVideoThumbnailFile(null);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(false);
    setDragFileType(null);
    setError(null);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleVideoSelect(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleVideoSelect(e.target.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(true);
    const items = e.dataTransfer.items;
    if (items && items.length > 0) {
      const item = items[0];
      if (item.kind === 'file') {
        const type = item.type;
        if (type.startsWith('video/')) {
          setDragFileType('video');
        } else {
          setDragFileType('not-video');
        }
      } else {
        setDragFileType(null);
      }
    } else {
      setDragFileType(null);
    }
  };
  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(false);
    setDragFileType(null);
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      if (video) {
        await onSave({
          title,
          description: desc,
          muscleGroup: group,
          ...(video ? {
            video,
            videoThumbnail: videoThumbnailFile,
            videoDuration,
            videoName: video.name,
          } : {})
        });
      } else {
        await onSave({ title,  
            description: desc,
            muscleGroup: group, 
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    setLoading(true);
    try {
      const hadVideo = !!initialData?.videoFile;
      const hasVideoNow = !!videoPreview;
      const videoChanged =
        (hadVideo && !hasVideoNow) ||
        (!hadVideo && hasVideoNow) ||
        (hadVideo && hasVideoNow && video?.name);

      if (hadVideo && !hasVideoNow) {
        if (onUpdate) await onUpdate({
          title,
          description: desc,
          muscleGroup: group,
          video: null,
          videoThumbnail: null,
        });
        return;
      }
      if (videoChanged && hasVideoNow) {
        if (onUpdate) await onUpdate({
          title,
          description: desc,
          muscleGroup: group,
          video,
          videoThumbnail: videoThumbnailFile,
          videoDuration: Math.round(videoDuration || 0),
          originalVideoFileName: video?.name,
        });
        return;
      }
      if (onUpdate) await onUpdate({
        title,
        description: desc,
        muscleGroup: group,
      });
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    if (open && initialData) {
      setTitle(initialData.title || '');
      setDesc(initialData.description || '');
      setGroup(initialData.muscleGroup || '');
      if (initialData.videoFile && initialData.videoFile.signedUrl) {
        setVideo(null); 
        setVideoPreview(initialData.videoFile.signedUrl);
        setVideoDuration(initialData.videoDuration || null);
      } else {
        setVideo(null);
        setVideoPreview(null);
        setVideoDuration(null);
      }
      setVideoThumbnailFile(null); 
      setDragActive(false);
      setError(null);
      setVideoPreviewDialogOpen(false);
    }
    if (!open) {
      setTitle('');
      setDesc('');
      setGroup('');
      setVideo(null);
      setVideoPreview(null);
      setVideoThumbnailFile(null);
      setDragActive(false);
      setError(null);
      setVideoDuration(null);
      setVideoPreviewDialogOpen(false);
    }
  }, [open, initialData]);

  return (
      <Dialog open={open} onClose={onClose} maxWidth={false} fullWidth TransitionComponent={Fade}
          PaperProps={{
              sx: styles.dialogPaper
          }}
          slotProps={{
              backdrop: {
                  timeout: 300,
                  sx: styles.dialogBackdrop,
              },
          }}
      >
      <DialogTitle sx={styles.dialogTitle}>
        {initialData ? t('training.editExercise') : t('training.addExercise')}
        <IconButton onClick={onClose} sx={styles.closeButton}>
          <DialogCloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={styles.dialogContent}>
        <Box sx={{ height: 18 }} />
        <TextField
          label={t('training.exerciseTitle')}
          value={title}
          onChange={e => setTitle(e.target.value)}
          fullWidth
          sx={styles.textField}
          InputProps={{
            sx: styles.textFieldInput,
          }}
          InputLabelProps={{ sx: styles.textFieldLabel }}
        />
        <Box>
          <Box sx={styles.descLabel}>{t('training.description')}</Box>
          <ReactQuill
            theme="snow"
            value={desc}
            onChange={val => setDesc(val)}
            style={styles.quill as React.CSSProperties}
          />
        </Box>
        <FormControl fullWidth sx={styles.formControl}>
          <InputLabel sx={styles.inputLabel}>{t('training.muscleGroup')}</InputLabel>
          <Select
            value={group}
            label={t('training.muscleGroup')}
            onChange={e => setGroup(e.target.value)}
            sx={styles.select}
            MenuProps={{ PaperProps: { sx: styles.selectMenuPaper } }}
          >
            {muscleGroups.map(mg => (
              <MenuItem key={mg} value={mg} sx={styles.menuItem}>{t(`training.muscleGroups.${mg}`)}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <Box
          sx={styles.videoDropBox(videoPreview, dragActive, dragFileType)}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => {
            if (!videoPreview) fileInputRef.current?.click();
          }}
        >
          <Box sx={styles.videoLabel}>
            {t('training.exerciseVideo')}
          </Box>
          <input
            ref={fileInputRef}
            type="file"
            accept="video/*"
            style={{ display: 'none' }}
            onChange={handleFileChange}
          />
          {!videoPreview ? (
            <>
              <Box sx={styles.videoUploadIcon}>
                <VideoUploadIcon />
              </Box>
              <Typography sx={styles.videoDropTitle}>
                {t('training.uploadVideoHere')}
              </Typography>
              <Typography sx={styles.videoDropSubtitle}>
                {t('training.dragOrChooseFile')}
              </Typography>
            </>
          ) : (
            <Box sx={styles.videoPreviewBox}>
              <Box sx={styles.videoThumb}
                onClick={() => setVideoPreviewDialogOpen(true)}
              >
                <video
                  src={videoPreview}
                  style={styles.videoTag as React.CSSProperties}
                  onLoadedMetadata={e => setVideoDuration(e.currentTarget.duration)}
                  tabIndex={-1}
                />
              </Box>
              <Box sx={styles.videoMetaBox}>
                <IconButton onClick={() => { setVideo(null); setVideoPreview(null); setError(null); }} sx={styles.videoRemoveButton}>
                  <XIcon />
                </IconButton>
                <Typography sx={styles.videoMetaLabel}>{t('training.fileName')}</Typography>
                <Typography sx={styles.videoMetaValue}>{
                    video?.name || initialData?.originalVideoFileName || (initialData?.videoFile && initialData.videoFile.fileName) || ''
                }</Typography>
                <Typography sx={styles.videoMetaLabel}>{t('training.duration')}</Typography>
                <Typography sx={styles.videoMetaValue}>{videoDuration ? `${Math.round(videoDuration)} ${t('training.seconds')}` : '---'}</Typography>
                <Typography sx={styles.videoMetaLabel}>{t('training.uploadDate')}</Typography>
                <Typography sx={styles.videoMetaValueNoMargin}>{initialData?.createdAt && new Date(initialData?.createdAt).toLocaleDateString('it-IT')}</Typography>
              </Box>
            </Box>
          )}
        </Box>
        {error && (
          <Typography sx={styles.errorText}>{t(error)}</Typography>
        )}
      </DialogContent>
      <DialogActions sx={styles.dialogActions}>
        <Button
          variant="contained"
          onClick={initialData && onUpdate ? handleUpdate : handleSave}
          sx={styles.saveButton}
          disabled={!title.trim() || !group.trim() || loading}
        >
          {loading ? (
            <CircularProgress size={22} sx={{ color: '#fff' }} />
          ) : (
            initialData ? t('training.saveChanges') : t('training.save')
          )}
        </Button>
      </DialogActions>
      {videoPreviewDialogOpen && videoPreview && (
        <VideoPreviewDialog
          open={videoPreviewDialogOpen}
          onClose={() => setVideoPreviewDialogOpen(false)}
          videoUrl={videoPreview}
        />
      )}

    </Dialog>
  );
};

export default ExerciseModal;
