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
        return { error: "Gemini API Key is missing. Please add it to .env" };
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
      Analyze this credit card image and extract the following details into a strict JSON format:
      {
        "name": "Card Issuer or Bank Name (e.g. Chase Sapphire, Amex Gold)",
        "cardNumber": "Full card number without spaces (digits only)",
        "expiryDate": "MM/YY",
        "cardholderName": "Name on card"
      }
      
      Rules:
      1. If the full card number is not visible, try to extract the last 4 digits and put them in a "last4" field.
      2. If a field is not found, set it to null.
      3. Return ONLY the raw JSON string. Do not include markdown formatting like \`\`\`json.
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

        return cardData;

    } catch (error) {
        console.error("Card scan OCR Error Full:", error);
        if (error.response) {
            console.error("Error Response Status:", error.response.status);
            console.error("Error Response Text:", error.response.statusText);
            try {
                const errorBody = await error.response.json();
                console.error("Error Response Body:", errorBody);
            } catch (e) {
                console.error("Could not parse error response body");
            }
        }
        return { error: `Failed to scan card. Error: ${error.message || 'Unknown error'}` };
    }
};
