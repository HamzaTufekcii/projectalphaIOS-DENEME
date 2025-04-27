package com.projectalpha.dto;

import java.util.Map;

public class GenericResponse {
    private boolean success;
    private String message;
    private Map<String, String> data;

    public GenericResponse() {
    }

    public GenericResponse(boolean success, String message, Map<String, String> data) {
        this.success = success;
        this.message = message;
        this.data = data;
    }

    public boolean isSuccess() {
        return success;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public Map<String, String> getData() {
        return data;
    }

    public void setData(Map<String, String> data) {
        this.data = data;
    }
}
