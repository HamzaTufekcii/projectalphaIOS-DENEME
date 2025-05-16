package com.projectalpha.exception.auth;

public class UserNotVerifiedException extends RuntimeException {

    public UserNotVerifiedException() {
        super("User is not verified waiting for new OTP auth.");
    }

    public UserNotVerifiedException(String message) {
        super(message);
    }

    public UserNotVerifiedException(String message, Throwable cause) {
        super(message, cause);
    }
}
