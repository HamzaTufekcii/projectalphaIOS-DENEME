package com.projectalpha.dto.user.diner.custom_lists;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@JsonIgnoreProperties(ignoreUnknown = true)
@Data

public class CustomListRequest {
    private String name;
    private boolean isPublic;
    private int likeCount;

}
