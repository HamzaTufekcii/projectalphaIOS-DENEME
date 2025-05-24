// src/hooks/useTopRated.js
import { useQuery } from '@tanstack/react-query';
import { getTopRated } from '../services/businessService';
import { mapBusiness } from '../utils/businessMapper';

export const useTopRated = (limit = 5) => {
    return useQuery({
        queryKey: ['topRated', limit],
        queryFn: async () => {
            const rawData = await getTopRated(limit);
            return rawData.map(mapBusiness);
        },
        staleTime: 5 * 60 * 1000,
    });
};