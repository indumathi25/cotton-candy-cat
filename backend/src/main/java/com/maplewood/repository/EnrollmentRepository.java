package com.maplewood.repository;

import com.maplewood.model.CourseSection;
import com.maplewood.model.Enrollment;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EnrollmentRepository extends JpaRepository<Enrollment, Long> {

        @EntityGraph(attributePaths = {
                        "courseSection",
                        "courseSection.course",
                        "courseSection.teacher",
                        "courseSection.semester",
                        "courseSection.timeSlot"
        })
        List<Enrollment> findByStudentIdAndCourseSection_SemesterId(
                        Long studentId,
                        Long semesterId);

        long countByCourseSection(CourseSection section);

        long countByStudentIdAndCourseSection_SemesterId(
                        Long studentId,
                        Long semesterId);

        boolean existsByStudentIdAndCourseSectionId(
                        Long studentId,
                        Long courseSectionId);

        @EntityGraph(attributePaths = {
                        "courseSection",
                        "courseSection.course",
                        "courseSection.teacher",
                        "courseSection.semester",
                        "courseSection.timeSlot"
        })
        List<Enrollment> findByStudentId(Long studentId);

        @Query("SELECT e.courseSection.id, COUNT(e) " +
                        "FROM Enrollment e " +
                        "WHERE e.courseSection.id IN :sectionIds " +
                        "GROUP BY e.courseSection.id")
        List<Object[]> countEnrollmentsBySectionIds(@Param("sectionIds") List<Long> sectionIds);
}
