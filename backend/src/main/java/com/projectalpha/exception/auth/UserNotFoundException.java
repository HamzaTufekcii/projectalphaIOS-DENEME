package com.projectalpha.exception.auth;

/**
 * Exception thrown when a user cannot be found with the given identifier.
 */
public class UserNotFoundException extends RuntimeException {
    
    public UserNotFoundException(String message) {
        super(message);
    }
    
    public UserNotFoundException(String message, Throwable cause) {
        super(message, cause);
    }
} 