package com.risiko.model;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import com.risiko.contoller.GameController;
import com.risiko.repository.UserRepository;

public class Room {
    private final int roomId;
    private List<Player> players;
    private boolean gameStarted;
    private Gamestate gamestate;
    private final GameController gameController;
    private final UserRepository userRepository;

    public Room(int roomId, GameController gameController, UserRepository userRepository) {
        this.roomId = roomId;
        this.gameController = gameController;
        this.userRepository = userRepository;
        players = new ArrayList<>();
        gameStarted = false;
    }

    public void sentSomething() {
        String data = players.stream()
            .map(p -> "{\"username\":\"" + p.username + "\"}")
            .collect(Collectors.joining(",", "[", "]"));
        for (Player p : players) {
            if (p.emitter != null) {
                try {
                    p.emitter.send(SseEmitter.event().name("playersInRoom").data(data));
                } catch (Exception e) {
                    p.emitter.completeWithError(e);
                }
            }
        }
    }

    public void joinRoom(long userId) {
        Player player = new Player(userId, userRepository);
        players.add(player);
    }

    public void leaveRoom() {}

    public void startGame() {}

    public void endGame() {}

    public int getRoomId() {
        return roomId;
    }

    public Gamestate getGamestate() {
        return gamestate;
    }

    public List<Player> getPlayers() {
        return players;
    }

}
