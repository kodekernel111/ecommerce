package com.kodekernel.ecommerce.model;

import jakarta.persistence.*;
import lombok.*;
import java.util.UUID;

@Entity
@Table(name = "users")
@Getter @Setter @NoArgsConstructor
public class User {

    @Id
    private UUID id;

    private String name;
    private String email;
    private String phone;
}

