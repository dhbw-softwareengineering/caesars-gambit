package com.risiko.contoller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.risiko.model.User;
import com.risiko.model.dto.UserDto;
import com.risiko.repository.UserRepository;
import com.risiko.services.AuthService;

import jakarta.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/api/user")
public class UserController {

    @Autowired
    private AuthService authService;

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/currentUser")
    public ResponseEntity<UserDto> getCurrentUser(HttpServletRequest request) {
        String token = request.getHeader("Authorization").substring(7);
        long userId = authService.getUserIdFromToken(token);
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        return ResponseEntity.ok(new UserDto(user.getUsername()));
    }
}
