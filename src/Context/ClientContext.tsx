import React, { createContext, useContext, useState, useCallback } from 'react';
import axiosInstance from '../utils/axiosInstance';

export type ClientSubscription = {
  subscriptionName: string;
  subscriptionColor: string;
};

export type TrainingProgramAssignment = {
  id: number;
  userId: number;
  completed: boolean;
  completedAt: string | null;
};

export type TrainingProgramWeek = {
  id: number;
}

// Type for historical exercise data returned from /trainning/exercises/history/user/:userId
export type HistoricalExercise = {
  exerciseName: string;
  data: string;
  type: string;
  week: number;
  workoutExerciseId: number;
  assignmentId: number;
};

// Type for diet data
export type Diet = {
  id: number;
  userId: number;
  mealPlan: string;
  foodSupplements: string;
};

// Type for file/image data
export type FileData = {
  id: number;
  type: string;
  fileName: string;
  signedUrl: string;
  signedUrlExpire: string;
};

// Type for user album images
export type UserAlbumImage = {
  id: number;
  fileName: string;
  type: string;
  createdAt: string;
  updatedAt: string;
  signedUrl: string;
  signedUrlExpire: string;
};

// Type for initial history data
export type InitialHistory = {
  id: number;
  userId: number;
  sex: string;
  age: number;
  height: number;
  weight: number;
  physicalActivity: string;
  fatMass: string;
  goals: string;
  sittingHours: number;
  createdAt: string;
  updatedAt: string;
  completedStep: number;
  completed: boolean;
  workType: string;
  addome: string;
  altezza: string;
  avambraccioDx: string;
  avambraccioSx: string;
  braccioDx: string;
  braccioContrattoDx: string;
  braccioSx: string;
  braccioContrattoSx: string;
  cavigliaDx: string;
  cavigliaSx: string;
  collo: string;
  gambaDx: string;
  gambaMedialeDx: string;
  trainingExperience: string;
  sessionsPerWeek: number;
  desiredSessions: number;
  trainingPlace: string;
  equipment: string;
  weights: string;
  trainingHistory: string;
  drugs: string;
  previousDiet: string;
  injuries: string;
  allergies: string;
  frontImageId: number | null;
  leftSideImageId: number | null;
  rightSideImageId: number | null;
  backImageId: number | null;
  frontImage?: FileData | null;
  leftSideImage?: FileData | null;
  rightSideImage?: FileData | null;
  backImage?: FileData | null;
};

// Type for user checks/measurements data
export type UserCheck = {
  id: number;
  userId: number;
  createdAt: string;
  updatedAt: string;
  addome?: string;
  altezza?: string;
  avambraccioDx?: string;
  avambraccioSx?: string;
  braccioDx?: string;
  braccioContrattoDx?: string;
  braccioSx?: string;
  braccioContrattoSx?: string;
  cavigliaDx?: string;
  cavigliaSx?: string;
  collo?: string;
  gambaDx?: string;
  gambaMedialeDx?: string;
  gambaSx?: string;
  peso?: string;
  [key: string]: string | number | undefined | null; // For any additional measurement fields
};

export type UserCheckDetailed = UserCheck & {
  optionalImageId1: number | null;
  optionalImageId2: number | null;
  optionalImageId3: number | null;
  optionalImageId4: number | null;
  optionalImageId5: number | null;
  frontImageId: number | null;
  sideImageId: number | null;
  backImageId: number | null;
  frontImage?: FileData | null;
  backImage?: FileData | null;
  sideImage?: FileData | null;
  optionalImage1?: FileData | null;
  optionalImage2?: FileData | null;
  optionalImage3?: FileData | null;
  optionalImage4?: FileData | null;
  optionalImage5?: FileData | null;
};

export type TrainingProgramOfUser = {
  id: number;
  title: string;
  description: string;
  type: string;
  createdAt: string;
  updatedAt: string;
  assignments: TrainingProgramAssignment[];
  weeks: TrainingProgramWeek[];
};

