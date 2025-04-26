package com.projectalpha.controller;

import com.projectalpha.service.UserService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/register")
    public String registerUser(@RequestParam String email, @RequestParam String password) {
        try {
            return userService.registerUser(email, password);
        } catch (Exception e) {
            return "Registration failed: " + e.getMessage();
        }
    }
}