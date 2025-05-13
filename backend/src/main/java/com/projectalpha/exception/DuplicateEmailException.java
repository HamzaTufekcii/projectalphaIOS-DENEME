package com.projectalpha.exception;

public class DuplicateEmailException extends RuntimeException {
    public DuplicateEmailException() {
        super("E-Posta zaten mevcut");
    }
}
