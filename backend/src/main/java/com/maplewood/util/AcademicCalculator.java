package com.maplewood.util;

import com.maplewood.model.CourseHistory;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class AcademicCalculator {

    /**
     * Calculates the cumulative weighted GPA based on the student's course history.
     *
     * @param history the list of course history records for the student
     * @return the calculated GPA as a double, or 0.0 if no history is provided
     */
    public double calculateGPA(List<CourseHistory> history) {
        if (history == null || history.isEmpty()) {
            return 0.0;
        }

        double totalPoints = 0.0;
        double totalCredits = 0.0;

        for (CourseHistory record : history) {
            double points = resolveGradePoints(record);
            double credits = record.getCourse().getCredits();

            totalPoints += points * credits;
            totalCredits += credits;
        }

        return totalCredits == 0 ? 0.0 : totalPoints / totalCredits;
    }

    /**
     * Maps the grade in a course history record to point values (0.0 - 4.0).
     * If the letter grade is missing, it falls back to the status ("passed" = 4.0).
     *
     * @param record the course history record
     * @return the grade point value as a double
     */
    private double resolveGradePoints(CourseHistory record) {
        String grade = record.getGrade();

        if (grade == null || grade.isBlank()) {
            return "passed".equalsIgnoreCase(record.getStatus()) ? 4.0 : 0.0;
        }

        return switch (grade.toUpperCase()) {
            case "A" -> 4.0;
            case "B" -> 3.0;
            case "C" -> 2.0;
            case "D" -> 1.0;
            case "F" -> 0.0;
            default -> 4.0; // Assume success if unknown grade
        };
    }

    public int calculateCreditsEarned(List<CourseHistory> passedCourses) {
        return passedCourses == null
                ? 0
                : passedCourses.stream()
                        .mapToInt(ch -> ch.getCourse().getCredits())
                        .sum();
    }

    public int calculateRemainingCredits(int creditsToGraduate, int creditsEarned) {
        return Math.max(0, creditsToGraduate - creditsEarned);
    }

    public double calculateProgress(int creditsToGraduate, int creditsEarned) {
        return creditsToGraduate == 0
                ? 0.0
                : (creditsEarned * 100.0) / creditsToGraduate;
    }
}
