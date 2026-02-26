package com.maplewood;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.boot.persistence.autoconfigure.EntityScan;

@SpringBootApplication
@ComponentScan("com.maplewood")
@EnableJpaRepositories("com.maplewood.repository")
@EntityScan("com.maplewood.model")
public class Application {

    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }
}
