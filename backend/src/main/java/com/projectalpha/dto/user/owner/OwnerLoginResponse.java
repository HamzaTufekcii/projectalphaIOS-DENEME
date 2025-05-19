package com.projectalpha.dto.user.owner;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.projectalpha.dto.user.owner.OwnerUserProfile;
import com.projectalpha.dto.business.Business;
import lombok.Data;

@JsonIgnoreProperties(ignoreUnknown = true)
@Data
public class OwnerLoginResponse {

    private com.projectalpha.dto.user.owner.OwnerUserProfile profile;
    private com.projectalpha.dto.business.Business ownedBusiness;


    public OwnerLoginResponse(com.projectalpha.dto.user.owner.OwnerUserProfile ownerProfile, com.projectalpha.dto.business.Business businessProfile) {
        profile = ownerProfile;
        ownedBusiness = businessProfile;
    }

    @JsonIgnoreProperties
    @Data
    public static class OwnerUserProfile {
        private String user_id;

        private String id;

        private String name;

        private String phone_numb;

        private String email;

        private String surname;

        private String created_at;
    }
    @JsonIgnoreProperties
    @Data
    public static class Business {

        private String id;

        private String name;

        private String addresses;

        private int price_range;

        private int avg_rating;

        private String created_at;

        private String description;

    }
}
