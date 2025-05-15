package com.projectalpha.exception;

public class VerificationCodeNotCorrect extends RuntimeException {
    public VerificationCodeNotCorrect() {
        super("Verification code not correct");
    }

    public VerificationCodeNotCorrect(String message) {
        super(message);
    }

    public VerificationCodeNotCorrect(String message, Throwable cause) {
        super(message, cause);
    }
}
