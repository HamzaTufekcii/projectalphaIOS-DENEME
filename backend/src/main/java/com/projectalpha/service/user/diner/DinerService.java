package com.projectalpha.service.user.diner;

import com.projectalpha.dto.business.Business;
import com.projectalpha.dto.business.BusinessDTO;
import com.projectalpha.dto.user.diner.DinerLoginResponse;
import com.projectalpha.dto.user.diner.DinerUpdateRequest;
import com.projectalpha.dto.user.diner.DinerUserProfile;

import java.util.List;
import java.util.Optional;

public interface DinerService {
    /**
     * Get a user's user information
     *
     * @param userId The ID of the user
     * @return User user data
     */
    Optional<DinerLoginResponse> getDinerProfileByUserId(String userId);
    /**
     * Update dinerProfile
     *
     * @param userId dinerId
     * @param request dinerProfile
     */
    void updateProfile(String userId, DinerUpdateRequest request);
    //yorum kısmını yap!
    List<BusinessDTO> getDinerListItems(String userId,String listId);

}