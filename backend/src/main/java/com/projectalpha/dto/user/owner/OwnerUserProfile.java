package com.projectalpha.dto.user.owner;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import java.security.Timestamp;
@JsonIgnoreProperties(ignoreUnknown = true)
@Data
public class OwnerUserProfile {

    private String owner_id;

    private String id;

    private String name;

    private String phone_numb;

    private String email;

    private String surname;

    private String created_at;

}