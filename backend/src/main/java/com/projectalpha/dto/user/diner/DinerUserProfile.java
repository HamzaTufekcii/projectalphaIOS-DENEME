package com.projectalpha.dto.user.diner;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import lombok.Data;

@JsonIgnoreProperties(ignoreUnknown = true)
@Data
public class DinerUserProfile {

    private String user_id;

    private String id;

    private String name;

    private String phone_numb;

    private String email;

    private String surname;

    private String created_at;

}