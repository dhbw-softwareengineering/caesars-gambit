package com.risiko.contoller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

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
    public void joinRoom(@PathVariable("roomId") int roomId, HttpServletRequest request, @RequestBody(required = false) Map<String, Object> body) {
        String token = request.getHeader("Authorization").substring(7);
        long userId = authService.getUserIdFromToken(token);
        boolean host = false;
        if (body != null && body.containsKey("host")) {
            Object hostObj = body.get("host");
            if (hostObj instanceof Boolean) host = (Boolean) hostObj;
            else host = Boolean.parseBoolean(hostObj.toString());
        }
        if (!roomService.joinRoom(roomId, userId, host)) {
            throw new RuntimeException("Room not found");
        }
    }
    
    @PostMapping("/leave/{roomId}")
     public void leaveRoom(@PathVariable("roomId") int roomId, HttpServletRequest request) {
        String token = request.getHeader("Authorization").substring(7);
        long userId = authService.getUserIdFromToken(token);
        if (!roomService.leaveRoom(roomId, userId)) {
            throw new RuntimeException("Room not found");
        }
    }

    @PostMapping("/message/{roomId}")
    public void sendMessage(@PathVariable("roomId") int roomId, HttpServletRequest request, @RequestBody Map<String, String> body) {
        String token = request.getHeader("Authorization").substring(7);
        long userId = authService.getUserIdFromToken(token);
        String message = body.get("message");
        roomService.sendMessage(roomId, userId, message);
    }


    @GetMapping
    public List<Room> listRooms() {
        return roomService.getAllRooms();
    }
}