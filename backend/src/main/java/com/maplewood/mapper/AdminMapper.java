package com.maplewood.mapper;

import com.maplewood.dto.AdminStatsDTO;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface AdminMapper {

    AdminStatsDTO toStatsDTO(
            int totalStudents,
            int totalCourses,
            int totalTeachers,
            int totalClassrooms,
            int studentsPerGrade,
            int coreCoursesCount,
            int electiveCoursesCount,
            int specializationsCount);
}
