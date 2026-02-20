package com.maplewood.util;

import com.maplewood.model.Course;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.util.*;

/**
 * A data structure implementing a Directed Acyclic Graph (DAG) for course
 * prerequisites.
 * This class provides advanced academic planning capabilities like topological
 * sorting
 * and impact analysis.
 */
@Slf4j
@Component
public class PrerequisiteGraph {
    // Adjacency list: Course ID -> List of dependent Course IDs (courses that
    // require this one)
    private final Map<Long, List<Long>> adjList = new HashMap<>();

    // Reverse lookup: Course ID -> Prerequisite ID (what this course requires)
    private final Map<Long, Long> prerequisites = new HashMap<>();

    // Storage for course objects for quick retrieval
    private final Map<Long, Course> courseMap = new HashMap<>();

    /**
     * Initializes the graph from a list of courses.
     */
    public void buildGraph(List<Course> courses) {
        log.info("Building Prerequisite Graph from {} courses", courses.size());
        adjList.clear();
        prerequisites.clear();
        courseMap.clear();

        for (Course course : courses) {
            courseMap.put(course.getId(), course);
            if (course.getPrerequisiteId() != null) {
                log.debug("Course {} ({}) requires {}", course.getName(), course.getId(), course.getPrerequisiteId());
                prerequisites.put(course.getId(), course.getPrerequisiteId());
                // Build adjacency list (forward direction)
                adjList.computeIfAbsent(course.getPrerequisiteId(), k -> new ArrayList<>()).add(course.getId());
            }
        }
        log.info("Graph built. Edges: {}", prerequisites.size());
    }

    /**
     * Uses Topological Sort (Kahn's algorithm or DFS based) to find a valid
     * graduation path where every prerequisite is met before its dependent course.
     */
    public List<Course> getTopologicalSort() {
        List<Course> result = new ArrayList<>();
        Set<Long> visited = new HashSet<>();
        Set<Long> stack = new HashSet<>(); // Used for cycle detection

        for (Long courseId : courseMap.keySet()) {
            if (!visited.contains(courseId)) {
                if (dfsSort(courseId, visited, stack, result)) {
                    throw new IllegalStateException("Circular dependency detected in prerequisites!");
                }
            }
        }

        // Reverse because DFS adds nodes after visiting neighbors
        Collections.reverse(result);
        return result;
    }

    private boolean dfsSort(Long node, Set<Long> visited, Set<Long> stack, List<Course> result) {
        visited.add(node);
        stack.add(node);

        List<Long> dependents = adjList.getOrDefault(node, new ArrayList<>());
        for (Long neighbor : dependents) {
            if (!visited.contains(neighbor)) {
                if (dfsSort(neighbor, visited, stack, result))
                    return true;
            } else if (stack.contains(neighbor)) {
                return true; // Cycle detected
            }
        }

        stack.remove(node);
        result.add(courseMap.get(node));
        return false;
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
