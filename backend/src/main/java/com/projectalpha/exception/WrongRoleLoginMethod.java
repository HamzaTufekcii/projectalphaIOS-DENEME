package com.projectalpha.exception;

public class WrongRoleLoginMethod extends RuntimeException {
    public WrongRoleLoginMethod() {
        super("Wrong login method called");
    }

    public WrongRoleLoginMethod(String message) {
        super(message);
    }

    public WrongRoleLoginMethod(String message, Throwable cause) {
        super(message, cause);
    }
}
