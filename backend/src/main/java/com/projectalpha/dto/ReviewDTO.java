package com.projectalpha.dto;

import java.util.Date;

/**
 * Data Transfer Object for user reviews
 */
public class ReviewDTO {
    private String id;
    private String userId;
    private String businessId;
    private String businessName;
    private String businessImageUrl;
    private Double rating;
    private String comment;
    private Date createdAt;

    // Default constructor
    public ReviewDTO() {}

    // Constructor with all fields
    public ReviewDTO(String id, String userId, String businessId, String businessName,
                    String businessImageUrl, Double rating, String comment, Date createdAt) {
        this.id = id;
        this.userId = userId;
        this.businessId = businessId;
        this.businessName = businessName;
        this.businessImageUrl = businessImageUrl;
        this.rating = rating;
        this.comment = comment;
        this.createdAt = createdAt;
    }

    // Getters and Setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getBusinessId() {
        return businessId;
    }

    public void setBusinessId(String businessId) {
        this.businessId = businessId;
    }

    public String getBusinessName() {
        return businessName;
    }

    public void setBusinessName(String businessName) {
        this.businessName = businessName;
    }

    public String getBusinessImageUrl() {
        return businessImageUrl;
    }

    public void setBusinessImageUrl(String businessImageUrl) {
        this.businessImageUrl = businessImageUrl;
    }

    public Double getRating() {
        return rating;
    }

    public void setRating(Double rating) {
        this.rating = rating;
    }

    public String getComment() {
        return comment;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }

    public Date getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Date createdAt) {
        this.createdAt = createdAt;
    }
} 