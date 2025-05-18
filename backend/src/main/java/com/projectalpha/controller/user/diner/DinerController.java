package com.projectalpha.controller.user.diner;

import com.projectalpha.dto.user.diner.DinerUpdateRequest;
import com.projectalpha.dto.user.diner.DinerUserProfile;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

public interface DinerController {

    ResponseEntity<?> getDinerProfile(@PathVariable String userId);

    ResponseEntity<?> updateDinerProfile(@PathVariable String userId, @RequestBody DinerUpdateRequest request);

}
