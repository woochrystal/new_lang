package com.example.backend;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

//localhost:5173(Vue)에서 오는 요청 허용
@CrossOrigin(origins = "http://localhost:5173")

@RestController public class TestController {

    @GetMapping("/api/test")
    public String test(){
        return "백엔드 연결 성공";
    }

}
