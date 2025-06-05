package com.projectalpha.dto.business;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@JsonIgnoreProperties(ignoreUnknown = true)
@Data
@Entity
@Table(name = "business")
public class Business {
    @Id
    private String id;

    private String owner_id1;
    private String name;
    private String addresses;
    private String price_range;
    private double avg_rating;
    private String created_at;
    private String description;
}