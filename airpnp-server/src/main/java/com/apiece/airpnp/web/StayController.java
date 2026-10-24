package com.apiece.airpnp.web;

import com.apiece.airpnp.dto.StayRequest;
import com.apiece.airpnp.dto.StayResponse;
import com.apiece.airpnp.service.StayService;

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

    private final StayService stayService;

    public StayController(StayService stayService) {
        this.stayService = stayService;
    }

    @GetMapping("/api/stays")
    public List<StayResponse> list() {
        return stayService.list();
    }

    @GetMapping("/api/stays/{id}")
    public StayResponse get(
        @PathVariable Long id
    ) {
        return stayService.get(id)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
    }

    @PostMapping("/api/stays")
    public ResponseEntity<StayResponse> create(
        @Valid @RequestBody StayRequest request
    ) {
        StayResponse response = stayService.create(request);
        return ResponseEntity.created(URI.create("/api/stays/" + response.id()))
            .body(response);
    }

}
