// src/hooks/useAllBusinesses.js
import { useQuery } from '@tanstack/react-query';
import { getAllBusinesses } from '../services/businessService';
import { mapBusiness } from '../utils/businessMapper'; // bu dosyada mapBusiness varsa yolu bu şekilde

export const useAllBusinesses = () => {
    return useQuery({
        queryKey: ['allBusinesses'],
        queryFn: async () => {
            const rawList = await getAllBusinesses();
            return rawList.map(mapBusiness); // burada dönüştürülmüş veriyi cache'liyoruz
        },
        staleTime: 5 * 60 * 1000, // 5 dakika
        cacheTime: 10 * 60 * 1000,
    });
};