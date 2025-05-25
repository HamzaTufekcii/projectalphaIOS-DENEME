package com.projectalpha.dto.user.owner;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Data;

@JsonIgnoreProperties(ignoreUnknown = true)
@Data
public class OwnerUpdateRequest {

    private String email;
    private String role;
    private OwnerUserProfile requestOwner;

    @JsonIgnoreProperties(ignoreUnknown = true)
    @Data
    public static class OwnerUserProfile {

        private String name;

        private String surname;

        private String phone_numb;

    }

}
