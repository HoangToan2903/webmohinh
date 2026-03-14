package mohinh.com.webmohinh_backend.controller;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import mohinh.com.webmohinh_backend.dto.DashboardDTO;
import mohinh.com.webmohinh_backend.service.DashboardService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.Map;

@RestController
@Slf4j
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@CrossOrigin
public class DashboardController {
    DashboardService dashboardService;

    @GetMapping("/dashboard")
    public ResponseEntity<DashboardDTO> getDashboardOverview() {
        return ResponseEntity.ok(dashboardService.getDashboardData());
    }
    @GetMapping("/dashboardSearch")
    public ResponseEntity<DashboardDTO> getDashboardStats(
            @RequestParam(value = "date", required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {

        DashboardDTO stats = dashboardService.getStats(date);
        return ResponseEntity.ok(stats);
    }

}
