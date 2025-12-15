package com.smartparking.reservation.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDateTime;

@Entity
@Data
public class Reservation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull(message = "L'ID de la place de parking est obligatoire")
    private Long parkingSpotId;

    @NotBlank(message = "Le nom du client est obligatoire")
    private String nomClient;

    @NotBlank(message = "L'email est obligatoire")
    private String email;

    @NotBlank(message = "Le numéro de téléphone est obligatoire")
    private String telephone;

    @NotNull(message = "La date de début est obligatoire")
    private LocalDateTime dateDebut;

    @NotNull(message = "La date de fin est obligatoire")
    private LocalDateTime dateFin;

    @Enumerated(EnumType.STRING)
    private StatutReservation statut;

    private LocalDateTime dateCreation;

    public enum StatutReservation {
        ACTIVE, ANNULEE, TERMINEE
    }


    }