export type Client = {
  id: number;
  email: string;
  username: string;
  firstName: string | null;
  lastName: string | null;
  phoneNumber: string | null;
  dateOfBirth: string | null;
  placeOfBirth: string | null;
  activeSubscription: {
    id: number;
    name: string;
    color: string;
    expireDate: string;
    startDate: string;
    status: 'active' | 'expired' | 'pending';
  } | null;
  totalMessages: number;
};

export type ClientAnagrafica = {
  firstName: string | null;
  lastName: string | null;
  phoneNumber: string | null;
  email: string;
  dateOfBirth: string | null;
  placeOfBirth: string | null;
  activeSubscription: {
    id: number,
    title: string,
    color: string,
    startDate: string,
    endDate: string,
    status: string,
    integrationPlan: boolean,
    mealPlan: boolean,
  } | null;

};

// Type for user subscriptions
export type UserSubscription = {
  id: number;
  subscription: {
    id: number;
    title: string;
    color: string;
  };
  status: 'active' | 'expired' | 'pending' | 'cancelled';
  startDate: string;
  endDate: string;
  isCurrentActiveSubscription: boolean;
  futureSubscription?: boolean;
  stripePaymentData: {
    id: string;
    amount: number;
    currency: string;
    status: string;
  };
};

// Type for notification data
export type UserNotification = {
  id: number;
  title: string;
  description: string;
  type: 'push' | 'email';
  metadata: Record<string, unknown> | null;
  createdAt: string;
};

// Type for notification pagination
export type NotificationPagination = {
  page: number;
  pageLimit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
};

// Type for pagination
export type Pagination = {
  page: number;
  pageLimit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
};

// Type for notifications response
export type NotificationsResponse = {
  notifications: UserNotification[];
  pagination: Pagination;
};

// Type for client names
export type ClientName = {
  id: number;
  name: string;
};

export type ClientContextType = {
  clients: Client[];
  clientNames: ClientName[];
  clientAnagrafica: ClientAnagrafica | null;
  trainingProgramOfUser: TrainingProgramOfUser[];
  historicalExercises: HistoricalExercise[];
  diet: Diet | null;
  initialHistory: InitialHistory | null;
  userChecks: UserCheck[];
  userImagesAlbum: UserAlbumImage[];
  userNotifications: UserNotification[];
  userSubscriptions: UserSubscription[];
  notificationsPagination: Pagination | null;
  userImagesAlbumPagination: Pagination | null;
  selectedCheckDetailed: UserCheckDetailed | null;
  loading: boolean;
  loadingClientNames: boolean;
  loadingClientAnagrafica: boolean;
  loadingTrainingPrograms: boolean;
  loadingHistoricalExercises: boolean;
  loadingDiet: boolean;
  loadingInitialHistory: boolean;
  loadingUserChecks: boolean;
  loadingUserImagesAlbum: boolean;
  loadingUserNotifications: boolean;
  loadingUserSubscriptions: boolean;
  loadingSelectedCheck: boolean;
  page: number;
  pageSize: number;
  total: number;
  search: string;
  fetchClients: (params?: { page?: number; pageSize?: number; search?: string; subscriptionId?: string; append?: boolean }) => Promise<void>;
  fetchClientNames: () => Promise<void>;
  setSearch: (search: string) => void;
  setPage: (page: number) => void;
  setClients: React.Dispatch<React.SetStateAction<Client[]>>;
  fetchClientAnagrafica: (clientId: string) => Promise<void>;
  fetchTrainingProgramOfUser: (userId: string) => Promise<void>;
  fetchHistoricalExercises: (userId: string) => Promise<void>;
  fetchDiet: (userId: string) => Promise<void>;
  createOrUpdateDiet: (userId: string, mealPlan?: string, foodSupplements?: string) => Promise<void>;
  fetchInitialHistory: (userId: string) => Promise<void>;
  fetchUserChecks: (userId: string, startDate?: string, endDate?: string) => Promise<void>;
  fetchUserImagesAlbum: (userId: string, page?: number, pageLimit?: number, startDate?: string, endDate?: string, append?: boolean) => Promise<void>;
  fetchUserNotifications: (userId: string, page?: number, pageLimit?: number, startDate?: string, endDate?: string, type?: string, append?: boolean) => Promise<void>;
  fetchUserSubscriptions: (userId: string) => Promise<void>;
  fetchCheckById: (checkId: number) => Promise<void>;
  changeUserPassword: (userId: string, newPassword: string) => Promise<void>;
};

