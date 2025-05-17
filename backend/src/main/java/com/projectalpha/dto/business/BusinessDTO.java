package com.projectalpha.dto.business;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Data;

import java.security.Timestamp;

@JsonIgnoreProperties(ignoreUnknown = true)
@Data
public class BusinessDTO {

    private String id;

    private String owner_id;

    private String name;

    private String address;

    private Timestamp created_at;

    private String description;
}
