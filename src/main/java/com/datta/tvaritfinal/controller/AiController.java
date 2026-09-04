package com.datta.tvaritfinal.controller;

import com.datta.tvaritfinal.service.AiService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/ai")
public class AiController {

    private final AiService aiService;

    public AiController(AiService aiService) {
        this.aiService = aiService;
    }

    @PostMapping("/chat")
    public ResponseEntity<Map<String, Object>> askTvarit(@RequestBody Map<String, String> body) {
        String prompt = body.getOrDefault("prompt", "");
        return ResponseEntity.ok(aiService.generateShoppingListFromPrompt(prompt));
    }

    @PostMapping("/snap-and-shop")
    public ResponseEntity<Map<String, Object>> snapAndShop(@RequestBody Map<String, String> body) {
        String imageBase64 = body.getOrDefault("image", "");
        String filenameHint = body.getOrDefault("filenameHint", "");
        return ResponseEntity.ok(aiService.analyzeImageToShoppingList(imageBase64, filenameHint));
    }

    @PostMapping("/voice-parse")
    public ResponseEntity<Map<String, Object>> parseVoice(@RequestBody Map<String, String> body) {
        String transcript = body.getOrDefault("transcript", "");
        return ResponseEntity.ok(aiService.parseVoiceTranscriptToItems(transcript));
    }
}
