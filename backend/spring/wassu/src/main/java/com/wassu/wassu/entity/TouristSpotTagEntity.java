package com.wassu.wassu.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class TouristSpotTagEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 20)
    private String tag;

    @ManyToOne
    @JoinColumn(name="spot_id", nullable=false)
    private TouristSpotEntity touristSpot;
}
