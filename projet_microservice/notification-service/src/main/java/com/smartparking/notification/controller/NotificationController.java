package com.smartparking.notification.controller;

import com.smartparking.notification.model.Notification;
import com.smartparking.notification.service.NotificationService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    private final NotificationService notificationService;

    @Autowired
    public NotificationController(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    @PostMapping("/envoyer")
    public ResponseEntity<Notification> envoyerNotification(@Valid @RequestBody Notification notification) {
        Notification result = notificationService.envoyerNotification(notification);
        
        if (result.getStatut() == Notification.StatutNotification.ENVOYEE) {
            return ResponseEntity.status(HttpStatus.OK).body(result);
        } else {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(result);
        }
    }

    @PostMapping("/reservation-confirmee")
    public ResponseEntity<Notification> envoyerConfirmationReservation(@Valid @RequestBody Notification notification) {
        notification.setSujet("Confirmation de réservation de parking");
        notification.setMessage("Votre réservation de parking a été confirmée. " + notification.getMessage());
        return envoyerNotification(notification);
    }

    @PostMapping("/rappel-reservation")
    public ResponseEntity<Notification> envoyerRappelReservation(@Valid @RequestBody Notification notification) {
        notification.setSujet("Rappel: Réservation de parking");
        notification.setMessage("Rappel: Votre réservation de parking commence bientôt. " + notification.getMessage());
        return envoyerNotification(notification);
    }
}



