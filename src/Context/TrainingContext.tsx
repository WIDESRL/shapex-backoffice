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

export interface FullTrainningProgram extends TrainingProgram {
  weeks: TrainingProgramWeek[];
}


// --- Training Program Weeks Types ---
export type TrainingProgramExercise = {
  id: number;
  dayId: number;
  exerciseId: number;
  order: number;
  type: string;
  sets: number;
  repsOrTime: string;
  rest: number;
  weight?: number;
  rpe?: number;
  rir?: number;
  tut?: number;
  note?: string;
  supersetGroup?: number | null;
  createdAt: string;
  updatedAt: string;
  exercise: Exercise;
};

export type TrainingProgramDay = {
  id: number;
  weekId: number;
  dayOfWeek: number;
  title: string;
  createdAt: string;
  updatedAt: string;
  exercises: TrainingProgramExercise[];
};

export type TrainingProgramWeek = {
  id: number;
  trainingProgramId: number;
  order: number;
  createdAt: string;
  updatedAt: string;
  days: TrainingProgramDay[];
};

interface TrainingContextType {
  exercises: Exercise[];
  isLoading: boolean;
  fetchExercises: (limit: number | undefined) => Promise<void>;
  fetchExercisesWithoutLoading: (limit?: number) => Promise<void>;
  addExercise: (data: {
    title: string;
    muscleGroup: string;
    description: string;
    videoFile?: File | null;
    videoThumbnailFile?: File | null;
    videoDuration?: number;
  }) => Promise<Exercise>;
  updateExercise: (id: number, data: UpdateExercisePayload) => Promise<Exercise>;
  deleteExercise: (id: number) => Promise<void>;
  trainingPrograms: TrainingProgram[];
  fetchTrainingPrograms: (limit?: number) => Promise<void>;
  addTrainingProgram: (data: { title: string; description: string; type: string;}) => Promise<TrainingProgram>;
  updateTrainingProgram: (id: number, data: { title?: string; description?: string; type?: string; }) => Promise<TrainingProgram>;
  deleteTrainingProgram: (id: number) => Promise<void>;
  selectedTrainingProgram: FullTrainningProgram | null;
  fetchTrainingProgramById: (id: string | number) => Promise<TrainingProgram>;
  modifyTrainingProgram: (id: number, data: TrainingProgramPayload) => Promise<void>;
  deleteWeek: (weekId: number) => Promise<void>;
  createNextWeek: (programId: number) => Promise<void>;
  duplicateWeek: (weekId: number, destinationWeekOrderNumber: number, programId: number) => Promise<void>;
  updateDayTitle: (dayId: number, title: string) => Promise<void>;
}

// Type for exercise payload
export type ExercisePayload = {
  title: string;
  muscleGroup: string;
  description: string;
  videoFileId?: number | null;
  videoThumbnailFileId?: number | null;
  videoDuration?: number;
  originalVideoFileName?: string;
};

// Type for update exercise payload
export type UpdateExercisePayload = {
  title?: string;
  muscleGroup?: string;
  description?: string;
  video?: File | null;
  videoThumbnail?: File | null;
  videoDuration?: number;
  originalVideoFileName?: string;
};

// Type for update exercise API payload (extends UpdateExercisePayload)
export type UpdateExerciseApiPayload = UpdateExercisePayload & {
  videoFileId?: number | null;
  videoThumbnailFileId?: number | null;
};

// Type for modify training program payload
export type ModifyTrainingProgramPayload = {
  title: string;
  description: string;
  type: string;
};

const TrainingContext = createContext<TrainingContextType | undefined>(undefined);

export const TrainingProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [exercises, setExercises] = React.useState<Exercise[]>([]);
  const [trainingPrograms, setTrainingPrograms] = React.useState<TrainingProgram[]>([]);
  const [selectedTrainingProgram, setSelectedTrainingProgram] = React.useState<FullTrainningProgram | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);

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

    const fetchExercisesWithoutLoading = React.useCallback(async (limit: number | undefined = undefined) => {
    try {
      let url = '/trainning/exercise';
      if (limit) url += `?limit=${limit}`;
      const res = await api.get(url);
      setExercises(res);
    } catch (error) {
      console.error('Error fetching exercises:', error);
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
    const payload: ExercisePayload = {
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

  const updateExercise = async (id: number, data: UpdateExercisePayload): Promise<Exercise> => {
    let videoFileId: null | number | undefined = data.video === null ? null : undefined;
    let videoThumbnailFileId: null | number | undefined = data.videoThumbnail === null ? null : undefined;
    if (data.video) {
      videoFileId = await uploadFileAndGetId(data.video);
    }
    if (data.videoThumbnail) {
      videoThumbnailFileId = await uploadFileAndGetId(data.videoThumbnail);
    }
    const payload: UpdateExerciseApiPayload = {
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

  const addTrainingProgram = async ({ title, description, type }: ModifyTrainingProgramPayload): Promise<TrainingProgram> => {
    const payload: ModifyTrainingProgramPayload = { title, description, type };
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

  const modifyTrainingProgram = async (id: number, data: TrainingProgramPayload) => {
    await api.put(`/trainning/program/${id}`, data);
    fetchTrainingProgramById(id);
  };

  const deleteWeek = async (weekId: number) => {
    await api.delete(`/trainning/program/weeks/${weekId}`);
    if(selectedTrainingProgram) fetchTrainingProgramById(selectedTrainingProgram?.id );
  };

  const createNextWeek = async (programId: number) => {
    await api.post(`/trainning/program/${selectedTrainingProgram?.id}/newweek`);
    await fetchTrainingProgramById(programId);
  };

  const duplicateWeek = async (weekId: number, destinationWeekOrderNumber: number, programId: number, ) => {
    await api.post(`/trainning/program/weeks/${weekId}/clone/${destinationWeekOrderNumber}`);
    await fetchTrainingProgramById(programId);
  };

  const updateDayTitle = async (dayId: number, title: string) => {
    await api.put(`/trainning/program/days/${dayId}`, { title });
    if(selectedTrainingProgram) await fetchTrainingProgramById(selectedTrainingProgram?.id);
  };

  return (
    <TrainingContext.Provider value={{
      exercises,
      isLoading,
      fetchExercises,
      fetchExercisesWithoutLoading,
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
      modifyTrainingProgram,
      deleteWeek,
      createNextWeek,
      duplicateWeek,
      updateDayTitle,
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
