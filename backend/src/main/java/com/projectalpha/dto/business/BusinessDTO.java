package com.projectalpha.dto.business;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Data;


@JsonIgnoreProperties(ignoreUnknown = true)
@Data
public class BusinessDTO {

    private String id;

    private String owner_id;

    private String name;

    private String address;

    private String created_at;

    private String description;

}
