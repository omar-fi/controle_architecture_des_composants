package com.smartparking.reservation.service;

import com.smartparking.reservation.client.ParkingServiceClient;
import com.smartparking.reservation.dto.ParkingSpotDTO;
import com.smartparking.reservation.model.Reservation;
import com.smartparking.reservation.repository.ReservationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class ReservationService {

    private final ReservationRepository reservationRepository;
    private final ParkingServiceClient parkingServiceClient;

    @Autowired
    public ReservationService(ReservationRepository reservationRepository, 
                             ParkingServiceClient parkingServiceClient) {
        this.reservationRepository = reservationRepository;
        this.parkingServiceClient = parkingServiceClient;
    }

    public List<Reservation> getAllReservations() {
        return reservationRepository.findAll();
    }

    public Optional<Reservation> getReservationById(Long id) {
        return reservationRepository.findById(id);
    }

    @Transactional
    public Reservation createReservation(Reservation reservation) {

        ParkingSpotDTO parkingSpot = parkingServiceClient.getPlaceById(reservation.getParkingSpotId());
        
        if (parkingSpot == null) {
            throw new RuntimeException("Place de parking non trouvée");
        }
        
        if (parkingSpot.getStatut() != ParkingSpotDTO.StatutPlace.DISPONIBLE) {
            throw new RuntimeException("La place de parking n'est pas disponible");
        }

        Reservation savedReservation = reservationRepository.save(reservation);


        parkingSpot.setStatut(ParkingSpotDTO.StatutPlace.RESERVEE);
        parkingServiceClient.updatePlace(reservation.getParkingSpotId(), parkingSpot);

        return savedReservation;
    }

    @Transactional
    public Reservation annulerReservation(Long id) {
        Reservation reservation = reservationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Réservation non trouvée avec l'id: " + id));
        
        reservation.setStatut(Reservation.StatutReservation.ANNULEE);
        

        ParkingSpotDTO parkingSpot = parkingServiceClient.getPlaceById(reservation.getParkingSpotId());
        if (parkingSpot != null) {
            parkingSpot.setStatut(ParkingSpotDTO.StatutPlace.DISPONIBLE);
            parkingServiceClient.updatePlace(reservation.getParkingSpotId(), parkingSpot);
        }
        
        return reservationRepository.save(reservation);
    }

    public List<Reservation> getReservationsByEmail(String email) {
        return reservationRepository.findByEmail(email);
    }

    public List<Reservation> getReservationsActives() {
        return reservationRepository.findByStatut(Reservation.StatutReservation.ACTIVE);
    }

    public List<ParkingSpotDTO> getPlacesDisponibles() {
        return parkingServiceClient.getPlacesDisponibles();
    }
}



