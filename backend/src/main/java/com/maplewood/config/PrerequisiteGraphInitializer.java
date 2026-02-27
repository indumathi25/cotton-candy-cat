package com.maplewood.config;

import com.maplewood.repository.CourseRepository;
import com.maplewood.util.PrerequisiteGraph;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

/**
 * Initializes the PrerequisiteGraph once after the application (and data
 * seeding) is fully ready. This avoids rebuilding the graph on every enrollment
 * request.
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class PrerequisiteGraphInitializer {

    private final CourseRepository courseRepository;
    private final PrerequisiteGraph prerequisiteGraph;

    @EventListener(ApplicationReadyEvent.class)
    public void initializeGraph() {
        log.info("Application ready. Building prerequisite graph from all courses...");
        prerequisiteGraph.buildGraph(courseRepository.findAll());
        log.info("Prerequisite graph initialized and cached for enrollment validation.");
    }
}
