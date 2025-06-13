import React, { createContext, useContext, ReactNode } from 'react';
import { api } from '../utils/axiosInstance';
import { uploadFileAndGetId } from '../utils/uploadFileAndGetId';

export interface UploadedFile {
  id: number;
  type: string;
  fileName: string;
  signedUrl: string;
  signedUrlExpire: string;
}

export interface Exercise {
  id: number;
  title: string;
  muscleGroup: string;
  description: string;
  videoFile?: UploadedFile | null;
  videoFileId?: number | null;
  originalVideoFileName?: string;
  videoThumbnailFileId?: number | null;
  videoThumbnailFile?: UploadedFile | null;
  videoDuration?: number;
  videoName?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface TrainingProgram extends TrainingProgramPayload {
  id: number;
  createdAt?: string;
  updatedAt?: string;
}

interface TrainingProgramPayload {
    title?: string;
    description?: string;
    type?: string;
}

interface TrainingContextType {
  exercises: Exercise[];
  isLoading: boolean;
  fetchExercises: (limit: number | undefined) => Promise<void>;
  addExercise: (data: {
    title: string;
    muscleGroup: string;
    description: string;
    videoFile?: File | null;
    videoThumbnailFile?: File | null;
    videoDuration?: number;
  }) => Promise<Exercise>;
  updateExercise: (id: number, data: {
    title?: string;
    muscleGroup?: string;
    description?: string;
    videoFile?: File | null;
    videoThumbnailFile?: File | null;
    videoDuration?: number;
  }) => Promise<Exercise>;
  deleteExercise: (id: number) => Promise<void>;
  trainingPrograms: TrainingProgram[];
  fetchTrainingPrograms: (limit?: number) => Promise<void>;
  addTrainingProgram: (data: { title: string; description: string; type: string;}) => Promise<TrainingProgram>;
  updateTrainingProgram: (id: number, data: { title?: string; description?: string; type?: string; }) => Promise<TrainingProgram>;
  deleteTrainingProgram: (id: number) => Promise<void>;
  selectedTrainingProgram: TrainingProgram | null;
  fetchTrainingProgramById: (id: string | number) => Promise<TrainingProgram>;
}

const TrainingContext = createContext<TrainingContextType | undefined>(undefined);

export const TrainingProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [exercises, setExercises] = React.useState<Exercise[]>([]);
  const [trainingPrograms, setTrainingPrograms] = React.useState<TrainingProgram[]>([]);
  const [selectedTrainingProgram, setSelectedTrainingProgram] = React.useState<TrainingProgram | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);

  const fetchExercises = React.useCallback(async (limit: number | undefined = undefined) => {
    setIsLoading(true);
    try {
        let url = '/trainning/exercise';
      if (limit) url += `?limit=${limit}`;
      const res = await api.get(url);
      setExercises(res);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const addExercise = async ({ title, muscleGroup, description, videoFile, videoThumbnailFile, videoDuration }: {
    title: string;
    muscleGroup: string;
    description: string;
    videoFile?: File | null;
    videoThumbnailFile?: File | null;
    videoDuration?: number;
  }): Promise<Exercise> => {
    let videoFileId: number | undefined = undefined;
    let videoThumbnailFileId: number | undefined = undefined;
    if (videoFile) {
      videoFileId = await uploadFileAndGetId(videoFile);
    }
    if (videoThumbnailFile) {
      videoThumbnailFileId = await uploadFileAndGetId(videoThumbnailFile);
    }
    const payload: any = {
      title,
      muscleGroup,
      description,
      videoFileId,
      videoThumbnailFileId,
      videoDuration: videoFile && typeof videoDuration === 'number' ? Math.round(videoDuration) : undefined,
      originalVideoFileName: videoFile ? videoFile.name : undefined,
    };
    const res = await api.post('/trainning/exercise', payload);
    await fetchExercises();
    return res;
  };

  const updateExercise = async (id: number, data: {
    title?: string;
    muscleGroup?: string;
    description?: string;
    video?: File | null;
    videoThumbnail?: File | null;
    videoDuration?: number;
    originalVideoFileName?: string;

  }): Promise<Exercise> => {
    let videoFileId: null | Number | undefined = data.video === null ? null : undefined;
    let videoThumbnailFileId: null | Number | undefined = data.videoThumbnail === null ? null : undefined;
    if (data.video) {
      videoFileId = await uploadFileAndGetId(data.video);
    }
    if (data.videoThumbnail) {
      videoThumbnailFileId = await uploadFileAndGetId(data.videoThumbnail);
    }
    const payload: any = {
      ...data,
      videoFileId,
      videoThumbnailFileId,
    };
    delete payload.video;
    delete payload.videoThumbnail;
    const res = await api.put(`/trainning/exercise/${id}`, payload);
    setExercises(prev =>
      prev.map(ex => (ex.id === res.id ? res : ex))
    );
    return res;
  };

  const deleteExercise = async (id: number) => {
    await api.delete(`/trainning/exercise/${id}`);
    setExercises(prev => prev.filter(ex => ex.id !== id));
  };

  const fetchTrainingPrograms = React.useCallback(async (limit?: number) => {
    setIsLoading(true);
    try {
      let url = '/trainning/program';
      if (limit) url += `?limit=${limit}`;
      const res = await api.get(url);
      setTrainingPrograms(res);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const addTrainingProgram = async ({ title, description, type }: TrainingProgramPayload): Promise<TrainingProgram> => {
    const payload: any = { title, description, type };
    const res = await api.post('/trainning/program', payload);
    await fetchTrainingPrograms();
    return res;
  };

  const updateTrainingProgram = async (id: number, data: TrainingProgramPayload): Promise<TrainingProgram> => {
    const res = await api.put(`/trainning/program/${id}`, data);
    setTrainingPrograms(prev => prev.map(p => (p.id === res.id ? res : p)));
    return res;
  };

  const deleteTrainingProgram = async (id: number) => {
    await api.delete(`/trainning/program/${id}`);
    setTrainingPrograms(prev => prev.filter(p => p.id !== id));
  };

  const fetchTrainingProgramById = React.useCallback(async (id: string | number) => {
    setIsLoading(true);
    try {
      const res = await api.get(`/trainning/program/${id}`);
      setSelectedTrainingProgram(res);
      return res;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <TrainingContext.Provider value={{
      exercises,
      isLoading,
      fetchExercises,
      addExercise,
      updateExercise,
      deleteExercise,
      trainingPrograms,
      fetchTrainingPrograms,
      addTrainingProgram,
      updateTrainingProgram,
      deleteTrainingProgram,
      selectedTrainingProgram,
      fetchTrainingProgramById,
    }}>
      {children}
    </TrainingContext.Provider>
  );
};

export const useTraining = (): TrainingContextType => {
  const context = useContext(TrainingContext);
  if (!context) {
    throw new Error('useTraining must be used within a TrainingProvider');
  }
  return context;
};
