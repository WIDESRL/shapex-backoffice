import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { api } from '../utils/axiosInstance';

export interface Banner {
    id: number;
    title: string;
    description: string;
    size: string;
    link: string;
    couponCode: string;
    color: string;
    imageId?: number;
    image?: {
        id: number;
        type: string;
        fileName: string;
        signedUrl: string;
        signedUrlExpire: string;
    };
    createdAt?: string;
    updatedAt?: string;
}

interface BannersContextType {
    banners: Banner[];
    isLoading: boolean;
    fetchBanners: () => void;
    addBanner: (banner: Omit<Banner, 'id' | 'image' | 'createdAt' | 'updatedAt'>, file?: File) => Promise<void>;
    updateBanner: (id: number, banner: Partial<Omit<Banner, 'image' | 'createdAt' | 'updatedAt'>>, file?: File) => Promise<void>;
    removeBanner: (id: number) => Promise<void>;
}

const BannersContext = createContext<BannersContextType | undefined>(undefined);

export const BannersProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [banners, setBanners] = useState<Banner[]>([]);

    // Fetch banners
    const { data, isLoading, refetch } = useQuery<Banner[], Error>({
        queryKey: ['banners'],
        queryFn: async () => {
            return api.get('/banners');
        },
    });

    useEffect(() => {
        if (data) setBanners(data);
    }, [data]);

    // Helper to upload file and get imageId
    const uploadFileAndGetId = async (file: File): Promise<number> => {
        // 1. Get upload url and file object
        const response = await api.post('/storage/create-file', { fileName: file.name, contentType: file.type });
        const uploadUrl = response.uploadUrl;
        const fileObj = response.file;
        // 2. Upload to uploadUrl
        console.log('FILE', file)
        await fetch(uploadUrl, {
            method: 'PUT',
            headers: { 'Content-Type': file.type },
            body: file,
        });
        // 3. Return file id
        return fileObj.id;
    };

    // Add banner
    const addBannerMutation = useMutation<Banner, Error, { banner: Omit<Banner, 'id' | 'image' | 'createdAt' | 'updatedAt'>, file?: File }>({
        mutationFn: async ({ banner, file }) => {
            let imageId = banner.imageId;
            if (file) {
                imageId = await uploadFileAndGetId(file);
            }
            const payload = {
                title: banner.title,
                description: banner.description,
                size: banner.size,
                link: banner.link,
                couponCode: banner.couponCode,
                color: banner.color, imageId
            };
            return api.post('/banners', payload);
        },
        onSuccess: (data) => {
            setBanners(prev => [...prev, data]);
        },
    });

    // Update banner
    const updateBannerMutation = useMutation<Banner, Error, { id: number, banner: Partial<Omit<Banner, 'image' | 'createdAt' | 'updatedAt'>>, file?: File }>({
        mutationFn: async ({ id, banner, file }) => {
            let imageId = banner.imageId;
            if (file) {
                imageId = await uploadFileAndGetId(file);
            }
            // Remove any accidental image property
            const payload = {
                title: banner.title,
                description: banner.description,
                size: banner.size,
                link: banner.link,
                couponCode: banner.couponCode,
                color: banner.color,
                imageId
            };

            return api.put(`/banners/${id}`, payload);
        },
        onSuccess: (data) => {
            setBanners(prev => prev.map(b => b.id === data.id ? data : b));
        },
    });

    // Remove banner
    const removeBannerMutation = useMutation<void, Error, number>({
        mutationFn: async (id: number) => {
            await api.delete(`/banners/${id}`);
        },
        onSuccess: (_, id) => {
            setBanners(prev => prev.filter(b => b.id !== id));
        },
    });

    const fetchBanners = () => {
        refetch();
    };

    const addBanner = async (banner: Omit<Banner, 'id' | 'image' | 'createdAt' | 'updatedAt'>, file?: File) => {
        await addBannerMutation.mutateAsync({ banner, file });
    };

    const updateBanner = async (id: number, banner: Partial<Omit<Banner, 'image' | 'createdAt' | 'updatedAt'>>, file?: File) => {
        await updateBannerMutation.mutateAsync({ id, banner, file });
    };

    const removeBanner = async (id: number) => {
        await removeBannerMutation.mutateAsync(id);
    };

    return (
        <BannersContext.Provider value={{ banners, isLoading, fetchBanners, addBanner, updateBanner, removeBanner }}>
            {children}
        </BannersContext.Provider>
    );
};

export const useBanners = (): BannersContextType => {
    const context = useContext(BannersContext);
    if (!context) {
        throw new Error('useBanners must be used within a BannersProvider');
    }
    return context;
};
