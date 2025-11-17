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

    public void joinRoom(long userId, boolean host) {
        if (gameStarted) {
            // do some error handling and unexpected error handling
        }
        Player player = new Player(userId, userRepository);
        players.add(player);
        player.setHost(host);
        List<SseEmitter> emitters = players.stream()
            .map(p -> p.emitter)
            .filter(e -> e != null)
            .collect(Collectors.toList());
        String data = players.stream()
            .map(p -> "{\"username\":\"" + p.username + "\", \"host\": \"" + p.isHost() + "\"}")
            .collect(Collectors.joining(",", "[", "]"));
        gameController.broadcastEvent(emitters, "playerJoined", data);
    }

    public void leaveRoom(long userId) {
        if (gameStarted) {
            // do some error handling and unexpected error handling
        }
        players = players.stream()
            .filter(p -> p.getUserId() != userId)
            .collect(Collectors.toList());
        List<SseEmitter> emitters = players.stream()
            .map(p -> p.emitter)
            .filter(e -> e != null)
            .collect(Collectors.toList());
        String data = players.stream()
            .map(p -> "{\"username\":\"" + p.username + "\", \"host\": \"" + p.isHost() + "\"}")
            .collect(Collectors.joining(",", "[", "]"));
        gameController.broadcastEvent(emitters, "playerLeft", data);
    }

    public void startGame() {
        if (gameStarted) {
            throw new IllegalStateException("Game already started");
        }
        gameStarted = true;
        gamestate = new Gamestate(roomId, players, gameController);
        gamestate.start();
    }

    public void endGame() {
        gameStarted = false;
        gamestate = null;
    }

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
