import React, { createContext, useState, useContext, ReactNode, useEffect, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../utils/axiosInstance';
import { omit } from 'lodash';
import { useSnackbar } from './SnackbarContext';
import { useTranslation } from 'react-i18next';
import { useAuth } from './AuthContext';

// Define the structure of a product type
export interface ProductType {
  id: number;
  name: string;
  description: string;
  createdAt?: string;
  updatedAt?: string;
  _count?: {
    products: number;
  };
}

// Define the structure of a product
export interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  typeId: number;
  type?: ProductType;
  createdAt?: string;
  updatedAt?: string;
}

// Define the structure of an order item
export interface OrderItem {
  id: number;
  orderId: number;
  productId: number;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  product: {
    id: number;
    title: string;
    price: number;
    type: {
      name: string;
    };
  };
}

// Define the structure of an order
export interface Order {
  id: number;
  userId: number;
  stripePaymentIntentId: string | null;
  status: string;
  totalAmount: number;
  createdAt: string;
  paidAt: string | null;
  items: OrderItem[];
  user: {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
  };
}

// Pagination interface
export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

// Products API response
// interface ProductsApiResponse {
//   success: boolean;
//   data: Product[];
//   pagination: Pagination;
// }

// // Product types API response
// interface ProductTypesApiResponse {
//   success: boolean;
//   data: ProductType[];
// }

// Define the context type
interface ProductsContextType {
  // Product Types
  productTypes: ProductType[];
  isLoadingProductTypes: boolean;
  fetchProductTypes: () => void;
  addProductType: (productType: Omit<ProductType, 'id'>) => Promise<void>;
  updateProductType: (productType: ProductType) => Promise<void>;
  removeProductType: (id: string) => Promise<void>;
  
  // Products
  products: Product[];
  pagination: Pagination | null;
  isLoadingProducts: boolean;
  fetchProducts: () => void;
  productsFilters: {
    page: number;
    limit: number;
    typeId?: number;
    search?: string;
  };
  setProductsFilters: (filters: Partial<{ page: number; limit: number; typeId?: number; search?: string }>) => void;
  addProduct: (product: Omit<Product, 'id'>) => Promise<void>;
  updateProduct: (product: Product) => Promise<void>;
  removeProduct: (id: number) => Promise<void>;

  // Orders
  orders: Order[];
  ordersPagination: Pagination | null;
  isLoadingOrders: boolean;
  fetchOrders: () => void;
  ordersFilters: {
    page: number;
    limit: number;
    search?: string;
    startDate?: string;
    endDate?: string;
  };
  setOrdersFilters: (filters: Partial<{ page: number; limit: number; search?: string; startDate?: string; endDate?: string }>) => void;
}

// Create the context
const ProductsContext = createContext<ProductsContextType | undefined>(undefined);

