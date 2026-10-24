package com.apiece.airpnp.domain;

import java.util.List;

import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class StayService {

    private final StayRepository stayRepository;

    public List<Stay> list() {
        return stayRepository.findAll();
    }

    public Stay create(
        String title,
        String address,
        int pricePerNight
    ) {
        Stay stay = new Stay(title, address, pricePerNight);
        return stayRepository.save(stay);
    }

}
