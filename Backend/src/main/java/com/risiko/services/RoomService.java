package com.risiko.services;

import java.util.List;
import java.util.ArrayList;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;

import org.springframework.stereotype.Service;

import com.risiko.contoller.GameController;
import com.risiko.model.Room;

@Service
public class RoomService {
    private final ConcurrentHashMap<Integer, Room> rooms = new ConcurrentHashMap<>();
    private final AtomicInteger nextId = new AtomicInteger(1);

    public List<Room> getAllRooms() {
        return new ArrayList<>(rooms.values());
    }

    public Room createRoom(GameController gameController) {
        int id = nextId.getAndIncrement();
        Room room = new Room(id, gameController);
        rooms.put(id, room);
        return room;
    }

    public Room getRoomById(int id) {
        return rooms.get(id);
    }

    public void removeRoom(int id) {
        rooms.remove(id);
    }
}