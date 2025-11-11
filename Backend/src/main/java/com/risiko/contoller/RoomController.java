package com.risiko.contoller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

import com.risiko.model.Room;
import com.risiko.services.RoomService;

@RestController
@RequestMapping("/api/rooms")
public class RoomController {

    @Autowired
    private RoomService roomService;
    private final GameController gameController;

    @Autowired
    public RoomController(GameController gameController) {
        this.gameController = gameController;
    }

    @PostMapping("/create")
    public int createRoom() {
        Room created = roomService.createRoom(gameController);
        return created.getRoomId();
    }

    @GetMapping
    public List<Room> listRooms() {
        return roomService.getAllRooms();
    }

    // ...existing code...
}