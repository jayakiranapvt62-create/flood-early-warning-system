package com.srilanka.floodwarning.service;

import com.srilanka.floodwarning.dto.AlertResponse;
import com.srilanka.floodwarning.entity.AlertZone;
import com.srilanka.floodwarning.repository.AlertZoneRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FloodAlertService {

    private final AlertZoneRepository alertZoneRepository;
    private final MockWaterLevelService mockWaterLevelService;

    public FloodAlertService(AlertZoneRepository alertZoneRepository,
                             MockWaterLevelService mockWaterLevelService) {
        this.alertZoneRepository = alertZoneRepository;
        this.mockWaterLevelService = mockWaterLevelService;
    }

    public AlertResponse checkRisk(double latitude, double longitude) {
        List<AlertZone> nearbyZones = alertZoneRepository.findZonesWithin5Km(latitude, longitude);
        double waterLevel = mockWaterLevelService.getMockWaterLevel();

        if (!nearbyZones.isEmpty()) {
            String riskLevel;
            String instructions;

            if (waterLevel >= 4.0) {
                riskLevel = "HIGH";
                instructions = "Move to higher ground immediately and follow official instructions.";
            } else if (waterLevel >= 2.5) {
                riskLevel = "MEDIUM";
                instructions = "Stay alert, prepare emergency supplies, and monitor updates.";
            } else {
                riskLevel = "LOW";
                instructions = "Remain cautious and keep monitoring local updates.";
            }

            return new AlertResponse(
                    riskLevel,
                    instructions,
                    nearbyZones.get(0).getZoneName(),
                    waterLevel
            );
        }

        return new AlertResponse(
                "LOW",
                "You are currently outside the 5km flood alert radius. Stay aware of changing conditions.",
                "None",
                waterLevel
        );
    }
}