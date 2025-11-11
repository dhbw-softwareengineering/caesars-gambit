import type { CSSProperties } from "react";

export default function MainMenu() {
    const containerStyle: CSSProperties = {
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
        backgroundColor: "#0b2a2f",
        color: "white",
    };

    const cardStyle: CSSProperties = {
        width: "100%",
        maxWidth: "960px",
        backgroundColor: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.06)",
        borderRadius: "12px",
        padding: "32px",
        display: "flex",
        flexDirection: "column",
    };

    const buttonBase: CSSProperties = {
        width: "100%",
        padding: "12px 16px",
        borderRadius: "8px",
        border: "none",
        cursor: "pointer",
        fontWeight: 600,
        fontSize: "16px",
    };

    const buttonDefaultStyle: CSSProperties = {
        ...buttonBase,
        backgroundColor: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.06)",
        color: "rgba(255,255,255,0.9)",
    };

    const buttonPrimaryStyle: CSSProperties = {
        ...buttonBase,
        backgroundColor: "#8AA39A",
        border: "none",
        color: "#052722",
        fontWeight: 700,
        fontSize: "18px",
    };

    const buttonDangerStyle: CSSProperties = {
        ...buttonBase,
        backgroundColor: "#A85A5A",
        border: "none",
        color: "#fff",
        fontWeight: 700,
    };

        const paragraphStyle: CSSProperties = {
        margin: 0,
        fontSize: "14px",
        color: "rgba(255,255,255,0.7)",
        textAlign: "center",
        maxWidth: "720px",
    };

    return (
        <main style={containerStyle}>
            <div style={cardStyle}>
                <header style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "12px", marginBottom: "24px" }}>
                    <h1 style={{ fontSize: "48px", fontWeight: 800, color: "#C9B69A", letterSpacing: "1px", margin: 0 }}>Caesar's Gambit</h1>
                    <p style={paragraphStyle}>
                        Wähle eine Option, um zu beginnen.
                    </p>
                </header>

                <nav style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                    <button style={buttonPrimaryStyle}>Spiel erstellen</button>
                    <button style={buttonDefaultStyle}>Lobby beitreten</button>
                    <button style={buttonDefaultStyle}>Einstellungen</button>
                    <button style={buttonDefaultStyle}>Hilf bei der Entwicklung</button>
                    <button style={buttonDangerStyle}>Abmelden</button>
                </nav>

                <footer style={{ marginTop: "20px", display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "12px", color: "rgba(255,255,255,0.6)" }}>
                    <span>Version 1.0</span>
                    <span>© Caesar's Gambit</span>
                </footer>
            </div>
        </main>
    );
}