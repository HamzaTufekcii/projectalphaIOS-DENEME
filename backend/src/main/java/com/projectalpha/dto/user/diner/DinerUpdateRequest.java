package com.projectalpha.dto.user.diner;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.projectalpha.dto.user.owner.OwnerRegisterRequest;
import lombok.Data;

@JsonIgnoreProperties(ignoreUnknown = true)
@Data
public class DinerUpdateRequest {

    private String email;
    private String role;
    private DinerUserProfile requestDiner;

    @JsonIgnoreProperties(ignoreUnknown = true)
    @Data
    public static class DinerUserProfile {

        private String name;

        private String surname;

        private String phone_numb;

    }

}
