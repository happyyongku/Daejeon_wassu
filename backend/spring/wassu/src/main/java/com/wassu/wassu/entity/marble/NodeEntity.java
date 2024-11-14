package com.wassu.wassu.entity.marble;

import com.wassu.wassu.entity.touristspot.TouristSpotEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter @Setter
public class NodeEntity {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private int nodeOrder; // 관광지 번수 (순서)

    @ManyToOne
    @JoinColumn(name = "board_entity_id")
    private MarbleEntity board;

    @ManyToOne
    @JoinColumn(name = "tourist_spot_entity_id")
    private TouristSpotEntity touristSpot;

}
