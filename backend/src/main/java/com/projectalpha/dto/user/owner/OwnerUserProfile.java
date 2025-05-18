package com.projectalpha.dto.user.owner;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.security.Timestamp;

@Entity
@Table(name = "user_profile_owner")
public class OwnerUserProfile {
    //ID değiştirilemez.
    @Getter
    @Setter
    @Id
    @Column(name = "owner_id")
    private String userId;

    @Getter
    private String id; //değiştirilemez.

    @Setter
    @Getter
    private String name;

    @Setter
    @Getter
    private String phone_numb;

    @Getter
    private String email; //değiştirilemez.

    @Setter
    @Getter
    private String surname;

    @Getter
    private Timestamp created_at; //değiştirilemez.
}