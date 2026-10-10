
package com.studentmanagement.backend;

import java.util.List;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/students")
public class StudentController {

    private final StudentRepository studentRepository;

    public StudentController(StudentRepository studentRepository) {
        this.studentRepository = studentRepository;
    }

    // 1. Get all students
    @GetMapping
    public List<Student> getAllStudents() {
        return studentRepository.findAll();
    }

    // 2. Get student by ID
    @GetMapping("/{id}")
    public Student getStudentById(@PathVariable Long id) {
        return studentRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Student not found"));
    }

    // 3. Add a new student
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Student addStudent(@Valid @RequestBody Student student) {
        student.setId(null);
        return studentRepository.save(student);
    }

    // 4. Update an existing student
    @PutMapping("/{id}")
    public Student updateStudent(
            @PathVariable Long id,
            @Valid @RequestBody Student updatedStudent) {

        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Student not found"));

        student.setName(updatedStudent.getName());
        student.setEmail(updatedStudent.getEmail());
        student.setDepartment(updatedStudent.getDepartment());

        return studentRepository.save(student);
    }

    // 5. Delete a student
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteStudent(@PathVariable Long id) {
        if (!studentRepository.existsById(id)) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND, "Student not found");
        }

        studentRepository.deleteById(id);
    }
}
