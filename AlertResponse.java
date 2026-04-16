package com.srilanka.floodwarning.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class AlertResponse {

    private String riskLevel;
    private String instructions;
    private String nearestZone;
    private Double currentWaterLevel;
}