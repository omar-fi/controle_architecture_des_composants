package com.smartparking.parking.repository;

import com.smartparking.parking.model.ParkingSpot;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.data.rest.core.annotation.RestResource;

import java.util.List;
import java.util.Optional;

@RepositoryRestResource(collectionResourceRel = "parkingSpots", path = "parking-spots")
public interface ParkingSpotRepository extends JpaRepository<ParkingSpot, Long> {
    
    @RestResource(path = "disponibles", rel = "disponibles")
    List<ParkingSpot> findByStatut(ParkingSpot.StatutPlace statut);
    
    Optional<ParkingSpot> findByNumeroPlace(String numeroPlace);
    
    List<ParkingSpot> findByEmplacement(String emplacement);

    @RestResource(path = "par-parking", rel = "par-parking")
    List<ParkingSpot> findByParkingId(Long parkingId);
}



