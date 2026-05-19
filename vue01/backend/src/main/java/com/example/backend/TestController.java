package com.example.backend;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;
import java.util.HashMap;

//localhost:5173(Vue)에서 오는 요청 허용
@CrossOrigin(origins = "http://localhost:5173")

@RestController public class TestController {

    @GetMapping("/api/test")
    public Map<String, Object> test(){
        Map<String, Object> data = new HashMap<String, Object>();

        data.put("name", "홍길동");
        data.put("age", 29);

        return data;
    }

}
