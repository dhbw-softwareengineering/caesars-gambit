package com.risiko.services;

import com.risiko.model.User;
import com.risiko.repository.UserRepository;
import com.risiko.security.JwtUtil;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;



@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    @Transactional
    public String register(String username, String email, String password) {
        if (userRepository.existsByEmail(email)) throw new RuntimeException("Email exists");
        if (userRepository.existsByUsername(username)) throw new RuntimeException("Username exists");
        User u = new User();
        u.setUsername(username);
        u.setEmail(email);
        u.setPassword(passwordEncoder.encode(password));
        u = userRepository.save(u);
        return jwtUtil.generateToken(u.getEmail(), u.getId());
    }

    public String login(String email, String password) {
        User u = userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("Invalid credentials"));
        if (!passwordEncoder.matches(password, u.getPassword())) throw new RuntimeException("Invalid credentials");
        return jwtUtil.generateToken(u.getEmail(), u.getId());
    }

      public long getUserIdFromToken(String token) {
        return jwtUtil.getUserIdFromToken(token);
      }
      
    public User getUserIdFromAuth() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth.getName();
        return  userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));
    }
    
}
