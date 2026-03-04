package com.maplewood.config;

import com.maplewood.model.*;
import com.maplewood.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Configuration;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Configuration
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

        private final StudentRepository studentRepository;
        private final CourseRepository courseRepository;
        private final SemesterRepository semesterRepository;
        private final TeacherRepository teacherRepository;
        private final ClassroomRepository classroomRepository;
        private final TimeSlotRepository timeSlotRepository;
        private final CourseSectionRepository courseSectionRepository;
        private final SpecializationRepository specializationRepository;
        private final CourseHistoryRepository courseHistoryRepository;
        private final EnrollmentRepository enrollmentRepository;

        private final Random random = new Random();

        private static final List<String> FIRST_NAMES = List.of(
                        "James", "Mary", "John", "Patricia", "Robert", "Jennifer", "Michael", "Linda",
                        "William", "Elizabeth", "David", "Barbara", "Richard", "Susan", "Joseph", "Jessica",
                        "Thomas", "Sarah", "Christopher", "Karen", "Charles", "Nancy", "Daniel", "Lisa",
                        "Matthew", "Betty", "Anthony", "Helen", "Mark", "Sandra", "Donald", "Donna",
                        "Steven", "Carol", "Paul", "Ruth", "Andrew", "Sharon", "Joshua", "Michelle",
                        "Kenneth", "Laura", "Kevin", "Brian", "Kimberly", "George", "Deborah",
                        "Edward", "Dorothy", "Ronald", "Timothy", "Jason", "Jeffrey", "Ryan", "Jacob",
                        "Gary", "Nicholas", "Eric", "Jonathan", "Stephen");

        private static final List<String> LAST_NAMES = List.of(
                        "Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis",
                        "Rodriguez", "Martinez", "Hernandez", "Lopez", "Gonzalez", "Wilson", "Anderson", "Thomas",
                        "Taylor", "Moore", "Jackson", "Martin", "Lee", "Perez", "Thompson", "White",
                        "Harris", "Sanchez", "Clark", "Ramirez", "Lewis", "Robinson", "Walker", "Young",
                        "Allen", "King", "Wright", "Scott", "Torres", "Nguyen", "Hill", "Flores",
                        "Green", "Adams", "Nelson", "Baker", "Hall", "Rivera", "Campbell", "Mitchell",
                        "Carter", "Roberts", "Gomez", "Phillips", "Evans", "Turner", "Diaz", "Parker",
                        "Cruz", "Edwards", "Collins", "Reyes", "Stewart", "Morris", "Morales", "Murphy",
                        "Cook", "Rogers", "Gutierrez", "Ortiz", "Morgan", "Cooper", "Peterson", "Bailey");

        @Override
        @Transactional
        public void run(String... args) {
                if (studentRepository.count() > 0) {
                        log.info("Database already seeded. Skipping initialization.");
                        return;
                }

                log.info("Seeding database with full realistic sample data (Strict Sync & Visibility)...");

                Map<Integer, Specialization> specs = populateSpecializations();
                Map<Integer, List<Classroom>> roomsByType = populateClassrooms();
                List<Teacher> teachers = populateTeachers(specs);
                List<TimeSlot> timeSlots = populateTimeSlots();
                List<Semester> semesters = populateSemesters();
                List<Course> courses = populateCourses(specs);
                populateStudentsAndHistory(courses, semesters);
                List<CourseSection> sections = populateSections(courses, teachers, roomsByType, semesters, timeSlots);
                populateEnrollments(sections);

                log.info("Database seeding completed successfully.");
        }

        private Map<Integer, Specialization> populateSpecializations() {
                List<Object[]> specData = List.of(
                                new Object[] { "Mathematics", 1, "Math and related quantitative subjects" },
                                new Object[] { "English", 1, "English language arts and literature" },
                                new Object[] { "Science", 2, "Biology, chemistry, physics, earth science" },
                                new Object[] { "Social Studies", 1, "History, government, economics, geography" },
                                new Object[] { "Arts", 3, "Visual arts, drawing, painting, sculpture" },
                                new Object[] { "Music", 6, "Band, choir, music theory, individual instruments" },
                                new Object[] { "Physical Education", 4, "Physical fitness, sports, health education" },
                                new Object[] { "Computer Science", 5,
                                                "Programming, web development, digital literacy" },
                                new Object[] { "Foreign Language", 1, "Spanish, French, German language instruction" });

                Map<Integer, Specialization> result = new HashMap<>();
                for (int i = 0; i < specData.size(); i++) {
                        Object[] data = specData.get(i);
                        Specialization s = new Specialization(null, (String) data[0], (Integer) data[1],
                                        (String) data[2]);
                        s = specializationRepository.save(s);
                        result.put(i + 1, s);
                }
                return result;
        }

        private Map<Integer, List<Classroom>> populateClassrooms() {
                List<Classroom> allRooms = new ArrayList<>();
                // 30 standard
                for (int i = 1; i <= 30; i++)
                        allRooms.add(
                                        new Classroom(null, "Room-" + (100 + i), 1, 10, "Whiteboard, projector",
                                                        random.nextInt(3) + 1));
                // 10 labs
                for (int i = 1; i <= 10; i++)
                        allRooms.add(new Classroom(null, "Lab-" + i, 2, 10, "Lab equipment", random.nextInt(2) + 1));
                // 6 art
                for (int i = 1; i <= 6; i++)
                        allRooms.add(new Classroom(null, "Art-" + i, 3, 10, "Easels, supplies", random.nextInt(2) + 1));
                // 3 gyms
                for (int i = 1; i <= 3; i++)
                        allRooms.add(new Classroom(null, "Gym-" + i, 4, 10, "Sports equipment", 1));
                // 6 computer
                for (int i = 1; i <= 6; i++)
                        allRooms.add(new Classroom(null, "CompLab-" + i, 5, 10, "Computers", random.nextInt(2) + 2));
                // 5 music
                for (int i = 1; i <= 5; i++)
                        allRooms.add(new Classroom(null, "Music-" + i, 6, 10, "Instruments", random.nextInt(2) + 1));

                classroomRepository.saveAll(allRooms);
                return allRooms.stream().collect(Collectors.groupingBy(Classroom::getRoomTypeId));
        }

        private List<Teacher> populateTeachers(Map<Integer, Specialization> specs) {
                Map<Integer, Integer> specCounts = Map.of(1, 8, 2, 8, 3, 10, 4, 6, 5, 4, 6, 4, 7, 4, 8, 3, 9, 3);
                List<Teacher> teachers = new ArrayList<>();
                Set<String> used = new HashSet<>();
                for (int specId = 1; specId <= 9; specId++) {
                        Specialization s = specs.get(specId);
                        int count = specCounts.get(specId);
                        for (int i = 0; i < count; i++) {
                                String first, last;
                                do {
                                        first = FIRST_NAMES.get(random.nextInt(FIRST_NAMES.size()));
                                        last = LAST_NAMES.get(random.nextInt(LAST_NAMES.size()));
                                } while (!used.add(first + " " + last));
                                teachers.add(new Teacher(null, first, last, s.getId().intValue(),
                                                first.toLowerCase() + "." + last.toLowerCase() + "@maplewood.edu", 4,
                                                LocalDateTime.now()));
                        }
                }
                return teacherRepository.saveAll(teachers);
        }

        private List<TimeSlot> populateTimeSlots() {
                List<TimeSlot> slots = new ArrayList<>();
                List<String[]> mwf = List.of(new String[] { "08:00", "09:00" }, new String[] { "09:00", "10:00" },
                                new String[] { "10:00", "11:00" }, new String[] { "11:00", "12:00" },
                                new String[] { "13:00", "14:00" },
                                new String[] { "14:00", "15:00" });
                for (String[] t : mwf) {
                        for (String d : List.of("Monday", "Wednesday", "Friday")) {
                                slots.add(new TimeSlot(null, d, t[0], t[1]));
                        }
                }
                List<String[]> tth = List.of(new String[] { "08:00", "09:30" }, new String[] { "09:30", "11:00" },
                                new String[] { "12:30", "14:00" }, new String[] { "14:00", "15:30" });
                for (String[] t : tth) {
                        for (String d : List.of("Tuesday", "Thursday")) {
                                slots.add(new TimeSlot(null, d, t[0], t[1]));
                        }
                }
                return timeSlotRepository.saveAll(slots);
        }

        private List<Semester> populateSemesters() {
                List<Semester> list = new ArrayList<>();
                list.add(new Semester(null, "Fall", 2021, 1, "2021-08-20", "2021-12-15", false, LocalDateTime.now()));
                list.add(new Semester(null, "Spring", 2021, 2, "2022-01-15", "2022-05-15", false, LocalDateTime.now()));
                list.add(new Semester(null, "Fall", 2022, 1, "2022-08-20", "2022-12-15", false, LocalDateTime.now()));
                list.add(new Semester(null, "Spring", 2022, 2, "2023-01-15", "2023-05-15", false, LocalDateTime.now()));
                list.add(new Semester(null, "Fall", 2023, 1, "2023-08-20", "2023-12-15", false, LocalDateTime.now()));
                list.add(new Semester(null, "Spring", 2023, 2, "2024-01-15", "2024-05-15", false, LocalDateTime.now()));
                list.add(new Semester(null, "Fall", 2024, 1, "2024-08-20", "2024-12-15", true, LocalDateTime.now()));
                list.add(new Semester(null, "Spring", 2024, 2, "2025-01-15", "2025-05-15", false, LocalDateTime.now()));
                list.add(new Semester(null, "Fall", 2025, 1, "2025-08-20", "2025-12-15", false, LocalDateTime.now()));
                return semesterRepository.saveAll(list);
        }

        private List<Course> populateCourses(Map<Integer, Specialization> specs) {
                List<Course> list = new ArrayList<>();

                // English (8)
                list.add(new Course(null, "ENG101", "English I: Foundations", specs.get(2).getId().intValue(), null, 1,
                                5, 1, 9,
                                9, "core", "Basic writing and literature", LocalDateTime.now()));
                list.add(new Course(null, "ENG102", "English I: Composition", specs.get(2).getId().intValue(), null, 1,
                                5, 2, 9,
                                9, "core", "Advanced writing and grammar", LocalDateTime.now()));
                list.add(new Course(null, "ENG201", "English II: Literature", specs.get(2).getId().intValue(), null, 1,
                                5, 1,
                                10, 10, "core", "World literature and analysis", LocalDateTime.now()));
                list.add(new Course(null, "ENG202", "English II: Rhetoric", specs.get(2).getId().intValue(), null, 1, 5,
                                2, 10,
                                10, "core", "Advanced composition and speech", LocalDateTime.now()));
                list.add(new Course(null, "ENG301", "English III: American Literature", specs.get(2).getId().intValue(),
                                null,
                                1, 5, 1, 11, 11, "core", "American literary traditions", LocalDateTime.now()));
                list.add(new Course(null, "ENG302", "English III: Research Writing", specs.get(2).getId().intValue(),
                                null, 1,
                                5, 2, 11, 11, "core", "Research methods and academic writing", LocalDateTime.now()));
                list.add(new Course(null, "ENG401", "English IV: British Literature", specs.get(2).getId().intValue(),
                                null, 1,
                                5, 1, 12, 12, "core", "British literary canon", LocalDateTime.now()));
                list.add(new Course(null, "ENG402", "English IV: Creative Writing", specs.get(2).getId().intValue(),
                                null, 1, 5,
                                2, 12, 12, "core", "Poetry, fiction, and drama writing", LocalDateTime.now()));

                // Math (5)
                list.add(new Course(null, "MAT101", "Algebra I", specs.get(1).getId().intValue(), null, 1, 6, 1, 9, 10,
                                "core",
                                "Basic algebraic concepts", LocalDateTime.now()));
                list.add(new Course(null, "MAT102", "Geometry", specs.get(1).getId().intValue(), null, 1, 6, 2, 9, 11,
                                "core",
                                "Geometric principles and proofs", LocalDateTime.now()));
                list.add(new Course(null, "MAT201", "Algebra II", specs.get(1).getId().intValue(), null, 1, 6, 1, 10,
                                12,
                                "core", "Advanced algebraic concepts", LocalDateTime.now()));
                list.add(new Course(null, "MAT202", "Pre-Calculus", specs.get(1).getId().intValue(), null, 1, 6, 2, 11,
                                12,
                                "core", "Functions and trigonometry", LocalDateTime.now()));
                list.add(new Course(null, "MAT301", "Calculus", specs.get(1).getId().intValue(), null, 1, 6, 1, 12, 12,
                                "core",
                                "Differential and integral calculus", LocalDateTime.now()));

                // Science (4)
                list.add(new Course(null, "SCI101", "Biology I", specs.get(3).getId().intValue(), null, 1, 6, 1, 9, 10,
                                "core",
                                "Introduction to life sciences", LocalDateTime.now()));
                list.add(new Course(null, "SCI102", "Earth Science", specs.get(3).getId().intValue(), null, 1, 6, 2, 9,
                                10,
                                "core", "Geology, weather, and astronomy", LocalDateTime.now()));
                list.add(new Course(null, "SCI201", "Chemistry I", specs.get(3).getId().intValue(), null, 1, 6, 1, 10,
                                12,
                                "core", "Basic chemical principles", LocalDateTime.now()));
                list.add(new Course(null, "SCI301", "Physics I", specs.get(3).getId().intValue(), null, 1, 6, 2, 11, 12,
                                "core",
                                "Mechanics and thermodynamics", LocalDateTime.now()));

                // Social Studies (3)
                list.add(new Course(null, "SOC101", "World History", specs.get(4).getId().intValue(), null, 1, 4, 1, 9,
                                10,
                                "core", "Ancient civilizations to modern era", LocalDateTime.now()));
                list.add(new Course(null, "SOC201", "Government", specs.get(4).getId().intValue(), null, 1, 4, 2, 11,
                                12,
                                "core", "American government and civics", LocalDateTime.now()));
                list.add(new Course(null, "SOC301", "Economics", specs.get(4).getId().intValue(), null, 1, 4, 1, 12, 12,
                                "core",
                                "Micro and macroeconomic principles", LocalDateTime.now()));

                // Art Electives (6)
                list.add(new Course(null, "ART101", "Art I: Drawing", specs.get(5).getId().intValue(), null, 0, 4, 1, 9,
                                12,
                                "elective", "Basic drawing techniques", LocalDateTime.now()));
                list.add(new Course(null, "ART201", "Art II: Painting", specs.get(5).getId().intValue(), null, 0, 4, 2,
                                9, 12,
                                "elective", "Watercolor and acrylic techniques", LocalDateTime.now()));
                list.add(new Course(null, "ART301", "Art III: Sculpture", specs.get(5).getId().intValue(), null, 0, 4,
                                1, 10,
                                12, "elective", "Three-dimensional art creation", LocalDateTime.now()));
                list.add(new Course(null, "ART401", "Advanced Art Portfolio", specs.get(5).getId().intValue(), null, 0,
                                4, 2,
                                11, 12, "elective", "Portfolio development for college", LocalDateTime.now()));
                list.add(new Course(null, "PHOT101", "Photography I", specs.get(5).getId().intValue(), null, 0, 3, 1, 9,
                                12,
                                "elective", "Digital photography basics", LocalDateTime.now()));
                list.add(new Course(null, "PHOT201", "Photography II", specs.get(5).getId().intValue(), null, 0, 3, 2,
                                10, 12,
                                "elective", "Advanced techniques and editing", LocalDateTime.now()));

                // Music Electives (6)
                list.add(new Course(null, "MUS101", "Music Theory I", specs.get(6).getId().intValue(), null, 0, 3, 1, 9,
                                12,
                                "elective", "Basic music theory and notation", LocalDateTime.now()));
                list.add(new Course(null, "MUS201", "Music Theory II", specs.get(6).getId().intValue(), null, 0, 3, 2,
                                10, 12,
                                "elective", "Advanced harmony and composition", LocalDateTime.now()));
                list.add(new Course(null, "BAND101", "Concert Band", specs.get(6).getId().intValue(), null, 0, 4, 2, 9,
                                12,
                                "elective", "Instrumental ensemble performance", LocalDateTime.now()));
                list.add(new Course(null, "BAND201", "Jazz Band", specs.get(6).getId().intValue(), null, 0, 4, 1, 10,
                                12,
                                "elective", "Jazz ensemble and improvisation", LocalDateTime.now()));
                list.add(new Course(null, "CHOIR101", "Concert Choir", specs.get(6).getId().intValue(), null, 0, 4, 1,
                                9, 12,
                                "elective", "Vocal ensemble performance", LocalDateTime.now()));
                list.add(new Course(null, "CHOIR201", "Chamber Choir", specs.get(6).getId().intValue(), null, 0, 4, 2,
                                10, 12,
                                "elective", "Advanced vocal techniques", LocalDateTime.now()));

                // PE Electives (4)
                list.add(new Course(null, "PE101", "Physical Education I", specs.get(7).getId().intValue(), null, 0, 4,
                                1, 9,
                                12, "elective", "Basic fitness and sports", LocalDateTime.now()));
                list.add(new Course(null, "PE201", "Physical Education II", specs.get(7).getId().intValue(), null, 0, 4,
                                2, 10,
                                12, "elective", "Advanced fitness training", LocalDateTime.now()));
                list.add(new Course(null, "HLTH101", "Health Education", specs.get(7).getId().intValue(), null, 0, 2, 2,
                                9, 12,
                                "elective", "Nutrition and wellness", LocalDateTime.now()));
                list.add(new Course(null, "SPORT101", "Team Sports", specs.get(7).getId().intValue(), null, 0, 4, 1, 9,
                                12,
                                "elective", "Basketball, volleyball, soccer", LocalDateTime.now()));

                // Circular Demo - Move earlier for Visibility! (This makes them IDs 40, 41
                // roughly)
                list.add(new Course(null, "CYC101", "Circular Theory A", specs.get(9).getId().intValue(), null, 0, 3, 1,
                                9, 12,
                                "elective", "Cycle A", LocalDateTime.now()));
                list.add(new Course(null, "CYC102", "Circular Theory B", specs.get(9).getId().intValue(), null, 0, 3, 1,
                                9, 12,
                                "elective", "Cycle B", LocalDateTime.now()));

                // CS Electives (4)
                list.add(new Course(null, "CS101", "Intro to Programming", specs.get(8).getId().intValue(), null, 0, 4,
                                1, 9,
                                12, "elective", "Basic programming concepts", LocalDateTime.now()));
                list.add(new Course(null, "CS201", "Web Development", specs.get(8).getId().intValue(), null, 0, 4, 2,
                                10, 12,
                                "elective", "HTML, CSS, JavaScript basics", LocalDateTime.now()));
                list.add(new Course(null, "CS301", "Advanced Programming", specs.get(8).getId().intValue(), null, 0, 4,
                                1, 11,
                                12, "elective", "Data structures and algorithms", LocalDateTime.now()));
                list.add(new Course(null, "CS401", "Computer Science Projects", specs.get(8).getId().intValue(), null,
                                0, 4, 2,
                                12, 12, "elective", "Capstone programming projects", LocalDateTime.now()));

                // Foreign Language (9)
                list.add(new Course(null, "SPAN101", "Spanish I", specs.get(9).getId().intValue(), null, 0, 4, 1, 9, 12,
                                "elective", "Basic Spanish language", LocalDateTime.now()));
                list.add(new Course(null, "SPAN201", "Spanish II", specs.get(9).getId().intValue(), null, 0, 4, 2, 10,
                                12,
                                "elective", "Intermediate Spanish", LocalDateTime.now()));
                list.add(new Course(null, "SPAN301", "Spanish III", specs.get(9).getId().intValue(), null, 0, 4, 1, 11,
                                12,
                                "elective", "Advanced Spanish", LocalDateTime.now()));
                list.add(new Course(null, "FREN101", "French I", specs.get(9).getId().intValue(), null, 0, 4, 1, 9, 12,
                                "elective", "Basic French language", LocalDateTime.now()));
                list.add(new Course(null, "FREN201", "French II", specs.get(9).getId().intValue(), null, 0, 4, 2, 10,
                                12,
                                "elective", "Intermediate French", LocalDateTime.now()));
                list.add(new Course(null, "FREN301", "French III", specs.get(9).getId().intValue(), null, 0, 4, 1, 11,
                                12,
                                "elective", "Advanced French", LocalDateTime.now()));
                list.add(new Course(null, "GERM101", "German I", specs.get(9).getId().intValue(), null, 0, 4, 1, 9, 12,
                                "elective", "Basic German language", LocalDateTime.now()));
                list.add(new Course(null, "GERM201", "German II", specs.get(9).getId().intValue(), null, 0, 4, 2, 10,
                                12,
                                "elective", "Intermediate German", LocalDateTime.now()));
                list.add(new Course(null, "GERM301", "German III", specs.get(9).getId().intValue(), null, 0, 4, 1, 11,
                                12,
                                "elective", "Advanced German", LocalDateTime.now()));

                // Other Electives (8)
                list.add(new Course(null, "DRAMA101", "Drama I", specs.get(5).getId().intValue(), null, 0, 3, 1, 9, 12,
                                "elective", "Basic acting and theater", LocalDateTime.now()));
                list.add(new Course(null, "DRAMA201", "Drama II", specs.get(5).getId().intValue(), null, 0, 3, 2, 10,
                                12,
                                "elective", "Advanced acting techniques", LocalDateTime.now()));
                list.add(new Course(null, "DEBATE101", "Speech and Debate", specs.get(2).getId().intValue(), null, 0, 3,
                                2, 9,
                                12, "elective", "Public speaking skills", LocalDateTime.now()));
                list.add(new Course(null, "JOURN101", "Journalism", specs.get(2).getId().intValue(), null, 0, 3, 1, 10,
                                12,
                                "elective", "School newspaper and media", LocalDateTime.now()));
                list.add(new Course(null, "PSYCH101", "Psychology", specs.get(4).getId().intValue(), null, 0, 3, 1, 11,
                                12,
                                "elective", "Introduction to psychology", LocalDateTime.now()));
                list.add(new Course(null, "STATS101", "Statistics", specs.get(1).getId().intValue(), null, 0, 3, 2, 11,
                                12,
                                "elective", "Data analysis and probability", LocalDateTime.now()));
                list.add(new Course(null, "ENVIRON101", "Environmental Science", specs.get(3).getId().intValue(), null,
                                0, 4, 2,
                                10, 12, "elective", "Ecology and conservation", LocalDateTime.now()));
                list.add(new Course(null, "ASTRO101", "Astronomy", specs.get(3).getId().intValue(), null, 0, 3, 1, 11,
                                12,
                                "elective", "Stars, planets, and space", LocalDateTime.now()));

                courseRepository.saveAll(list);
                Map<String, Long> codes = list.stream().collect(Collectors.toMap(Course::getCode, q -> q.getId()));

                List<String[]> prereqs = List.of(
                                new String[] { "ENG102", "ENG101" }, new String[] { "ENG201", "ENG102" },
                                new String[] { "ENG202", "ENG201" },
                                new String[] { "ENG301", "ENG202" }, new String[] { "ENG302", "ENG301" },
                                new String[] { "ENG401", "ENG302" },
                                new String[] { "ENG402", "ENG401" }, new String[] { "MAT102", "MAT101" },
                                new String[] { "MAT201", "MAT101" },
                                new String[] { "MAT202", "MAT201" }, new String[] { "MAT301", "MAT202" },
                                new String[] { "SCI201", "SCI101" },
                                new String[] { "SCI301", "MAT201" }, new String[] { "ART201", "ART101" },
                                new String[] { "ART301", "ART201" },
                                new String[] { "ART401", "ART301" }, new String[] { "MUS201", "MUS101" },
                                new String[] { "BAND201", "BAND101" },
                                new String[] { "CHOIR201", "CHOIR101" }, new String[] { "PE201", "PE101" },
                                new String[] { "CS201", "CS101" },
                                new String[] { "CS301", "CS101" }, new String[] { "CS401", "CS301" },
                                new String[] { "SPAN201", "SPAN101" },
                                new String[] { "SPAN301", "SPAN201" }, new String[] { "FREN201", "FREN101" },
                                new String[] { "FREN301", "FREN201" },
                                new String[] { "GERM201", "GERM101" }, new String[] { "GERM301", "GERM201" },
                                new String[] { "DRAMA201", "DRAMA101" },
                                new String[] { "STATS101", "MAT201" }, new String[] { "ENVIRON101", "SCI101" },
                                new String[] { "ASTRO101", "SCI102" },
                                new String[] { "PHOT201", "PHOT101" }, new String[] { "CYC101", "CYC102" },
                                new String[] { "CYC102", "CYC101" });

                for (String[] pair : prereqs) {
                        updatePrereq(codes, pair[0], pair[1]);
                }
                return list;
        }

        private void updatePrereq(Map<String, Long> codes, String target, String prereq) {
                if (!codes.containsKey(target) || !codes.containsKey(prereq))
                        return;
                Course c = courseRepository.getReferenceById(codes.get(target));
                c.setPrerequisiteId(codes.get(prereq));
                courseRepository.save(c);
        }

        private void populateStudentsAndHistory(List<Course> courses, List<Semester> semesters) {
                Map<String, Course> courseMap = courses.stream().collect(Collectors.toMap(Course::getCode, c -> c));
                List<Semester> historySemesters = semesters.stream().filter(s -> s.getYear() < 2024).toList();

                // ─── DEMO STUDENTS (IDs 1–4) ────────────────────────────────────────────────
                // These are inserted first so they get predictable low IDs for demo purposes.

                // Student 1 – Emma Wilson (Grade 12). Has all English prerequisites up to
                // ENG302 passed, so she CAN enroll in ENG401 (Scenario 1: ✅ valid enroll).
                Student emma = studentRepository.save(new Student(null, "Emma", "Wilson",
                                "emma.wilson@student.maplewood.edu", 12, 2020, 2024, LocalDateTime.now()));
                List<CourseHistory> demoHistories = new ArrayList<>();
                List<String> emmaCourses = List.of("ENG101", "ENG102", "ENG201", "ENG202", "ENG301", "ENG302");
                for (int i = 0; i < emmaCourses.size(); i++) {
                        demoHistories.add(new CourseHistory(null, emma,
                                        courseMap.get(emmaCourses.get(i)),
                                        historySemesters.get(i % historySemesters.size()),
                                        null, CourseStatus.passed, LocalDateTime.now()));
                }

                // Student 2 – James Lee (Grade 9). No course history at all, so he CANNOT
                // enroll in MAT402/AP Calculus BC (Scenario 2: ❌ prerequisite not met).
                studentRepository.save(new Student(null, "James", "Lee",
                                "james.lee@student.maplewood.edu", 9, 2024, 2028, LocalDateTime.now()));

                // Student 3 – Alex Chen (Grade 11). Has SCI101 passed so they CAN enroll in
                // SCI201 (Chemistry I). SCI301 (Physics I) also has a section — both share a
                // Thursday 09:30 slot — triggering Scenario 3: ❌ time conflict.
                Student alex = studentRepository.save(new Student(null, "Alex", "Chen",
                                "alex.chen@student.maplewood.edu", 11, 2022, 2026, LocalDateTime.now()));
                demoHistories.add(new CourseHistory(null, alex, courseMap.get("SCI101"),
                                historySemesters.get(0), null, CourseStatus.passed, LocalDateTime.now()));
                // MAT201 is also required for SCI301
                demoHistories.add(new CourseHistory(null, alex, courseMap.get("MAT101"),
                                historySemesters.get(0), null, CourseStatus.passed, LocalDateTime.now()));
                demoHistories.add(new CourseHistory(null, alex, courseMap.get("MAT201"),
                                historySemesters.get(1), null, CourseStatus.passed, LocalDateTime.now()));

                // Student 4 – Maya Patel (Grade 11). Given 5 active section enrollments in
                // populateEnrollments so any further enroll attempt hits the 5-course cap
                // (Scenario 4: ❌ max courses reached).
                studentRepository.save(new Student(null, "Maya", "Patel",
                                "maya.patel@student.maplewood.edu", 11, 2022, 2026, LocalDateTime.now()));

                courseHistoryRepository.saveAll(demoHistories);
                // ─── END DEMO STUDENTS ───────────────────────────────────────────────────────

                List<CourseHistory> extraDemoHistories = new ArrayList<>();

                // ─── FILLER: pad IDs 5–100 ────────────────────────────────────────────────
                List<Student> fillers1 = new ArrayList<>();
                for (int i = 5; i <= 100; i++) {
                        fillers1.add(new Student(null, "Filler", "Student" + i,
                                        "filler" + i + "@student.maplewood.edu",
                                        10, 2022, 2026, LocalDateTime.now()));
                }
                studentRepository.saveAll(fillers1);

                // Student 101 – Alex Rivera (Grade 11). Has ART101 + ART201 passed, so
                // they CAN enroll in Art III: Sculpture (deep prereq chain). ✅
                Student alexRivera = studentRepository.save(new Student(null, "Alex", "Rivera",
                                "alex.rivera@student.maplewood.edu", 11, 2022, 2026, LocalDateTime.now()));
                extraDemoHistories.add(new CourseHistory(null, alexRivera, courseMap.get("ART101"),
                                historySemesters.get(0), null, CourseStatus.passed, LocalDateTime.now()));
                extraDemoHistories.add(new CourseHistory(null, alexRivera, courseMap.get("ART201"),
                                historySemesters.get(1), null, CourseStatus.passed, LocalDateTime.now()));

                // ─── FILLER: pad IDs 102–109 ───────────────────────────────────────────────
                List<Student> fillers2 = new ArrayList<>();
                for (int i = 102; i <= 109; i++) {
                        fillers2.add(new Student(null, "Filler", "Student" + i,
                                        "filler" + i + "@student.maplewood.edu",
                                        10, 2022, 2026, LocalDateTime.now()));
                }
                studentRepository.saveAll(fillers2);

                // Student 110 – Sam Wong (Grade 10). No CYC102 in history, so the backend's
                // prerequisite graph traversal hits the circular dependency CYC101↔CYC102
                // and throws a 500 error. ❌
                studentRepository.save(new Student(null, "Sam", "Wong",
                                "sam.wong@student.maplewood.edu", 10, 2023, 2027, LocalDateTime.now()));

                courseHistoryRepository.saveAll(extraDemoHistories);

                // ─── Bulk random students: IDs 111+ ─────────────────────────────────────
                List<Student> students = new ArrayList<>();
                for (int grade : List.of(9, 10, 11, 12)) {
                        for (int i = 0; i < 100; i++) {
                                String f = FIRST_NAMES.get(random.nextInt(FIRST_NAMES.size()));
                                String l = LAST_NAMES.get(random.nextInt(LAST_NAMES.size()));
                                int enrollmentYear = 2024 - (grade - 9);
                                students.add(new Student(null, f, l,
                                                f.toLowerCase() + l.toLowerCase() + grade + i
                                                                + "@student.maplewood.edu",
                                                grade, enrollmentYear,
                                                enrollmentYear + 4, LocalDateTime.now()));
                        }
                }
                List<Student> saved = studentRepository.saveAll(students);

                List<CourseHistory> randomHistories = new ArrayList<>();
                for (int i = 0; i < saved.size(); i++) {
                        Student s = saved.get(i);
                        int compSem = (s.getGradeLevel() - 9) * 2;
                        int startIdx = Math.max(0, historySemesters.size() - compSem);
                        Set<Long> completedIds = new HashSet<>();

                        for (int j = startIdx; j < historySemesters.size(); j++) {
                                Semester sem = historySemesters.get(j);
                                int currentGrade = 9 + ((j - startIdx) / 2);

                                List<Course> available = courses.stream()
                                                .filter(c -> c.getGradeLevelMin() <= currentGrade
                                                                && c.getGradeLevelMax() >= currentGrade)
                                                .filter(c -> c.getSemesterOrder().equals(sem.getOrderInYear()))
                                                .filter(c -> !completedIds.contains(c.getId()))
                                                .filter(c -> c.getPrerequisiteId() == null
                                                                || completedIds.contains(c.getPrerequisiteId()))
                                                .toList();

                                List<Course> toTake = available.stream().limit(5).toList();
                                for (Course c : toTake) {
                                        CourseStatus status = (random.nextDouble() < 0.85) ? CourseStatus.passed
                                                        : CourseStatus.failed;
                                        randomHistories.add(new CourseHistory(null, s, c, sem, null, status,
                                                        LocalDateTime.now()));
                                        if (status == CourseStatus.passed)
                                                completedIds.add(c.getId());
                                }
                        }
                }
                courseHistoryRepository.saveAll(randomHistories);
        }

        private List<CourseSection> populateSections(List<Course> courses, List<Teacher> teachers,
                        Map<Integer, List<Classroom>> roomsByType, List<Semester> semesters, List<TimeSlot> timeSlots) {
                Semester active = semesters.stream().filter(Semester::getIsActive).findFirst().orElseThrow();
                List<CourseSection> sections = new ArrayList<>();

                Map<Integer, List<Teacher>> tBySpec = teachers.stream()
                                .collect(Collectors.groupingBy(Teacher::getSpecializationId));
                Map<Integer, Integer> sToR = Map.of(1, 1, 2, 1, 3, 2, 4, 1, 5, 3, 6, 6, 7, 4, 8, 5, 9, 1);

                Set<String> tBusy = new HashSet<>();
                Set<String> rBusy = new HashSet<>();

                for (Course c : courses) {
                        int n = "core".equals(c.getCourseType()) ? 2 : 1;
                        List<Teacher> tals = tBySpec.get(c.getSpecializationId());
                        List<Classroom> rms = roomsByType.get(sToR.getOrDefault(c.getSpecializationId(), 1));

                        for (int k = 0; k < n; k++) {
                                boolean found = false;
                                List<TimeSlot> tss = new ArrayList<>(timeSlots);
                                Collections.shuffle(tss);
                                for (TimeSlot ts : tss) {
                                        for (Teacher t : tals) {
                                                if (tBusy.contains(t.getId() + "-" + ts.getId()))
                                                        continue;
                                                for (Classroom r : rms) {
                                                        if (rBusy.contains(r.getId() + "-" + ts.getId()))
                                                                continue;
                                                        sections.add(new CourseSection(null, c, t, r.getId().intValue(),
                                                                        active, ts, 10));
                                                        tBusy.add(t.getId() + "-" + ts.getId());
                                                        rBusy.add(r.getId() + "-" + ts.getId());
                                                        found = true;
                                                        break;
                                                }
                                                if (found)
                                                        break;
                                        }
                                        if (found)
                                                break;
                                }
                        }
                }
                return courseSectionRepository.saveAll(sections);
        }

        private void populateEnrollments(List<CourseSection> sections) {
                // Student 4 – Maya Patel: pre-enroll in 5 sections to trigger the max-courses
                // cap (Scenario 4)
                studentRepository.findById(4L).ifPresent(maya -> {
                        List<CourseSection> subset = sections.stream().limit(5).toList();
                        subset.forEach(s -> enrollmentRepository
                                        .save(new Enrollment(null, maya, s, LocalDateTime.now(), null)));
                });

                // Student 101 – minimal seed enrollments (2 courses)
                studentRepository.findById(101L).ifPresent(student101 -> {
                        List<CourseSection> subset = sections.stream()
                                        .filter(s -> !s.getCourse().getCode().startsWith("ART"))
                                        .limit(2).toList();
                        subset.forEach(s -> enrollmentRepository
                                        .save(new Enrollment(null, student101, s, LocalDateTime.now(), null)));
                });
        }
}
