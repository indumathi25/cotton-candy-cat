package com.maplewood.service.impl;

import com.maplewood.dto.AdminStatsDTO;
import com.maplewood.repository.*;
import com.maplewood.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AdminServiceImpl implements AdminService {

    private final StudentRepository studentRepository;
    private final CourseRepository courseRepository;
    private final TeacherRepository teacherRepository;
    private final ClassroomRepository classroomRepository;
    private final SpecializationRepository specializationRepository;
    private final com.maplewood.mapper.AdminMapper adminMapper;

    @Override
    @Transactional(readOnly = true)
    public AdminStatsDTO getAdminStats() {
        long totalStudents = studentRepository.count();
        long totalCourses = courseRepository.count();
        long totalTeachers = teacherRepository.count();
        long totalClassrooms = classroomRepository.count();
        long specializationsCount = specializationRepository.count();

        // Count core and elective courses
        long coreCoursesCount = courseRepository.countByCourseType("core");
        long electiveCoursesCount = courseRepository.countByCourseType("elective");

        // Calculate students per grade (assuming 4 grades: 9-12)
        int studentsPerGrade = totalStudents > 0 ? (int) (totalStudents / 4) : 0;

        return adminMapper.toStatsDTO(
                (int) totalStudents,
                (int) totalCourses,
                (int) totalTeachers,
                (int) totalClassrooms,
                studentsPerGrade,
                (int) coreCoursesCount,
                (int) electiveCoursesCount,
                (int) specializationsCount);
    }
}
