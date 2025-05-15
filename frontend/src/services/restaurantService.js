/**
 * Restaurant Service
 * Handles all API calls related to restaurants and cafes
 */
import axios from 'axios';

const API_URL = 'http://localhost:8080/api';

// Get axios instance with auth token
const getAuthAxios = () => {
  const token = localStorage.getItem('token');
  return axios.create({
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
};

/**
 * Get featured restaurants
 * @returns {Promise} List of featured restaurants
 */
export const getFeaturedRestaurants = async () => {
  // This will be replaced with actual API call when backend is ready
  // For now, return mock data
  return [
    { 
      id: 1, 
      name: "Sardunya", 
      type: "Wine House", 
      distance: "0.5 miles away", 
      rating: 4.5, 
      priceRange: "$$",
      hasActivePromo: true,
      promoDetails: "15% off all wines after 6pm",
      image: "https://static.wixstatic.com/media/91a1e5_da596005b0d64069b04f0ba1fa7bde51~mv2.jpg/v1/fill/w_442,h_589,q_90,enc_avif,quality_auto/91a1e5_da596005b0d64069b04f0ba1fa7bde51~mv2.jpg" 
    },
    { 
      id: 2, 
      name: "Botanica", 
      type: "Fine Dining", 
      distance: "1.2 miles away", 
      rating: 4.0, 
      priceRange: "$$$",
      hasActivePromo: true,
      promoDetails: "Free dessert with main course",
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSus3XssJfNT4VBjmkZmrdiRKSYfbwy7kjquw&s" 
    }
  ];
  
  /*
  try {
    const response = await axios.get(`${API_URL}/restaurants/featured`);
    return response.data;
  } catch (error) {
    console.error('Error fetching featured restaurants:', error);
    throw error.response?.data || error.message || 'Error fetching featured restaurants';
  }
  */
};

/**
 * Get all restaurants with optional filters
 * @param {Object} filters - Filter criteria
 * @returns {Promise} List of restaurants
 */
export const getRestaurants = async (filters = {}) => {
  // This will be replaced with actual API call when backend is ready
  // For now, return mock data
  const allRestaurants = [
    {
      id: 3, 
      name: "Naya", 
      type: "Fine Dining", 
      distance: "0.3 miles away", 
      rating: 4.7, 
      priceRange: "$$$",
      hasActivePromo: false,
      tags: ["fine-dining", "romantic", "dinner"],
      image: "https://profitnesetgune.com/wp-content/uploads/2023/06/1-6-scaled.jpg" 
    },
    {
      id: 4, 
      name: "The Soul", 
      type: "Pub", 
      distance: "0.7 miles away", 
      rating: 4.6, 
      priceRange: "$$",
      hasActivePromo: true,
      promoDetails: "Happy hour: 2 for 1 on selected drinks",
      tags: ["pub", "casual", "drinks", "dinner"],
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT_d-yhdv2ZkhWp-sj5d2DLDZ76nOk7RAdGNQ&s" 
    },
    {
      id: 5, 
      name: "Olive Garden", 
      type: "Italian", 
      distance: "1.0 miles away", 
      rating: 4.3, 
      priceRange: "$$",
      hasActivePromo: false,
      tags: ["italian", "family-friendly", "lunch", "dinner"],
      image: "https://parade.com/.image/t_share/MjEzNzg3ODkwNjU4ODQ2MTU5/olive-garden-exterior.jpg" 
    },
    {
      id: 6, 
      name: "Spice Route", 
      type: "Indian", 
      distance: "0.8 miles away", 
      rating: 4.4, 
      priceRange: "$$",
      hasActivePromo: true,
      promoDetails: "10% off on takeaway orders",
      tags: ["indian", "spicy", "lunch", "dinner"],
      image: "https://social.massimodutti.com/paper/wp-content/uploads/2020/09/The-Spice-Route-2.jpg" 
    },
    {
      id: 7, 
      name: "Morning Brew", 
      type: "Cafe", 
      distance: "0.2 miles away", 
      rating: 4.8, 
      priceRange: "$",
      hasActivePromo: true,
      promoDetails: "Buy 1 Get 1 Free on all coffees before 10am",
      tags: ["cafe", "coffee", "breakfast", "wifi"],
      image: "https://img.freepik.com/premium-photo/cozy-coffee-shop-interior-with-wooden-tables-comfortable-chairs_158595-5559.jpg" 
    },
    {
      id: 8, 
      name: "Burger Joint", 
      type: "Fast Food", 
      distance: "0.5 miles away", 
      rating: 4.2, 
      priceRange: "$",
      hasActivePromo: false,
      tags: ["burgers", "fast-food", "casual", "lunch"],
      image: "https://media-cdn.tripadvisor.com/media/photo-s/0e/cc/0a/dc/restaurant-chocolat.jpg" 
    }
  ];
  
  // Apply filters if provided
  if (filters && Object.keys(filters).length > 0) {
    return allRestaurants.filter(restaurant => {
      // Filter by type
      if (filters.type && restaurant.type.toLowerCase() !== filters.type.toLowerCase()) {
        return false;
      }
      
      // Filter by tag
      if (filters.tag && restaurant.tags && !restaurant.tags.includes(filters.tag)) {
        return false;
      }
      
      // Filter by search term
      if (filters.searchTerm && !restaurant.name.toLowerCase().includes(filters.searchTerm.toLowerCase())) {
        return false;
      }
      
      // Filter by price range
      if (filters.priceRange && restaurant.priceRange !== filters.priceRange) {
        return false;
      }
      
      // Filter by hasActivePromo
      if (filters.hasActivePromo !== undefined && restaurant.hasActivePromo !== filters.hasActivePromo) {
        return false;
      }
      
      return true;
    });
  }
  
  return allRestaurants;

  /*
  try {
    const response = await axios.get(`${API_URL}/restaurants`, { params: filters });
    return response.data;
  } catch (error) {
    console.error('Error fetching restaurants:', error);
    throw error.response?.data || error.message || 'Error fetching restaurants';
  }
  */
};

/**
 * Get restaurant details by ID
 * @param {number} id - Restaurant ID
 * @returns {Promise} Restaurant details
 */
export const getRestaurantById = async (id) => {
  try {
    // This will be replaced with actual API call when backend is ready
    const allRestaurants = [...await getFeaturedRestaurants(), ...await getRestaurants()];
    const restaurant = allRestaurants.find(r => r.id === Number(id));
    
    if (!restaurant) {
      throw new Error('Restaurant not found');
    }
    
    return restaurant;
    
    /*
    const response = await axios.get(`${API_URL}/restaurants/${id}`);
    return response.data;
    */
  } catch (error) {
    console.error(`Error fetching restaurant with ID ${id}:`, error);
    throw error.response?.data || error.message || 'Error fetching restaurant details';
  }
};

/**
 * Toggle restaurant favorite status
 * @param {number} id - Restaurant ID
 * @param {boolean} isFavorite - Whether to add or remove from favorites
 * @returns {Promise} Updated favorites list
 */
export const toggleFavorite = async (id, isFavorite) => {
  try {
    const authAxios = getAuthAxios();
    const action = isFavorite ? 'add' : 'remove';
    
    // This will be replaced with actual API call when backend is ready
    console.log(`${action} restaurant ${id} ${isFavorite ? 'to' : 'from'} favorites`);
    return { success: true };
    
    /*
    const response = await authAxios.post(`${API_URL}/favorites/${action}`, { restaurantId: id });
    return response.data;
    */
  } catch (error) {
    console.error('Error updating favorites:', error);
    throw error.response?.data || error.message || 'Error updating favorites';
  }
};

/**
 * Get user's favorite restaurants
 * @returns {Promise} List of favorite restaurant IDs
 */
export const getFavorites = async () => {
  try {
    // This will be replaced with actual API call when backend is ready
    return [2, 4, 7];
    
    /*
    const authAxios = getAuthAxios();
    const response = await authAxios.get(`${API_URL}/favorites`);
    return response.data;
    */
  } catch (error) {
    console.error('Error fetching favorites:', error);
    throw error.response?.data || error.message || 'Error fetching favorites';
  }
}; 