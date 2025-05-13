package com.projectalpha.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.Map;

@Data
@AllArgsConstructor
public class GenericResponse<T> {
    private boolean success;
    private String code;
    private String message;
    private T data;
}
