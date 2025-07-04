import React, { createContext, useContext, ReactNode } from 'react';
import { api } from '../utils/axiosInstance';
import { uploadFileAndGetId } from '../utils/uploadFileAndGetId';

export interface UploadedFile {
  id: number;
  type: string;
  fileName: string;
  signedUrl: string;
  signedUrlExpire: string;
  createdAt?: string;
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
  loadingAvailableUsers: boolean;
  fetchExercises: (limit: number | undefined) => Promise<void>;
  fetchExercisesWithoutLoading: (limit?: number, search?: string, muscleGroups?: string[]) => Promise<void>;
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
  cloneDay: (sourceWeekId: number, sourceDayOfWeek: number, destinationWeekId: number, destinationDayOfWeek: number) => Promise<void>;
  deleteDay: (dayId: string | number) => Promise<void>;
  createDay: (weekId: number, dayOfWeek: number, title: string) => Promise<void>;
  updateExercisesOrder: (updates: { exerciseId: number; order: number }[]) => Promise<void>;
  // Create a workout exercise for a day
  createWorkoutExercise: (dayId: number, data: WorkoutExercisePayload) => Promise<void>;
  // Update a workout exercise
  updateWorkoutExercise: (exerciseId: number, data: WorkoutExercisePayload) => Promise<void>;
  // Delete a workout exercise
  deleteWorkoutExercise: (exerciseId: number) => Promise<void>;
  copyExerciseToDay: (exerciseId: number, destinationDayId: number) => Promise<void>;
  availableUsers: User[];
  fetchAllUsers: () => Promise<void>;
  assignedUsers: AssignedUser[];
  loadingAssignedUsers: boolean;
  fetchAssignedUsers: () => Promise<void>;
  removeUserAssignment: (assignmentId: number) => Promise<void>;
  assignUserToProgram: (userId: number) => Promise<void>;
  batchAssignAndRemoveUsers: (userIdsToAssign: number[], assignmentIdsToRemove: number[]) => Promise<void>;
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

// Reusable type for workout exercise payload
export type WorkoutExercisePayload = {
  exerciseId: number;
  order?: number; //Required when create a new exercise, optional when updating
  type: string;
  sets: number;
  repsOrTime: string;
  rest: number;
  weight?: number;
  rpe?: number;
  rir?: number;
  tut?: number;
  note?: string;
  supersetWorkoutExerciseId?: number | null; // ID of the exercise to superset with, if any
};

// --- User Types ---
export interface UserActiveSubscription {
  id: number;
}

export interface UserAssignedProgram {
  trainingProgramId: number;
  id: number;
  completed: boolean;
}

export interface User {
  id: number;
  email: string;
  username: string;
  firstName: string | null;
  lastName: string | null;
  subscriptions: UserActiveSubscription[];
  assignedPrograms: UserAssignedProgram[];
}

// --- Assigned User Types ---
export interface AssignedUser {
  id: number;
  trainingProgramId: number;
  completed: boolean;
  user: {
    id: number;
    username: string;
    email: string;
    firstName: string | null;
    lastName: string | null;
  };
}

const TrainingContext = createContext<TrainingContextType | undefined>(undefined);

export const TrainingProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [exercises, setExercises] = React.useState<Exercise[]>([]);
  const [trainingPrograms, setTrainingPrograms] = React.useState<TrainingProgram[]>([]);
  const [selectedTrainingProgram, setSelectedTrainingProgram] = React.useState<FullTrainningProgram | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [availableUsers, setAvailableUsers] = React.useState<User[]>([]);
  const [loadingAvailableUsers, setLoadingAvailableUsers] = React.useState(false);
  const [assignedUsers, setAssignedUsers] = React.useState<AssignedUser[]>([]);
  const [loadingAssignedUsers, setLoadingAssignedUsers] = React.useState(false);

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

