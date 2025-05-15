package com.projectalpha.repository;

import com.projectalpha.dto.SupabaseTokenResponse;
import org.springframework.stereotype.Repository;

/**
 * Repository interface for authentication operations with Supabase.
 */
@Repository
public interface AuthRepository {
    
    /**
     * Send a verification code to the provided email
     * 
     * @param email Email to send the verification code to
     */
    void sendVerificationCode(String email) throws Exception;
    
    /**
     * Verify a token for the given email
     * 
     * @param email The email associated with the token
     * @param token The verification token
     * @return The Supabase token response
     */
    SupabaseTokenResponse verifyToken(String email, String token) throws Exception;
    
    /**
     * Authenticate a user with email and password
     * 
     * @param email User's email
     * @param password User's password
     * @return The Supabase token response with auth tokens and user info
     */
    SupabaseTokenResponse authenticateUser(String email, String password) throws Exception;
} 