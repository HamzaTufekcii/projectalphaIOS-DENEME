
import axios from 'axios';

const API_BASE = '/api/business';

/**
 * Fetches all businesses.
 * @returns {Promise<Array>} List of Business objects.
 */
export const getAllBusinesses = async () => {
    const res = await axios.get(`${API_BASE}`);
    return res.data.data; // assuming GenericResponse<T>.data holds payload
};

/**
 * Fetches a single business by ID.
 * @param {string} id UUID of the business.
 * @returns {Promise<Object>} Business object.
 */
export const getBusinessById = async (id) => {
    const res = await axios.get(`${API_BASE}/${id}`);
    return res.data.data;
};

/**
 * Searches businesses by name (case-insensitive).
 * @param {string} name Search term.
 * @returns {Promise<Array>} Matched businesses.
 */
export const searchBusinesses = async (name) => {
    const res = await axios.get(`${API_BASE}/search`, { params: { name } });
    return res.data.data;
};

/**
 * Retrieves businesses owned by a specific owner.
 * @param {number} ownerId Owner's numeric ID.
 * @returns {Promise<Array>} List of businesses.
 */
export const getBusinessesByOwner = async (ownerId) => {
    const res = await axios.get(`${API_BASE}/owner/${ownerId}`);
    return res.data.data;
};

/**
 * Retrieves top-rated businesses with a limit.
 * @param {number} limit Number of top items.
 * @returns {Promise<Array>} List of top-rated businesses.
 */
export const getTopRated = async (limit = 5) => {
    const res = await axios.get(`${API_BASE}/top`, { params: { limit } });
    return res.data.data;
};

/**
 * Fetches businesses tagged with a specific UUID.
 * @param {string} tagId UUID string of tag.
 * @returns {Promise<Array>} List of businesses.
 */
export const getByTag = async (tagId) => {
    const res = await axios.get(`${API_BASE}/tag/${tagId}`);
    return res.data.data;
};

export const getBusinessReviews = async (businessId) => {
    const res = await axios.get(`${API_BASE}/reviews/${businessId}`);
    return res.data.data;
};

export const getBusinessPromotions = async (businessId) => {
    const res = await axios.get(`${API_BASE}/promotions/${businessId}`);
    return res.data.data;
}

export const newPromotion = async (businessId, newPromotionData) => {
    const promotion = {
        title: newPromotionData.title,
        description: newPromotionData.description,
        startDate: newPromotionData.startDate,
        endDate: newPromotionData.endDate,
        amount: newPromotionData.amount,
        isActive: newPromotionData.isActive
    };

    const res = await axios.post(`${API_BASE}/promotions/${businessId}`, promotion);
    return res.data.data;
}
export const updatePromotion = async (businessId, promotionId, newPromotionData) => {
    const promotion = {
        title: newPromotionData.title,
        description: newPromotionData.description,
        startDate: newPromotionData.startDate,
        endDate: newPromotionData.endDate,
        amount: newPromotionData.amount,
        isActive: newPromotionData.isActive
    };

    const res = await axios.patch(`${API_BASE}/promotions/${businessId}/${promotionId}`, promotion);
    return res.data.data;
}

export const deletePromotion = async (businessId, promotionId) => {
    const res = await axios.delete(`${API_BASE}/promotions/${businessId}/${promotionId}`);
    return res.data.data;
}

export const setViewed = async (reviewId) => {
    const res = await axios.patch(`${API_BASE}/reviews/${reviewId}`);
    return res.data.data;
}
