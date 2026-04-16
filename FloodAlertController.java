package com.srilanka.floodwarning.controller;

import com.srilanka.floodwarning.dto.AlertResponse;
import com.srilanka.floodwarning.dto.LocationRequest;
import com.srilanka.floodwarning.service.FloodAlertService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/flood-alert")
@CrossOrigin(origins = "*")
public class FloodAlertController {

    private final FloodAlertService floodAlertService;

    public FloodAlertController(FloodAlertService floodAlertService) {
        this.floodAlertService = floodAlertService;
    }

    @PostMapping("/check")
    public AlertResponse checkFloodRisk(@Valid @RequestBody LocationRequest request) {
        return floodAlertService.checkRisk(request.getLatitude(), request.getLongitude());
    }
    @GetMapping("/ping")
    public String ping() {
        return "pong";
    }
}
