
import axios from 'axios';

const API_BASE = 'http://localhost:8080/api/business';

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
 * Retrieves businesses under active promotions.
 * @returns {Promise<Array>} List of businesses.
 */
export const getActivePromotions = async () => {
    const res = await axios.get(`${API_BASE}/promotions/active`);
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
