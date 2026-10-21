package com.apiece.airpnp.web;

import com.apiece.airpnp.domain.Stay;
import com.apiece.airpnp.domain.StayRepository;

import java.net.URI;
import java.util.List;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

@RestController
public class StayController {

    private final StayRepository stayRepository;

    public StayController(StayRepository stayRepository) {
        this.stayRepository = stayRepository;
    }

    @GetMapping("/api/stays")
    public List<StayResponse> list() {
        return stayRepository.findAll().stream().map(StayResponse::from).toList();
    }

    @GetMapping("/api/stays/{id}")
    public StayResponse get(
        @PathVariable Long id
    ) {
        return stayRepository.findById(id)
            .map(StayResponse::from)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
    }

    @PostMapping("/api/stays")
    public ResponseEntity<StayResponse> create(
        @Valid @RequestBody StayRequest request
    ) {
        Stay stay = new Stay(
            request.title(),
            request.address(),
            request.pricePerNight()
        );
        Stay saved = stayRepository.save(stay);
        return ResponseEntity.created(URI.create("/api/stays/" + saved.getId()))
            .body(StayResponse.from(saved));
    }

}
