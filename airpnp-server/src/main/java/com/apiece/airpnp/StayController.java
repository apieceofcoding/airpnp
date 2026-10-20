package com.apiece.airpnp;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

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

    @PostMapping("/api/stays/preview")
    public StayPreview preview(
        @RequestBody StayPreview preview
    ) {
        return preview;
    }

}
