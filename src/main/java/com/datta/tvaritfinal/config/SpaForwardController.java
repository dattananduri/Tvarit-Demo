package com.datta.tvaritfinal.config;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class SpaForwardController {

    // Forward any non-API, non-file paths to index.html for React Router
    @RequestMapping(value = {
            "/",
            "/home",
            "/login",
            "/register",
            "/order/create",
            "/orders",
            "/orders/**",
            "/partner/**",
            "/admin/**",
            "/profile",
            "/addresses"
    })
    public String forwardToIndex() {
        return "forward:/index.html";
    }
}
