package com.kodekernel.ecommerce.service;

import com.kodekernel.ecommerce.entity.User;
import com.kodekernel.ecommerce.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository repository;

    public void saveUser(User user) {
        repository.save(user);
    }

    public void disconnect(User user) {
        if (user.getId() != null) {
            var storedUser = repository.findById(user.getId()).orElse(null);
            if (storedUser != null) {
                repository.save(storedUser);
            }
        }
    }

    public List<User> findConnectedUsers() {
        return repository.findAll();
    }
}
