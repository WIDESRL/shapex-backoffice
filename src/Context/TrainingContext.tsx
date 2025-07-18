import React, { createContext, useContext, ReactNode } from 'react';
import { api } from '../utils/axiosInstance';
import { uploadFileAndGetId } from '../utils/uploadFileAndGetId';
import type {
  // Exercise Types
  Exercise,
  ExercisePayload,
  UpdateExercisePayload,
  UpdateExerciseApiPayload,
  // Training Program Types
  TrainingProgram,
  TrainingProgramPayload,
  ModifyTrainingProgramPayload,
  FullTrainningProgram,
  // Workout Exercise Types
  WorkoutExercisePayload,
  // User Types
  User,
  AssignedUser,
  // Completed Training Types
  CompletedTrainingParams,
  CompletedTrainingResponse,
  // Assignment Logs Types
  AssignmentLogsResponse,
  // Context Type
  TrainingContextType,
} from '../types/trainingProgram.types';

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
  const [completedTrainings, setCompletedTrainings] = React.useState<CompletedTrainingResponse | null>(null);
  const [loadingCompletedTrainings, setLoadingCompletedTrainings] = React.useState(false);
  
  // Assignment logs states
  const [assignmentLogs, setAssignmentLogs] = React.useState<AssignmentLogsResponse | null>(null);
  const [loadingAssignmentLogs, setLoadingAssignmentLogs] = React.useState(false);

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

  const assignUserToProgram = async (userId: number, trainingProgramId?: number | undefined) => {
    await api.post('/trainning/program/assign', { userId, trainingProgramId: trainingProgramId || selectedTrainingProgram?.id });
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

  // Fetch completed trainings
  const fetchCompletedTrainings = React.useCallback(async (params: CompletedTrainingParams = {}) => {
    setLoadingCompletedTrainings(true);
    try {
      const searchParams = new URLSearchParams();
      
      // Set default values
      searchParams.append('page', (params.page || 1).toString());
      searchParams.append('itemsPerPage', (params.itemsPerPage || 20).toString());
      
      // Add optional parameters
      if (params.clientId) searchParams.append('clientId', params.clientId.toString());
      if (params.status) searchParams.append('status', params.status);
      if (params.startDate) searchParams.append('startDate', params.startDate);
      if (params.endDate) searchParams.append('endDate', params.endDate);
      
      const url = `/trainning/completed-programs?${searchParams.toString()}`;
      const res = await api.get(url);
      console.log('fetchCompletedTrainings response:', res);
      setCompletedTrainings(res);
    } catch (error) {
      console.error('Error fetching completed trainings:', error);
    } finally {
      setLoadingCompletedTrainings(false);
    }
  }, []);

  // Load more completed trainings (append to existing data)
  const loadMoreCompletedTrainings = React.useCallback(async (params: CompletedTrainingParams = {}) => {
    setLoadingCompletedTrainings(true);
    try {
      const searchParams = new URLSearchParams();
      
      // Set default values - use the next page from current data
      const currentPage = completedTrainings?.page || 1;
      const nextPage = currentPage + 1;
      
      searchParams.append('page', nextPage.toString());
      searchParams.append('itemsPerPage', (params.itemsPerPage || 20).toString());
      
      // Add optional parameters
      if (params.clientId) searchParams.append('clientId', params.clientId.toString());
      if (params.status) searchParams.append('status', params.status);
      if (params.startDate) searchParams.append('startDate', params.startDate);
      if (params.endDate) searchParams.append('endDate', params.endDate);
      
      const url = `/trainning/completed-programs?${searchParams.toString()}`;
      const res = await api.get(url);
      
      // Append new data to existing assignments
      setCompletedTrainings(prev => ({
        ...res,
        assignments: prev ? [...prev.assignments, ...res.assignments] : res.assignments
      }));
    } catch (error) {
      console.error('Error loading more completed trainings:', error);
    } finally {
      setLoadingCompletedTrainings(false);
    }
  }, [completedTrainings]);

  // Fetch assignment logs
  const fetchAssignmentLogs = React.useCallback(async (assignmentId: number) => {
    setLoadingAssignmentLogs(true);
    try {
      const url = `/trainning/assignment/${assignmentId}/logs`;
      const res = await api.get(url);
      console.log('fetchAssignmentLogs response:', res);
      setAssignmentLogs(res);
    } catch (error) {
      console.error('Error fetching assignment logs:', error);
      setAssignmentLogs(null);
    } finally {
      setLoadingAssignmentLogs(false);
    }
  }, []);

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
      batchAssignAndRemoveUsers,
      completedTrainings,
      loadingCompletedTrainings,
      fetchCompletedTrainings,
      loadMoreCompletedTrainings,
      assignmentLogs,
      loadingAssignmentLogs,
      fetchAssignmentLogs
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
