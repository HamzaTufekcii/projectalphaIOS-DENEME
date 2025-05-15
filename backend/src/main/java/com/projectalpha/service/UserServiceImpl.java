package com.projectalpha.service;

import com.projectalpha.dto.ListDTO;
import com.projectalpha.dto.BusinessDTO;
import com.projectalpha.dto.ReviewDTO;
import com.projectalpha.dto.UserProfileDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

/**
 * Implementation of the UserService interface
 * This service manages user profile, lists, and reviews functionality
 */
@Service
public class UserServiceImpl implements UserService {

    // TODO: Inject necessary repositories when they are created
    
    @Override
    public UserProfileDTO getUserProfile(String userId) {
        // TODO: Implement actual database query to fetch user data
        // This is a mock implementation for now
        return new UserProfileDTO(
            userId,
            "user@example.com",
            "John",
            "Doe",
            "+1234567890",
            "https://example.com/profile.jpg",
            new Date(),
            "user"
        );
    }

    @Override
    public void updateUserProfile(String userId, UserProfileDTO profileData) {
        // TODO: Implement actual database update
        // For now, this is just a stub
        System.out.println("Updating user profile for: " + userId);
    }

    @Override
    public List<ListDTO> getUserLists(String userId) {
        // TODO: Implement actual database query to fetch user lists
        // This is a mock implementation for now
        List<ListDTO> lists = new ArrayList<>();
        
        // Create a favorites list
        List<BusinessDTO> favoriteBusinesses = new ArrayList<>();
        favoriteBusinesses.add(new BusinessDTO(
            "bus1",
            "Sample Restaurant 1",
            "123 Main St, City",
            "https://example.com/business1.jpg",
            4.5,
            "Italian",
            "$$",
            "restaurant"
        ));
        
        lists.add(new ListDTO(
            "list1",
            "Favorites",
            userId,
            new Date(),
            favoriteBusinesses,
            true
        ));
        
        // Add a custom list
        List<BusinessDTO> customListBusinesses = new ArrayList<>();
        customListBusinesses.add(new BusinessDTO(
            "bus2",
            "Sample Cafe",
            "456 Oak St, City",
            "https://example.com/business2.jpg",
            4.2,
            "Cafe",
            "$",
            "cafe"
        ));
        
        lists.add(new ListDTO(
            "list2",
            "My Custom List",
            userId,
            new Date(),
            customListBusinesses,
            false
        ));
        
        return lists;
    }

    @Override
    public ListDTO createList(String userId, String listName) {
        // TODO: Implement actual database creation
        // This is a mock implementation for now
        return new ListDTO(
            "list" + System.currentTimeMillis(), // Generate a pseudo-random ID
            listName,
            userId,
            new Date(),
            new ArrayList<>(),
            false
        );
    }

    @Override
    public void addBusinessToList(String userId, String listId, String businessId) {
        // TODO: Implement actual database update
        // For now, this is just a stub
        System.out.println("Adding business " + businessId + " to list " + listId + " for user " + userId);
    }

    @Override
    public void removeBusinessFromList(String userId, String listId, String businessId) {
        // TODO: Implement actual database update
        // For now, this is just a stub
        System.out.println("Removing business " + businessId + " from list " + listId + " for user " + userId);
    }

    @Override
    public List<ReviewDTO> getUserReviews(String userId) {
        // TODO: Implement actual database query to fetch user reviews
        // This is a mock implementation for now
        List<ReviewDTO> reviews = new ArrayList<>();
        
        reviews.add(new ReviewDTO(
            "rev1",
            userId,
            "bus1",
            "Sample Restaurant",
            "https://example.com/business1.jpg",
            4.5,
            "Great food and service!",
            new Date()
        ));
        
        reviews.add(new ReviewDTO(
            "rev2",
            userId,
            "bus2",
            "Sample Cafe",
            "https://example.com/business2.jpg",
            3.8,
            "Good coffee but slow service.",
            new Date()
        ));
        
        return reviews;
    }
} 