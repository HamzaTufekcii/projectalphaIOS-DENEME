package com.projectalpha.service.user;

/*import com.projectalpha.dto.ListDTO;
import com.projectalpha.dto.ReviewDTO;
import com.projectalpha.dto.UserProfileDTO;*/
import com.projectalpha.dto.business.Business;
import com.projectalpha.dto.business.BusinessDTO;
import com.projectalpha.dto.user.diner.DinerUpdateRequest;
import com.projectalpha.dto.user.diner.DinerUserProfile;
import com.projectalpha.dto.user.owner.OwnerUserProfile;
import com.projectalpha.repository.user.diner.DinerRepository;
import com.projectalpha.repository.user.diner.custom_lists.listItem.FavoritesRepository;
import com.projectalpha.repository.user.owner.OwnerRepository;
import com.projectalpha.service.user.diner.DinerService;
import com.projectalpha.service.user.owner.OwnerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

//import java.util.List;

@Service
public class UserService implements DinerService, OwnerService {

    private final DinerRepository dinerRepository;
    private final OwnerRepository ownerRepository;
    private final FavoritesRepository favoritesRepository;

    @Autowired
    public UserService(DinerRepository dinerRepository, OwnerRepository ownerRepository, FavoritesRepository favoritesRepository) {
        this.dinerRepository = dinerRepository;
        this.ownerRepository = ownerRepository;
        this.favoritesRepository = favoritesRepository;
    }

    @Override
    public Optional<DinerUserProfile> getDinerProfileByUserId(String userId) {
        return dinerRepository.findDinerByID(userId);
    }

    @Override
    public Optional<OwnerUserProfile> getOwnerProfileByUserId(String userId) {
        return ownerRepository.findOwnerByID(userId);
    }

    @Override
    public void updateProfile(String userId, DinerUpdateRequest request) {
        dinerRepository.updateDinerProfile(userId, request);
    }

    @Override
    public void updateProfile(String userId, OwnerUserProfile profile) {
        ownerRepository.updateOwnerProfile(userId, profile);
    }
    @Override
    public List<Business> getDinerFavorites(String userId) {
        return favoritesRepository.getDinerFavorites(userId);
    }
}


// /**
// * Service interface for user-related operations
// */
// old implementations
// /**
// */
// * Update a user's user information
// *
// * @param userId The ID of the user
// * @param profileData The updated user data
// */
//void updateUserProfile(String userId, UserProfileDTO profileData);

// /**
// * Get all lists for a user (including favorites)
// *
// * @param userId The ID of the user
// * @return List of user's lists
// */
// List<ListDTO> getUserLists(String userId);

// /**
// * Create a new list for a user
// *
// * @param userId The ID of the user
// * @param listName The name of the new list
// * @return The created list
// */
// ListDTO createList(String userId, String listName);

// /**
// * Add a business to a user's list
// *
// * @param userId The ID of the user
// * @param listId The ID of the list
// * @param businessId The ID of the business to add
// */
// void addBusinessToList(String userId, String listId, String businessId);

// /**
// * Remove a business from a user's list
// *
// * @param userId The ID of the user
// * @param listId The ID of the list
// * @param businessId The ID of the business to remove
// */
// void removeBusinessFromList(String userId, String listId, String businessId);

// /**
// * Get all reviews written by a user
// *
// * @param userId The ID of the user
// * @return List of user's reviews
// */
// List<ReviewDTO> getUserReviews(String userId);
//
