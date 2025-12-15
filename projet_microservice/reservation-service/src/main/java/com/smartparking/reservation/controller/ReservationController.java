package com.smartparking.reservation.controller;

import com.smartparking.reservation.dto.ParkingSpotDTO;
import com.smartparking.reservation.model.Reservation;
import com.smartparking.reservation.service.ReservationService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/reservations")
public class ReservationController {

    private final ReservationService reservationService;

    @Autowired
    public ReservationController(ReservationService reservationService) {
        this.reservationService = reservationService;
    }

    @GetMapping
    public ResponseEntity<List<Reservation>> getAllReservations() {
        List<Reservation> reservations = reservationService.getAllReservations();
        return ResponseEntity.ok(reservations);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Reservation> getReservationById(@PathVariable Long id) {
        Optional<Reservation> reservation = reservationService.getReservationById(id);
        return reservation.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<?> createReservation(@Valid @RequestBody Reservation reservation) {
        try {
            Reservation createdReservation = reservationService.createReservation(reservation);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdReservation);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/{id}/annuler")
    public ResponseEntity<?> annulerReservation(@PathVariable Long id) {
        try {
            Reservation reservation = reservationService.annulerReservation(id);
            return ResponseEntity.ok(reservation);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/email/{email}")
    public ResponseEntity<List<Reservation>> getReservationsByEmail(@PathVariable String email) {
        List<Reservation> reservations = reservationService.getReservationsByEmail(email);
        return ResponseEntity.ok(reservations);
    }

    @GetMapping("/actives")
    public ResponseEntity<List<Reservation>> getReservationsActives() {
        List<Reservation> reservations = reservationService.getReservationsActives();
        return ResponseEntity.ok(reservations);
    }

    @GetMapping("/places-disponibles")
    public ResponseEntity<List<ParkingSpotDTO>> getPlacesDisponibles() {
        List<ParkingSpotDTO> places = reservationService.getPlacesDisponibles();
        return ResponseEntity.ok(places);
    }
}



