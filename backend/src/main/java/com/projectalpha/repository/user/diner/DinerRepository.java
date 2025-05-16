package com.projectalpha.repository.user.diner;

import com.projectalpha.dto.ListDTO;
import com.projectalpha.dto.user.diner.DinerUserProfile;
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
     * @param profile dinerProfile
     */
    void updateDinerProfile(String userId, DinerUserProfile profile);
    /**
     * Find diners' lists by their user_id (in database)
     *
     * @param userId The dinerId to search for
     * @return The diner's lists
     */
    List<ListDTO> findListsByUserId(String userId);
    /**
     * Let diners create a new list by their user_id (in database)
     *
     * @param userId The userId to search for
     * @param listName the new list's name
     * @return The new list
     */
    ListDTO createList(String userId, String listName);
    /**
     * Let diners add businesses to their lists by their user_id (in database)
     *
     * @param userId The dinerId to search for
     * @param listId The listId to insert data
     * @param businessId to get business
     */
    void addBusinessToList(String userId, String listId, String businessId);
    /**
     * Let diners remove businesses from their lists by their user_id (in database)
     *
     * @param userId The dinerId to search for
     * @param listId The listId to delete data
     * @param businessId to get business from list
     */
    void removeBusinessFromList(String userId, String listId, String businessId);
}
