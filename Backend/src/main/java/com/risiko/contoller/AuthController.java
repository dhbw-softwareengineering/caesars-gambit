package com.risiko.contoller;

import com.risiko.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    public static record RegisterReq(String username, String email, String password) {}
    public static record LoginReq(String email, String password) {}

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterReq req) {
        try {
            String token = authService.register(req.username(), req.email(), req.password());
            return ResponseEntity.ok(Map.of("accessToken", token));
        } catch (RuntimeException e) {
            return ResponseEntity.status(409).body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginReq req) {
        try {
            String token = authService.login(req.email(), req.password());
            return ResponseEntity.ok(Map.of("accessToken", token));
        } catch (RuntimeException e) {
            return ResponseEntity.status(401).body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/signout")
    public ResponseEntity<?> signout(HttpServletRequest request, HttpServletResponse response) {
        // This application uses stateless JWTs. There's nothing to invalidate server-side
        // unless a token blacklist is implemented. To help clients, clear any access token cookie.
        // If your frontend stores the token in localStorage, it should remove it on signout.
    jakarta.servlet.http.Cookie cookie = new jakarta.servlet.http.Cookie("accessToken", "");
        cookie.setPath("/");
        cookie.setHttpOnly(true);
        cookie.setMaxAge(0);
        response.addCookie(cookie);
        return ResponseEntity.ok(Map.of("message", "Signed out"));
    }
}
