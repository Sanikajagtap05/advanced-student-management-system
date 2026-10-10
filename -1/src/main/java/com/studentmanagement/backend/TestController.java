
package com.studentmanagement.backend;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class TestController {

    @GetMapping("/api/test")
    public String testApi() {
        return "Student Management System API is working!";
    }
}
