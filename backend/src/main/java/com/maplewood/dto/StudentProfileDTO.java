package com.maplewood.dto;

public record StudentProfileDTO(
        Long id,
        String fullName,
        Integer gradeLevel,
        Double gpa,
        Integer creditsEarned,
        Integer creditsToGraduate,
        Integer remainingCredits,
        Double progressPercentage) {
}