const ClientContext = createContext<ClientContextType | undefined>(undefined);

export const ClientProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [clients, setClients] = useState<Client[]>([]);
  const [clientNames, setClientNames] = useState<ClientName[]>([]);
  const [clientAnagrafica, setClientAnagrafica] = useState<ClientAnagrafica | null>(null);
  const [trainingProgramOfUser, setTrainingProgramOfUser] = useState<TrainingProgramOfUser[]>([]);
  const [historicalExercises, setHistoricalExercises] = useState<HistoricalExercise[]>([]);
  const [diet, setDiet] = useState<Diet | null>(null);
  const [initialHistory, setInitialHistory] = useState<InitialHistory | null>(null);
  const [userChecks, setUserChecks] = useState<UserCheck[]>([]);
  const [userImagesAlbum, setUserImagesAlbum] = useState<UserAlbumImage[]>([]);
  const [userNotifications, setUserNotifications] = useState<UserNotification[]>([]);
  const [userSubscriptions, setUserSubscriptions] = useState<UserSubscription[]>([]);
  const [notificationsPagination, setNotificationsPagination] = useState<Pagination | null>(null);
  const [userImagesAlbumPagination, setUserImagesAlbumPagination] = useState<Pagination | null>(null);
  const [selectedCheckDetailed, setSelectedCheckDetailed] = useState<UserCheckDetailed | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingClientNames, setLoadingClientNames] = useState(false);
  const [loadingClientAnagrafica, setLoadingClientAnagrafica] = useState(false);
  const [loadingTrainingPrograms, setLoadingTrainingPrograms] = useState(false);
  const [loadingHistoricalExercises, setLoadingHistoricalExercises] = useState(false);
  const [loadingDiet, setLoadingDiet] = useState(false);
  const [loadingInitialHistory, setLoadingInitialHistory] = useState(false);
  const [loadingUserChecks, setLoadingUserChecks] = useState(false);
  const [loadingUserImagesAlbum, setLoadingUserImagesAlbum] = useState(false);
  const [loadingUserNotifications, setLoadingUserNotifications] = useState(false);
  const [loadingUserSubscriptions, setLoadingUserSubscriptions] = useState(false);
  const [loadingSelectedCheck, setLoadingSelectedCheck] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');

  const fetchClients = useCallback(
    async (params?: { page?: number; pageSize?: number; search?: string; subscriptionId?: string; append?: boolean }) => {
      setLoading(true);
      const currentPage = params?.page ?? page;
      const currentPageSize = params?.pageSize ?? pageSize;
      const currentSearch = params?.search ?? search;
      const append = params?.append ?? false;
        const response = await axiosInstance.get(
      `/client/all`,
      {
        params: {
          page: currentPage,
          pageSize: currentPageSize,
          search: currentSearch,
          ...(params?.subscriptionId && { subscriptionId: params.subscriptionId }),
        },
      }
    );
      setClients((prev) => append ? [...prev, ...response.data] : response.data);
      setTotal(response.data.total);
      setLoading(false);
    },
    [page, pageSize, search]
  );

  const fetchClientNames = useCallback(async (): Promise<void> => {
    try {
      setLoadingClientNames(true);
      const response = await axiosInstance.get('/client/all/names');
      setClientNames(response.data || []);
    } catch (error) {
      console.error('Error fetching client names:', error);
      setClientNames([]);
      throw error;
    } finally {
      setLoadingClientNames(false);
    }
  }, []);

  const fetchClientAnagrafica = async (clientId: string): Promise<void> => {
    try {
      setLoadingClientAnagrafica(true);
      const response = await axiosInstance.get(`/client/anagrafica/${clientId}`);
      if (!response.data) throw new Error('Client not found');
      
      setClientAnagrafica(response.data);
    } catch (error) {
      console.error('Error fetching client anagrafica:', error);
      setClientAnagrafica(null);
      throw error;
    } finally {
      setLoadingClientAnagrafica(false);
    }
  };

  const fetchTrainingProgramOfUser = async (userId: string): Promise<void> => {
    try {
      setLoadingTrainingPrograms(true);
      const response = await axiosInstance.get(`/trainning/program/user/${userId}`);
      
      setTrainingProgramOfUser(response.data || []);
    } catch (error) {
      console.error('Error fetching training programs:', error);
      setTrainingProgramOfUser([]);
      throw error;
    } finally {
      setLoadingTrainingPrograms(false);
    }
  };

  const fetchHistoricalExercises = async (userId: string): Promise<void> => {
    try {
      setLoadingHistoricalExercises(true);
      const response = await axiosInstance.get(`/trainning/exercises/history/user/${userId}`);
      
      setHistoricalExercises(response.data || []);
    } catch (error) {
      console.error('Error fetching historical exercises:', error);
      setHistoricalExercises([]);
      throw error;
    } finally {
      setLoadingHistoricalExercises(false);
    }
  };

  const fetchDiet = async (userId: string): Promise<void> => {
    try {
      setLoadingDiet(true);
      const response = await axiosInstance.get(`/diet/${userId}`);
      
      setDiet(response.data || null);
    } catch (error) {
      console.error('Error fetching diet:', error);
      setDiet(null);
      throw error;
    } finally {
      setLoadingDiet(false);
    }
  };

  const createOrUpdateDiet = async (userId: string, mealPlan?: string, foodSupplements?: string): Promise<void> => {
    try {
      setLoadingDiet(true);

      const response = await axiosInstance.post(`/diet/${userId}`, {
        foodSupplements,
        mealPlan
      });
      
      setDiet(response.data);
    } catch (error) {
      console.error('Error creating/updating diet:', error);
      throw error;
    } finally {
      setLoadingDiet(false);
    }
  };

  const fetchInitialHistory = async (userId: string): Promise<void> => {
    try {
      setLoadingInitialHistory(true);
      const response = await axiosInstance.get(`/users/initial-history/${userId}`);
      
      setInitialHistory(response.data || null);
    } catch (error) {
      console.error('Error fetching initial history:', error);
      setInitialHistory(null);
      throw error;
    } finally {
      setLoadingInitialHistory(false);
    }
  };

  const fetchUserChecks = useCallback(async (userId: string, startDate?: string, endDate?: string): Promise<void> => {
    try {
      setLoadingUserChecks(true);
      
      // Build query parameters
      const params = new URLSearchParams();
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);
      
      const queryString = params.toString();
      const url = `/checks/user/${userId}${queryString ? `?${queryString}` : ''}`;
      
      const response = await axiosInstance.get(url);
      
      setUserChecks(response.data || []);
    } catch (error) {
      console.error('Error fetching user checks:', error);
      setUserChecks([]);
      throw error;
    } finally {
      setLoadingUserChecks(false);
    }
  }, []);

  const fetchUserImagesAlbum = useCallback(async (
    userId: string, 
    page: number = 1, 
    pageLimit: number = 20, 
    startDate?: string, 
    endDate?: string,
    append: boolean = false
  ): Promise<void> => {
    try {
      setLoadingUserImagesAlbum(true);
      
      const params = new URLSearchParams();
      params.append('page', page.toString());
      params.append('pageLimit', pageLimit.toString());
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);
      
      const queryString = params.toString();
      const url = `/storage/images/${userId}?${queryString}`;
      
      const response = await axiosInstance.get(url);
      const data = response.data;
      
      // Check if response has pagination structure
      if (data.images && data.pagination) {
        setUserImagesAlbum(prev => append ? [...prev, ...data.images] : data.images);
        setUserImagesAlbumPagination(data.pagination);
      } else {
        // Fallback for legacy response format
        setUserImagesAlbum(prev => append ? [...prev, ...(data || [])] : (data || []));
        setUserImagesAlbumPagination(null);
      }
    } catch (error) {
      console.error('Error fetching user images album:', error);
      setUserImagesAlbum([]);
      setUserImagesAlbumPagination(null);
      throw error;
    } finally {
      setLoadingUserImagesAlbum(false);
    }
  }, []);

  const fetchUserNotifications = useCallback(async (
    userId: string, 
    page: number = 1, 
    pageLimit: number = 20, 
    startDate?: string, 
    endDate?: string,
    type?: string,
    append: boolean = false
  ): Promise<void> => {
    try {
      setLoadingUserNotifications(true);
      
      // Build query parameters
      const params = new URLSearchParams();
      params.append('page', page.toString());
      params.append('pageLimit', pageLimit.toString());
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);
      if (type && type !== 'all') params.append('type', type);
      
      const queryString = params.toString();
      const url = `/notification-logs/user/${userId}?${queryString}`;
      
      const response = await axiosInstance.get(url);
      const data: NotificationsResponse = response.data;
      
      setUserNotifications(prev => append ? [...prev, ...data.notifications] : data.notifications);
      setNotificationsPagination(data.pagination);
    } catch (error) {
      console.error('Error fetching user notifications:', error);
      setUserNotifications([]);
      setNotificationsPagination(null);
      throw error;
    } finally {
      setLoadingUserNotifications(false);
    }
  }, []);

  const fetchUserSubscriptions = useCallback(async (userId: string): Promise<void> => {
    try {
      setLoadingUserSubscriptions(true);
      const response = await axiosInstance.get(`/client/${userId}/subscriptions`);
      setUserSubscriptions(response.data || []);
    } catch (error) {
      console.error('Error fetching user subscriptions:', error);
      setUserSubscriptions([]);
      throw error;
    } finally {
      setLoadingUserSubscriptions(false);
    }
  }, []);

  const fetchCheckById = useCallback(async (checkId: number): Promise<void> => {
    try {
      setLoadingSelectedCheck(true);
      const response = await axiosInstance.get(`/checks/admin/${checkId}`);
      setSelectedCheckDetailed(response.data || null);
    } catch (error) {
      console.error('Error fetching check by ID:', error);
      setSelectedCheckDetailed(null);
      throw error;
    } finally {
      setLoadingSelectedCheck(false);
    }
  }, []);

  const changeUserPassword = useCallback(async (userId: string, newPassword: string): Promise<void> => {
    try {
      await axiosInstance.put(`/users/set-password/${userId}`, {
        newPassword
      });
    } catch (error) {
      console.error('Error changing user password:', error);
      throw error;
    }
  }, []);

  return (
    <ClientContext.Provider
      value={{ 
        clients, 
        clientNames,
        clientAnagrafica, 
        trainingProgramOfUser,
        historicalExercises,
        diet,
        initialHistory,
        userChecks,
        userImagesAlbum,
        userNotifications,
        userSubscriptions,
        notificationsPagination,
        userImagesAlbumPagination,
        selectedCheckDetailed,
        loading, 
        loadingClientNames,
        loadingClientAnagrafica,
        loadingTrainingPrograms,
        loadingHistoricalExercises,
        loadingDiet,
        loadingInitialHistory,
        loadingUserChecks,
        loadingUserImagesAlbum,
        loadingUserNotifications,
        loadingUserSubscriptions,
        loadingSelectedCheck,
        page, 
        pageSize, 
        total, 
        search, 
        fetchClients, 
        fetchClientNames,
        setSearch, 
        setPage, 
        setClients, 
        fetchClientAnagrafica,
        fetchTrainingProgramOfUser,
        fetchHistoricalExercises,
        fetchDiet,
        createOrUpdateDiet,
        fetchInitialHistory,
        fetchUserChecks,
        fetchUserImagesAlbum,
        fetchUserNotifications,
        fetchUserSubscriptions,
        fetchCheckById,
        changeUserPassword
      }}
    >
      {children}
    </ClientContext.Provider>
  );
};

export const useClientContext = () => {
  const ctx = useContext(ClientContext);
  if (!ctx) throw new Error('useClientContext must be used within ClientProvider');
  return ctx;
};
