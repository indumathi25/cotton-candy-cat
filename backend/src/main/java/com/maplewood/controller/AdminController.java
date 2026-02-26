package com.maplewood.controller;

import com.maplewood.dto.AdminStatsDTO;
import com.maplewood.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;

    @GetMapping("/stats")
    public AdminStatsDTO getAdminStats() {
        return adminService.getAdminStats();
    }
}
