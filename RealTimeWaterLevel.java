package com.srilanka.floodwarning.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@Entity
@Table(name = "real_time_water_levels")
public class RealTimeWaterLevel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "station_name", nullable = false, length = 150)
    private String stationName;

    @Column(nullable = false, length = 100)
    private String district;

    @Column(name = "water_level_meters", nullable = false)
    private Double waterLevelMeters;

    @Column(name = "warning_threshold", nullable = false)
    private Double warningThreshold;

    @Column(name = "measured_at")
    private LocalDateTime measuredAt = LocalDateTime.now();

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "zone_id")
    private AlertZone zone;
}