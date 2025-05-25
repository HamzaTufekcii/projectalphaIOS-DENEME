package com.projectalpha.dto.user.diner.custom_lists;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class CustomListRequest {

    private String name;
    @JsonProperty("is_public")
    private boolean isPublic;

    private int likeCount;

}
