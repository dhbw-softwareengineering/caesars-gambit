package com.risiko.contoller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import com.risiko.model.Player;
import com.risiko.model.Room;
import com.risiko.model.Territorries;
import com.risiko.services.AuthService;
import com.risiko.services.RoomService;

import jakarta.servlet.http.HttpServletRequest;

import java.io.IOException;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/game")
public class GameController {
    private final RoomService roomService;
    private final AuthService authService;

    @Autowired
    public GameController(RoomService roomService, AuthService authService) {
        this.roomService = roomService;
        this.authService = authService;
    }

    @GetMapping("/stream/{roomId}")
    public SseEmitter stream(@PathVariable("roomId") String roomId, @RequestParam(value = "token", required = false) String tokenParam, HttpServletRequest request) {
        String token = tokenParam;
        if (token == null) {
            String authHeader = request.getHeader("Authorization");
            if (authHeader != null && authHeader.startsWith("Bearer ")) {
                token = authHeader.substring(7);
            }
        }
        if (token == null) throw new RuntimeException("Missing token");
        long userId = authService.getUserIdFromToken(token);
        
        Room room = roomService.getRoomById(Integer.parseInt(roomId));
        if (room == null) {
            throw new RuntimeException("Room not found");
        }

        SseEmitter emitter = new SseEmitter(0L);
        
        Player player = room.getPlayers().stream()
            .filter(p -> userId == p.getUserId())
            .findFirst()
            .orElseThrow(() -> new RuntimeException("Player not found in room"));

        player.setEmitter(emitter);
        emitter.onCompletion(() -> player.setEmitter(null));
        emitter.onTimeout(() -> player.setEmitter(null));
        emitter.onError(e -> player.setEmitter(null));

        try {
            emitter.send(SseEmitter.event().name("init").data(room.getLobbyData()).build());
        } catch (IOException e) {
            emitter.completeWithError(e);
        }

        return emitter;
    }

    @PostMapping("/Move")
    public void move(@RequestParam String from, @RequestParam String to, @RequestParam int sum, @RequestParam String roomId) {
        Room room = roomService.getRoomById(Integer.parseInt(roomId));
        room.getGamestate().getCurrentPlayer().moveTroops(from, to, sum);
    }

    @PostMapping("/attack")
    public void attack(@RequestParam String from, @RequestParam String to, @RequestParam String roomId) {
        Room room = roomService.getRoomById(Integer.parseInt(roomId));
        room.getGamestate().attack(from, to);
    }

    @PostMapping("/distTroops")
    public void distTroops(@RequestBody Map<String, Object> request, HttpServletRequest httpRequest) {
        Room room = roomService.getRoomById(Integer.parseInt((String) request.get("roomId")));
        String token = httpRequest.getHeader("Authorization").substring(7);
        long userId = authService.getUserIdFromToken(token);
        String to = (String) request.get("to");
        int sum = ((Number) request.get("sum")).intValue();
        room.getGamestate().getPlayerByUserId(userId).distTroops(Territorries.getTerritorryByDisplayName(to), sum);
        room.getGamestate().sendGameStateUpdate();
    }

    public void broadcastEvent(List<SseEmitter> emitters, String eventName, String data) {
        for (SseEmitter emitter : emitters) {
            try {
                emitter.send(SseEmitter.event().name(eventName).data(data).build());
            } catch (IOException e) {
                emitter.completeWithError(e);
            }
        }
    }
}