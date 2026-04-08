package com.risiko.model.dto;

public class LobbyPlayerDto {
    private String username;
    private boolean host;

    public LobbyPlayerDto() {
    }

    public LobbyPlayerDto(String username, boolean host) {
        this.username = username;
        this.host = host;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public boolean isHost() {
        return host;
    }

    public void setHost(boolean host) {
        this.host = host;
    }
}
