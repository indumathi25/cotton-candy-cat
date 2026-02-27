package com.maplewood.repository;

import com.maplewood.model.Course;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CourseRepository extends JpaRepository<Course, Long> {

        List<Course> findByGradeLevelMinLessThanEqualAndGradeLevelMaxGreaterThanEqual(
                        int grade1, int grade2);

        Page<Course> findByGradeLevelMinLessThanEqualAndGradeLevelMaxGreaterThanEqual(
                        int grade1, int grade2, Pageable pageable);

        @Query("SELECT c FROM Course c WHERE " +
                        "(:grade IS NULL OR (c.gradeLevelMin <= :grade AND c.gradeLevelMax >= :grade)) AND " +
                        "(:search IS NULL OR LOWER(c.name) LIKE :search OR LOWER(c.code) LIKE :search)")
        Page<Course> findByFilters(@Param("grade") Integer grade, @Param("search") String search, Pageable pageable);

        long countByCourseType(String courseType);
}