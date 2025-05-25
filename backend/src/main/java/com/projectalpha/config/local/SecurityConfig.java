package com.projectalpha.config.local;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

import java.util.List;

/**
 * Security configuration that *also* exposes a global CORS filter so Spring Security
 * can handle the browser’s CORS pre‑flight (OPTIONS) requests.
 *
 * – Allowed origins match your React dev ports (5173 & 5180).
 * – Allowed methods/headers mirror what you enabled in WebConfig.
 *
 * Drop this class in the same package as your previous SecurityConfig (it will
 * replace it). Re‑build & restart the backend and the CORS 401/blocked errors
 * from the frontend should disappear.
 */
@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                // Disable CSRF for APIs
                .csrf(csrf -> csrf.disable())
                // *** ENABLE CORS SUPPORT HERE ***
                .cors(Customizer.withDefaults())
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/api/auth/**", "/api/users/**").permitAll()
                        // 🔸  Open the rest of the API while you’re still wiring things.
                        //     Switch to .authenticated() once you add auth filters.
                        .anyRequest().permitAll()
                )
                .httpBasic(Customizer.withDefaults());
        return http.build();
    }

    /**
     * Central CORS filter registered with Spring Security.
     * This ensures that BOTH the framework & the MVC layer share the same rules.
     */
    @Bean
    public CorsFilter corsFilter() {
        CorsConfiguration cors = new CorsConfiguration();
        cors.setAllowedOrigins(List.of("http://localhost:5173", "http://localhost:5180"));
        cors.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        cors.addAllowedHeader("*");
        cors.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", cors);
        return new CorsFilter(source);
    }
}
