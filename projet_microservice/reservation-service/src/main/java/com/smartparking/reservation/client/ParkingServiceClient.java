package com.smartparking.reservation.client;

import com.smartparking.reservation.dto.ParkingSpotDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.List;

@FeignClient(name = "parking-service", path = "/api")
public interface ParkingServiceClient {

    @GetMapping("/parking-spots/search/disponibles?statut=DISPONIBLE")
    List<ParkingSpotDTO> getPlacesDisponibles();

    @GetMapping("/parking-spots/{id}")
    ParkingSpotDTO getPlaceById(@PathVariable Long id);

    @PutMapping("/parking-spots/{id}")
    ParkingSpotDTO updatePlace(@PathVariable Long id, @RequestBody ParkingSpotDTO parkingSpot);
}



