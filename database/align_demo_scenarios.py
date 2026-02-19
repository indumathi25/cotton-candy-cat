import sqlite3
import os

DB_FILE = os.path.join(os.path.dirname(__file__), 'maplewood_school.sqlite')

def setup_demo():
    conn = sqlite3.connect(DB_FILE)
    cursor = conn.cursor()

    print("🔧 Aligning database with demo scenarios...")

    # 1. Ensure Semester 7 is the active Fall 2024 semester
    cursor.execute("UPDATE semesters SET is_active = 0")
    cursor.execute("UPDATE semesters SET is_active = 1 WHERE name = 'Fall' AND year = 2024")
    active_semester_id = cursor.execute("SELECT id FROM semesters WHERE is_active = 1").fetchone()[0]
    
    # Get a previous semester for history
    prev_semester_id = cursor.execute("SELECT id FROM semesters WHERE year < 2024 ORDER BY year DESC, order_in_year DESC LIMIT 1").fetchone()[0]

    # 2. Setup Courses
    # Ensure English II exists (usually ENG201)
    cursor.execute("SELECT id FROM courses WHERE code = 'ENG201'")
    eng2_row = cursor.fetchone()
    if not eng2_row:
        # Create it if missing (unlikely based on populate script)
        cursor.execute("INSERT INTO courses (code, name, credits, hours_per_week, specialization_id, semester_order, course_type, grade_level_min, grade_level_max) VALUES ('ENG201', 'English II', 1.0, 5, (SELECT id FROM specializations WHERE name = 'English'), 1, 'core', 10, 10)")
        eng2_id = cursor.lastrowid
    else:
        eng2_id = eng2_row[0]

    # Add AP English Literature
    cursor.execute("INSERT OR REPLACE INTO courses (code, name, description, credits, hours_per_week, specialization_id, prerequisite_id, course_type, grade_level_min, grade_level_max, semester_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
                   ('ENG501', 'AP English Literature', 'Advanced placement english', 1.0, 5, 2, eng2_id, 'elective', 10, 12, 1))
    ap_eng_id = cursor.lastrowid

    # Add AP Calculus AB and BC
    cursor.execute("INSERT OR REPLACE INTO courses (code, name, description, credits, hours_per_week, specialization_id, semester_order, course_type, grade_level_min, grade_level_max) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
                   ('MAT401', 'AP Calculus AB', 'Introduction to Calculus', 1.0, 5, 1, 1, 'elective', 9, 12))
    ab_calc_id = cursor.lastrowid
    
    cursor.execute("INSERT OR REPLACE INTO courses (code, name, description, credits, hours_per_week, specialization_id, prerequisite_id, course_type, grade_level_min, grade_level_max, semester_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
                   ('MAT501', 'AP Calculus BC', 'Advanced Calculus', 1.0, 5, 1, ab_calc_id, 'elective', 9, 12, 1))
    bc_calc_id = cursor.lastrowid

    # 3. Setup Students
    # Scenario 1: Emma Wilson (ID 1)
    cursor.execute("DELETE FROM students WHERE id = 1")
    cursor.execute("INSERT INTO students (id, first_name, last_name, email, grade_level, enrollment_year, status) VALUES (1, 'Emma', 'Wilson', 'emma.wilson@student.maplewood.edu', 10, 2023, 'active')")
    
    # Pass Prerequisite chain for English II
    cursor.execute("DELETE FROM student_course_history WHERE student_id = 1")
    # English I: Foundations (ENG101)
    eng101_id = cursor.execute("SELECT id FROM courses WHERE code = 'ENG101'").fetchone()[0]
    # English I: Composition (ENG102)
    eng102_id = cursor.execute("SELECT id FROM courses WHERE code = 'ENG102'").fetchone()[0]
    
    cursor.execute("INSERT INTO student_course_history (student_id, course_id, semester_id, status) VALUES (1, ?, ?, 'passed')", (eng101_id, prev_semester_id))
    cursor.execute("INSERT INTO student_course_history (student_id, course_id, semester_id, status) VALUES (1, ?, ?, 'passed')", (eng102_id, prev_semester_id))
    cursor.execute("INSERT INTO student_course_history (student_id, course_id, semester_id, status) VALUES (1, ?, ?, 'passed')", (eng2_id, prev_semester_id))
    
    # 3 active courses for Emma
    # (Just pick any 3 sections)
    cursor.execute("DELETE FROM enrollments WHERE student_id = 1")
    cursor.execute("SELECT id FROM course_sections WHERE semester_id = ? LIMIT 3", (active_semester_id,))
    for (sec_id,) in cursor.fetchall():
        cursor.execute("INSERT INTO enrollments (student_id, course_section_id) VALUES (1, ?)", (sec_id,))

    # Scenario 2: James Lee (ID 2)
    cursor.execute("DELETE FROM students WHERE id = 2")
    cursor.execute("INSERT INTO students (id, first_name, last_name, email, grade_level, enrollment_year, status) VALUES (2, 'James', 'Lee', 'james.lee@student.maplewood.edu', 9, 2024, 'active')")
    cursor.execute("DELETE FROM student_course_history WHERE student_id = 2")
    # No history for AB Calc

    # Scenario 3: Time Conflict
    # Physics I (SCI301) and Chemistry I (SCI201)
    cursor.execute("SELECT id FROM courses WHERE name = 'Physics I'")
    phys_id = cursor.execute("SELECT id FROM courses WHERE code = 'SCI301'").fetchone()[0]
    chem_id = cursor.execute("SELECT id FROM courses WHERE code = 'SCI201'").fetchone()[0]
    
    # Find a time slot (e.g., Mon 9:00-10:00)
    cursor.execute("SELECT id FROM time_slots WHERE day_of_week = 'Monday' AND start_time = '09:00'")
    slot_id = cursor.fetchone()[0]
    
    # Update sections to share this slot
    cursor.execute("UPDATE course_sections SET time_slot_id = ? WHERE course_id = ? LIMIT 1", (slot_id, phys_id))
    cursor.execute("UPDATE course_sections SET time_slot_id = ? WHERE course_id = ? LIMIT 1", (slot_id, chem_id))
    
    # Put another student (ID 3) in Chemistry I already
    cursor.execute("DELETE FROM students WHERE id = 3")
    cursor.execute("INSERT INTO students (id, first_name, last_name, email, grade_level, enrollment_year, status) VALUES (3, 'Test', 'Student', 'test@student.maplewood.edu', 11, 2022, 'active')")
    chem_sec_id = cursor.execute("SELECT id FROM course_sections WHERE course_id = ? AND time_slot_id = ?", (chem_id, slot_id)).fetchone()[0]
    cursor.execute("DELETE FROM enrollments WHERE student_id = 3")
    cursor.execute("INSERT INTO enrollments (student_id, course_section_id) VALUES (3, ?)", (chem_sec_id,))

    # Scenario 4: Course Limit
    # Student ID 4 with 5 courses
    cursor.execute("DELETE FROM students WHERE id = 4")
    cursor.execute("INSERT INTO students (id, first_name, last_name, email, grade_level, enrollment_year, status) VALUES (4, 'Max', 'Courses', 'max@student.maplewood.edu', 12, 2021, 'active')")
    cursor.execute("DELETE FROM enrollments WHERE student_id = 4")
    cursor.execute("SELECT id FROM course_sections WHERE semester_id = ? AND id != ? LIMIT 5", (active_semester_id, chem_sec_id))
    for (sec_id,) in cursor.fetchall():
        cursor.execute("INSERT INTO enrollments (student_id, course_section_id) VALUES (4, ?)", (sec_id,))

    conn.commit()
    conn.close()
    print("✅ Database successfully aligned with all 4 demo scenarios.")

if __name__ == "__main__":
    setup_demo()
