package com.risiko.model;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import com.risiko.contoller.GameController;

public class Gamestate {
    private final List<Player> players;
    private static final int INITIAL_TROOPS = 40;
    private Player currentPlayer;
    private final GameController gameController;


    public Gamestate(int roomId, List<Player> players, GameController gameController) {
        this.players = players;
        this.gameController = gameController;
    }

    public void start() {
        Collections.shuffle(players);
        List<Territorries> territoryList = new ArrayList<>(Arrays.asList(Territorries.values()));
        Collections.shuffle(territoryList);
        int territoriesPerPlayer = territoryList.size() / players.size();
        List<List<Territorries>> distributedTerritories = new ArrayList<>();
        for (int i = 0; i < players.size(); i++) {
            List<Territorries> playerTerritories = territoryList.subList(
                i * territoriesPerPlayer, 
                (i + 1) * territoriesPerPlayer
            );
            distributedTerritories.add(playerTerritories);
        }
        int remaining = territoryList.size() % players.size();
        if (remaining > 0) {
            for (int i = 0; i < remaining; i++) {
                int territoryIndex = (players.size() * territoriesPerPlayer) + i;
                distributedTerritories.get(i).add(territoryList.get(territoryIndex));
            }
        }
        for (int i = 0; i < players.size(); i++) {
            players.get(i).setTerritories(distributedTerritories.get(i));
            players.get(i).askDistTroops(INITIAL_TROOPS);
        }
        currentPlayer = players.get(0);
        nextMove();
    }

    public void nextMove() {
        String gameState = "lala";
        List<SseEmitter> emitters = players.stream()
            .map(p -> p.emitter)
            .filter(Objects::nonNull)
            .collect(Collectors.toList());
        gameController.broadcastEvent(emitters, "NextMove:", gameState);
        gameController.broadcastEvent(emitters, "CurrentPlayer:", currentPlayer.username);
    }

    public void endMove() {
        int currentIndex = players.indexOf(currentPlayer);
        int nextIndex = (currentIndex + 1) % players.size();
        currentPlayer = players.get(nextIndex);
        nextMove();
    }


    public void attack(String fromTerritory, String toTerritory) {
        for (Player p : players) {
            if (p.hasTerritory(Territorries.valueOf(toTerritory))) {
                List<Integer> attackerRolls = dice(3, 2); //TODO: wie viel truppen angreifen
                List<Integer> defenderRolls = dice(2, 2); //TODO
                int comparisons = Math.min(attackerRolls.size(), defenderRolls.size());
                for (int i = 0; i < comparisons; i++) {
                    int lostTroopsDefence = 0;
                    int lostTroopsAttack = 0;
                    if (attackerRolls.get(i) > defenderRolls.get(i)) {
                        lostTroopsDefence++;
                    } else {
                        lostTroopsAttack++;
                    }
                    if (p.defend(toTerritory, lostTroopsDefence) == 0) {
                        currentPlayer.getTerritory(toTerritory);
                        currentPlayer.distTroops(fromTerritory, -lostTroopsAttack);
                        List<SseEmitter> emitters = new ArrayList<>();
                        emitters.add(currentPlayer.emitter);
                        gameController.broadcastEvent(emitters, "AskDistTroops:", toTerritory);
                    }
                    
                }
            }
        }
        gameController.broadcastEvent(
            players.stream()
                .map(pl -> pl.emitter)
                .filter(Objects::nonNull)
                .collect(Collectors.toList()),
            "AttackResult:",
            "Attack from " + fromTerritory + " to " + toTerritory + " completed."
        );
    }

    public static List<Integer> dice(int rollCount, int returnCount) {
        if (rollCount <= 0 || returnCount <= 0) {
            return new ArrayList<>();
        }
        if (returnCount > rollCount) {
            returnCount = rollCount;
        }

        List<Integer> rolls = new ArrayList<>(rollCount);
        for (int i = 0; i < rollCount; i++) {
            rolls.add(java.util.concurrent.ThreadLocalRandom.current().nextInt(1, 7));
        }

        rolls.sort(Collections.reverseOrder());
        return new ArrayList<>(rolls.subList(0, returnCount));
    }

    public Player getCurrentPlayer() {
        return currentPlayer;
    }
}
