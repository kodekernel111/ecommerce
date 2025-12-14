package com.kodekernel.ecommerce.service;

import com.kodekernel.ecommerce.entity.ChatMessage;
import com.kodekernel.ecommerce.entity.User;
import com.kodekernel.ecommerce.repository.ChatMessageRepository;
import com.kodekernel.ecommerce.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ChatMessageService {
    private final ChatMessageRepository repository;
    private final ChatRoomService chatRoomService;
    private final UserRepository userRepository;

    public ChatMessage save(UUID senderId, UUID recipientId, String content) {
        var chatRoom = chatRoomService
                .getChatRoom(senderId, recipientId, true)
                .orElseThrow();

        User sender = userRepository.findById(senderId).orElseThrow();
        User recipient = userRepository.findById(recipientId).orElseThrow();

        ChatMessage chatMessage = ChatMessage.builder()
                .chatRoom(chatRoom)
                .sender(sender)
                .recipient(recipient)
                .content(content)
                .status("DELIVERED")
                .build();

        return repository.save(chatMessage);
    }

    public List<ChatMessage> findChatMessages(UUID senderId, UUID recipientId) {
        var chatRoom = chatRoomService.getChatRoom(senderId, recipientId, false);
        return chatRoom.map(repository::findByChatRoom).orElse(new ArrayList<>());
    }
}
