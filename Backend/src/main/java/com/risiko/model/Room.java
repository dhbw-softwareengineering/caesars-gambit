package com.risiko.model;

import java.util.List;
import java.util.concurrent.atomic.AtomicInteger;

import com.risiko.contoller.GameController;

public class Room {
    private final int roomId;
    private List<Player> players;
    private boolean gameStarted;
    private Gamestate gamestate;
    private final GameController gameController;

    public Room(int roomId, GameController gameController) {
        this.roomId = roomId;
        this.gameController = gameController;
    }

    public void joinRoom() {}

    public void leaveRoom() {}

    public void startGame() {}

    public void endGame() {}

    public int getRoomId() {
        return roomId;
    }

    public Gamestate getGamestate() {
        return gamestate;
    }

}
