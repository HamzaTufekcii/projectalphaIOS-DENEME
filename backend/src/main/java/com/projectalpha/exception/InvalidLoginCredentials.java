package com.projectalpha.exception;

public class InvalidLoginCredentials extends RuntimeException {
    public InvalidLoginCredentials() {
        super("Password is incorrect.");
    }

    public InvalidLoginCredentials(String message) {
        super(message);
    }

    public InvalidLoginCredentials(String message, Throwable cause) {
        super(message, cause);
    }
}
