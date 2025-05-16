package com.projectalpha.service.user.diner;

import com.projectalpha.dto.user.diner.DinerUserProfile;

import java.util.Optional;

public interface DinerService {
    /**
     * Get a user's user information
     *
     * @param userId The ID of the user
     * @return User user data
     */
    Optional<DinerUserProfile> getDinerProfileByUserId(String userId);
    /**
     * Update dinerProfile
     *
     * @param userId dinerId
     * @param profile dinerProfile
     */
    void updateProfile(String userId, DinerUserProfile profile);
}