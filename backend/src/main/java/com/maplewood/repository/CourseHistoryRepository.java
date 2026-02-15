package com.maplewood.repository;

import com.maplewood.model.CourseHistory;
import com.maplewood.model.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CourseHistoryRepository extends JpaRepository<CourseHistory, Long> {
    List<CourseHistory> findByStudent(Student student);

    List<CourseHistory> findByStudentAndStatus(Student student, String status);
}
