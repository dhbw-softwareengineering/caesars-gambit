package com.risiko.services;

import java.util.List;
import java.util.ArrayList;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.scheduling.annotation.Scheduled;

import com.risiko.contoller.GameController;
import com.risiko.model.Room;
import com.risiko.repository.UserRepository;

@Service
public class RoomService {
    private final ConcurrentHashMap<Integer, Room> rooms = new ConcurrentHashMap<>();
    private final AtomicInteger nextId = new AtomicInteger(1);

    private final UserRepository userRepository;

    @Autowired
    public RoomService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public List<Room> getAllRooms() {
        return new ArrayList<>(rooms.values());
    }

    public boolean joinRoom(int roomId, long userId) {
        Room room = rooms.get(roomId);
        if (room != null) {
            room.joinRoom(userId);
            return true;
        }
        return false;
    }
    public Room createRoom(GameController gameController) {
        int id = nextId.getAndIncrement();
        Room room = new Room(id, gameController, userRepository);
        rooms.put(id, room);
        return room;
    }

    public Room getRoomById(int id) {
        return rooms.get(id);
    }

    public void removeRoom(int id) {
        rooms.remove(id);
    }

    // scheduled task that ticks all rooms every 6 seconds
    @Scheduled(fixedRate = 6000)
    public void tickRooms() {
        for (Room room : rooms.values()) {
            try {
                room.sentSomething();
            } catch (Exception e) {
                // log and continue
                System.err.println("Error while ticking room " + room.getRoomId() + ": " + e.getMessage());
            }
        }
    }
}