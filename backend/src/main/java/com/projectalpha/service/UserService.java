package com.projectalpha.service;

import com.projectalpha.dto.ListDTO;
import com.projectalpha.dto.ReviewDTO;
import com.projectalpha.dto.UserProfileDTO;

import java.util.List;

/**
 * Service interface for user-related operations
 */
public interface UserService {
    
    /**
     * Get a user's profile information
     * 
     * @param userId The ID of the user
     * @return User profile data
     */
    UserProfileDTO getUserProfile(String userId);
    
    /**
     * Update a user's profile information
     * 
     * @param userId The ID of the user
     * @param profileData The updated profile data
     */
    void updateUserProfile(String userId, UserProfileDTO profileData);
    
    /**
     * Get all lists for a user (including favorites)
     * 
     * @param userId The ID of the user
     * @return List of user's lists
     */
    List<ListDTO> getUserLists(String userId);
    
    /**
     * Create a new list for a user
     * 
     * @param userId The ID of the user
     * @param listName The name of the new list
     * @return The created list
     */
    ListDTO createList(String userId, String listName);
    
    /**
     * Add a business to a user's list
     * 
     * @param userId The ID of the user
     * @param listId The ID of the list
     * @param businessId The ID of the business to add
     */
    void addBusinessToList(String userId, String listId, String businessId);
    
    /**
     * Remove a business from a user's list
     * 
     * @param userId The ID of the user
     * @param listId The ID of the list
     * @param businessId The ID of the business to remove
     */
    void removeBusinessFromList(String userId, String listId, String businessId);
    
    /**
     * Get all reviews written by a user
     * 
     * @param userId The ID of the user
     * @return List of user's reviews
     */
    List<ReviewDTO> getUserReviews(String userId);
} 