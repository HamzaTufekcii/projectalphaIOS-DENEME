package com.projectalpha.dto.business;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Data;

@JsonIgnoreProperties(ignoreUnknown = true)
@Data
public class Business {
    private String id;

    private String owner_id1;

    private String name;

    private String addresses;

    private int price_range;

    private int avg_rating;

    private String created_at;

    private String description;
}
