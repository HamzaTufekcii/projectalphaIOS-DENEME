package com.projectalpha.dto;

import java.util.Date;

/**
 * Data Transfer Object for user profile information
 */
public class UserProfileDTO {
    private String id;
    private String email;
    private String name;
    private String surname;
    private String phone;
    private String profilePicture;
    private Date lastUpdated;
    private String role;

    // Default constructor
    public UserProfileDTO() {}

    // Constructor with all fields
    public UserProfileDTO(String id, String email, String name, String surname, 
                         String phone, String profilePicture, Date lastUpdated, String role) {
        this.id = id;
        this.email = email;
        this.name = name;
        this.surname = surname;
        this.phone = phone;
        this.profilePicture = profilePicture;
        this.lastUpdated = lastUpdated;
        this.role = role;
    }

    // Getters and Setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getSurname() {
        return surname;
    }

    public void setSurname(String surname) {
        this.surname = surname;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getProfilePicture() {
        return profilePicture;
    }

    public void setProfilePicture(String profilePicture) {
        this.profilePicture = profilePicture;
    }

    public Date getLastUpdated() {
        return lastUpdated;
    }

    public void setLastUpdated(Date lastUpdated) {
        this.lastUpdated = lastUpdated;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }
} 