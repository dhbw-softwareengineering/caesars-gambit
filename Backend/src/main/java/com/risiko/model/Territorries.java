package com.risiko.model;

/**
 * Enum of territories. Enum constant names are sanitized (Java identifier safe).
 * Use {@link #getDisplayName()} to get the original label as shown in the SVG.
 */
public enum Territorries {
    PALATIN("Palatin"),
    LATERANO("Laterano"),
    FORUM_TRASTEVEVEE("Forum Trastevevee"),
    CAMPANIA_A_LAPPE("Campania a Lappe"),
    EICHENWALD("Eichenwald"),
    PONRALMA("Ponralma"),
    NEAPEL("Neapel"),
    TRENTAKUSTE("Trentakuste"),
    DUENENSEE("Dünensee"),
    RENIAKUSTE("Reniakuste"),
    JONISCHE_UFER("Jonische-Ufer"),
    STRUMICIACHE_UFER("Strumiciache Ufer"),
    TOSCANA_UND_UNBURIA("Toscana + Unburia"),
    FLORENZZ("Florenzz"),
    FORUM_VATLKANSTADT("Forum Vatlkanstadt"),
    VARENSIA("Varensia"),
    PORRUGIERT("Porrugiert"),
    SANDFELSEN("Sandfelsen"),
    APENINII_TAL("ApeniniiTal"),
    SILBER_BUCHT("Silber-Bucht"),
    PALERNO("Palerno"),
    HAIRON("Hairon"),
    MATTRA("Mattra"),
    HORTHITAL("Horthital"),
    FOROUZA("Forouza"),
    APILION("Apilion"),
    MENDRIA("Mendria"),
    PERGUGIA("Pergugia"),
    FARNOVIA("Farnovia"),
    LISITONE("Lisitone"),
    MARSKEM("Marskem"),
    APPULLEN("Appullen"),
    TUKU("Tuku"),
    ERALDIS("Eraldis"),
    AUGUSTA_NEMETERS("Augusta Nemeters"),
    AQUITANE("Aquitane"),
    MAURENIET("Maureniet"),
    TUSKULUM("Tuskulum"),
    MONTEGRO("Montegro"),
    AGUALAINE("Agualaine"),
    LAURIA("Lauria"),
    TENUBRA("Tenubra"),
    FELSDUENE("Felsdüne"),
    SIZI_KUESTE("Sizi Küste"),
    SANDMEER("Sandmeer"),
    HARI("Hari"),
    PALEMO("Palemo"),
    FELSDUENE_2("Felsdüne2"),
    PONRALMA_UFER("Ponralma Ufer"),
    MOLASSNO("Molassno"),
    LUCERRA("Lucerra"),
    SZULIONEN("Szulionen"),
    TREVOIA("Trevoia"),
    PATATRA("Patatra"),
    ALABRE_KUSTE("Alabre Kuste"),
    SIZILLEBT_ERGANSEKUR("Sizillebt Ergansekur"),
    KRAILDUNE("Kraildune"),
    MAL_GOLF_TARENT("Mal Golf Tarent"),
    MESSNO_ERKANSI("Messno Erkansi"),
    MONTE_SKARNO("Monte Skarno");

    private final String displayName;

    Territorries(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
}
