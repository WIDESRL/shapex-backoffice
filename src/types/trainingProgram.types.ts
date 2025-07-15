// --- File Upload Types ---
export interface UploadedFile {
  id: number;
  type: string;
  fileName: string;
  signedUrl: string;
  signedUrlExpire: string;
  createdAt?: string;
}

// --- Exercise Types ---
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

export type ExercisePayload = {
  title: string;
  muscleGroup: string;
  description: string;
  videoFileId?: number | null;
  videoThumbnailFileId?: number | null;
  videoDuration?: number;
  originalVideoFileName?: string;
};

export type UpdateExercisePayload = {
  title?: string;
  muscleGroup?: string;
  description?: string;
  video?: File | null;
  videoThumbnail?: File | null;
  videoDuration?: number;
  originalVideoFileName?: string;
};

export type UpdateExerciseApiPayload = UpdateExercisePayload & {
  videoFileId?: number | null;
  videoThumbnailFileId?: number | null;
};

// --- Training Program Types ---
export interface TrainingProgramPayload {
  title?: string;
  description?: string;
  type?: string;
}

export interface TrainingProgram extends TrainingProgramPayload {
  id: number;
  createdAt?: string;
  updatedAt?: string;
}

export type ModifyTrainingProgramPayload = {
  title: string;
  description: string;
  type: string;
};

export interface FullTrainningProgram extends TrainingProgram {
  weeks: TrainingProgramWeek[];
}

// --- Training Program Structure Types ---
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

// --- Workout Exercise Types ---
export type WorkoutExercisePayload = {
  exerciseId: number;
  order?: number; // Required when creating a new exercise, optional when updating
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

// --- Completed Training Types ---
export interface CompletedTraining {
  id: number;
  clientId: number;
  clientName: string;
  trainingProgramName: string;
  trainingProgramType: string;
  weekCount: number;
  dayCount: number;
  status: 'completed' | 'expiringSoon' | 'inProgress';
  createdAt: string;
  completedAt: string;
  expiresAt: string;
}

export interface CompletedTrainingParams {
  page?: number;
  itemsPerPage?: number;
  clientId?: number;
  status?: 'completed' | 'expiringSoon' | 'inProgress';
  startDate?: string;
  endDate?: string;
}

export interface CompletedTrainingResponse {
  assignments: CompletedTraining[];
  totalCount: number;
  page: number;
  itemsPerPage: number;
  totalPages: number;
}

// --- Exercise Detail Types (Legacy) ---
export interface ExerciseDetailData {
  programma: string;
  data: string;
  durataAllenamento: string;
  exercises: ExerciseDetail[];
}

export interface ExerciseDetail {
  id: number;
  name: string;
  series: number;
  repetitions: number;
  sets: ExerciseSet[];
  note: string;
}

export interface ExerciseSet {
  serie: number;
  peso: number;
  ripetizioni: number;
}

// --- Assignment Logs Types ---
export interface AssignmentLogEntry {
  weight: number;
  reps: number;
  rest: number | null;
  completedAt: string;
}

export interface AssignmentLogSeries {
  serie: number;
  logs: AssignmentLogEntry[];
}

export interface AssignmentLogExercise {
  name: string;
  repetitions: number;
  type: string;
  series: AssignmentLogSeries[];
}

export interface AssignmentLogAssignment {
  id: number;
  clientId: number;
  clientName: string;
  createdAt: string;
  expiresAt: string;
  completedAt: string;
  completed: boolean;
}

export interface AssignmentLogTrainingProgram {
  id: number;
  title: string;
  type: string;
}

export interface AssignmentLogsResponse {
  assignment: AssignmentLogAssignment;
  trainingProgram: AssignmentLogTrainingProgram;
  exercises: AssignmentLogExercise[];
  totalLogs: number;
}

// --- Training Context Interface ---
export interface TrainingContextType {
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
  createWorkoutExercise: (dayId: number, data: WorkoutExercisePayload) => Promise<void>;
  updateWorkoutExercise: (exerciseId: number, data: WorkoutExercisePayload) => Promise<void>;
  deleteWorkoutExercise: (exerciseId: number) => Promise<void>;
  copyExerciseToDay: (exerciseId: number, destinationDayId: number) => Promise<void>;
  availableUsers: User[];
  fetchAllUsers: () => Promise<void>;
  assignedUsers: AssignedUser[];
  loadingAssignedUsers: boolean;
  fetchAssignedUsers: () => Promise<void>;
  removeUserAssignment: (assignmentId: number) => Promise<void>;
  assignUserToProgram: (userId: number, trainingProgramId?: number) => Promise<void>;
  batchAssignAndRemoveUsers: (userIdsToAssign: number[], assignmentIdsToRemove: number[]) => Promise<void>;
  completedTrainings: CompletedTrainingResponse | null;
  loadingCompletedTrainings: boolean;
  fetchCompletedTrainings: (params?: CompletedTrainingParams) => Promise<void>;
  loadMoreCompletedTrainings: (params?: CompletedTrainingParams) => Promise<void>;
  assignmentLogs: AssignmentLogsResponse | null;
  loadingAssignmentLogs: boolean;
  fetchAssignmentLogs: (assignmentId: number) => Promise<void>;
}
