package com.apiece.airpnp.service;

import com.apiece.airpnp.domain.Stay;
import com.apiece.airpnp.domain.StayRepository;
import com.apiece.airpnp.dto.StayRequest;
import com.apiece.airpnp.dto.StayResponse;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

@Service
public class StayService {

    private final StayRepository stayRepository;

    public StayService(StayRepository stayRepository) {
        this.stayRepository = stayRepository;
    }

    public List<StayResponse> list() {
        return stayRepository.findAll().stream().map(StayResponse::from).toList();
    }

    public Optional<StayResponse> get(Long id) {
        return stayRepository.findById(id).map(StayResponse::from);
    }

    public StayResponse create(StayRequest request) {
        Stay stay = new Stay(
            request.title(),
            request.address(),
            request.pricePerNight()
        );
        Stay saved = stayRepository.save(stay);
        return StayResponse.from(saved);
    }

}
