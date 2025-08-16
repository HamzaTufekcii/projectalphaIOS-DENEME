package com.projectalpha;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class TestController {
    
    @GetMapping("/test")
    public String test() {
        System.out.println("=== SIMPLE TEST CONTROLLER HIT ===");
        System.err.println("=== SIMPLE TEST ERROR STREAM ===");
        return "Simple test controller is working!";
    }
}
