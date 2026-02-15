package com.maplewood.repository;

import com.maplewood.model.CourseSection;
import com.maplewood.model.Enrollment;
import com.maplewood.model.Semester;
import com.maplewood.model.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EnrollmentRepository extends JpaRepository<Enrollment, Long> {
    @Query("SELECT e FROM Enrollment e " +
            "JOIN FETCH e.courseSection cs " +
            "JOIN FETCH cs.course c " +
            "JOIN FETCH cs.teacher t " +
            "JOIN FETCH cs.timeSlot ts " +
            "WHERE e.student = :student AND cs.semester = :semester")
    List<Enrollment> findByStudentAndSemester(Student student, Semester semester);

    long countByCourseSection(CourseSection section);

    @Query("SELECT COUNT(e) FROM Enrollment e WHERE e.student = :student AND e.courseSection.semester = :semester")
    long countByStudentAndSemester(Student student, Semester semester);

    boolean existsByStudentAndCourseSection(Student student, CourseSection courseSection);
}
