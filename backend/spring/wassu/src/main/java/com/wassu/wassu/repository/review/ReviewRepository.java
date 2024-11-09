package com.wassu.wassu.repository.review;

import com.wassu.wassu.entity.review.ReviewEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;

public interface ReviewRepository extends JpaRepository<ReviewEntity, Long> {

    @Query("select re from ReviewEntity re " +
            "join fetch re.user u " +
            "join fetch re.images i " +
            "where re.id = :id")
    Optional<ReviewEntity> findByIdWithJoin(Long id);

}
