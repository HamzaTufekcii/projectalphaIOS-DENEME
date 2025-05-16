package com.projectalpha.dto.user.diner;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.security.Timestamp;

@Entity
@Table(name = "user_profile_diner")
public class DinerUserProfile {
    //ID değiştirilemez.
    @Getter
    @Id
    @Column(name = "user_id")
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

    @Setter
    @Getter
    private String address;

    @Getter
    private Timestamp created_at; //değiştirilemez.
}