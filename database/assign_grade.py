import sqlite3
import sys
import os

# Get directory where this script is located
DB_DIR = os.path.dirname(os.path.abspath(__file__))
DB_FILE = os.path.join(DB_DIR, 'maplewood_school.sqlite')

def update_grade(student_id, course_code, grade):
    # Connect to the database
    conn = sqlite3.connect(DB_FILE)
    cursor = conn.cursor()
    
    # 1. Find a valid section for this course code
    cursor.execute("""
        SELECT cs.id 
        FROM course_sections cs 
        JOIN courses c ON cs.course_id = c.id 
        WHERE c.code = ? 
        LIMIT 1
    """, (course_code.upper(),))
    
    section = cursor.fetchone()
    if not section:
        print(f"❌ Error: No course section found for course code {course_code.upper()}")
        conn.close()
        return
    
    section_id = section[0]

    # 2. Check if the student is already enrolled
    cursor.execute("""
        SELECT id FROM enrollments 
        WHERE student_id = ? AND course_section_id = ?
    """, (student_id, section_id))
    
    enrollment = cursor.fetchone()
    
    if not enrollment:
        # Enrol the student automatically
        print(f"ℹ️ Student {student_id} is not enrolled in {course_code.upper()}. Enrolling now...")
        try:
            cursor.execute("""
                INSERT INTO enrollments (student_id, course_section_id, enrolled_at)
                VALUES (?, ?, ?)
            """, (student_id, section_id, '2024-09-01 08:00:00'))
            conn.commit()
            print(f"✅ Enrolled Student {student_id} in {course_code.upper()}")
        except Exception as e:
            print(f"❌ Failed to enroll: {e}")
            conn.close()
            return

    # 3. Update the grade
    query = """
    UPDATE enrollments 
    SET grade = ? 
    WHERE student_id = ? 
    AND course_section_id = ?
    """
    
    try:
        cursor.execute(query, (grade.upper(), student_id, section_id))
        conn.commit()
        
        if cursor.rowcount > 0:
            print(f"✅ Success: Updated {course_code.upper()} for Student {student_id} to Grade {grade.upper()}")
            print("GPA will now be recalculated on next refresh.")
        else:
            print(f"❌ Error: Could not update grade.")
    except Exception as e:
        print(f"❌ Database Error: {e}")
    finally:
        conn.close()

if __name__ == "__main__":
    if len(sys.argv) < 4:
        print("Usage: python3 assign_grade.py <student_id> <course_code> <grade>")
        print("Example: python3 assign_grade.py 101 MAT101 A")
    else:
        update_grade(sys.argv[1], sys.argv[2], sys.argv[3])
