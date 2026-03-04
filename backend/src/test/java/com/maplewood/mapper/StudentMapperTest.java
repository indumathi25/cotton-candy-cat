package com.maplewood.mapper;

import com.maplewood.dto.StudentProfileDTO;
import com.maplewood.model.Course;
import com.maplewood.model.CourseHistory;
import com.maplewood.model.Student;
import com.maplewood.util.AcademicCalculator;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.mapstruct.factory.Mappers;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.Collections;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.ArgumentMatchers.anyList;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class StudentMapperTest {

    @Mock
    private AcademicCalculator academicCalculator;

    private StudentMapper studentMapper;

    @BeforeEach
    void setUp() {
        studentMapper = Mappers.getMapper(StudentMapper.class);
        ReflectionTestUtils.setField(studentMapper, "academicCalculator", academicCalculator);
    }

    @Test
    void testToProfileDTO() {
        // Arrange
        Student student = new Student();
        student.setId(1L);
        student.setFirstName("John");
        student.setLastName("Doe");
        student.setGradeLevel(12);

        Course course = new Course();
        course.setCredits(3);

        CourseHistory history = new CourseHistory();
        history.setCourse(course);
        List<CourseHistory> passedCourses = Collections.singletonList(history);

        int creditsToGraduate = 120;
        double gpa = 3.5;

        when(academicCalculator.calculateCreditsEarned(anyList())).thenReturn(3);
        when(academicCalculator.calculateRemainingCredits(anyInt(), anyInt())).thenReturn(117);
        when(academicCalculator.calculateProgress(anyInt(), anyInt())).thenReturn(2.5);

        // Act
        StudentProfileDTO dto = studentMapper.toProfileDTO(student, passedCourses, creditsToGraduate, gpa);

        // Assert
        assertEquals(1L, dto.id());
        assertEquals("John Doe", dto.fullName());
        assertEquals(3, dto.creditsEarned());
        assertEquals(117, dto.remainingCredits());
        assertEquals(2.5, dto.progressPercentage());

        verify(academicCalculator).calculateCreditsEarned(passedCourses);
        verify(academicCalculator).calculateRemainingCredits(creditsToGraduate, 3);
        verify(academicCalculator).calculateProgress(creditsToGraduate, 3);
    }
}
