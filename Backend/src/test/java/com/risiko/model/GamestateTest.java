package com.risiko.model;

import com.risiko.contoller.GameController;
import com.risiko.repository.UserRepository;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class GamestateTest {

    @Mock
    private GameController gameController;

    @Nested
    class Dice {

        @Test
        void anzahlRueckgabewerteKorrekt() {
            List<Integer> result = Gamestate.dice(3, 2);

            assertThat(result).hasSize(2);
        }

        @Test
        void alleWerteZwischenEinsUndSechs() {
            List<Integer> result = Gamestate.dice(10, 10);

            assertThat(result).allMatch(v -> v >= 1 && v <= 6);
        }

        @Test
        void ergebnisseAbsteigendSortiert() {
            List<Integer> result = Gamestate.dice(5, 3);

            for (int i = 0; i < result.size() - 1; i++) {
                assertThat(result.get(i)).isGreaterThanOrEqualTo(result.get(i + 1));
            }
        }

        @Test
        void rollCountNullGibtLeereListeZurueck() {
            assertThat(Gamestate.dice(0, 2)).isEmpty();
        }

        @Test
        void returnCountNullGibtLeereListeZurueck() {
            assertThat(Gamestate.dice(3, 0)).isEmpty();
        }

        @Test
        void returnCountGroesserAlsRollCount_wirdAufRollCountBegrenzt() {
            List<Integer> result = Gamestate.dice(2, 5);

            assertThat(result).hasSize(2);
        }

        @Test
        void einWurf_gibtEinenWertZurueck() {
            assertThat(Gamestate.dice(1, 1)).hasSize(1);
        }

        @Test
        void negativerRollCount_gibtLeereListeZurueck() {
            assertThat(Gamestate.dice(-1, 2)).isEmpty();
        }
    }

    @Nested
    class GetPlayerByUserId {

        @Test
        void vorhandenerSpieler_gibtSpielerZurueck() {
            UserRepository userRepo = mock(UserRepository.class);
            when(userRepo.findById(1L)).thenReturn(Optional.empty());
            Player player = new Player(1L, userRepo);
            Gamestate gamestate = new Gamestate(1, List.of(player), gameController);

            assertThat(gamestate.getPlayerByUserId(1L)).isEqualTo(player);
        }

        @Test
        void nichtVorhandenerSpieler_gibtNullZurueck() {
            UserRepository userRepo = mock(UserRepository.class);
            when(userRepo.findById(1L)).thenReturn(Optional.empty());
            Player player = new Player(1L, userRepo);
            Gamestate gamestate = new Gamestate(1, List.of(player), gameController);

            assertThat(gamestate.getPlayerByUserId(99L)).isNull();
        }

        @Test
        void leereSpielerListe_gibtNullZurueck() {
            Gamestate gamestate = new Gamestate(1, List.of(), gameController);

            assertThat(gamestate.getPlayerByUserId(1L)).isNull();
        }
    }

    @Nested
    class EndMove {

        private Player makePlayer(long id) {
            UserRepository userRepo = mock(UserRepository.class);
            when(userRepo.findById(id)).thenReturn(Optional.empty());
            return new Player(id, userRepo);
        }

        @Test
        void wechseltZumNaechstenSpieler() {
            UserRepository repo1 = mock(UserRepository.class);
            UserRepository repo2 = mock(UserRepository.class);
            when(repo1.findById(1L)).thenReturn(Optional.empty());
            when(repo2.findById(2L)).thenReturn(Optional.empty());
            Player p1 = new Player(1L, repo1);
            Player p2 = new Player(2L, repo2);

            // Mutable list required for Gamestate shuffle
            java.util.List<Player> players = new java.util.ArrayList<>(List.of(p1, p2));
            Gamestate gamestate = new Gamestate(1, players, gameController);

            // Manuell currentPlayer auf p1 setzen via Reflection
            org.springframework.test.util.ReflectionTestUtils.setField(gamestate, "currentPlayer", p1);

            gamestate.endMove();

            assertThat(gamestate.getCurrentPlayer()).isEqualTo(p2);
        }

        @Test
        void letzterSpieler_wechseltZumErstenSpieler() {
            UserRepository repo1 = mock(UserRepository.class);
            UserRepository repo2 = mock(UserRepository.class);
            when(repo1.findById(1L)).thenReturn(Optional.empty());
            when(repo2.findById(2L)).thenReturn(Optional.empty());
            Player p1 = new Player(1L, repo1);
            Player p2 = new Player(2L, repo2);

            java.util.List<Player> players = new java.util.ArrayList<>(List.of(p1, p2));
            Gamestate gamestate = new Gamestate(1, players, gameController);

            // Letzten Spieler als aktuellen setzen
            org.springframework.test.util.ReflectionTestUtils.setField(gamestate, "currentPlayer", p2);

            gamestate.endMove();

            assertThat(gamestate.getCurrentPlayer()).isEqualTo(p1);
        }
    }
}
