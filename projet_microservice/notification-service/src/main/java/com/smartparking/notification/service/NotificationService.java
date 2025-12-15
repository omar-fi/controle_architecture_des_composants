package com.smartparking.notification.service;

import com.smartparking.notification.model.Notification;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class NotificationService {

    private static final Logger logger = LoggerFactory.getLogger(NotificationService.class);
    
    @Autowired(required = false)
    private JavaMailSender mailSender;
    
    @Value("${spring.mail.username:noreply@smartparking.com}")
    private String fromEmail;

    public Notification envoyerNotification(Notification notification) {
        notification.setDateEnvoi(LocalDateTime.now());
        
        try {
            switch (notification.getType()) {
                case EMAIL:
                    envoyerEmail(notification);
                    break;
                case SMS:
                    envoyerSMS(notification);
                    break;
                case LES_DEUX:
                    envoyerEmail(notification);
                    envoyerSMS(notification);
                    break;
            }
            notification.setStatut(Notification.StatutNotification.ENVOYEE);
            logger.info("Notification envoyée avec succès à {}", notification.getDestinataire());
        } catch (Exception e) {
            notification.setStatut(Notification.StatutNotification.ECHEC);
            logger.error("Erreur lors de l'envoi de la notification: {}", e.getMessage());
        }
        return notification;
    }

    private void envoyerEmail(Notification notification) {
        logger.info("Envoi d'email à {}: {}", notification.getDestinataire(), notification.getSujet());
        
        if (mailSender != null) {
            try {
                SimpleMailMessage message = new SimpleMailMessage();
                message.setFrom(fromEmail);
                message.setTo(notification.getDestinataire());
                message.setSubject(notification.getSujet());
                message.setText(notification.getMessage());
                
                mailSender.send(message);
                logger.info("Email envoyé avec succès à {}", notification.getDestinataire());
            } catch (Exception e) {
                logger.error("Erreur lors de l'envoi de l'email: {}", e.getMessage());
                throw e;
            }
        } else {
            // Mode simulation si pas de configuration mail
            logger.info("[SIMULATION] Email envoyé à {} - Sujet: {} - Message: {}", 
                notification.getDestinataire(), 
                notification.getSujet(), 
                notification.getMessage());
        }
    }

    private void envoyerSMS(Notification notification) {
        // Mode simulation pour SMS
        logger.info("[SIMULATION] SMS envoyé à {} - Message: {}", 
            notification.getTelephone(), 
            notification.getMessage());
    }
}



