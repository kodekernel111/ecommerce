package com.kodekernel.ecommerce.controller;

import com.kodekernel.ecommerce.entity.ChatMessage;

import com.kodekernel.ecommerce.entity.ChatMessageDTO;
import com.kodekernel.ecommerce.entity.ChatNotification;
import com.kodekernel.ecommerce.service.ChatMessageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;
import java.util.UUID;

@Controller
@RequiredArgsConstructor
public class ChatController {

        private final SimpMessagingTemplate messagingTemplate;
        private final ChatMessageService chatMessageService;

        @MessageMapping("/chat")
        public void processMessage(@Payload ChatMessageDTO chatMessageDto) {
                ChatMessage savedMsg = chatMessageService.save(
                                chatMessageDto.getSenderId(),
                                chatMessageDto.getRecipientId(),
                                chatMessageDto.getContent());

                messagingTemplate.convertAndSendToUser(
                                savedMsg.getRecipient().getId().toString(), "/queue/messages",
                                new ChatNotification(
                                                savedMsg.getId(),
                                                savedMsg.getSender().getId(),
                                                savedMsg.getRecipient().getId(),
                                                savedMsg.getContent()));
        }

        @GetMapping("/messages/{senderId}/{recipientId}")
        public ResponseEntity<List<ChatMessage>> findChatMessages(@PathVariable UUID senderId,
                        @PathVariable UUID recipientId) {
                return ResponseEntity
                                .ok(chatMessageService.findChatMessages(senderId, recipientId));
        }
}
