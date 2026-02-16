package com.maplewood.mapper;

import com.maplewood.dto.CourseSectionDto;
import com.maplewood.model.CourseSection;
import org.springframework.stereotype.Component;

@Component
public class CourseSectionMapper {

    public CourseSectionDto toDto(CourseSection section, Long enrolledCount) {
        if (section == null) {
            return null;
        }

        return CourseSectionDto.builder()
                .id(section.getId())
                .teacherName(section.getTeacher().getFirstName() + " " + section.getTeacher().getLastName())
                .dayOfWeek(section.getTimeSlot().getDayOfWeek())
                .startTime(section.getTimeSlot().getStartTime())
                .endTime(section.getTimeSlot().getEndTime())
                .classroomId(section.getClassroomId())
                .capacity(section.getCapacity())
                .enrolledCount(enrolledCount)
                .build();
    }
}
