package com.projectalpha.controller;

import com.projectalpha.dto.AuthRequest;
import com.projectalpha.dto.GenericResponse;
import com.projectalpha.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    @Autowired
    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/signup")
    public ResponseEntity<GenericResponse> signup(@RequestBody AuthRequest request) {
        return authService.signup(request);
    }

    @PostMapping("/login")
    public ResponseEntity<GenericResponse> login(@RequestBody AuthRequest request) {
        return authService.login(request);
    }
}
