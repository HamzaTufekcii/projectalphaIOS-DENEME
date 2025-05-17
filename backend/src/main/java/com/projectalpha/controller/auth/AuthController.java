package com.projectalpha.controller.auth;

import com.projectalpha.dto.*;
import com.projectalpha.dto.thirdparty.SupabaseTokenResponse;
import com.projectalpha.dto.user.owner.OwnerRegisterRequest;
import com.projectalpha.exception.auth.*;
import com.projectalpha.service.auth.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * Controller for handling auth-related endpoints.
 */
@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private final AuthService authService;

    @Autowired
    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    /**
     * Sends a verification code to the provided email for registration.
     * 
     * @param body Request body containing the email
     * @return Response with success or error message
     */
    @PostMapping("/send-verification-code")
    public ResponseEntity<GenericResponse<Object>> sendVerificationCode(@RequestBody Map<String, String> body) {
        try {
            String email = body.get("email");
            if (email == null || email.isEmpty()) {
                return ResponseEntity.badRequest()
                    .body(new GenericResponse<>(false, "Email is required"));
            }
            
            authService.sendVerificationCode(email);
            return ResponseEntity.ok(new GenericResponse<>(true, "Verification code sent successfully"));
        } catch (DuplicateEmailException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                .body(new GenericResponse<>(false, e.getMessage()));
        } catch (UserNotVerifiedException e){
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(new GenericResponse<>(false, e.getMessage()));
        } catch (Exception e) {
            // Log the full error for debugging purposes
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new GenericResponse<>(false, "Error sending verification code: " + e.getMessage()));
        }
    }

    /**
     * Verifies the code sent to the user's email.
     * 
     * @param body Request body containing email and token
     * @return Response with auth token and user ID or error message
     */
    @PostMapping("/verify-verification-code")
    public ResponseEntity<?> verifyVerificationCode(@RequestBody Map<String, String> body) {
        try {
            String email = body.get("email");
            String token = body.get("token");
            
            if (email == null || email.isEmpty() || token == null || token.isEmpty()) {
                return ResponseEntity.badRequest()
                    .body(new GenericResponse(false, "Email and token are required"));
            }
            
            SupabaseTokenResponse res = authService.verifyVerificationCode(email, token);
            return ResponseEntity.ok(Map.of(
                "success", true,
                "token", res.getAccess_token(), 
                "userId", res.getUser().getId()
            ));
        } catch (VerificationCodeNotCorrect e) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(new GenericResponse(false, e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(new GenericResponse(false, "Verification failed: " + e.getMessage()));
        }
    }

    /**
     * Updates a user's password and role after verification.
     * 
     * @param body Request body containing email, password and role
     * @return Response with success or error message
     */
    @PostMapping("/update-user")
    public ResponseEntity<GenericResponse> updateUser(@RequestBody Map<String, String> body) {
        try {
            String email = body.get("email");
            String password = body.get("password");
            String role = body.get("role");
            if (email == null || email.isEmpty() || password == null || password.isEmpty()) {
                return ResponseEntity.badRequest()
                    .body(new GenericResponse(false, "Email and password are required"));
            }
            
            // Set a default role if not provided
            if (role == null || role.isEmpty()) {
                role = "user";
            }
            
            authService.updateUser(email, password, role);
            return ResponseEntity.ok(new GenericResponse(true, "User updated successfully"));
        } catch (UserNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(new GenericResponse(false, e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new GenericResponse(false, "Error updating user: " + e.getMessage()));
        }
    }
    @PostMapping("/update-owner-user")
    public ResponseEntity<GenericResponse> updateUser(@RequestBody OwnerRegisterRequest request) {
        try {
            if (request.getEmail() == null || request.getEmail().isEmpty() ||
                    request.getPassword() == null || request.getPassword().isEmpty()) {
                return ResponseEntity.badRequest()
                        .body(new GenericResponse(false, "Email and password are required"));
            }

            if (request.getRole() == null || request.getRole().isEmpty()) {
                request.setRole("user");
            }

            authService.updateUser(request.getEmail(), request.getPassword(), request.getRole(), request);
            return ResponseEntity.ok(new GenericResponse(true, "User updated successfully"));
        } catch (UserNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new GenericResponse(false, e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new GenericResponse(false, "Error updating user: " + e.getMessage()));
        }
    }
    
    /**
     * Authenticates a user with email and password.
     * 
     * @param body Request body containing email and password
     * @return Response with auth tokens and user info or error message
     */
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> body) {
        try {
            String email = body.get("email");
            String password = body.get("password");
            String expectedRole = body.get("role");
            
            if (email == null || email.isEmpty() || password == null || password.isEmpty()) {
                return ResponseEntity.badRequest()
                    .body(new GenericResponse(false, "Email and password are required"));
            }
            
            SupabaseTokenResponse response = authService.loginWithEmailPassword(email, password, expectedRole);
            return ResponseEntity.ok(Map.of(
                "success", true,
                "access_token", response.getAccess_token(),
                "refresh_token", response.getRefresh_token(),
                "user", response.getUser()
            ));
        } catch (UserNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new GenericResponse(false, e.getMessage()));
        } catch (InvalidLoginCredentials e) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(new GenericResponse(false, e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(new GenericResponse(false, "Login failed: " + e.getMessage()));
        }
    }
}
