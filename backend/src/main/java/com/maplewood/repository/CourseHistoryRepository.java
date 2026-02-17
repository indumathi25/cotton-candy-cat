package com.maplewood.repository;

import com.maplewood.model.CourseHistory;
import com.maplewood.model.CourseStatus;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface CourseHistoryRepository extends JpaRepository<CourseHistory, Long> {

    @EntityGraph(attributePaths = "course")
    List<CourseHistory> findByStudentId(Long studentId);

    List<CourseHistory> findByStudentIdAndStatus(Long studentId, CourseStatus status);

    boolean existsByStudentIdAndCourseIdAndStatus(
            Long studentId,
            Long courseId,
            CourseStatus status);
}
