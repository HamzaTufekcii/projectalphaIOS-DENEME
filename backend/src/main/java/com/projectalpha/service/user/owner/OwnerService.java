package com.projectalpha.service.user.owner;

import com.projectalpha.dto.user.owner.OwnerLoginResponse;
import com.projectalpha.dto.user.owner.OwnerUpdateRequest;
import com.projectalpha.dto.user.owner.OwnerUserProfile;

import java.util.Optional;

public interface OwnerService {
    /**
     * Get a user's user information
     *
     * @param userId The ID of the user
     * @return User user data
     */
    Optional<OwnerLoginResponse> getOwnerProfileByUserId(String userId);

    /**
     * Update ownerProfile
     *
     * @param userId ownerId
     * @param request requestOwner
     */
    void updateProfile(String userId, OwnerUpdateRequest request);
}