package com.projectalpha.dto.user.owner;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Data;

import java.security.Timestamp;

@JsonIgnoreProperties(ignoreUnknown = true)
@Data
public class OwnerRegisterRequest {

    private String email;
    private String password;
    private String role;
    private BusinessDTO requestBusiness;
    private AddressDTO requestAddress;
    private OwnerUserProfile requestOwner;

    @JsonIgnoreProperties(ignoreUnknown = true)
    @Data
    public static class OwnerUserProfile {

        private String name;

        private String surname;

        private String phone_numb;

    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    @Data
    public static class BusinessDTO {

        private String name;

        private String description;

    }
    @JsonIgnoreProperties(ignoreUnknown = true)
    @Data
    public static class AddressDTO {

        private String city;

        private String district;

        private String neighborhood;

        private String street;

    }
}
