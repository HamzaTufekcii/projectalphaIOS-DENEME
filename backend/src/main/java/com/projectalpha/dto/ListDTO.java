package com.projectalpha.dto;

import java.util.Date;
import java.util.List;

/**
 * Data Transfer Object for user lists (favorites and custom lists)
 */
public class ListDTO {
    private String id;
    private String name;
    private String userId;
    private Date createdAt;
    private List<BusinessDTO> businesses;
    private boolean isFavorites;

    // Default constructor
    public ListDTO() {}

    // Constructor with all fields
    public ListDTO(String id, String name, String userId, Date createdAt, 
                   List<BusinessDTO> businesses, boolean isFavorites) {
        this.id = id;
        this.name = name;
        this.userId = userId;
        this.createdAt = createdAt;
        this.businesses = businesses;
        this.isFavorites = isFavorites;
    }

    // Getters and Setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public Date getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Date createdAt) {
        this.createdAt = createdAt;
    }

    public List<BusinessDTO> getBusinesses() {
        return businesses;
    }

    public void setBusinesses(List<BusinessDTO> businesses) {
        this.businesses = businesses;
    }

    public boolean isFavorites() {
        return isFavorites;
    }

    public void setFavorites(boolean favorites) {
        isFavorites = favorites;
    }
} 