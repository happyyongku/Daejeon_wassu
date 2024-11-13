package com.wassu.wassu.entity.marble;

import com.wassu.wassu.entity.UserEntity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Builder
@Getter @Setter
@AllArgsConstructor
@NoArgsConstructor
public class MarbleRoomEntity {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String inviteCode; // 초대 코드 -> 혼자면 없음
    private boolean single = false; // 혼자 or 같이 여부

    @ManyToOne
    @JoinColumn(name = "marble_entity_id")
    private MarbleEntity marble;

    // 유저 1
    @ManyToOne
    @JoinColumn(name = "creator_id")
    private UserEntity creator;

    private int creatorPosition = 0; // 유저1 말 위치
    private boolean creatorVerified = false; // 유저1 장소인증 여부
    private int creatorReroll = 1;
    private int creatorPass = 1;

    // 유저 2 -> 혼자면 없음
    @ManyToOne
    @JoinColumn(name = "guest_id")
    private UserEntity guest;

    private int guestPosition = 0; // 유저2 말 위치
    private boolean guestVerified = false; // 유저2 장소인증 여부
    private int guestReroll = 1;
    private int guestPass = 1;

}
