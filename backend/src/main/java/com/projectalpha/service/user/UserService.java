package com.projectalpha.service.user;

/*import com.projectalpha.dto.ListDTO;
import com.projectalpha.dto.ReviewDTO;
import com.projectalpha.dto.UserProfileDTO;*/
import com.projectalpha.dto.business.Business;
import com.projectalpha.dto.business.BusinessDTO;
import com.projectalpha.dto.user.diner.DinerUpdateRequest;
import com.projectalpha.dto.user.diner.DinerUserProfile;
import com.projectalpha.dto.user.owner.OwnerLoginResponse;
import com.projectalpha.dto.user.owner.OwnerUpdateRequest;
import com.projectalpha.dto.user.owner.OwnerUserProfile;
import com.projectalpha.repository.user.UserRepository;
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
    private final UserRepository userRepository;

    @Autowired
    public UserService(DinerRepository dinerRepository, OwnerRepository ownerRepository, FavoritesRepository favoritesRepository, UserRepository userRepository) {
        this.dinerRepository = dinerRepository;
        this.ownerRepository = ownerRepository;
        this.favoritesRepository = favoritesRepository;
        this.userRepository = userRepository;
    }

    @Override
    public Optional<DinerUserProfile> getDinerProfileByUserId(String userId) {
        return dinerRepository.findDinerByID(userId);
    }

    @Override
    public Optional<OwnerLoginResponse> getOwnerProfileByUserId(String userId) {
        return ownerRepository.findOwnerByID(userId);
    }

    @Override
    public void updateProfile(String userId, DinerUpdateRequest request) {
        dinerRepository.updateDinerProfile(userId, request);
    }

    @Override
    public void updateProfile(String userId, OwnerUpdateRequest request) {
        ownerRepository.updateOwnerProfile(userId, request);
    }
    @Override
    public List<Business> getDinerFavorites(String userId) {
        return favoritesRepository.getDinerFavorites(userId);
    }

    /**
     * <p><b> Giriş yapmış kullanıcının şifresini değiştirir. </b></p>
     * <p>-------------</p>
     * <p><i>
     * ⚠ <b>Uyarı</b> ⚠
     *     <p>Bu metod tüm kullanıcılar için geçerlidir ve herhangi bir service interface'i implemente etmez.</p>
     * </i></p>
     *
     * @author izzethancelikdemir
     *
     * @param userId Şifresi değiştirilecek kullanıcının ID'si -> (<b>String</b>)
     * <p></p>
     * @param newPassword  Yeni şifre -> (<b>String</b>)
     * @throws Exception  Şifre değiştirme başarısız olursa fırlatılır
     */
    public void changePassword(String userId, String newPassword) throws Exception {
            userRepository.changePassword(userId, newPassword);
    }
}


