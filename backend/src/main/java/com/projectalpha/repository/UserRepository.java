package com.projectalpha.repository;

import org.springframework.stereotype.Repository;

/**
 * Repository interface for user operations against Supabase.
 * This abstracts the data access layer from the service layer.
 */
@Repository
public interface UserRepository {
    
    /**
     * Find a user by their email
     * 
     * @param email The email to search for
     * @return The user ID if found, null otherwise
     */
    String findUserIdByEmail(String email) throws Exception;
    
    /**
     * Update a user's password and role
     * 
     * @param userId The ID of the user to update
     * @param password The new password
     * @param role The role to assign
     */
    void updateUserPasswordAndRole(String userId, String password, String role) throws Exception;
} 