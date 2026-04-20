package com.risiko.contoller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.risiko.services.AuthService;

@RestController
@RequestMapping("/api/user")
public class UserController {
    
    private final AuthService authService;


    @Autowired
    public UserController(AuthService authService) {
        this.authService = authService;
    }

    @GetMapping("/currentUser")
    public ResponseEntity<String> getCurrentUser() {
        return ResponseEntity.ok("{\"username\": \"" + authService.getUserIdFromAuth().getUsername() + "\"}");
    }
}
