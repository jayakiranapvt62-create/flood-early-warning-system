package com.srilanka.floodwarning.controller;

import com.srilanka.floodwarning.dto.ChatRequest;
import com.srilanka.floodwarning.dto.ChatResponse;
import com.srilanka.floodwarning.service.ChatService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/chat")
@CrossOrigin(origins = "*")
public class ChatController {

    private final ChatService chatService;

    public ChatController(ChatService chatService) {
        this.chatService = chatService;
    }

    @PostMapping
    public ChatResponse chat(@Valid @RequestBody ChatRequest request) {
        return new ChatResponse(chatService.reply(request.getMessage()));
    }
}