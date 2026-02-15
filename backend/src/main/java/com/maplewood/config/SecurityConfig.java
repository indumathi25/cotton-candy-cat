package com.maplewood.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.header.writers.ReferrerPolicyHeaderWriter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.List;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final com.maplewood.security.CustomAuthenticationEntryPoint customAuthenticationEntryPoint;
    private final com.maplewood.security.CustomAccessDeniedHandler customAccessDeniedHandler;

    public SecurityConfig(com.maplewood.security.CustomAuthenticationEntryPoint customAuthenticationEntryPoint,
            com.maplewood.security.CustomAccessDeniedHandler customAccessDeniedHandler) {
        this.customAuthenticationEntryPoint = customAuthenticationEntryPoint;
        this.customAccessDeniedHandler = customAccessDeniedHandler;
    }

    @Bean
    public org.springframework.security.provisioning.InMemoryUserDetailsManager userDetailsService() {
        org.springframework.security.core.userdetails.UserDetails student = org.springframework.security.core.userdetails.User
                .withDefaultPasswordEncoder()
                .username("student")
                .password("password")
                .roles("STUDENT")
                .build();
        org.springframework.security.core.userdetails.UserDetails admin = org.springframework.security.core.userdetails.User
                .withDefaultPasswordEncoder()
                .username("admin")
                .password("admin")
                .roles("ADMIN")
                .build();
        return new org.springframework.security.provisioning.InMemoryUserDetailsManager(student, admin);
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                // Disable CSRF using the new lambda DSL since we are using stateless REST APIs
                .csrf(AbstractHttpConfigurer::disable)

                // Configure Exception Handling
                .exceptionHandling(exception -> exception
                        .authenticationEntryPoint(customAuthenticationEntryPoint)
                        .accessDeniedHandler(customAccessDeniedHandler))

                // Configure CORS
                .cors(Customizer.withDefaults())

                // Stateless session management
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))

                // Authorize requests
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/api/enroll").hasRole("STUDENT")
                        .requestMatchers("/api/schedule/**").hasAnyRole("STUDENT", "ADMIN")
                        .anyRequest().authenticated())
                .httpBasic(Customizer.withDefaults()) // Enable Basic Auth for testing

                // Configure Security Headers
                .headers(headers -> headers
                        .xssProtection(xss -> xss.headerValue(
                                org.springframework.security.web.header.writers.XXssProtectionHeaderWriter.HeaderValue.ENABLED_MODE_BLOCK))
                        .contentSecurityPolicy(csp -> csp.policyDirectives("default-src 'self'"))
                        .frameOptions(frame -> frame.deny())
                        .referrerPolicy(referrer -> referrer
                                .policy(ReferrerPolicyHeaderWriter.ReferrerPolicy.STRICT_ORIGIN_WHEN_CROSS_ORIGIN))
                        .httpStrictTransportSecurity(hsts -> hsts
                                .includeSubDomains(true)
                                .maxAgeInSeconds(31536000)));

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        // Allow frontend origin - adjust if frontend runs on different port
        configuration.setAllowedOrigins(List.of("http://localhost:3000"));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS", "HEAD"));
        configuration.setAllowedHeaders(Arrays.asList("Authorization", "Content-Type", "X-Requested-With"));
        configuration.setAllowCredentials(true);
        configuration.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
