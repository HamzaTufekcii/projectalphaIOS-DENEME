package com.projectalpha.exception;

public class UserNotVerifiedException extends RuntimeException {

    public UserNotVerifiedException() {
        super("User is not verified waiting for new OTP authentication.");
    }

    public UserNotVerifiedException(String message) {
        super(message);
    }

    public UserNotVerifiedException(String message, Throwable cause) {
        super(message, cause);
    }
}
