import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY || "dummy_key");

// Process image for statement/receipt parsing
export const processImageWithGemini = async (file) => {
    if (!import.meta.env.VITE_GEMINI_API_KEY) {
        console.warn("Missing VITE_GEMINI_API_KEY");
        return { error: "Gemini API Key is missing. Please add it to .env" };
    }

    try {
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        // Convert file to base64
        const base64Data = await new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result.split(',')[1]);
            reader.onerror = error => reject(error);
        });

        const prompt = `
      Analyze this credit card statement or receipt image. Extract the following details in JSON format:
      - name: (Merchant or Card Name)
      - dueDate: (YYYY-MM-DD format, if found)
      - minimumPayment: (Number, if found)
      - statementBalance: (Number, total amount found)
      
      If a field is not found, return null. Return ONLY the JSON string, no markdown.
    `;

        const result = await model.generateContent([
            prompt,
            {
                inlineData: {
                    data: base64Data,
                    mimeType: file.type,
                },
            },
        ]);

        const response = await result.response;
        const text = response.text();

        // Clean up markdown code blocks if present
        const jsonString = text.replace(/```json/g, '').replace(/```/g, '').trim();

        return JSON.parse(jsonString);

    } catch (error) {
        console.error("Gemini OCR Error:", error);
        return { error: "Failed to process image. Please try again." };
    }
};

// Process scanned card image to extract card details
export const processCardScan = async (file) => {
    if (!import.meta.env.VITE_GEMINI_API_KEY) {
        console.warn("Missing VITE_GEMINI_API_KEY");
        return { error: "Gemini API Key is missing. Please add VITE_GEMINI_API_KEY to .env file." };
    }

    try {
        const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
        console.log("Initializing Gemini with key:", apiKey ? `${apiKey.slice(0, 5)}...` : "MISSING");

        const modelName = "gemini-2.5-flash";
        console.log("Using model:", modelName);
        const model = genAI.getGenerativeModel({ model: modelName });

        // Convert file to base64
        const base64Data = await new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result.split(',')[1]);
            reader.onerror = error => reject(error);
        });

        const prompt = `
You are an expert credit card OCR system. Analyze this credit card image carefully and extract the following information.

OUTPUT FORMAT: Return ONLY valid JSON with these fields:
{
  "name": "Bank/Card name (e.g., Chase Sapphire Preferred, Amex Gold)",
  "cardNumber": "Full 16-digit card number if visible, otherwise null",
  "expiryDate": "MM/YY format if visible, otherwise null",
  "cardholderName": "Name printed on card if visible, otherwise null",
  "last4": "Last 4 digits of card number if visible, otherwise null",
  "confidence": "high/medium/low based on image quality and text clarity"
}

RULES:
1. If card number is partially obscured but last 4 digits are visible, extract them to "last4"
2. For embossed numbers, read them carefully (they may have shadows)
3. Card name should be the issuing bank + card tier (e.g., "Wells Fargo Propel")
4. If you cannot read a field with confidence, set it to null
5. Set confidence to:
   - "high" if image is clear and all text is readable
   - "medium" if image is acceptable but some text is unclear
   - "low" if image is blurry or poorly lit
6. Return ONLY the JSON object, no markdown formatting, no explanation

Be very careful with number recognition. Common mistakes:
- 0 vs O, 1 vs I, 5 vs S, 8 vs B
- Verify the card number has exactly 16 digits (or 15 for Amex)
`;

        const result = await model.generateContent([
            prompt,
            {
                inlineData: {
                    data: base64Data,
                    mimeType: file.type,
                },
            },
        ]);

        const response = await result.response;
        const text = response.text();

        // Clean up markdown code blocks if present
        const jsonString = text.replace(/```json/g, '').replace(/```/g, '').trim();

        const cardData = JSON.parse(jsonString);

        // If we got last4 from full number, extract it
        if (cardData.cardNumber && !cardData.last4) {
            cardData.last4 = cardData.cardNumber.slice(-4);
        }

        // Log confidence for debugging
        console.log("Card scan confidence:", cardData.confidence || "unknown");

        return cardData;

    } catch (error) {
        console.error("Card scan OCR Error Full:", error);

        // Provide more specific error messages
        if (error.message?.includes('API key')) {
            return { error: "Invalid API key. Please check your Gemini API key in .env file." };
        }
        if (error.message?.includes('quota') || error.message?.includes('rate limit')) {
            return { error: "API rate limit reached. Please try again in a few moments." };
        }
        if (error.message?.includes('JSON')) {
            return { error: "Failed to parse card data. Please try again with a clearer image." };
        }

        return { error: `Failed to scan card: ${error.message || 'Unknown error'}. Try taking a clearer photo in good lighting.` };
    }
};
