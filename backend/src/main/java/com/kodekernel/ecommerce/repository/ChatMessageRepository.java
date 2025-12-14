package com.kodekernel.ecommerce.repository;

import com.kodekernel.ecommerce.entity.ChatMessage;
import com.kodekernel.ecommerce.entity.ChatRoom;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface ChatMessageRepository extends JpaRepository<ChatMessage, UUID> {
    List<ChatMessage> findByChatRoom(ChatRoom chatRoom);
}
