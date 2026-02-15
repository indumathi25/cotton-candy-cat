package com.maplewood.repository;

import com.maplewood.model.CourseHistory;
import com.maplewood.model.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CourseHistoryRepository extends JpaRepository<CourseHistory, Long> {
    @org.springframework.data.jpa.repository.Query("SELECT ch FROM CourseHistory ch JOIN FETCH ch.course WHERE ch.student = :student")
    List<CourseHistory> findByStudent(Student student);

    List<CourseHistory> findByStudentAndStatus(Student student, String status);

    boolean existsByStudentAndCourseIdAndStatus(Student student, Long courseId, String status);
}