// Create the provider
export const ProductsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [productTypes, setProductTypes] = useState<ProductType[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [productsFilters, setProductsFiltersState] = useState({
    page: 1,
    limit: 10,
    typeId: undefined as number | undefined,
    search: undefined as string | undefined,
  });
  
  // Orders state
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersPagination, setOrdersPagination] = useState<Pagination | null>(null);
  const [ordersFilters, setOrdersFiltersState] = useState({
    page: 1,
    limit: 10,
    search: undefined as string | undefined,
    startDate: undefined as string | undefined,
    endDate: undefined as string | undefined,
  });

  // Debug orders state changes
  useEffect(() => {
    console.log('Orders state changed:', orders);
    console.log('Orders length:', orders.length);
  }, [orders]);
  
  const { showSnackbar } = useSnackbar();
  const { t } = useTranslation();
  const { isAuth } = useAuth();
  const queryClient = useQueryClient();

  // Fetch product types using React Query
  const { data: productTypesData, isLoading: isLoadingProductTypes, refetch: refetchProductTypes, error: productTypesError } = useQuery({
    queryKey: ['productTypes'],
    queryFn: async () => {
      console.log('Fetching product types...');
      const response = await api.get('/products/types');
      console.log('Product types response:', response.data);
      return response.data;
    },
    enabled: isAuth, // Only fetch when user is authenticated
    retry: 3,
    retryDelay: 1000,
  });

  // Fetch products using React Query with pagination
  const { data: productsData, isLoading: isLoadingProducts, refetch: refetchProducts } = useQuery({
    queryKey: ['products', productsFilters],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: productsFilters.page.toString(),
        limit: productsFilters.limit.toString(),
      });
      
      if (productsFilters.typeId) {
        params.append('typeId', productsFilters.typeId.toString());
      }
      
      if (productsFilters.search && productsFilters.search.trim()) {
        params.append('search', productsFilters.search.trim());
      }
      
      console.log('Fetching products with params:', params.toString());
      const response = await api.get(`/products?${params.toString()}`);
      console.log('Products response:', response.data);
      return response.data;
    },
    enabled: isAuth, // Only fetch when user is authenticated
    placeholderData: (previousData) => previousData, // Keep previous data while loading new page
  });

  // Fetch orders using React Query with pagination
  const { data: ordersData, isLoading: isLoadingOrders, refetch: refetchOrders, error: ordersError } = useQuery({
    queryKey: ['orders', ordersFilters],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: ordersFilters.page.toString(),
        limit: ordersFilters.limit.toString(),
      });
      
      if (ordersFilters.search && ordersFilters.search.trim()) {
        params.append('search', ordersFilters.search.trim());
      }
      
      if (ordersFilters.startDate) {
        params.append('startDate', ordersFilters.startDate);
      }
      
      if (ordersFilters.endDate) {
        params.append('endDate', ordersFilters.endDate);
      }
      
      console.log('Fetching orders with params:', params.toString());
      console.log('isAuth status:', isAuth);
      const response = await api.get(`/orders/admin/all?${params.toString()}`);
      console.log('Orders response:', response.data);
      return response.data;
    },
    enabled: isAuth, // Only fetch when user is authenticated
    placeholderData: (previousData) => previousData, // Keep previous data while loading new page
  });

  // Update local state when data changes
  useEffect(() => {
    console.log('Product types data changed:', productTypesData);
    if (productTypesData) {
      // Handle both wrapped and direct responses
      if (productTypesData?.success && productTypesData?.data) {
        console.log('Setting product types from wrapped response:', productTypesData.data);
        setProductTypes(productTypesData.data);
      } else if (Array.isArray(productTypesData)) {
        console.log('Setting product types from direct array:', productTypesData);
        setProductTypes(productTypesData);
      } else if (productTypesData?.data && Array.isArray(productTypesData.data)) {
        console.log('Setting product types from data property:', productTypesData.data);
        setProductTypes(productTypesData.data);
      } else {
        console.log('Product types data format not recognized:', productTypesData);
      }
    }
    if (productTypesError) {
      console.error('Product types error:', productTypesError);
    }
  }, [productTypesData, productTypesError]);

  useEffect(() => {
    console.log('Products data changed:', productsData);
    if (productsData) {
      // Handle both wrapped and direct responses
      if (productsData?.success && productsData?.data) {
        console.log('Setting products from wrapped response:', productsData.data, 'pagination:', productsData.pagination);
        setProducts(productsData.data);
        setPagination(productsData.pagination);
      } else if (productsData?.data && Array.isArray(productsData.data)) {
        console.log('Setting products from data property:', productsData.data);
        setProducts(productsData.data);
        // Try to get pagination if it exists
        if (productsData.pagination) {
          setPagination(productsData.pagination);
        }
      } else if (Array.isArray(productsData)) {
        console.log('Setting products from direct array:', productsData);
        setProducts(productsData);
        // No pagination info available
        setPagination(null);
      } else {
        console.log('Products data format not recognized:', productsData);
      }
    }
  }, [productsData]);

  useEffect(() => {
    console.log('Orders data changed:', ordersData);
    if (ordersData) {
      // Handle your actual API response format
      if (ordersData?.orders && Array.isArray(ordersData.orders)) {
        setOrders(ordersData.orders);
        
        if (ordersData.pagination) {
          setOrdersPagination(ordersData.pagination);
        }
      }
    }
    if (ordersError) {
      console.error('Orders error:', ordersError);
    }
  }, [ordersData, ordersError]);

  // === PRODUCT TYPES MUTATIONS ===

  // Mutation to add a product type
  const addProductTypeMutation = useMutation({
    mutationFn: async (newProductType: Omit<ProductType, 'id'>) => {
      const response = await api.post('/products/types', newProductType);
      console.log('Add product type response:', response.data);
      
      // Handle both wrapped and direct responses
      if (response.data?.success && response.data?.data) {
        return response.data.data;
      } else if (response.data && !response.data.success) {
        // Direct response without wrapper
        return response.data;
      } else {
        throw new Error('Invalid response structure');
      }
    },
    onSuccess: (data: ProductType) => {
      console.log('Add product type success data:', data);
      if (data && data.id) {
        setProductTypes((prev) => [...prev, data]);
        queryClient.invalidateQueries({ queryKey: ['productTypes'] });
        showSnackbar(t('products.types.addSuccess') || 'Product type added successfully', 'success');
      } else {
        console.error('Invalid data received in onSuccess:', data);
        showSnackbar(t('products.types.addFailed') || 'Failed to add product type', 'error');
      }
    },
    onError: (error) => {
      console.error('Failed to add product type:', error);
      showSnackbar(t('products.types.addFailed') || 'Failed to add product type', 'error');
    },
  });

  // Mutation to update a product type
  const updateProductTypeMutation = useMutation({
    mutationFn: async (updatedProductType: ProductType) => {
      const payload = omit(updatedProductType, ['id', 'createdAt', 'updatedAt', '_count']);
      const response = await api.put(`/products/types/${updatedProductType.id}`, payload);
      console.log('Update product type response:', response.data);
      
      // Handle both wrapped and direct responses
      if (response.data?.success && response.data?.data) {
        return response.data.data;
      } else if (response.data && !response.data.success) {
        // Direct response without wrapper
        return response.data;
      } else {
        throw new Error('Invalid response structure');
      }
    },
    onSuccess: (data: ProductType) => {
      console.log('Update product type success data:', data);
      if (data && data.id) {
        setProductTypes((prev) =>
          prev.map((type) => (type.id === data.id ? data : type))
        );
        queryClient.invalidateQueries({ queryKey: ['productTypes'] });
        showSnackbar(t('products.types.updateSuccess') || 'Product type updated successfully', 'success');
      } else {
        console.error('Invalid data received in onSuccess:', data);
        showSnackbar(t('products.types.updateFailed') || 'Failed to update product type', 'error');
      }
    },
    onError: (error) => {
      console.error('Failed to update product type:', error);
      showSnackbar(t('products.types.updateFailed') || 'Failed to update product type', 'error');
    },
  });

  // Mutation to remove a product type
  const removeProductTypeMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/products/types/${id}`);
    },
    onSuccess: (_: void, id: string) => {
      setProductTypes((prev) => prev.filter((type) => String(type.id) !== id));
      queryClient.invalidateQueries({ queryKey: ['productTypes'] });
      showSnackbar(t('products.types.deleteSuccess') || 'Product type deleted successfully', 'success');
    },
    onError: (error) => {
      console.error('Failed to remove product type:', error);
      showSnackbar(t('products.types.deleteFailed') || 'Failed to delete product type', 'error');
    },
  });

  // === PRODUCTS MUTATIONS ===

  // Mutation to add a product
  const addProductMutation = useMutation({
    mutationFn: async (newProduct: Omit<Product, 'id'>) => {
      const response = await api.post('/products', newProduct);
      
      if (response.data?.success && response.data?.data) {
        return response.data.data;
      } else if (response.data && !response.data.success) {
        return response.data;
      } else {
        throw new Error('Invalid response structure');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      showSnackbar(t('products.addSuccess') || 'Product added successfully', 'success');
    },
    onError: (error) => {
      console.error('Failed to add product:', error);
      showSnackbar(t('products.addFailed') || 'Failed to add product', 'error');
    },
  });

  const updateProductMutation = useMutation({
    mutationFn: async (updatedProduct: Product) => {
      const payload = omit(updatedProduct, ['id', 'createdAt', 'updatedAt', 'type']);
      const response = await api.put(`/products/${updatedProduct.id}`, payload);
      console.log('Update product response:', response.data);
      
      // Handle both wrapped and direct responses
      if (response.data?.success && response.data?.data) {
        return response.data.data;
      } else if (response.data && !response.data.success) {
        // Direct response without wrapper
        return response.data;
      } else {
        throw new Error('Invalid response structure');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      showSnackbar(t('products.updateSuccess') || 'Product updated successfully', 'success');
    },
    onError: (error) => {
      console.error('Failed to update product:', error);
      showSnackbar(t('products.updateFailed') || 'Failed to update product', 'error');
    },
  });

  // Mutation to remove a product
  const removeProductMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/products/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      showSnackbar(t('products.deleteSuccess') || 'Product deleted successfully', 'success');
    },
    onError: (error) => {
      console.error('Failed to remove product:', error);
      showSnackbar(t('products.deleteFailed') || 'Failed to delete product', 'error');
    },
  });

  // === PUBLIC METHODS ===

  // Product Types methods
  const fetchProductTypes = () => {
    refetchProductTypes();
  };

  // Products methods
  const fetchProducts = () => {
    refetchProducts();
  };

  const addProductType = async (productType: Omit<ProductType, 'id'>) => {
    await addProductTypeMutation.mutateAsync(productType);
  };

  const updateProductType = async (productType: ProductType) => {
    await updateProductTypeMutation.mutateAsync(productType);
  };

  const removeProductType = async (id: string) => {
    await removeProductTypeMutation.mutateAsync(id);
  };

  // Products methods
  const setProductsFilters = (filters: Partial<{ page: number; limit: number; typeId?: number; search?: string }>) => {
    setProductsFiltersState(prev => ({ ...prev, ...filters }));
  };

  const addProduct = async (product: Omit<Product, 'id'>) => {
    await addProductMutation.mutateAsync(product);
  };

  const updateProduct = async (product: Product) => {
    await updateProductMutation.mutateAsync(product);
  };

  const removeProduct = async (id: number) => {
    await removeProductMutation.mutateAsync(String(id));
  };

  // Orders methods
  const fetchOrders = () => {
    refetchOrders();
  };

  const setOrdersFilters = useCallback((filters: Partial<{ page: number; limit: number; search?: string; startDate?: string; endDate?: string }>) => {
    setOrdersFiltersState(prev => ({ ...prev, ...filters }));
  }, []);

  return (
    <ProductsContext.Provider
      value={{
        // Product Types
        productTypes,
        isLoadingProductTypes,
        fetchProductTypes,
        addProductType,
        updateProductType,
        removeProductType,
        
        // Products
        products,
        pagination,
        isLoadingProducts,
        fetchProducts,
        productsFilters,
        setProductsFilters,
        addProduct,
        updateProduct,
        removeProduct,

        // Orders
        orders,
        ordersPagination,
        isLoadingOrders,
        fetchOrders,
        ordersFilters,
        setOrdersFilters,
      }}
    >
      {children}
    </ProductsContext.Provider>
  );
};

// Create a custom hook to use the ProductsContext
export const useProducts = (): ProductsContextType => {
  const context = useContext(ProductsContext);
  if (!context) {
    throw new Error('useProducts must be used within a ProductsProvider');
  }
  return context;
};