package com.smartparking.notification.model;

import jakarta.persistence.Entity;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jdk.jfr.DataAmount;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class Notification {
    
    @NotBlank(message = "Le destinataire est obligatoire")
    @Email(message = "L'email doit être valide")
    private String destinataire;
    
    @NotBlank(message = "Le numéro de téléphone est obligatoire")
    private String telephone;
    
    @NotNull(message = "Le type de notification est obligatoire")
    private TypeNotification type;
    
    @NotBlank(message = "Le sujet est obligatoire")
    private String sujet;
    
    @NotBlank(message = "Le message est obligatoire")
    private String message;
    
    private LocalDateTime dateEnvoi;
    
    private StatutNotification statut;

    public enum TypeNotification {
        EMAIL, SMS, LES_DEUX
    }

    public enum StatutNotification {
        EN_ATTENTE, ENVOYEE, ECHEC
    }




}



