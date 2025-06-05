import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getBusinessById } from '../services/businessService';

export const useBusinessById = (businessId) => {
    const queryClient = useQueryClient();

    return useQuery({
        queryKey: ['business', businessId],
        queryFn: async () => {
            // Önce allBusinesses cache’ine bak
            const allBusinesses = queryClient.getQueryData(['allBusinesses']);
            if (allBusinesses) {
                const cached = allBusinesses.find(b => b.id === businessId);
                if (cached) return cached;
            }

            // Yoksa API'den çek
            return await getBusinessById(businessId);
        },
        staleTime: 5 * 60 * 1000,
        cacheTime: 10 * 60 * 1000,
    });
};