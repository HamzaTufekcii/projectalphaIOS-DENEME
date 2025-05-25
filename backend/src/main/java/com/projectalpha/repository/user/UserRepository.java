package com.projectalpha.repository.user;

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
     * Create a user's database table
     *
     * @param userId The ID of the user to create table
     * @param email The email of the user to insert
     * @param role The role to check which table to insert new user
     */
    void createUserProfile(String userId, String email, String role) throws Exception;
    /**
     * Find a user by their email and check if verified
     *
     * @param email The email to search for
     * @return The verification time if found, null otherwise
     */
    String isVerified(String email) throws Exception;
    /**
     * Find a user's role in raw_app_meta_data
     *
     * @param email The email to search for
     * @return User's role if found, null otherwise
     */
    String checkRole(String email) throws Exception;
    /**
     * Update a user's password and role
     * 
     * @param userId The ID of the user to update
     * @param password The new password
     * @param role The role to assign
     */
    void updateUserPasswordAndRole(String userId, String password, String role) throws Exception;

    /**
     * Updates a user password.
     *
     * @param userId The userId to change user
     * @param newPassword The new password to set
     * @throws Exception If the update fails
     */
    void changePassword(String userId, String newPassword) throws Exception;

} 