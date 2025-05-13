package com.projectalpha.service;

import com.projectalpha.dto.*;
import com.projectalpha.exception.*;
import com.projectalpha.repository.AuthRepository;
import com.projectalpha.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 * Service for handling authentication operations.
 */
@Service
public class AuthService {

    private final AuthRepository authRepository;
    private final UserRepository userRepository;

    @Autowired
    public AuthService(AuthRepository authRepository, UserRepository userRepository) {
        this.authRepository = authRepository;
        this.userRepository = userRepository;
    }

    /**
     * Sends a verification code to the specified email for registration.
     * 
     * @param email The email to send the verification code to
     * @throws DuplicateEmailException If the email is already registered
     * @throws Exception If an error occurs during the process
     */
    public void sendVerificationCode(String email) throws Exception {
        // Check if user already exists
        String userId = userRepository.findUserIdByEmail(email);
        if (userId != null) {
            throw new DuplicateEmailException("Email is already registered");
        }
        
        // Send verification code through repository
        authRepository.sendVerificationCode(email);
    }

    /**
     * Verifies a token for the specified email.
     * 
     * @param email The email associated with the token
     * @param token The verification token
     * @return SupabaseTokenResponse containing access token and user info
     * @throws Exception If verification fails
     */
    public SupabaseTokenResponse verifyVerificationCode(String email, String token) throws Exception {
        return authRepository.verifyToken(email, token);
    }

    /**
     * Updates a user's password and role.
     * 
     * @param email The user's email
     * @param newPassword The new password to set
     * @param role The role to assign to the user
     * @throws Exception If the update fails
     */
    public void updateUser(String email, String newPassword, String role) throws Exception {
        String userId = userRepository.findUserIdByEmail(email);
        if (userId == null) {
            throw new UserNotFoundException("User not found with email: " + email);
        }
        
        userRepository.updateUserPasswordAndRole(userId, newPassword, role);
    }

    /**
     * Authenticates a user with email and password.
     * 
     * @param email The user's email
     * @param password The user's password
     * @return SupabaseTokenResponse containing access token, refresh token, and user info
     * @throws Exception If authentication fails
     */
    public SupabaseTokenResponse loginWithEmailPassword(String email, String password) throws Exception {
        return authRepository.authenticateUser(email, password);
    }
}
