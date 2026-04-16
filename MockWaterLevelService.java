package com.srilanka.floodwarning.service;

import org.springframework.stereotype.Service;

import java.util.Random;

@Service
public class MockWaterLevelService {

    private final Random random = new Random();

    public double getMockWaterLevel() {
        return 1.5 + (4.5 - 1.5) * random.nextDouble();
    }
}