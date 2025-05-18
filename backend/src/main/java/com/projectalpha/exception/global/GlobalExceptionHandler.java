package com.projectalpha.exception.global;

import com.projectalpha.dto.GenericResponse;
import com.projectalpha.exception.auth.DuplicateEmailException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(DuplicateEmailException.class)
    public ResponseEntity<GenericResponse<Void>> handleDuplicateEmail(DuplicateEmailException ex) {
        GenericResponse<Void> resp = new GenericResponse<Void>(
                false,
                "EMAIL_ALREADY_EXISTS",  // code
                ex.getMessage(),         // "E-posta zaten mevcut"
                null);
        return ResponseEntity
                .status(HttpStatus.CONFLICT)
                .body(resp);
    }
}
