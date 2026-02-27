package com.maplewood.repository;

import com.maplewood.model.CourseHistory;
import com.maplewood.model.CourseStatus;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface CourseHistoryRepository extends JpaRepository<CourseHistory, Long> {

    @EntityGraph(attributePaths = "course")
    List<CourseHistory> findByStudentId(Long studentId);

    List<CourseHistory> findByStudentIdAndStatus(Long studentId, CourseStatus status);

    @Query("SELECT ch.course.id FROM CourseHistory ch WHERE ch.student.id = :studentId AND ch.status = :status")
    List<Long> findPassedCourseIdsByStudentId(@Param("studentId") Long studentId, @Param("status") CourseStatus status);
}
