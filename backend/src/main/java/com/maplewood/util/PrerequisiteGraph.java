package com.maplewood.util;

import com.maplewood.model.Course;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import java.util.*;

/**
 * A data structure implementing a Directed Acyclic Graph (DAG) for course
 * prerequisites.
 */
@Slf4j
@Component
public class PrerequisiteGraph {
    private final Map<Long, List<Long>> adjList = new HashMap<>();

    private final Map<Long, Integer> indegree = new HashMap<>();

    private final Map<Long, Course> courseMap = new HashMap<>();

    private final Map<Long, Long> prerequisites = new HashMap<>();

    private final Map<Long, List<Course>> deepPrerequisitesCache = new HashMap<>();

    public void buildGraph(List<Course> courses) {
        log.info("Building Prerequisite Graph from {} courses", courses.size());
        adjList.clear();
        indegree.clear();
        courseMap.clear();
        prerequisites.clear();
        deepPrerequisitesCache.clear();

        // 1. Initialize courseMap and indegree (all courses start with 0)
        for (Course course : courses) {
            courseMap.put(course.getId(), course);
            indegree.put(course.getId(), 0);
        }

        // 2. Build adjacency list and calculate indegrees
        for (Course course : courses) {
            if (course.getPrerequisiteId() != null) {
                Long prereqId = course.getPrerequisiteId();
                Long courseId = course.getId();

                log.debug("Course {} ({}) requires {}", course.getName(), courseId, prereqId);

                // prereq -> course (forward edge)
                adjList.computeIfAbsent(prereqId, k -> new ArrayList<>()).add(courseId);

                // course has one more prerequisite
                indegree.put(courseId, indegree.get(courseId) + 1);

                // Keep for deepPrerequisites lookup
                prerequisites.put(courseId, prereqId);
            }
        }

        // 3. ✅ Pre-compute deep prerequisites for every course with prerequisites
        for (Course course : courses) {
            if (course.getPrerequisiteId() != null) {
                deepPrerequisitesCache.put(course.getId(), computeDeepPrerequisites(course.getId()));
            }
        }
        log.info("Graph built. Edges: {}. Deep prerequisite cache populated for {} courses.",
                prerequisites.size(), deepPrerequisitesCache.size());

        // Log the full cache as a single summary
        String cacheSummary = deepPrerequisitesCache.entrySet().stream()
                .map(e -> {
                    String name = courseMap.containsKey(e.getKey()) ? courseMap.get(e.getKey()).getName()
                            : "ID:" + e.getKey();
                    List<Course> chain = e.getValue();
                    String chainNames = chain.stream().map(Course::getName)
                            .collect(java.util.stream.Collectors.joining(" → "));

                    // Demonstration of SequencedCollection methods (Java 25)
                    String first = chain.isEmpty() ? "None" : chain.getFirst().getName();
                    return name + " (Primary Prereq: " + first + ") [" + chainNames + "]";
                })
                .collect(java.util.stream.Collectors.joining(", "));
        log.info("Prerequisite cache: {}", cacheSummary);
    }

    /**
     * Internal traversal called once at startup per course.
     * If a cycle is detected, logs a warning and returns the prerequisites found so
     * far rather than crashing the application.
     */
    private List<Course> computeDeepPrerequisites(Long courseId) {
        List<Course> allPrereqs = new ArrayList<>();
        Set<Long> visited = new HashSet<>();
        Long currentPrereqId = prerequisites.get(courseId);

        while (currentPrereqId != null) {
            if (visited.contains(currentPrereqId)) {
                log.warn("Circular prerequisite chain detected for course ID {}. Skipping cycle at ID: {}. " +
                        "This course will be blocked from enrollment.", courseId, currentPrereqId);
                break; // stop traversal instead of crashing
            }
            visited.add(currentPrereqId);
            Course prereq = courseMap.get(currentPrereqId);
            if (prereq != null) {
                allPrereqs.add(prereq);
                currentPrereqId = prerequisites.get(currentPrereqId);
            } else {
                break;
            }
        }
        return allPrereqs;
    }

    /**
     * Uses Kahn's algorithm to find a valid graduation path.
     * Detects cycles automatically if result size doesn't match total courses.
     */
    public List<Course> getTopologicalSort() {
        List<Course> result = new ArrayList<>();
        Queue<Long> queue = new LinkedList<>();

        // 1. Add all nodes with indegree 0 to the queue
        for (Map.Entry<Long, Integer> entry : indegree.entrySet()) {
            if (entry.getValue() == 0) {
                queue.add(entry.getKey());
            }
        }

        // 2. Process the queue
        while (!queue.isEmpty()) {
            Long current = queue.poll();
            result.add(courseMap.get(current));

            // Decrease indegree of neighbors
            List<Long> dependents = adjList.getOrDefault(current, new ArrayList<>());
            for (Long neighbor : dependents) {
                int newIndegree = indegree.get(neighbor) - 1;
                indegree.put(neighbor, newIndegree);

                if (newIndegree == 0) {
                    queue.add(neighbor);
                }
            }
        }

        // 3. Cycle detection
        if (result.size() != courseMap.size()) {
            log.error("Topological sort failed: result size ({}) != total courses ({})",
                    result.size(), courseMap.size());
            throw new IllegalStateException("Circular dependency detected in prerequisites!");
        }

        return result;
    }

    /**
     * Analyzes the "Downstream Impact".
     * If a student fails this courseId, it returns all future courses that will be
     * blocked.
     */
    public List<Course> getDownstreamImpact(Long courseId) {
        List<Course> impacted = new ArrayList<>();
        Queue<Long> queue = new LinkedList<>();

        // We start from the dependents of the failed course
        List<Long> initialDependents = adjList.getOrDefault(courseId, new ArrayList<>());
        queue.addAll(initialDependents);

        Set<Long> visited = new HashSet<>(initialDependents);

        while (!queue.isEmpty()) {
            Long current = queue.poll();
            impacted.add(courseMap.get(current));

            // Any courses that depend on THIS blocked course are also blocked (Transitive
            // property)
            for (Long dep : adjList.getOrDefault(current, new ArrayList<>())) {
                if (!visited.contains(dep)) {
                    visited.add(dep);
                    queue.add(dep);
                }
            }
        }
        return impacted;
    }

    /**
     * ✅ O(1) cache lookup — returns the pre-computed deep prerequisites for a
     * course.
     * The traversal is done once at startup by buildGraph().
     */
    public List<Course> getDeepPrerequisites(Long courseId) {
        return deepPrerequisitesCache.getOrDefault(courseId, Collections.emptyList());
    }
}
