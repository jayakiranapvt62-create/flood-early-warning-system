package com.srilanka.floodwarning.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@Entity
@Table(name = "alert_zones")
public class AlertZone {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "zone_name", nullable = false, length = 150)
    private String zoneName;

    @Column(nullable = false, length = 100)
    private String district;

    @Column(name = "risk_level", nullable = false, length = 20)
    private String riskLevel;

    @Column(name = "radius_km")
    private Double radiusKm;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();
}