package com.srilanka.floodwarning.service;

import org.springframework.stereotype.Service;

@Service
public class ChatService {

    public String reply(String input) {
        String m = input.toLowerCase();

        if (m.contains("evacuate") || m.contains("high risk")) {
            return "If your area is HIGH risk, move to higher ground, avoid flooded roads, and follow local authorities immediately.";
        }
        if (m.contains("prepare") || m.contains("emergency kit")) {
            return "Keep drinking water, dry food, medicines, flashlight, power bank, and important documents in a waterproof bag.";
        }
        if (m.contains("colombo") || m.contains("kelani")) {
            return "Kelani basin areas can flood quickly during heavy rainfall. Monitor alerts every 30 minutes in severe weather.";
        }
        return "I can help with flood safety, preparedness, and interpreting risk levels. Ask about evacuation, kits, or district risk.";
    }
}