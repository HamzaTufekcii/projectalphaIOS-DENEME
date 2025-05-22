package com.projectalpha.repository.user.owner;

import com.projectalpha.dto.business.Business;
import com.projectalpha.dto.business.BusinessDTO;
import com.projectalpha.dto.business.address.AddressDTO;
import com.projectalpha.dto.user.diner.DinerUserProfile;
import com.projectalpha.dto.user.owner.OwnerLoginResponse;
import com.projectalpha.dto.user.owner.OwnerRegisterRequest;
import com.projectalpha.dto.user.owner.OwnerUpdateRequest;
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
    Optional<OwnerLoginResponse> findOwnerByID(String userId);
    /**
     * Find a user's business by their user_id (in database)
     *
     * @param userId The userId to search for
     * @return The owner's business if found, otherwise null
     */
    Business getBusinessProfile(String userId);
    /**
     * update owners by their user_id (in database)
     *
     * @param userId The ownerId to search for
     * @param request ownerProfile
     */
    void updateOwnerProfile(String userId, OwnerUpdateRequest request);

    /**
     * Yeni bir business (işletme) kaydını veri tabanına ekler.
     *
     * @param ownerId hangi owner business oluşturuyor?
     * @param business gelen istekten businessDTO çekilir
     * @return yeni oluşturulan businessi döndürür
     */
    BusinessDTO saveBusiness(String ownerId, BusinessDTO business);

    /**
     * Yeni adres kaydını veri tabanına ekler.
     *
     * @param businessId hangi business address oluşturuyor?
     * @param address gelen istekten addressDTO çekilir
     * @return yeni oluşturulan addressi döndürür
     */
    AddressDTO saveAddress(String businessId, AddressDTO address);


     /**
     * <p>
     *    <b>
      *        Owner kullanıcısı için kayıt sırasında otomatik olarak yeni bir Business ve Address oluşturur ve Owner'e isim soyisim telefon numarası bilgisi ekler.
     *    </b>
     * </p>
     * <p>-------------</p>
     * <p><i>
     * ⚠ <b>Uyarı</b> ⚠
     *     <p>Owner profil oluşturulmuş var sayılır.
     *     <p><i> (createUserProfile(..., ..., role: 'owner_user'))</i></p>
     *     </p>
     * </i></p>
     * <p>-------------</p>
     * <ol>
     *      <li>Supabasede Yeni Business kaydı yaratır (sadece adıyla) ve ownerId ile bağlar.
     *      <p><i>(yani gelen ownerId ve name'yi databasede oluşan businesse ekler.)</i></p>
     *      </li>
     *      <li>Yeni oluşan Business kaydının idsini alır
      *         <p><i>(local değişken String businessId = Supabase random id atıyor.)</i></p>
      *      </li>
     *      <li>Yeni Address kaydı yaratır ve businessId ile bağlar.</li>
     *      <li>Yeni oluşan adresin idsini business'e ekler.
     *          <p><i>(local değişken String addressId = Supabase random id atıyor.)</i></p>
     *      </li>
     * </ol>
     * @author izzethancelikdemir
     *
     * @param ownerId -> (<b>String</b>) Owner kullanıcısının userId'si
     * <p></p>
     * @param request -> (<b>OwnerRegisterRequest</b>) Ön yüzden gelen istek
     * @return -> (<b>BusinessDTO</b>) Yeni oluşturulan işletmeyi döndürür
     */
     BusinessDTO createInitialBusinessForOwner(String ownerId, OwnerRegisterRequest request) throws Exception;
}
