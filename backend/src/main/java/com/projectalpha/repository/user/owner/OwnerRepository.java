package com.projectalpha.repository.user.owner;

import com.projectalpha.dto.business.BusinessDTO;
import com.projectalpha.dto.business.address.AddressDTO;
import com.projectalpha.dto.user.diner.DinerUserProfile;
import com.projectalpha.dto.user.owner.OwnerRegisterRequest;
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
     * Owner kullanıcısı için kayıt sırasında otomatik olarak
     * yeni bir Business ve Address oluşturur
     * ve Owner'e isim soyisim telefon numarası bilgisi ekler.
     *
     *  Uyarı: Owner profil oluşturulmuş var sayılır. (createUserProfile(..., ..., role: 'owner_user'))
     *  ----
     *  1-Supabasede Yeni Business kaydı yaratır (sadece adıyla) ve ownerId ile bağlar. (yani gelen ownerId ve name'yi databaseye yeni bir business satırının içine ekler.)
     *  2-Yeni oluşan Business kaydının idsini alır (businessId : supabase random id atıyor.)
     *  3-Yeni Address kaydı yaratır ve businessId ile bağlar.
     *  4-Yeni oluşan adresin idsini business'e ekler. (addressId : supabase random id atıyor.)
     *
     * @param ownerId Owner kullanıcısının userId'si (Supabase'den gelen ID)
     * @param request Ön yüzden gelen istek
     * @return supabasede oluşturulan yeni işletmeyi döndürür
     */
     BusinessDTO createInitialBusinessForOwner(String ownerId, OwnerRegisterRequest request) throws Exception;
}
