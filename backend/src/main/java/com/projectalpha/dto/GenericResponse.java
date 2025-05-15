package com.projectalpha.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Generic response structure for API endpoints.
 * Provides a standardized format for all API responses.
 *
 * @param <T> The type of data included in the response
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class GenericResponse<T> {
    private boolean success;
    private String code;
    private String message;
    private T data;
    
    /**
     * Constructor for simple success/failure with a message.
     *
     * @param success Whether the operation was successful
     * @param message The message describing the result
     */
    public GenericResponse(boolean success, String message) {
        this.success = success;
        this.message = message;
        this.code = success ? "SUCCESS" : "ERROR";
    }
    
    /**
     * Constructor for providing success/failure, message, and data.
     *
     * @param success Whether the operation was successful
     * @param message The message describing the result
     * @param data The data returned by the operation
     */
    public GenericResponse(boolean success, String message, T data) {
        this.success = success;
        this.message = message;
        this.data = data;
        this.code = success ? "SUCCESS" : "ERROR";
    }
}
