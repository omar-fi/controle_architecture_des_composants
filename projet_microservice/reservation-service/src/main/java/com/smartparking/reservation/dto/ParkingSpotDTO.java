package com.smartparking.reservation.dto;

import lombok.Data;

@Data
public class ParkingSpotDTO {
    private Long id;
    private String numeroPlace;
    private String emplacement;
    private StatutPlace statut;

    public enum StatutPlace {
        DISPONIBLE, OCCUPEE, RESERVEE, HORS_SERVICE
    }



}

