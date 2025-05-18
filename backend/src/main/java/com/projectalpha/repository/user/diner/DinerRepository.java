package com.projectalpha.repository.user.diner;

import com.projectalpha.dto.user.diner.DinerUpdateRequest;
import com.projectalpha.dto.user.diner.DinerUserProfile;
import com.projectalpha.dto.user.diner.custom_lists.CustomList;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DinerRepository {
    /**
     * Find diners by their user_id (in database)
     *
     * @param userId The dinerId to search for
     * @return The diner user if found, otherwise null
     */
    Optional<DinerUserProfile> findDinerByID(String userId);
    /**
     * update diners by their user_id (in database)
     *
     * @param userId The dinerId to search for
     * @param request dinerProfile
     */
    void updateDinerProfile(String userId, DinerUpdateRequest request);

}
