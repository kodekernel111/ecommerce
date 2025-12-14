package com.kodekernel.ecommerce.repository;

import com.kodekernel.ecommerce.entity.ChatRoom;
import com.kodekernel.ecommerce.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface ChatRoomRepository extends JpaRepository<ChatRoom, UUID> {
    Optional<ChatRoom> findByBuyerAndSeller(User buyer, User seller);
}
