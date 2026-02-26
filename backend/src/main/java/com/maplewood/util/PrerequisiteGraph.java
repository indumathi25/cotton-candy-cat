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
    // Adjacency list: Course ID -> List of dependent Course IDs
    private final Map<Long, List<Long>> adjList = new HashMap<>();

    // Indegree: Course ID -> Number of prerequisites
    private final Map<Long, Integer> indegree = new HashMap<>();

    // Storage for course objects for quick retrieval
    private final Map<Long, Course> courseMap = new HashMap<>();

    // Reverse lookup: Course ID -> Prerequisite ID
    private final Map<Long, Long> prerequisites = new HashMap<>();

    /**
     * Initializes the graph from a list of courses.
     */
    public void buildGraph(List<Course> courses) {
        log.info("Building Prerequisite Graph from {} courses", courses.size());
        adjList.clear();
        indegree.clear();
        courseMap.clear();
        prerequisites.clear();

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
        log.info("Graph built. Edges: {}", prerequisites.size());
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
     * Returns all prerequisites for a specific course, including transitively.
     * E.g. If C requires B and B requires A, getDeepPrerequisites(C) returns [B,
     * A].
     */
    public List<Course> getDeepPrerequisites(Long courseId) {
        log.info("Resolving deep prerequisites for Course ID: {}", courseId);
        List<Course> allPrereqs = new ArrayList<>();
        Long currentPrereqId = prerequisites.get(courseId);

        while (currentPrereqId != null) {
            Course prereq = courseMap.get(currentPrereqId);
            if (prereq != null) {
                log.info("  -> Found prerequisite: {} (ID: {})", prereq.getName(), prereq.getId());
                allPrereqs.add(prereq);
                currentPrereqId = prerequisites.get(currentPrereqId);
            } else {
                log.warn("  -> Prerequisite ID {} found in map but missing from courseMap!", currentPrereqId);
                break;
            }
        }
        log.info("Total prerequisites found for Course {}: {}", courseId, allPrereqs.size());
        return allPrereqs;
    }
}
