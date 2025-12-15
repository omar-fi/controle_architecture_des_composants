package com.smartparking.parking.repository;

import com.smartparking.parking.model.Parking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.Repository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

@RepositoryRestResource(path = "parkings")
public interface ParkingRepository extends Repository<Parking, Long> {
}
