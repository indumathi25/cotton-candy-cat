package com.maplewood.repository;

import com.maplewood.model.Course;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CourseRepository extends JpaRepository<Course, Long> {

    List<Course> findByGradeLevelMinLessThanEqualAndGradeLevelMaxGreaterThanEqual(
            int grade1, int grade2);

    Page<Course> findByGradeLevelMinLessThanEqualAndGradeLevelMaxGreaterThanEqual(
            int grade1, int grade2, Pageable pageable);
}