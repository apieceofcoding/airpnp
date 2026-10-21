package com.apiece.airpnp.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "stays")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Stay {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 80)
    private String title;

    @Column(nullable = false, length = 200)
    private String address;

    private String imageUrl;

    private int pricePerNight;

    public Stay(
        String title,
        String address,
        int pricePerNight
    ) {
        this.title = title.trim();
        this.address = address.trim();
        this.pricePerNight = pricePerNight;
        this.imageUrl = "/images/rooms/living.svg";
    }

}
