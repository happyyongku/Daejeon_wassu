package com.wassu.wassu.repository.marble;

import com.wassu.wassu.entity.marble.MarbleRoomEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;

public interface MarbleRoomRepository extends JpaRepository<MarbleRoomEntity, Long> {

    @Query("select mr from MarbleRoomEntity mr " +
            "join fetch mr.marble m " +
            "join fetch m.nodes n " +
            "join fetch n.touristSpot ts " +
            "join fetch mr.creator c " +
            "where mr.id=:roomId order by n.nodeOrder asc")
    Optional<MarbleRoomEntity> findSingleRoomDetails(Long roomId);

    @Query("select mr from MarbleRoomEntity mr " +
            "join fetch mr.marble m " +
            "join fetch m.nodes n " +
            "join fetch n.touristSpot ts " +
            "join fetch mr.creator c " +
            "join fetch mr.guest g " +
            "where mr.id=:roomId order by n.nodeOrder asc")
    Optional<MarbleRoomEntity> findMultiRoomDetails(Long roomId);

    @Query("select mr.single from MarbleRoomEntity mr where mr.id=:roomId")
    boolean isSingleRoom(Long roomId);

}
