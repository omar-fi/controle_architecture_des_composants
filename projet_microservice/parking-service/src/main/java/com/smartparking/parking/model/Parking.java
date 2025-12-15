package com.smartparking.parking.model;

import jakarta.persistence.*;
import lombok.Data;
import java.util.List;

@Entity
@Data
public class Parking {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nom;
    private String adresse;
    private Integer capacite;

    @OneToMany(mappedBy = "parking")
    private List<ParkingSpot> places;
}
