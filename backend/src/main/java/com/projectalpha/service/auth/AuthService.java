package com.projectalpha.service.auth;

import com.projectalpha.dto.thirdparty.SupabaseTokenResponse;
import com.projectalpha.exception.auth.DuplicateEmailException;
import com.projectalpha.exception.auth.UserNotFoundException;
import com.projectalpha.exception.auth.UserNotVerifiedException;
import com.projectalpha.exception.auth.WrongRoleLoginMethod;
import com.projectalpha.repository.auth.AuthRepository;
import com.projectalpha.repository.user.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 * Service for handling auth operations.
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
     * @throws UserNotVerifiedException If the email is not verified
     * @throws Exception If an error occurs during the process
     */
    public void sendVerificationCode(String email) throws Exception {
        // Check if user already exists
        String userId = userRepository.findUserIdByEmail(email);
        String verificationTime = userRepository.isVerified(email);

        if (userId != null) {
            // Check if user verified email or not
            if(verificationTime == null) {
                authRepository.sendVerificationCode(email);
                throw new UserNotVerifiedException("User is not verified");
            }

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
        userRepository.createUserProfile(userId, email, role);
        userRepository.updateUserPasswordAndRole(userId, newPassword, role);
    }

    /**
     * Authenticates a user with email and password.
     * 
     * @param email The user's email
     * @param password The user's password
     * @return SupabaseTokenResponse containing access token, refresh token, and user info
     * @throws Exception If auth fails
     */
    public SupabaseTokenResponse loginWithEmailPassword(String email, String password, String expectedRole) throws Exception {
        String userId = userRepository.findUserIdByEmail(email);
        String userRole = userRepository.checkRole(email);

        if (userId == null) {
            throw new UserNotFoundException("User not found with email: " + email);
        }
        if (!(userRole.equals(expectedRole))) {
            throw new WrongRoleLoginMethod("Wrong role");
        }

        return authRepository.authenticateUser(email, password);
    }
}
