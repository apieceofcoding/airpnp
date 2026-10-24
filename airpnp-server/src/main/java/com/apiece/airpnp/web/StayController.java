package com.apiece.airpnp.web;

import com.apiece.airpnp.domain.Stay;
import com.apiece.airpnp.domain.StayService;

import lombok.RequiredArgsConstructor;

import java.net.URI;
import java.util.List;

import jakarta.validation.Valid;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class StayController {

    private final StayService stayService;

    @GetMapping("/api/stays")
    public List<StayResponse> list() {
        return stayService.list().stream().map(StayResponse::from).toList();
    }

    @PostMapping("/api/stays")
    public ResponseEntity<StayResponse> create(
        @Valid @RequestBody StayRequest request
    ) {
        Stay saved = stayService.create(
            request.title(),
            request.address(),
            request.pricePerNight()
        );
        return ResponseEntity.created(URI.create("/api/stays/" + saved.getId()))
            .body(StayResponse.from(saved));
    }

}