  const fetchExercisesWithoutLoading = React.useCallback(async (limit: number | undefined = undefined, search?: string, muscleGroups?: string[]) => {
    try {
      let url = '/trainning/exercise';
      const params = new URLSearchParams();
      
      if (limit) params.append('limit', limit.toString());
      if (search) params.append('search', search);
      if (muscleGroups && muscleGroups.length > 0) {
        muscleGroups.forEach(group => params.append('muscleGroup[]', group));
      }
      
      if (params.toString()) {
        url += `?${params.toString()}`;
      }
      
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

  const fetchTrainingProgramById = React.useCallback(async (id: string | number, loading = true) => {
    if(loading) setIsLoading(true);
    try {
      const res = await api.get(`/trainning/program/${id}`);
      setSelectedTrainingProgram(res);
      return res;
    } finally {
      if(loading) setIsLoading(false);
    }
  }, []);

  const modifyTrainingProgram = async (id: number, data: TrainingProgramPayload) => {
    await api.put(`/trainning/program/${id}`, data);
    fetchTrainingProgramById(id, false);
  };

  const deleteWeek = async (weekId: number) => {
    await api.delete(`/trainning/program/weeks/${weekId}`);
    if(selectedTrainingProgram) fetchTrainingProgramById(selectedTrainingProgram?.id, false );
  };

  const createNextWeek = async (programId: number) => {
    await api.post(`/trainning/program/${selectedTrainingProgram?.id}/newweek`);
    await fetchTrainingProgramById(programId, false);
  };

  const duplicateWeek = async (weekId: number, destinationWeekOrderNumber: number, programId: number, ) => {
    await api.post(`/trainning/program/weeks/${weekId}/clone/${destinationWeekOrderNumber}`);
    await fetchTrainingProgramById(programId, false);
  };

  const updateDayTitle = async (dayId: number, title: string) => {
    await api.put(`/trainning/program/days/${dayId}`, { title });
    if(selectedTrainingProgram) await fetchTrainingProgramById(selectedTrainingProgram?.id, false);
  };

  const cloneDay = async (
    sourceWeekId: number,
    sourceDayOfWeek: number,
    destinationWeekId: number,
    destinationDayOfWeek: number
  ) => {
    await api.post(`/trainning/program/weeks/${sourceWeekId}/days/${sourceDayOfWeek}/clone/${destinationWeekId}/${destinationDayOfWeek}`);
    if(selectedTrainingProgram) await fetchTrainingProgramById(selectedTrainingProgram.id, false);
  };

  const deleteDay = async (dayId: string | number) => {
    await api.delete(`/trainning/program/days/${dayId}`);
    if (selectedTrainingProgram) await fetchTrainingProgramById(selectedTrainingProgram.id, false);
  };

  const createDay = async (weekId: number, dayOfWeek: number, title: string) => {
    await api.post(`/trainning/program/weeks/${weekId}/days`, { dayOfWeek, title });
    if (selectedTrainingProgram) await fetchTrainingProgramById(selectedTrainingProgram.id, false);
  };

  const updateExercisesOrder = async (
    updates: { exerciseId: number; order: number }[]
  ) => {
    await Promise.all(
      updates.map(({ exerciseId, order }) =>
        api.put(`/trainning/program/exercises/${exerciseId}`, { order })
      )
    );
    if (selectedTrainingProgram) await fetchTrainingProgramById(selectedTrainingProgram.id, false);
    
  };

  // Create a workout exercise for a day
  const createWorkoutExercise = async (dayId: number, data: WorkoutExercisePayload) => {
    await api.post(`/trainning/program/days/${dayId}/exercises`, data);
    if (selectedTrainingProgram) await fetchTrainingProgramById(selectedTrainingProgram.id, false);
  };

  // Update a workout exercise
  const updateWorkoutExercise = async (exerciseId: number, data: WorkoutExercisePayload) => {
    await api.put(`/trainning/program/exercises/${exerciseId}`, data);
    if (selectedTrainingProgram) await fetchTrainingProgramById(selectedTrainingProgram.id, false);
  };

  // Delete a workout exercise
  const deleteWorkoutExercise = async (exerciseId: number) => {
    await api.delete(`/trainning/program/exercises/${exerciseId}`);
    if (selectedTrainingProgram) await fetchTrainingProgramById(selectedTrainingProgram.id, false);
  };

  // Clone a workout exercise to another day
  const copyExerciseToDay = async (exerciseId: number, destinationDayId: number) => {
    await api.post(`/trainning/program/exercises/${exerciseId}/clone/${destinationDayId}`);
    if (selectedTrainingProgram) await fetchTrainingProgramById(selectedTrainingProgram.id, false);
  };

  const fetchAllUsers = React.useCallback(async () => {
    setLoadingAvailableUsers(true);
    try {
      const res = await api.get('/users/all');
      setAvailableUsers(res);
    } finally {
      setLoadingAvailableUsers(false);
    }
  }, []);

  const fetchAssignedUsers = async () => {
    setLoadingAssignedUsers(true);
    try {
       if (selectedTrainingProgram) {
          const res = await api.get(`/trainning/program/${selectedTrainingProgram.id}/users`);
          setAssignedUsers(res);
       }
    } finally {
      setLoadingAssignedUsers(false);
    }
  }

  const removeUserAssignment = async (assignmentId: number) => {
    await api.delete(`/trainning/program/assign/${assignmentId}`);
  };

  const assignUserToProgram = async (userId: number) => {
    await api.post('/trainning/program/assign', { userId, trainingProgramId: selectedTrainingProgram?.id });
  };

  // Batch assign and remove users
  const batchAssignAndRemoveUsers = async (userIdsToAssign: number[], assignmentIdsToRemove: number[]) => {
    // Assign users
    const assignPromises = userIdsToAssign.map(userId => assignUserToProgram(userId));
    // Remove assignments
    const removePromises = assignmentIdsToRemove.map(assignmentId => removeUserAssignment(assignmentId));
    await Promise.all([...assignPromises, ...removePromises]);
    // Reload data
    await fetchAllUsers();
    await fetchAssignedUsers();
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
      cloneDay,
      deleteDay,
      createDay,
      updateExercisesOrder,
      createWorkoutExercise,
      updateWorkoutExercise,
      deleteWorkoutExercise,
      copyExerciseToDay,
      availableUsers,
      loadingAvailableUsers,
      fetchAllUsers,
      assignedUsers,
      loadingAssignedUsers,
      fetchAssignedUsers,
      removeUserAssignment,
      assignUserToProgram,
      batchAssignAndRemoveUsers
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
