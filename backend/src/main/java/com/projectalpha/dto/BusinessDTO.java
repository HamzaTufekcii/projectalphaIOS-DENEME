package com.projectalpha.dto;

/**
 * Data Transfer Object for business information
 */
public class BusinessDTO {
    private String id;
    private String name;
    private String address;
    private String imageUrl;
    private Double rating;
    private String category;
    private String priceRange;
    private String businessType; // e.g., "restaurant", "cafe", "bar", etc.

    // Default constructor
    public BusinessDTO() {}

    // Constructor with all fields
    public BusinessDTO(String id, String name, String address, String imageUrl, 
                         Double rating, String category, String priceRange, String businessType) {
        this.id = id;
        this.name = name;
        this.address = address;
        this.imageUrl = imageUrl;
        this.rating = rating;
        this.category = category;
        this.priceRange = priceRange;
        this.businessType = businessType;
    }

    // Constructor without businessType for backward compatibility
    public BusinessDTO(String id, String name, String address, String imageUrl, 
                         Double rating, String category, String priceRange) {
        this(id, name, address, imageUrl, rating, category, priceRange, "restaurant");
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

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public Double getRating() {
        return rating;
    }

    public void setRating(Double rating) {
        this.rating = rating;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getPriceRange() {
        return priceRange;
    }

    public void setPriceRange(String priceRange) {
        this.priceRange = priceRange;
    }
    
    public String getBusinessType() {
        return businessType;
    }
    
    public void setBusinessType(String businessType) {
        this.businessType = businessType;
    }
} 