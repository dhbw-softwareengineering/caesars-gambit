package com.risiko.model;

import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

class TerritoriesTest {

    @Nested
    class GetDisplayName {

        @Test
        void gibtKorrektenDisplayNameZurueck() {
            assertThat(Territorries.PALATIN.getDisplayName()).isEqualTo("Palatin");
        }

        @Test
        void sonderzeichenImDisplayName_werdenKorrektZurueckgegeben() {
            assertThat(Territorries.DUENENSEE.getDisplayName()).isEqualTo("Dünensee");
        }

        @Test
        void leerzeichenImDisplayName_werdenKorrektZurueckgegeben() {
            assertThat(Territorries.FORUM_TRASTEVEVEE.getDisplayName()).isEqualTo("Forum Trastevevee");
        }
    }

    @Nested
    class GetTerritorryByDisplayName {

        @Test
        void bekannterDisplayName_gibtKorrekteEnumZurueck() {
            assertThat(Territorries.getTerritorryByDisplayName("Palatin")).isEqualTo(Territorries.PALATIN);
        }

        @Test
        void unbekannterDisplayName_gibtNullZurueck() {
            assertThat(Territorries.getTerritorryByDisplayName("NichtVorhanden")).isNull();
        }

        @Test
        void leerenString_gibtNullZurueck() {
            assertThat(Territorries.getTerritorryByDisplayName("")).isNull();
        }

        @Test
        void grossKleinschreibungUnterschiede_gibtNullZurueck() {
            assertThat(Territorries.getTerritorryByDisplayName("palatin")).isNull();
        }

        @Test
        void displayNameMitSonderzeichen_gibtKorrekteEnumZurueck() {
            assertThat(Territorries.getTerritorryByDisplayName("Dünensee")).isEqualTo(Territorries.DUENENSEE);
        }

        @Test
        void alleEnumKonstanten_sindUeberDisplayNameAuffindbar() {
            for (Territorries t : Territorries.values()) {
                assertThat(Territorries.getTerritorryByDisplayName(t.getDisplayName())).isEqualTo(t);
            }
        }
    }

    @Nested
    class IsAdjacentTo {

        @Test
        void benachbarteGebiete_sindAdjazent() {
            assertThat(Territorries.PALATIN.isAdjacentTo(Territorries.LATERANO)).isTrue();
            assertThat(Territorries.PALATIN.isAdjacentTo(Territorries.FORUM_TRASTEVEVEE)).isTrue();
        }

        @Test
        void nichtBenachbarteGebiete_sindNichtAdjazent() {
            assertThat(Territorries.PALATIN.isAdjacentTo(Territorries.EICHENWALD)).isFalse();
            assertThat(Territorries.PALATIN.isAdjacentTo(Territorries.AGUALAINE)).isFalse();
        }

        @Test
        void adjazenz_istSymmetrisch() {
            assertThat(Territorries.LATERANO.isAdjacentTo(Territorries.PALATIN)).isTrue();
            assertThat(Territorries.FORUM_TRASTEVEVEE.isAdjacentTo(Territorries.PALATIN)).isTrue();
        }

        @Test
        void gebiet_istNichtAdjazentZuSichSelbst() {
            assertThat(Territorries.PALATIN.isAdjacentTo(Territorries.PALATIN)).isFalse();
        }
    }

    @Nested
    class GetNeighbors {

        @Test
        void getNeighbors_gibtKorrekteMenge() {
            assertThat(Territorries.PALATIN.getNeighbors())
                    .containsExactlyInAnyOrder(Territorries.LATERANO, Territorries.FORUM_TRASTEVEVEE)
                    .hasSize(2);
        }

        @Test
        void getNeighbors_istUnveraenderlich() {
            assertThatThrownBy(() -> Territorries.PALATIN.getNeighbors().add(Territorries.EICHENWALD))
                    .isInstanceOf(UnsupportedOperationException.class);
        }
    }
}
