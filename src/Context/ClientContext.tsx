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

// Type for diet history data
export type DietHistory = {
  id: number;
  mealPlan: string | null;
  foodSupplements: string | null;
  mealPlanUpdatedAt: string | null;
  foodSupplementsUpdatedAt: string | null;
  createdAt: string;
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
  gambaSx: string;
  gambaMedialeDx: string;
  gambaMedialeSx: string;
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
  gambaMedialeSx?: string;
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
  feedback?: string;
};

export type UserNextCheckDate = {
  nextCheckDate: string;
  daysBetweenChecks: number;
  subscriptionTitle: string;
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
  emailVerified: boolean;
  username: string;
  firstName: string | null;
  lastName: string | null;
  phoneNumber: string | null;
  dateOfBirth: string | null;
  placeOfBirth: string | null;
  fiscalCode: string | null;
  activeSubscription: {
    id: number;
    name: string;
    color: string;
    expireDate: string;
    startDate: string;
    status: 'active' | 'expired' | 'pending';
    integrationPlan: boolean;
    mealPlan: boolean;
  } | null;
  assignedProgram: {
    id: number;
    title: string;
    assignedAt: string;
    completed: boolean;
  } | null;
  totalMessages: number;
};

export type ClientAnagrafica = {
  firstName: string | null;
  lastName: string | null;
  phoneNumber: string | null;
  email: string;
  emailVerified: boolean;
  dateOfBirth: string | null;
  placeOfBirth: string | null;
  fiscalCode: string | null;
  lastLogin: string,
  lastOnline: string,
  online: boolean,
  createdAt: string,
  deletionRequested: boolean,
  deletionRequestedAt: string | null,
  scheduledDeletionDate: string | null,
  activeSubscription: {
    id: number,
    title: string,
    color: string,
    startDate: string,
    endDate: string,
    status: string,
    integrationPlan: boolean,
    mealPlan: boolean,
    userSubscriptionId: number
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

// Type for subscription transactions
export type SubscriptionTransaction = {
  id: number;
  transactionType?: string;
  eventType?: string;
  transactionDate: string;
  periodStartDate: string;
  periodEndDate: string;
  amount: number | string;
  currency: string;
  priceInCents?: number;
  status?: string;
  platform?: string;
  androidProductId?: string;
  appleProductId?: string;
  androidOrderId?: string;
  androidPurchaseToken?: string;
  appleTransactionId?: string;
  appleOriginalTransactionId?: string;
  appleWebOrderLineItemId?: string;
  appleEnvironment?: string;
  isTrialPeriod?: boolean;
  isIntroPeriod?: boolean;
  isAutoRenewing?: boolean;
  inGracePeriod?: boolean;
  willCancelAtPeriodEnd?: boolean;
  introOfferPeriods?: number;
  refundedAt?: string;
  refundAmount?: number | string;
  refundReason?: string;
  rawTransactionData?: Record<string, unknown>;
  subscription?: {
    id: number;
    title: string;
    color: string;
  };
};

// Type for Apple payment data
export type ApplePayment = {
  id: number;
  applePaymentId: string;
  userId: number;
  latestReceiptInfo: Record<string, unknown> | null;
  pendingRenewalInfo: Record<string, unknown> | null;
  decodedTransaction?: Record<string, unknown>;
  metadata?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
  subscription?: {
    id: number;
    title: string;
    color: string;
  };
};

// Type for Android payment data
export type AndroidPayment = {
  id: number;
  androidPaymentId: string;
  userId: number;
  latestPurchaseData: Record<string, unknown> | null;
  metadata?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
  subscription?: {
    id: number;
    title: string;
    color: string;
  };
};

// Type for subscription webhook data
export type SubscriptionWebhook = {
  id: number;
  platform: 'android' | 'apple';
  notificationType: string;
  subtype?: string | null;
  transactionId: string;
  originalTransactionId?: string | null;
  userId: number;
  userSubscriptionId: number;
  payload: Record<string, unknown>;
  processed: boolean;
  processedAt?: string | null;
  processingError?: string | null;
  retryCount: number;
  receivedAt: string;
  environment?: string;
  createdAt: string;
  updatedAt: string;
  subscription?: {
    id: number;
    title: string;
    color: string;
  };
};

// Type for subscription details response
export type UserSubscriptionDetails = {
  userSubscription: UserSubscription;
  transactions: SubscriptionTransaction[];
  applePayments: ApplePayment[];
  androidPayments: AndroidPayment[];
  subscriptionWebhooks: SubscriptionWebhook[];
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

// Type for consent data
export type UserConsent = {
  id: number;
  userId: number;
  type: 'marketing' | 'dataProcessing' | 'terms' | 'photoTracking';
  legalNotice: boolean;
  preference: boolean;
  createdAt: string;
};

// Type for user call data
export type UserCall = {
  id: number;
  userId: number;
  type: 'Extra' | 'Supplementary';
  usedAt: string | null;
  createdAt: string;
  product?: {
    id: number;
    title: string;
    price: number;
  };
  subscription?: {
    id: number;
    subscription: {
      title: string;
    };
  };
  order?: {
    id: number;
    totalAmount: number;
    stripePaymentIntentId: string;
    stripePaymentData: {
      id: string;
      amount: number;
      currency: string;
      status: string;
    };
    applePaymentData?: {
      applePaymentId: string;
      decodedTransaction: {
        type: string;
        price: number;
        bundleId: string;
        currency: string;
        quantity: number;
        productId: string;
        signedDate: number;
        storefront: string;
        environment: string;
        purchaseDate: number;
        storefrontId: string;
        transactionId: string;
        transactionReason: string;
        inAppOwnershipType: string;
        originalPurchaseDate: number;
        originalTransactionId: string;
      };
      latestReceiptInfo: null | Record<string, unknown>;
      pendingRenewalInfo: null | Record<string, unknown>;
      createdAt: string;
      updatedAt: string;
    };
  };
};

export type UserCallsResponse = {
  data: {
    calls: UserCall[];
    pagination: Pagination;
  }
};

// Type for pagination
export type Pagination = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasNextPage?: boolean;
  hasPrev: boolean;
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
  clientsPagination: Pagination | null;
  clientAnagrafica: ClientAnagrafica | null;
  trainingProgramOfUser: TrainingProgramOfUser[];
  historicalExercises: HistoricalExercise[];
  diet: Diet | null;
  dietHistory: DietHistory[];
  initialHistory: InitialHistory | null;
  userChecks: UserCheck[];
  userImagesAlbum: UserAlbumImage[];
  userVideosAlbum: UserAlbumImage[];
  userNotifications: UserNotification[];
  userConsents: UserConsent[];
  userCalls: UserCall[];
  userSubscriptions: UserSubscription[];
  subscriptionTransactions: SubscriptionTransaction[];
  userSubscriptionDetails: UserSubscriptionDetails | null;
  notificationsPagination: Pagination | null;
  userImagesAlbumPagination: Pagination | null;
  userVideosAlbumPagination: Pagination | null;
  userCallsPagination: Pagination | null;
  selectedCheckDetailed: UserCheckDetailed | null;
  userNextCheckDate: UserNextCheckDate | null;
  loading: boolean;
  loadingClientNames: boolean;
  loadingClientAnagrafica: boolean;
  loadingTrainingPrograms: boolean;
  loadingHistoricalExercises: boolean;
  loadingDiet: boolean;
  loadingDietHistory: boolean;
  loadingInitialHistory: boolean;
  loadingUserChecks: boolean;
  loadingUserImagesAlbum: boolean;
  loadingUserVideosAlbum: boolean;
  loadingUserNotifications: boolean;
  loadingUserConsents: boolean;
  loadingUserCalls: boolean;
  loadingUserSubscriptions: boolean;
  loadingSubscriptionTransactions: boolean;
  loadingSubscriptionDetails: boolean;
  loadingSelectedCheck: boolean;
  loadingUserNextCheckDate: boolean;
  page: number;
  pageSize: number;
  total: number;
  search: string;
  fetchClients: (params?: { page?: number; pageSize?: number; search?: string; subscriptionId?: string; subscriptionIds?: number[]; profileInformationCompleted?: boolean; append?: boolean }) => Promise<void>;
  fetchClientNames: () => Promise<void>;
  setSearch: (search: string) => void;
  setPage: (page: number) => void;
  setClients: React.Dispatch<React.SetStateAction<Client[]>>;
  fetchClientAnagrafica: (clientId: string) => Promise<void>;
  fetchTrainingProgramOfUser: (userId: string) => Promise<void>;
  fetchHistoricalExercises: (userId: string) => Promise<void>;
  fetchDiet: (userId: string) => Promise<void>;
  fetchDietHistory: (userId: string) => Promise<void>;
  createOrUpdateDiet: (userId: string, mealPlan?: string, foodSupplements?: string) => Promise<void>;
  fetchInitialHistory: (userId: string) => Promise<void>;
  fetchUserChecks: (userId: string, startDate?: string, endDate?: string) => Promise<void>;
  fetchUserImagesAlbum: (userId: string, page?: number, pageLimit?: number, startDate?: string, endDate?: string, append?: boolean) => Promise<void>;
  fetchUserVideosAlbum: (userId: string, page?: number, pageLimit?: number, startDate?: string, endDate?: string, append?: boolean) => Promise<void>;
  fetchUserNotifications: (userId: string, page?: number, pageLimit?: number, startDate?: string, endDate?: string, type?: string, append?: boolean) => Promise<void>;
  fetchUserConsents: (userId: string) => Promise<void>;
  fetchUserCalls: (userId: string, page?: number, pageLimit?: number, append?: boolean, used?: boolean, type?: 'Extra' | 'Supplementary') => Promise<void>;
  fetchUserSubscriptions: (userId: string) => Promise<void>;
  fetchSubscriptionTransactions: (userId: string) => Promise<void>;
  fetchUserSubscriptionDetails: (userSubscriptionId: number) => Promise<void>;
  fetchCheckById: (checkId: number) => Promise<void>;
  fetchUserNextCheckDate: (clientId: string) => Promise<void>;
  changeUserPassword: (userId: string, newPassword: string) => Promise<void>;
};

const ClientContext = createContext<ClientContextType | undefined>(undefined);

export const ClientProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [clients, setClients] = useState<Client[]>([]);
  const [clientNames, setClientNames] = useState<ClientName[]>([]);
  const [clientsPagination, setClientsPagination] = useState<Pagination | null>(null);
  const [clientAnagrafica, setClientAnagrafica] = useState<ClientAnagrafica | null>(null);
  const [trainingProgramOfUser, setTrainingProgramOfUser] = useState<TrainingProgramOfUser[]>([]);
  const [historicalExercises, setHistoricalExercises] = useState<HistoricalExercise[]>([]);
  const [diet, setDiet] = useState<Diet | null>(null);
  const [dietHistory, setDietHistory] = useState<DietHistory[]>([]);
  const [initialHistory, setInitialHistory] = useState<InitialHistory | null>(null);
  const [userChecks, setUserChecks] = useState<UserCheck[]>([]);
  const [userImagesAlbum, setUserImagesAlbum] = useState<UserAlbumImage[]>([]);
  const [userVideosAlbum, setUserVideosAlbum] = useState<UserAlbumImage[]>([]);
  const [userNotifications, setUserNotifications] = useState<UserNotification[]>([]);
  const [userConsents, setUserConsents] = useState<UserConsent[]>([]);
  const [userCalls, setUserCalls] = useState<UserCall[]>([]);
  const [userSubscriptions, setUserSubscriptions] = useState<UserSubscription[]>([]);
  const [subscriptionTransactions, setSubscriptionTransactions] = useState<SubscriptionTransaction[]>([]);
  const [userSubscriptionDetails, setUserSubscriptionDetails] = useState<UserSubscriptionDetails | null>(null);
  const [notificationsPagination, setNotificationsPagination] = useState<Pagination | null>(null);
  const [userImagesAlbumPagination, setUserImagesAlbumPagination] = useState<Pagination | null>(null);
  const [userVideosAlbumPagination, setUserVideosAlbumPagination] = useState<Pagination | null>(null);
  const [userCallsPagination, setUserCallsPagination] = useState<Pagination | null>(null);
  const [selectedCheckDetailed, setSelectedCheckDetailed] = useState<UserCheckDetailed | null>(null);
  const [userNextCheckDate, setUserNextCheckDate] = useState<UserNextCheckDate | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingClientNames, setLoadingClientNames] = useState(false);
  const [loadingClientAnagrafica, setLoadingClientAnagrafica] = useState(false);
  const [loadingTrainingPrograms, setLoadingTrainingPrograms] = useState(false);
  const [loadingHistoricalExercises, setLoadingHistoricalExercises] = useState(false);
  const [loadingDiet, setLoadingDiet] = useState(false);
  const [loadingDietHistory, setLoadingDietHistory] = useState(false);
  const [loadingInitialHistory, setLoadingInitialHistory] = useState(false);
  const [loadingUserChecks, setLoadingUserChecks] = useState(false);
  const [loadingUserImagesAlbum, setLoadingUserImagesAlbum] = useState(false);
  const [loadingUserVideosAlbum, setLoadingUserVideosAlbum] = useState(false);
  const [loadingUserNotifications, setLoadingUserNotifications] = useState(false);
  const [loadingUserConsents, setLoadingUserConsents] = useState(false);
  const [loadingUserCalls, setLoadingUserCalls] = useState(false);
  const [loadingUserSubscriptions, setLoadingUserSubscriptions] = useState(false);
  const [loadingSubscriptionTransactions, setLoadingSubscriptionTransactions] = useState(false);
  const [loadingSubscriptionDetails, setLoadingSubscriptionDetails] = useState(false);
  const [loadingSelectedCheck, setLoadingSelectedCheck] = useState(false);
  const [loadingUserNextCheckDate, setLoadingUserNextCheckDate] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(20);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');

  const fetchClients = useCallback(
    async (params?: { page?: number; pageSize?: number; search?: string; subscriptionId?: string; subscriptionIds?: number[]; profileInformationCompleted?: boolean; append?: boolean }) => {
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
            ...(params?.subscriptionIds && { subscriptionIds: params.subscriptionIds }),
            ...(params?.profileInformationCompleted !== undefined && { profileInformationCompleted: params.profileInformationCompleted }),
          },
        }
      );
      
      // Handle new API response structure
      const responseData = response.data;
      if (responseData.data && responseData.pagination) {
        // New structure: { data: [...], pagination: {...} }
        setClients((prev) => append ? [...prev, ...responseData.data] : responseData.data);
        setClientsPagination(responseData.pagination);
        setTotal(responseData.pagination.total);
      } else {
        // Fallback for old structure (direct array)
        setClients((prev) => append ? [...prev, ...responseData] : responseData);
        setClientsPagination(null);
        setTotal(responseData.length || 0);
      }
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

  const fetchDietHistory = async (userId: string): Promise<void> => {
    try {
      setLoadingDietHistory(true);
      const response = await axiosInstance.get(`/diet/${userId}/history?limit=1000`);
      
      setDietHistory(response.data || []);
    } catch (error) {
      console.error('Error fetching diet history:', error);
      setDietHistory([]);
      throw error;
    } finally {
      setLoadingDietHistory(false);
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

  const fetchUserVideosAlbum = useCallback(async (
    userId: string, 
    page: number = 1, 
    pageLimit: number = 20, 
    startDate?: string, 
    endDate?: string,
    append: boolean = false
  ): Promise<void> => {
    try {
      setLoadingUserVideosAlbum(true);
      
      const params = new URLSearchParams();
      params.append('page', page.toString());
      params.append('pageLimit', pageLimit.toString());
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);
      
      const queryString = params.toString();
      const url = `/storage/videos/${userId}?${queryString}`;
      
      const response = await axiosInstance.get(url);
      const data = response.data;
      
      // Check if response has pagination structure
      if (data.videos && data.pagination) {
        setUserVideosAlbum(prev => append ? [...prev, ...data.videos] : data.videos);
        setUserVideosAlbumPagination(data.pagination);
      } else {
        // Fallback for legacy response format
        setUserVideosAlbum(prev => append ? [...prev, ...(data || [])] : (data || []));
        setUserVideosAlbumPagination(null);
      }
    } catch (error) {
      console.error('Error fetching user videos album:', error);
      setUserVideosAlbum([]);
      setUserVideosAlbumPagination(null);
      throw error;
    } finally {
      setLoadingUserVideosAlbum(false);
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

  const fetchUserConsents = useCallback(async (userId: string): Promise<void> => {
    try {
      setLoadingUserConsents(true);
      const response = await axiosInstance.get(`/consent/user/${userId}`);
      
      setUserConsents(response.data.data || []);
    } catch (error) {
      console.error('Error fetching user consents:', error);
      setUserConsents([]);
      throw error;
    } finally {
      setLoadingUserConsents(false);
    }
  }, []);

  const fetchUserCalls = useCallback(async (
    userId: string, 
    page: number = 1, 
    pageLimit: number = 3, 
    append: boolean = false, 
    used?: boolean, 
    type?: 'Extra' | 'Supplementary'
  ): Promise<void> => {
    try {
      setLoadingUserCalls(true);
      
      // Build query parameters
      const params = new URLSearchParams({
        page: page.toString(),
        limit:  pageLimit.toString()
      });
      
      if (used !== undefined) {
        params.append('used', used.toString());
      }
      
      if (type) {
        params.append('type', type);
      }
      
      const response = await axiosInstance.get(`/calls/admin/user/${userId}?${params.toString()}`);
      
      const callsData: UserCallsResponse = response.data;
      console.log('Fetched user calls data:', callsData);
      if (append && page > 1) {
        setUserCalls(prev => [...prev, ...callsData.data.calls]);
      } else {
        setUserCalls(callsData.data.calls || []);
      }
      
      setUserCallsPagination(callsData.data.pagination);
    } catch (error) {
      console.error('Error fetching user calls:', error);
      if (!append) {
        setUserCalls([]);
        setUserCallsPagination(null);
      }
      throw error;
    } finally {
      setLoadingUserCalls(false);
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

  const fetchSubscriptionTransactions = useCallback(async (userId: string): Promise<void> => {
    try {
      setLoadingSubscriptionTransactions(true);
      const response = await axiosInstance.get(`/client/${userId}/subscription-transactions`);
      setSubscriptionTransactions(response.data.data || response.data || []);
    } catch (error) {
      console.error('Error fetching subscription transactions:', error);
      setSubscriptionTransactions([]);
      throw error;
    } finally {
      setLoadingSubscriptionTransactions(false);
    }
  }, []);

  const fetchUserSubscriptionDetails = useCallback(async (userSubscriptionId: number): Promise<void> => {
    try {
      setLoadingSubscriptionDetails(true);
      const response = await axiosInstance.get(`/client/user-subscription/${userSubscriptionId}/details`);
      setUserSubscriptionDetails(response.data.data || response.data || null);
    } catch (error) {
      console.error('Error fetching user subscription details:', error);
      setUserSubscriptionDetails(null);
      throw error;
    } finally {
      setLoadingSubscriptionDetails(false);
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

  const fetchUserNextCheckDate = useCallback(async (clientId: string): Promise<void> => {
    try {
      setLoadingUserNextCheckDate(true);
      const response = await axiosInstance.get(`/checks/admin/user-next-check-date/${clientId}`);
      setUserNextCheckDate(response.data || null);
    } catch (error) {
      console.error('Error fetching user next check date:', error);
      setUserNextCheckDate(null);
      // Don't throw error since we want to handle missing data gracefully
    } finally {
      setLoadingUserNextCheckDate(false);
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
        clientsPagination,
        clientAnagrafica, 
        trainingProgramOfUser,
        historicalExercises,
        diet,
        dietHistory,
        initialHistory,
        userChecks,
        userImagesAlbum,
        userVideosAlbum,
        userNotifications,
        userConsents,
        userCalls,
        userSubscriptions,
        subscriptionTransactions,
        userSubscriptionDetails,
        notificationsPagination,
        userImagesAlbumPagination,
        userVideosAlbumPagination,
        userCallsPagination,
        selectedCheckDetailed,
        userNextCheckDate,
        loading, 
        loadingClientNames,
        loadingClientAnagrafica,
        loadingTrainingPrograms,
        loadingHistoricalExercises,
        loadingDiet,
        loadingDietHistory,
        loadingInitialHistory,
        loadingUserChecks,
        loadingUserImagesAlbum,
        loadingUserVideosAlbum,
        loadingUserNotifications,
        loadingUserConsents,
        loadingUserCalls,
        loadingUserSubscriptions,
        loadingSubscriptionTransactions,
        loadingSubscriptionDetails,
        loadingSelectedCheck,
        loadingUserNextCheckDate,
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
        fetchDietHistory,
        createOrUpdateDiet,
        fetchInitialHistory,
        fetchUserChecks,
        fetchUserImagesAlbum,
        fetchUserVideosAlbum,
        fetchUserNotifications,
        fetchUserConsents,
        fetchUserCalls,
        fetchSubscriptionTransactions,
        fetchUserSubscriptions,
        fetchUserSubscriptionDetails,
        fetchCheckById,
        fetchUserNextCheckDate,
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
