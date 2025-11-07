package com.risiko.contoller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

import com.risiko.model.Room;
import com.risiko.repository.UserRepository;
import com.risiko.services.AuthService;
import com.risiko.services.RoomService;

import jakarta.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/api/rooms")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class RoomController {

    @Autowired
    private RoomService roomService;
    private final GameController gameController;
    private final AuthService authService;

    @Autowired
    public RoomController(GameController gameController, UserRepository userRepository, AuthService authService) {
        this.gameController = gameController;
        this.authService = authService;
    }

    @PostMapping("/create")
    public int createRoom() {
        Room created = roomService.createRoom(gameController);
        return created.getRoomId();
    }

    @PostMapping("/join/{roomId}")
    public void joinRoom(@PathVariable("roomId") int roomId, HttpServletRequest request) {
        String token = request.getHeader("Authorization").substring(7);
        long userId = authService.getUserIdFromToken(token);
        if (!roomService.joinRoom(roomId, userId, request.getParameter("host").equals("true"))) {
            throw new RuntimeException("Room not found");
        }
    }

    @GetMapping
    public List<Room> listRooms() {
        return roomService.getAllRooms();
    }
}