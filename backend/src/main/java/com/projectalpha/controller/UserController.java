package com.projectalpha.controller;

import com.projectalpha.dto.GenericResponse;
import com.projectalpha.dto.UserProfileDTO;
import com.projectalpha.dto.ListDTO;
import com.projectalpha.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * Controller for handling user profile and list management operations
 */
@RestController
@RequestMapping("/api/users")
public class UserController {
    private final UserService userService;

    @Autowired
    public UserController(UserService userService) {
        this.userService = userService;
    }

    /**
     * Get user profile data
     * 
     * @param userId The ID of the user
     * @return User profile information
     */
    @GetMapping("/{userId}/profile")
    public ResponseEntity<?> getUserProfile(@PathVariable String userId) {
        try {
            UserProfileDTO profile = userService.getUserProfile(userId);
            return ResponseEntity.ok(profile);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new GenericResponse<>(false, "Error retrieving user profile: " + e.getMessage()));
        }
    }

    /**
     * Update user profile information
     * 
     * @param userId The ID of the user
     * @param profileData The updated profile data
     * @return Success or error response
     */
    @PutMapping("/{userId}/profile")
    public ResponseEntity<GenericResponse> updateUserProfile(
            @PathVariable String userId,
            @RequestBody UserProfileDTO profileData) {
        try {
            userService.updateUserProfile(userId, profileData);
            return ResponseEntity.ok(new GenericResponse<>(true, "Profile updated successfully"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new GenericResponse<>(false, "Error updating profile: " + e.getMessage()));
        }
    }

    /**
     * Get all lists for a user (including favorites)
     * 
     * @param userId The ID of the user
     * @return List of user's lists
     */
    @GetMapping("/{userId}/lists")
    public ResponseEntity<?> getUserLists(@PathVariable String userId) {
        try {
            List<ListDTO> lists = userService.getUserLists(userId);
            return ResponseEntity.ok(lists);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new GenericResponse<>(false, "Error retrieving user lists: " + e.getMessage()));
        }
    }

    /**
     * Create a new list for a user
     * 
     * @param userId The ID of the user
     * @param listData The list data including name
     * @return The created list
     */
    @PostMapping("/{userId}/lists")
    public ResponseEntity<?> createList(
            @PathVariable String userId,
            @RequestBody Map<String, String> listData) {
        try {
            String listName = listData.get("name");
            if (listName == null || listName.isEmpty()) {
                return ResponseEntity.badRequest()
                    .body(new GenericResponse<>(false, "List name is required"));
            }
            
            ListDTO newList = userService.createList(userId, listName);
            return ResponseEntity.status(HttpStatus.CREATED).body(newList);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new GenericResponse<>(false, "Error creating list: " + e.getMessage()));
        }
    }

    /**
     * Add a business to a user's list
     * 
     * @param userId The ID of the user
     * @param listId The ID of the list
     * @param requestBody The business ID to add
     * @return Success or error response
     */
    @PostMapping("/{userId}/lists/{listId}/businesses")
    public ResponseEntity<GenericResponse> addBusinessToList(
            @PathVariable String userId,
            @PathVariable String listId,
            @RequestBody Map<String, String> requestBody) {
        try {
            String businessId = requestBody.get("businessId");
            if (businessId == null || businessId.isEmpty()) {
                return ResponseEntity.badRequest()
                    .body(new GenericResponse<>(false, "Business ID is required"));
            }
            
            userService.addBusinessToList(userId, listId, businessId);
            return ResponseEntity.ok(new GenericResponse<>(true, "Business added to list successfully"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new GenericResponse<>(false, "Error adding business to list: " + e.getMessage()));
        }
    }

    /**
     * Remove a business from a user's list
     * 
     * @param userId The ID of the user
     * @param listId The ID of the list
     * @param businessId The ID of the business to remove
     * @return Success or error response
     */
    @DeleteMapping("/{userId}/lists/{listId}/businesses/{businessId}")
    public ResponseEntity<GenericResponse> removeBusinessFromList(
            @PathVariable String userId,
            @PathVariable String listId,
            @PathVariable String businessId) {
        try {
            userService.removeBusinessFromList(userId, listId, businessId);
            return ResponseEntity.ok(new GenericResponse<>(true, "Business removed from list successfully"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new GenericResponse<>(false, "Error removing business from list: " + e.getMessage()));
        }
    }

    /**
     * Get user's reviews
     * 
     * @param userId The ID of the user
     * @return List of user's reviews
     */
    @GetMapping("/{userId}/reviews")
    public ResponseEntity<?> getUserReviews(@PathVariable String userId) {
        try {
            return ResponseEntity.ok(userService.getUserReviews(userId));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new GenericResponse<>(false, "Error retrieving user reviews: " + e.getMessage()));
        }
    }
} 