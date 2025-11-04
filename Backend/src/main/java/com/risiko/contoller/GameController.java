package com.risiko.contoller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import com.risiko.model.Room;
import com.risiko.services.RoomService;

import java.io.IOException;
import java.util.List;
import java.util.concurrent.CopyOnWriteArrayList;

@RestController
@RequestMapping("/api")
public class GameController {
    private final RoomService roomService;

    @Autowired
    public GameController(RoomService roomService) {
        this.roomService = roomService;
    }

    @PostMapping("/stream")
    public SseEmitter stream() {
        SseEmitter emitter = new SseEmitter(0L); // kein Timeout

        // TODO: mit player veknüpfen
        //emitter.onCompletion(() -> emitters.remove(emitter));
        //emitter.onTimeout(() -> emitters.remove(emitter));
        //emitter.onError(e -> emitters.remove(emitter));

        try {
            emitter.send(SseEmitter.event().name("init").data("connected"));
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
    public void distTroops(@RequestParam String to, @RequestParam int sum, @RequestParam String roomId) {
        Room room = roomService.getRoomById(Integer.parseInt(roomId));
        room.getGamestate().getCurrentPlayer().distTroops(to, sum);// Noch schauen ob currentPlayer hier richtig ist
    }

    public void broadcastEvent(List<SseEmitter> emitters, String eventName, String data) {
        for (SseEmitter emitter : emitters) {
            try {
                emitter.send(SseEmitter.event().name(eventName).data(data));
            } catch (IOException e) {
                emitter.completeWithError(e);
            }
        }
    }
}