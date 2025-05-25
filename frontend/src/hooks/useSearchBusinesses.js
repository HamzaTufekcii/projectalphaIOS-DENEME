// src/hooks/useSearchBusinesses.js
import { useQuery } from '@tanstack/react-query';
import { searchBusinesses } from '../services/businessService';
import { mapBusiness } from '../utils/businessMapper';

export const useSearchBusinesses = (name) => {
    return useQuery({
        queryKey: ['searchBusinesses', name],
        queryFn: async () => {
            const rawData = await searchBusinesses(name);
            return rawData.map(mapBusiness);
        },
        enabled: !!name,
        staleTime: 2 * 60 * 1000,
    });
};