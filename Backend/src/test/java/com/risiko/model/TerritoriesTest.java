package com.risiko.model;

import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

class TerritoriesTest {

    @Nested
    class GetDisplayName {

        @Test
        void gibtKorrektennDisplayNameZurueck() {
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
}
