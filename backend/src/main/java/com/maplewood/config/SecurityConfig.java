package com.maplewood.config;

import com.maplewood.security.CustomAccessDeniedHandler;
import com.maplewood.security.CustomAuthenticationEntryPoint;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.provisioning.InMemoryUserDetailsManager;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.header.writers.ReferrerPolicyHeaderWriter;
import org.springframework.web.cors.*;

import java.util.List;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

        private static final String FRONTEND_ORIGIN = "http://localhost:3000";

        @Value("${security.student.username:student}")
        private String studentUsername;

        @Value("${security.student.password:password}")
        private String studentPassword;

        @Value("${security.admin.username:admin}")
        private String adminUsername;

        @Value("${security.admin.password:admin}")
        private String adminPassword;

        private final CustomAuthenticationEntryPoint authenticationEntryPoint;
        private final CustomAccessDeniedHandler accessDeniedHandler;

        public SecurityConfig(
                        CustomAuthenticationEntryPoint authenticationEntryPoint,
                        CustomAccessDeniedHandler accessDeniedHandler) {
                this.authenticationEntryPoint = authenticationEntryPoint;
                this.accessDeniedHandler = accessDeniedHandler;
        }

        // 🔐 Password encoder (industry standard)
        @Bean
        public PasswordEncoder passwordEncoder() {
                return new BCryptPasswordEncoder();
        }

        // 👤 In-memory users (OK for dev/testing)
        @Bean
        public InMemoryUserDetailsManager userDetailsService(PasswordEncoder encoder) {

                UserDetails student = User.builder()
                                .username(studentUsername)
                                .password(encoder.encode(studentPassword))
                                .roles("STUDENT")
                                .build();

                UserDetails admin = User.builder()
                                .username(adminUsername)
                                .password(encoder.encode(adminPassword))
                                .roles("ADMIN")
                                .build();

                return new InMemoryUserDetailsManager(student, admin);
        }

        // 🔒 Main security filter chain
        @Bean
        public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

                http
                                .csrf(AbstractHttpConfigurer::disable)

                                .cors(Customizer.withDefaults())

                                .exceptionHandling(ex -> ex
                                                .authenticationEntryPoint(authenticationEntryPoint)
                                                .accessDeniedHandler(accessDeniedHandler))

                                .sessionManagement(session -> session
                                                .sessionCreationPolicy(SessionCreationPolicy.STATELESS))

                                .authorizeHttpRequests(auth -> auth
                                                .requestMatchers("/api/enrollments").hasRole("STUDENT")
                                                .requestMatchers("/api/schedule/**").hasAnyRole("STUDENT", "ADMIN")
                                                .anyRequest().authenticated())

                                .httpBasic(Customizer.withDefaults())

                                .headers(headers -> headers
                                                .xssProtection(xss -> xss.headerValue(
                                                                org.springframework.security.web.header.writers.XXssProtectionHeaderWriter.HeaderValue.ENABLED_MODE_BLOCK))
                                                .contentSecurityPolicy(
                                                                csp -> csp.policyDirectives("default-src 'self'"))
                                                .frameOptions(frame -> frame.deny())
                                                .referrerPolicy(referrer -> referrer.policy(
                                                                ReferrerPolicyHeaderWriter.ReferrerPolicy.STRICT_ORIGIN_WHEN_CROSS_ORIGIN))
                                                .httpStrictTransportSecurity(hsts -> hsts
                                                                .includeSubDomains(true)
                                                                .maxAgeInSeconds(31536000)));

                return http.build();
        }

        // 🌍 CORS configuration
        @Bean
        public CorsConfigurationSource corsConfigurationSource() {

                CorsConfiguration config = new CorsConfiguration();
                config.setAllowedOrigins(List.of(FRONTEND_ORIGIN));
                config.setAllowedMethods(List.of(
                                "GET", "POST", "PUT", "DELETE", "OPTIONS", "HEAD"));
                config.setAllowedHeaders(List.of(
                                "Authorization", "Content-Type", "X-Requested-With"));
                config.setAllowCredentials(true);
                config.setMaxAge(3600L);

                UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
                source.registerCorsConfiguration("/**", config);

                return source;
        }
}
