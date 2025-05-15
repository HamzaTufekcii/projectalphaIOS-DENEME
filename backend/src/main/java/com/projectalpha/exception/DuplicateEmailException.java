package com.projectalpha.exception;

/**
 * Exception thrown when attempting to register with an email that is already in use.
 */
public class DuplicateEmailException extends RuntimeException {
    
    public DuplicateEmailException() {
        super("Email is already registered");
    }
    
    public DuplicateEmailException(String message) {
        super(message);
    }
    
    public DuplicateEmailException(String message, Throwable cause) {
        super(message, cause);
    }
}
