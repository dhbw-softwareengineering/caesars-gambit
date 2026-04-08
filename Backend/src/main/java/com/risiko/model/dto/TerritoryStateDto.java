package com.risiko.model.dto;

public class TerritoryStateDto {
    private String territory;
    private String owner;
    private int troops;

    public TerritoryStateDto() {
    }

    public TerritoryStateDto(String territory, String owner, int troops) {
        this.territory = territory;
        this.owner = owner;
        this.troops = troops;
    }

    public String getTerritory() {
        return territory;
    }

    public void setTerritory(String territory) {
        this.territory = territory;
    }

    public String getOwner() {
        return owner;
    }

    public void setOwner(String owner) {
        this.owner = owner;
    }

    public int getTroops() {
        return troops;
    }

    public void setTroops(int troops) {
        this.troops = troops;
    }
}
