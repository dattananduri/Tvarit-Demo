package com.datta.tvaritfinal.service;

import com.datta.tvaritfinal.dto.ItemRequest;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class AiService {

    private static final Logger logger = LoggerFactory.getLogger(AiService.class);

    @Value("${tvarit.gemini.api-key:}")
    private String geminiApiKey;

    @Value("${tvarit.openai.api-key:}")
    private String openaiApiKey;

    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

    public boolean isLiveAiConfigured() {
        return (geminiApiKey != null && !geminiApiKey.isBlank()) ||
               (openaiApiKey != null && !openaiApiKey.isBlank());
    }

    // ==========================================
    // 1. ASK TVARIT: AI Smart Shopping Assistant
    // ==========================================
    public Map<String, Object> generateShoppingListFromPrompt(String prompt) {
        if (prompt == null || prompt.isBlank()) {
            prompt = "daily essentials";
        }
        String clean = prompt.trim();
        logger.info("AI Ask Tvarit processing query: '{}'", clean);

        if (geminiApiKey != null && !geminiApiKey.isBlank()) {
            try {
                return callGeminiTextToItems(clean);
            } catch (Exception e) {
                logger.warn("Gemini API call failed, falling back to intelligent demo mode: {}", e.getMessage());
            }
        }

        return generateSmartFallbackPrompt(clean);
    }

    // ==========================================
    // 2. SNAP & SHOP: AI Vision Ingredient Extractor
    // ==========================================
    public Map<String, Object> analyzeImageToShoppingList(String imageBase64, String filenameHint) {
        String hint = (filenameHint != null ? filenameHint.toLowerCase() : "");
        logger.info("Snap & Shop analyzing image. Filename hint: '{}'", hint);

        if (geminiApiKey != null && !geminiApiKey.isBlank() && imageBase64 != null && !imageBase64.isBlank()) {
            try {
                return callGeminiVisionToItems(imageBase64, hint);
            } catch (Exception e) {
                logger.warn("Gemini Vision API call failed, falling back to demo vision mode: {}", e.getMessage());
            }
        }

        return generateSmartFallbackVision(hint);
    }

    // ==========================================
    // 3. VOICE TO CART: Speech Entity Recognizer
    // ==========================================
    public Map<String, Object> parseVoiceTranscriptToItems(String transcript) {
        if (transcript == null || transcript.isBlank()) {
            transcript = "two milk one bread twelve eggs";
        }
        String clean = transcript.trim().toLowerCase();
        logger.info("Voice parsing transcript: '{}'", clean);

        if (geminiApiKey != null && !geminiApiKey.isBlank()) {
            try {
                Map<String, Object> geminiResult = callGeminiTextToItems("Convert spoken shopping request into exact items: " + clean);
                geminiResult.put("transcript", transcript);
                geminiResult.put("understoodText", "Understood " + ((List<?>) geminiResult.get("items")).size() + " items from speech");
                return geminiResult;
            } catch (Exception e) {
                logger.warn("Gemini voice parse failed, using local parser: {}", e.getMessage());
            }
        }

        List<ItemRequest> items = parseFreeFormTextToItems(clean);
        if (items.isEmpty()) {
            items.add(new ItemRequest("Fresh Milk", 2, "litre", 30.0, "Voice parsed"));
            items.add(new ItemRequest("Bread", 1, "pack", 35.0, "Voice parsed"));
            items.add(new ItemRequest("Farm Eggs", 12, "units", 7.0, "Voice parsed"));
        }

        Map<String, Object> response = new HashMap<>();
        response.put("transcript", transcript);
        response.put("understoodText", "Understood " + items.size() + " items from speech");
        response.put("items", items);
        response.put("totalEstimated", items.stream().mapToDouble(i -> (i.getItemPrice() != null ? i.getItemPrice() : 40.0) * (i.getItemQuantity() != null ? i.getItemQuantity() : 1)).sum());
        response.put("mode", "DEMO_MODE");
        response.put("isLiveAi", false);
        return response;
    }

    // ==========================================
    // Real Gemini 1.5 Flash API Integrations
    // ==========================================
    private Map<String, Object> callGeminiTextToItems(String prompt) throws Exception {
        String url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" + geminiApiKey.trim();

        String systemInstruction = "You are Tvarit AI, an Indian hyperlocal shopping assistant. Given user requirements or dish recipes, generate a structured shopping list for local neighborhood stores in JSON schema: { \"title\": \"Title of kit\", \"explanation\": \"short explanation\", \"items\": [ { \"itemName\": \"name\", \"itemQuantity\": 1, \"unit\": \"kg|g|litre|packet|units|pack|dozen\", \"estimatedPrice\": 50.0, \"notes\": \"brand or quality tip\" } ] }. Respond ONLY with valid raw JSON.";

        Map<String, Object> requestBody = new HashMap<>();
        Map<String, Object> content = new HashMap<>();
        Map<String, Object> part = new HashMap<>();
        part.put("text", systemInstruction + "\n\nUser Request: " + prompt);
        content.put("parts", List.of(part));
        requestBody.put("contents", List.of(content));

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

        ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.POST, entity, String.class);
        JsonNode root = objectMapper.readTree(response.getBody());
        String textResponse = root.path("candidates").get(0).path("content").path("parts").get(0).path("text").asText();

        // Extract JSON from markdown fences if any
        String cleanJson = extractJsonContent(textResponse);
        JsonNode parsed = objectMapper.readTree(cleanJson);

        List<ItemRequest> items = new ArrayList<>();
        if (parsed.has("items") && parsed.get("items").isArray()) {
            for (JsonNode itemNode : parsed.get("items")) {
                String name = itemNode.path("itemName").asText("Item");
                int qty = itemNode.path("itemQuantity").asInt(1);
                String unit = itemNode.path("unit").asText("units");
                double price = itemNode.path("estimatedPrice").asDouble(estimateItemPrice(name));
                String notes = itemNode.path("notes").asText("");
                items.add(new ItemRequest(name, qty, unit, price, notes));
            }
        }

        Map<String, Object> result = new HashMap<>();
        result.put("title", parsed.path("title").asText("AI Suggested Shopping List"));
        result.put("explanation", parsed.path("explanation").asText("Generated live using Gemini AI multimodal analysis."));
        result.put("items", items);
        result.put("totalEstimated", items.stream().mapToDouble(i -> (i.getItemPrice() != null ? i.getItemPrice() : 40.0) * (i.getItemQuantity() != null ? i.getItemQuantity() : 1)).sum());
        result.put("mode", "LIVE_AI");
        result.put("isLiveAi", true);
        result.put("provider", "Google Gemini 1.5 Flash (Live AI)");
        result.put("disclaimer", "Live AI recipe suggestions. Please review and adjust quantities before adding to cart.");
        return result;
    }

    private Map<String, Object> callGeminiVisionToItems(String imageBase64, String hint) throws Exception {
        String url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" + geminiApiKey.trim();

        // Strip data:image/...;base64, prefix if present
        String rawBase64 = imageBase64;
        String mimeType = "image/jpeg";
        if (imageBase64.contains(",")) {
            String[] parts = imageBase64.split(",");
            rawBase64 = parts[1];
            if (parts[0].contains("png")) mimeType = "image/png";
            else if (parts[0].contains("webp")) mimeType = "image/webp";
        }

        String prompt = "Analyze this image (could be a dish, cake, recipe, handwritten grocery list, or product). Extract all required ingredients or grocery items for purchase at local shops. Return raw JSON matching: { \"identifiedSubject\": \"Subject name\", \"confidence\": \"98%\", \"explanation\": \"Details\", \"items\": [ { \"itemName\": \"name\", \"itemQuantity\": 1, \"unit\": \"kg|g|litre|packet|units|pack|dozen\", \"estimatedPrice\": 40.0, \"notes\": \"notes\" } ] }. " + (hint.isBlank() ? "" : "Filename hint: " + hint);

        Map<String, Object> requestBody = new HashMap<>();
        Map<String, Object> content = new HashMap<>();

        Map<String, Object> textPart = new HashMap<>();
        textPart.put("text", prompt);

        Map<String, Object> inlineData = new HashMap<>();
        inlineData.put("mimeType", mimeType);
        inlineData.put("data", rawBase64);

        Map<String, Object> imagePart = new HashMap<>();
        imagePart.put("inlineData", inlineData);

        content.put("parts", List.of(textPart, imagePart));
        requestBody.put("contents", List.of(content));

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

        ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.POST, entity, String.class);
        JsonNode root = objectMapper.readTree(response.getBody());
        String textResponse = root.path("candidates").get(0).path("content").path("parts").get(0).path("text").asText();

        String cleanJson = extractJsonContent(textResponse);
        JsonNode parsed = objectMapper.readTree(cleanJson);

        List<ItemRequest> items = new ArrayList<>();
        if (parsed.has("items") && parsed.get("items").isArray()) {
            for (JsonNode itemNode : parsed.get("items")) {
                String name = itemNode.path("itemName").asText("Item");
                int qty = itemNode.path("itemQuantity").asInt(1);
                String unit = itemNode.path("unit").asText("units");
                double price = itemNode.path("estimatedPrice").asDouble(estimateItemPrice(name));
                String notes = itemNode.path("notes").asText("");
                items.add(new ItemRequest(name, qty, unit, price, notes));
            }
        }

        Map<String, Object> result = new HashMap<>();
        result.put("identifiedSubject", parsed.path("identifiedSubject").asText("Identified Image Content"));
        result.put("confidence", parsed.path("confidence").asText("98.5%"));
        result.put("explanation", parsed.path("explanation").asText("Deconstructed from image pixels with Gemini Vision."));
        result.put("items", items);
        result.put("totalEstimated", items.stream().mapToDouble(i -> (i.getItemPrice() != null ? i.getItemPrice() : 40.0) * (i.getItemQuantity() != null ? i.getItemQuantity() : 1)).sum());
        result.put("mode", "LIVE_AI");
        result.put("isLiveAi", true);
        result.put("provider", "Google Gemini Vision 1.5 Flash");
        result.put("disclaimer", "Extracted via Multimodal Vision AI. Please review and adjust items before purchasing.");
        return result;
    }

    private String extractJsonContent(String raw) {
        if (raw == null) return "{}";
        String trimmed = raw.trim();
        if (trimmed.startsWith("```json")) {
            trimmed = trimmed.substring(7);
        } else if (trimmed.startsWith("```")) {
            trimmed = trimmed.substring(3);
        }
        if (trimmed.endsWith("```")) {
            trimmed = trimmed.substring(0, trimmed.length() - 3);
        }
        return trimmed.trim();
    }

    // ==========================================
    // Intelligent Fallback (Explicit Demo Mode)
    // ==========================================
    private Map<String, Object> generateSmartFallbackPrompt(String prompt) {
        String clean = prompt.toLowerCase();
        List<ItemRequest> items = new ArrayList<>();
        String title;
        String explanation;

        int scaleMultiplier = extractPeopleScale(clean);

        if (clean.contains("biryani") || clean.contains("chicken")) {
            title = "Chicken Biryani Ingredients (Scaled for " + (scaleMultiplier * 2) + " people)";
            explanation = "Authentic recipe shopping list with exact local spice and grocery requirements.";
            items.add(new ItemRequest("Fresh Chicken (Curry Cut)", 1 * scaleMultiplier, "kg", 240.0, "Fresh tender cut"));
            items.add(new ItemRequest("India Gate Basmati Rice", 1 * scaleMultiplier, "kg", 140.0, "Long grain"));
            items.add(new ItemRequest("Onions", 1 * scaleMultiplier, "kg", 35.0, "For golden barista"));
            items.add(new ItemRequest("Fresh Tomatoes", 1, "kg", 35.0, "Ripe red"));
            items.add(new ItemRequest("Thick Curd / Dahi (500g)", 1, "pack", 40.0, "Nandini/Amul fresh curd"));
            items.add(new ItemRequest("Biryani Masala Packet", 1, "packet", 45.0, "Everest/MDH"));
            items.add(new ItemRequest("Fresh Mint (Pudina)", 1, "bunch", 15.0, "Fresh green leaves"));
            items.add(new ItemRequest("Fresh Coriander", 1, "bunch", 15.0, "Clean coriander"));
            items.add(new ItemRequest("Ginger Garlic Paste", 1, "packet", 25.0, "100g pouch"));
        } else if (clean.contains("cake") || clean.contains("baking") || clean.contains("chocolate")) {
            title = "Chocolate Cake Baking Kit";
            explanation = "Everything required to bake a rich, spongy homemade chocolate cake.";
            items.add(new ItemRequest("All Purpose Flour (Maida 500g)", 1, "pack", 40.0, "Fine sifted"));
            items.add(new ItemRequest("Hershey's Cocoa Powder (100g)", 1, "pack", 95.0, "Rich dark cocoa"));
            items.add(new ItemRequest("Fine Sugar (500g)", 1, "pack", 30.0, "Refined white"));
            items.add(new ItemRequest("Farm Fresh Eggs (6 pcs)", 1, "pack", 42.0, "Room temperature"));
            items.add(new ItemRequest("Amul Butter (100g)", 2, "pack", 55.0, "Rich dairy butter"));
            items.add(new ItemRequest("Fresh Milk (500ml)", 1, "packet", 25.0, "Whole milk"));
            items.add(new ItemRequest("Baking Powder & Soda", 1, "pack", 35.0, "Weikfield"));
            items.add(new ItemRequest("Vanilla Essence (20ml)", 1, "bottle", 50.0, "20ml bottle"));
        } else if (clean.contains("dosa") || clean.contains("idli") || clean.contains("breakfast")) {
            title = "South Indian Breakfast Kit (Masala Dosa)";
            explanation = "Fresh ingredients for crispy ghee masala dosas and coconut chutney.";
            items.add(new ItemRequest("iD Fresh Dosa Batter (1kg)", 1, "packet", 85.0, "1 kg ready batter"));
            items.add(new ItemRequest("Potatoes (Aloo)", 1, "kg", 35.0, "For masala filling"));
            items.add(new ItemRequest("Fresh Coconut", 1, "unit", 35.0, "For white chutney"));
            items.add(new ItemRequest("Green Chillies (100g)", 1, "pack", 15.0, "Spicy fresh"));
            items.add(new ItemRequest("Nandini Pure Ghee (200ml)", 1, "bottle", 140.0, "Aromatic cow ghee"));
            items.add(new ItemRequest("Mustard Seeds & Curry Leaves", 1, "pack", 20.0, "Tadka mix"));
        } else if (clean.contains("cleaning") || clean.contains("house") || clean.contains("pooja")) {
            title = "Home Essentials & Cleaning Supplies";
            explanation = "Essential supplies to keep your home fresh, clean, and organized.";
            items.add(new ItemRequest("Surf Excel Detergent (1kg)", 1, "kg", 140.0, "Quick wash"));
            items.add(new ItemRequest("Vim Dishwash Gel (500ml)", 1, "bottle", 105.0, "Lemon concentrate"));
            items.add(new ItemRequest("Lizol Floor Cleaner (500ml)", 1, "bottle", 95.0, "Citrus / Pine"));
            items.add(new ItemRequest("Scotch-Brite Sponge Scrub", 3, "units", 20.0, "Heavy duty"));
            items.add(new ItemRequest("Garbage Bags (Medium 30s)", 1, "roll", 75.0, "30 bags roll"));
        } else if (clean.contains("snack") || clean.contains("guest") || clean.contains("party") || clean.contains("drinks")) {
            title = "Party Snacks & Refreshment Drinks (Scaled for " + (scaleMultiplier * 2) + " guests)";
            explanation = "Crowd-pleaser snack assortment and chilled beverages.";
            items.add(new ItemRequest("Lay's Classic & Magic Masala Chips (Large)", 2 * scaleMultiplier, "pack", 40.0, "Crispy party pack"));
            items.add(new ItemRequest("Haldiram's Bhujia & Mixture (400g)", 1 * scaleMultiplier, "pack", 95.0, "Namkeen"));
            items.add(new ItemRequest("Coca-Cola / Thums Up (2L Bottle)", 1 * scaleMultiplier, "bottle", 90.0, "Chilled"));
            items.add(new ItemRequest("Paper Boat Mango Juice (1L)", 1, "pack", 95.0, "Aamras"));
            items.add(new ItemRequest("Salted Roasted Cashews (200g)", 1, "pack", 180.0, "Crunchy"));
        } else {
            title = "Custom Grocery Shopping List";
            explanation = "Tvarit AI structured your requirement into verified local grocery items.";
            items = parseFreeFormTextToItems(clean);
            if (items.isEmpty()) {
                items.add(new ItemRequest("Fresh Milk", 2, "packet", 30.0, "Daily fresh"));
                items.add(new ItemRequest("Whole Wheat Bread", 1, "pack", 35.0, "Brown / White"));
                items.add(new ItemRequest("Farm Eggs (6 pcs)", 1, "pack", 42.0, "Fresh"));
            }
        }

        Map<String, Object> response = new HashMap<>();
        response.put("title", title);
        response.put("explanation", explanation);
        response.put("items", items);
        response.put("totalEstimated", items.stream().mapToDouble(i -> (i.getItemPrice() != null ? i.getItemPrice() : 40.0) * (i.getItemQuantity() != null ? i.getItemQuantity() : 1)).sum());
        response.put("mode", "DEMO_MODE");
        response.put("isLiveAi", false);
        response.put("provider", "Tvarit AI (Demo Mode)");
        response.put("disclaimer", "DEMO MODE: Showing simulated AI recipe extraction. Configure GEMINI_API_KEY in environment for live AI.");
        return response;
    }

    private Map<String, Object> generateSmartFallbackVision(String hint) {
        String identifiedSubject;
        String confidence = "98.4%";
        List<ItemRequest> items = new ArrayList<>();

        if (hint.contains("cake") || hint.contains("pastry") || hint.contains("dessert")) {
            identifiedSubject = "Fresh Chocolate Fudge Cake";
            items.add(new ItemRequest("All Purpose Flour (Maida 500g)", 1, "pack", 40.0, "High grade"));
            items.add(new ItemRequest("Cocoa Powder (Unsweetened 100g)", 1, "pack", 95.0, "Dark Dutch-processed"));
            items.add(new ItemRequest("Fine Sugar (250g)", 1, "pack", 20.0, "Granulated"));
            items.add(new ItemRequest("Farm Fresh Eggs (4 pcs)", 4, "units", 7.0, "Fresh grade A"));
            items.add(new ItemRequest("Amul Butter (100g)", 2, "pack", 55.0, "Rich dairy butter"));
            items.add(new ItemRequest("Fresh Whole Milk (500ml)", 1, "packet", 25.0, "Full cream"));
            items.add(new ItemRequest("Baking Powder", 1, "pack", 25.0, "100g tin"));
            items.add(new ItemRequest("Dark Chocolate Compound (200g)", 1, "pack", 85.0, "For chocolate ganache"));
        } else if (hint.contains("biryani") || hint.contains("rice") || hint.contains("pulao")) {
            identifiedSubject = "Hyderabadi Dum Biryani";
            items.add(new ItemRequest("Fresh Chicken (Curry Cut)", 1, "kg", 240.0, "Skinless"));
            items.add(new ItemRequest("Basmati Rice (Royal Feast)", 1, "kg", 150.0, "Aged basmati"));
            items.add(new ItemRequest("Red Onions", 1, "kg", 35.0, "Crisp slicing onions"));
            items.add(new ItemRequest("Fresh Tomatoes", 1, "kg", 35.0, "Firm country tomatoes"));
            items.add(new ItemRequest("Fresh Curd (Dahi 400g)", 1, "pack", 35.0, "Thick natural curd"));
            items.add(new ItemRequest("Biryani Whole Spices Pack", 1, "pack", 50.0, "Cardamom, clove, bay leaf"));
            items.add(new ItemRequest("Fresh Pudina & Coriander", 2, "bunch", 15.0, "Washed green leaves"));
        } else if (hint.contains("list") || hint.contains("note") || hint.contains("handwritten")) {
            identifiedSubject = "Handwritten Grocery List (OCR Extracted)";
            items.add(new ItemRequest("Aashirvaad Shudh Chakki Atta (5kg)", 1, "pack", 240.0, "100% whole wheat"));
            items.add(new ItemRequest("Sona Masoori Raw Rice (5kg)", 1, "pack", 300.0, "Premium polished"));
            items.add(new ItemRequest("Toor Dal (1kg)", 1, "kg", 165.0, "Unpolished dal"));
            items.add(new ItemRequest("Sunflower Cooking Oil (1L)", 1, "litre", 140.0, "Pouch pack"));
            items.add(new ItemRequest("Tata Iodized Salt (1kg)", 1, "kg", 28.0, "Vacuum evaporated"));
            items.add(new ItemRequest("Tata Tea Premium (250g)", 1, "pack", 110.0, "Strong leaf tea"));
        } else if (hint.contains("dosa") || hint.contains("idli")) {
            identifiedSubject = "Crispy Masala Dosa & Sambar";
            items.add(new ItemRequest("Fresh Dosa Batter (1kg)", 1, "packet", 85.0, "Naturally fermented"));
            items.add(new ItemRequest("Potatoes (Aloo)", 1, "kg", 35.0, "Yellow potatoes"));
            items.add(new ItemRequest("Fresh Grated Coconut", 1, "unit", 35.0, "Fresh coconut"));
            items.add(new ItemRequest("Amul Pure Cow Ghee (200ml)", 1, "bottle", 140.0, "Rich aroma"));
            items.add(new ItemRequest("Sambar Powder (MTR)", 1, "packet", 40.0, "Traditional blend"));
        } else {
            identifiedSubject = "Fresh Produce & Grocery Assortment";
            items.add(new ItemRequest("Farm Fresh Tomatoes", 1, "kg", 40.0, "Fresh red harvest"));
            items.add(new ItemRequest("Fresh Farm Milk (Nandini)", 2, "packet", 30.0, "Pasteurized"));
            items.add(new ItemRequest("Whole Wheat Bread", 1, "pack", 35.0, "Modern / Britannia"));
            items.add(new ItemRequest("Farm Fresh Eggs (6 pcs)", 1, "pack", 42.0, "Protein rich"));
            items.add(new ItemRequest("Bananas (Robusta)", 6, "units", 5.0, "Sweet ripe"));
        }

        Map<String, Object> result = new HashMap<>();
        result.put("identifiedSubject", identifiedSubject);
        result.put("confidence", confidence);
        result.put("items", items);
        result.put("totalEstimated", items.stream().mapToDouble(i -> (i.getItemPrice() != null ? i.getItemPrice() : 40.0) * (i.getItemQuantity() != null ? i.getItemQuantity() : 1)).sum());
        result.put("mode", "DEMO_MODE");
        result.put("isLiveAi", false);
        result.put("provider", "Tvarit Vision AI (Demo Mode)");
        result.put("disclaimer", "DEMO MODE: Showing simulated Vision AI extraction. Configure GEMINI_API_KEY in environment for live vision API.");
        return result;
    }

    private List<ItemRequest> parseFreeFormTextToItems(String text) {
        List<ItemRequest> items = new ArrayList<>();
        String normalized = text.replaceAll("\\band\\b", ",").replaceAll("\\bplus\\b", ",").replaceAll("&", ",");
        String[] parts = normalized.split("[,;\n]+");

        for (String part : parts) {
            String trimmed = part.trim();
            if (trimmed.length() < 2) continue;

            ItemRequest parsed = parseSingleVoiceItem(trimmed);
            if (parsed != null) {
                items.add(parsed);
            }
        }
        return items;
    }

    private ItemRequest parseSingleVoiceItem(String segment) {
        String converted = convertNumberWordsToDigits(segment);
        Pattern pattern = Pattern.compile("(\\d+(?:\\.\\d+)?)\\s*(kg|kilo|litres?|l|packets?|packs?|grams?|g|units?|pcs?|dozen|bottles?|bunches?)?\\s*(?:of\\s+)?([a-zA-Z\\s]+)", Pattern.CASE_INSENSITIVE);
        Matcher matcher = pattern.matcher(converted);

        if (matcher.find()) {
            double qtyDouble = Double.parseDouble(matcher.group(1));
            int qty = (int) Math.max(1, Math.round(qtyDouble));
            String unit = matcher.group(2) != null ? normalizeUnit(matcher.group(2)) : "units";
            String name = matcher.group(3).trim();

            if (!name.isBlank()) {
                double price = estimateItemPrice(name);
                return new ItemRequest(capitalize(name), qty, unit, price, "");
            }
        }

        String cleanName = segment.replaceAll("^\\d+\\s*", "").trim();
        if (!cleanName.isBlank()) {
            return new ItemRequest(capitalize(cleanName), 1, "units", estimateItemPrice(cleanName), "");
        }
        return null;
    }

    private String convertNumberWordsToDigits(String text) {
        return text
                .replaceAll("\\bone\\b", "1")
                .replaceAll("\\btwo\\b", "2")
                .replaceAll("\\bthree\\b", "3")
                .replaceAll("\\bfour\\b", "4")
                .replaceAll("\\bfive\\b", "5")
                .replaceAll("\\bsix\\b", "6")
                .replaceAll("\\bseven\\b", "7")
                .replaceAll("\\beight\\b", "8")
                .replaceAll("\\bnine\\b", "9")
                .replaceAll("\\bten\\b", "10")
                .replaceAll("\\beleven\\b", "11")
                .replaceAll("\\btwelve\\b", "12")
                .replaceAll("\\bhalf kilo\\b", "1 pack")
                .replaceAll("\\bhalf litre\\b", "1 packet")
                .replaceAll("\\bhalf\\b", "1");
    }

    private String normalizeUnit(String raw) {
        String u = raw.toLowerCase().trim();
        if (u.startsWith("kg") || u.startsWith("kilo")) return "kg";
        if (u.startsWith("litre") || u.equals("l")) return "litre";
        if (u.startsWith("pack")) return "packet";
        if (u.startsWith("gram") || u.equals("g")) return "g";
        if (u.startsWith("dozen")) return "dozen";
        if (u.startsWith("bottle")) return "bottle";
        if (u.startsWith("bunch")) return "bunch";
        return "units";
    }

    private double estimateItemPrice(String name) {
        String l = name.toLowerCase();
        if (l.contains("chicken")) return 240.0;
        if (l.contains("rice") || l.contains("basmati")) return 120.0;
        if (l.contains("sugar")) return 45.0;
        if (l.contains("milk")) return 30.0;
        if (l.contains("bread")) return 35.0;
        if (l.contains("egg")) return 7.0;
        if (l.contains("butter")) return 55.0;
        if (l.contains("atta") || l.contains("flour")) return 50.0;
        if (l.contains("oil")) return 140.0;
        if (l.contains("tomato")) return 40.0;
        if (l.contains("onion")) return 35.0;
        if (l.contains("potato")) return 30.0;
        if (l.contains("curd") || l.contains("dahi")) return 35.0;
        if (l.contains("tea") || l.contains("chai")) return 80.0;
        if (l.contains("biscuit") || l.contains("cookie")) return 25.0;
        return 40.0;
    }

    private int extractPeopleScale(String text) {
        Pattern p = Pattern.compile("(\\d+)\\s*(?:people|persons|pax|members|guests)", Pattern.CASE_INSENSITIVE);
        Matcher m = p.matcher(text);
        if (m.find()) {
            int count = Integer.parseInt(m.group(1));
            return Math.max(1, (int) Math.ceil(count / 2.0));
        }
        return 1;
    }

    private String capitalize(String text) {
        if (text == null || text.isEmpty()) return text;
        return Character.toUpperCase(text.charAt(0)) + text.substring(1);
    }
}
