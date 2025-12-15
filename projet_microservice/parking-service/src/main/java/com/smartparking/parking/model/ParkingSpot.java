package com.smartparking.parking.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDateTime;

@Entity
@Data
public class ParkingSpot {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "parking_id")
    private Parking parking;

    private String numeroPlace;

    private String emplacement;

    @NotNull(message = "Le statut est obligatoire")
    @Enumerated(EnumType.STRING)
    private StatutPlace statut;


    private LocalDateTime dateCreation;


    private LocalDateTime dateModification;

    public enum StatutPlace {
        DISPONIBLE, OCCUPEE, RESERVEE, HORS_SERVICE
    }

















}



