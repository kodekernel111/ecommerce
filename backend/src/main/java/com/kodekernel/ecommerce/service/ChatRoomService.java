package com.kodekernel.ecommerce.service;

import com.kodekernel.ecommerce.entity.ChatRoom;
import com.kodekernel.ecommerce.entity.Role;
import com.kodekernel.ecommerce.entity.User;
import com.kodekernel.ecommerce.repository.ChatRoomRepository;
import com.kodekernel.ecommerce.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ChatRoomService {

    private final ChatRoomRepository chatRoomRepository;
    private final UserRepository userRepository;

    public Optional<ChatRoom> getChatRoom(UUID senderId, UUID recipientId, boolean createNewRoomIfNotExists) {
        User sender = userRepository.findById(senderId).orElseThrow(() -> new RuntimeException("Sender not found"));
        User recipient = userRepository.findById(recipientId)
                .orElseThrow(() -> new RuntimeException("Recipient not found"));

        User buyer = sender.getRole() == Role.USER ? sender : recipient;
        User seller = sender.getRole() == Role.SELLER ? sender : recipient;

        if (buyer.getRole() != Role.USER || seller.getRole() != Role.SELLER ) {
            if (createNewRoomIfNotExists) {
                throw new RuntimeException("Chat can only be between a Buyer and a Seller.");
            }
            return Optional.empty();
        }

        return chatRoomRepository
                .findByBuyerAndSeller(buyer, seller)
                .or(() -> {
                    if (createNewRoomIfNotExists) {
                        return Optional.of(createChatRoom(buyer, seller));
                    }
                    return Optional.empty();
                });
    }

    private ChatRoom createChatRoom(User buyer, User seller) {
        ChatRoom chatRoom = ChatRoom.builder()
                .buyer(buyer)
                .seller(seller)
                .build();
        return chatRoomRepository.save(chatRoom);
    }
}
