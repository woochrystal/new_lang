package com.example.backend;

//API 서버용 클래스 표시 기능
//"얘는 화면(html) 만드는 애가 아니라 데이터 응답하는 애야"
import org.springframework.web.bind.annotation.RestController;
//주소 연결 기능
import org.springframework.web.bind.annotation.GetMapping;
//다른 포트 요청 허용 기능
import org.springframework.web.bind.annotation.CrossOrigin;
//주소 뒤에 붙은 값 가져오기
import org.springframework.web.bind.annotation.RequestParam;

//이름 : 값 형태로 저장하는 구조
import java.util.Map;
//데이터 저장 객체
import java.util.HashMap;

//localhost:5173(Vue)에서 오는 요청 허용
@CrossOrigin(origins = "http://localhost:5173")

@RestController public class TestController {

    @GetMapping("/api/test")
    public Map<String, Object> test(
            @RequestParam String name
    ){
        //console.log 같은
        System.out.println(name);

        Map<String, Object> data = new HashMap<String, Object>();

        data.put("name", name);
        data.put("age", 29);

        return data;
    }

}
