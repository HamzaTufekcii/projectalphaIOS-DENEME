package com.projectalpha.repository.address;

import com.projectalpha.dto.business.address.AddressDTO;
import java.util.List;

public interface AddressRepository {
    List<AddressDTO> findAll();
    AddressDTO findById(String id);
    AddressDTO findByBusinessId(String businessId);
}