package com.projectalpha.repository.user.owner;

import com.projectalpha.dto.user.diner.DinerUserProfile;
import com.projectalpha.dto.user.owner.OwnerUserProfile;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface OwnerRepository {
    /**
     * Find a user by their user_id (in database)
     *
     * @param userId The userId to search for
     * @return The owner user if found, otherwise null
     */
    Optional<OwnerUserProfile> findOwnerByID(String userId);
    /**
     * update owners by their user_id (in database)
     *
     * @param userId The ownerId to search for
     * @param profile ownerProfile
     */
    void updateOwnerProfile(String userId, OwnerUserProfile profile);
}
