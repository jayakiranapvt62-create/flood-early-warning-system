package com.srilanka.floodwarning.repository;

import com.srilanka.floodwarning.entity.AlertZone;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface AlertZoneRepository extends JpaRepository<AlertZone, Long> {

    @Query(value = """
        SELECT *
        FROM alert_zones az
        WHERE ST_Distance_Sphere(
            az.center_point,
            ST_GeomFromText(CONCAT('POINT(', :longitude, ' ', :latitude, ')'), 4326)
        ) <= 5000
        """, nativeQuery = true)
    List<AlertZone> findZonesWithin5Km(@Param("latitude") double latitude,
                                       @Param("longitude") double longitude);
}