// New Updated code by using Stability API Key 
// Model : Stable Image Core,  API Version : REST API v2beta

import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { GoogleGenAI } from '@google/genai'; 
import 'dotenv/config'; 
import https from 'https';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import axios from 'axios'; 
// CRITICAL FIX: Import the necessary library for multipart/form-data in Node.js
import FormData from 'form-data'; 

// --- ES Module Path Setup Fix ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
// ---------------------------------

// Initialize Google Gen AI
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY }); 

// Get the STABILITY AI Key
const STABILITY_API_KEY = process.env.STABILITY_API_KEY; 

const app = express();
const port = process.env.PORT || 5000;

app.use(cors({ 
    origin: ['http://localhost:3000', 'http://127.0.0.1:3000'], 
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    optionsSuccessStatus: 204
})); 

app.use(bodyParser.json());

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// --- HELPER FUNCTION: STABILITY AI Image Generation (CORRECTED with error throwing) ---
/**
 * Calls the Stability AI API using the required FormData structure from the imported package.
 * Returns a Base64 encoded data URL or throws an error on failure.
 */
async function generateImageFromPrompt(prompt) {
    if (!STABILITY_API_KEY) {
        throw new Error("STABILITY_API_KEY is missing.");
    }

    const data = new FormData();
    data.append('prompt', prompt);
    data.append('output_format', 'jpeg');
    data.append('aspect_ratio', '1:1');
    data.append('style', 'photorealistic');

    try {
        const response = await axios.post(
            'https://api.stability.ai/v2beta/stable-image/generate/core',
            data,
            {
                headers: {
                   ...data.getHeaders(), 
                   'Authorization': `Bearer ${STABILITY_API_KEY}`,
                   'Accept': 'image/*'
                },
                responseType: 'arraybuffer'
            }
        );

        const base64Image = Buffer.from(response.data, 'binary').toString('base64');
        return `data:image/jpeg;base64,${base64Image}`;

    } catch (error) {
        let errorMsg = error.message;
        let statusCode = error.response ? error.response.status : 500;

        if (error.response && error.response.data) {
             errorMsg = Buffer.from(error.response.data).toString('utf-8');
             console.error("Stability AI Image Generation Failed (Detailed Error):", errorMsg);
        } else {
             console.error("Stability AI Image Generation Failed (Network/Other Error):", error.message);
        }
        
        // Propagate structured error object up to the API route handler
        const customError = new Error(errorMsg);
        customError.status = statusCode;
        throw customError;
    }
}
// ---------------------------------------------------------------------------------

// --- API ROUTES ---

// Health check
app.get('/', (req, res) => {
  res.send('Ad Variation Generator API is running 🚀');
});

/**
 * Endpoint to generate Ad Copy/Prompts AND Images
 */
app.post('/api/generate-images', async (req, res) => {
  try {
    const { productName, description, targetAudience, colorTheme } = req.body;

    if (!productName || !description || !targetAudience) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // --- 1. GEMINI: Generate Text Prompts and Copy ---
    const prompt = `You are an expert Ad Creative Generator. Based on the following inputs, generate structured JSON output.
    Product: ${productName}.
    Description: ${description}.
    Audience: ${targetAudience}.
    Color/Mood: ${colorTheme}.
    
    Generate three distinct ad variations. The output MUST be a JSON array containing three objects. Each object MUST have the following keys:
    1. "image_prompt": A highly detailed, single-sentence visual prompt suitable for a text-to-image generator.
    2. "headline": A catchy, short headline (max 5 words).
    3. "body": A compelling, action-oriented body copy (max 15 words).
    
    Example Structure: [{"image_prompt": "...", "headline": "...", "body": "..."}, {...}]`;

    const geminiResponse = await ai.models.generateContent({
        model: "gemini-2.5-flash", 
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: "array",
                items: {
                    type: "object",
                    properties: {
                        image_prompt: { type: "string" },
                        headline: { type: "string" },
                        body: { type: "string" },
                    },
                    required: ["image_prompt", "headline", "body"]
                }
            }
        }
    });

    // --- 2. Robust JSON Parsing ---
    let generatedAds = [];
    try {
        const cleanedText = geminiResponse.text.trim().replace(/^```json\s*|(?:\r?\n|\r)
```$/g, '');
        generatedAds = JSON.parse(cleanedText);
        
        if (!Array.isArray(generatedAds) || generatedAds.length === 0) {
            throw new Error("Parsed content is not a valid array of ads.");
        }

    } catch (e) {
        console.error('CRITICAL ERROR: Failed to parse Gemini JSON output:', e);
        console.error('Raw Gemini text output:', geminiResponse.text);
        throw new Error("Gemini returned malformed data.");
    }
    
    // --- 3. STABILITY AI: Generate Actual Images ---
    let imageUrls = [];
    try {
        // Create an array of Promises for parallel image generation
        const imageGenerationPromises = generatedAds.map(ad => 
            generateImageFromPrompt(ad.image_prompt)
        );
        
        // Wait for all three images to finish generating
        imageUrls = await Promise.all(imageGenerationPromises);

    } catch (apiError) {
        console.warn("Targeted API limitation triggered. Activating pre-generated fallback systems...", apiError.message);
        
        // Check for common rate limit (429), bad request limits (400), payment required (402), or string matches
        if (apiError.status === 429 || apiError.status === 400 || apiError.status === 402 || apiError.message.includes('quota') || apiError.message.includes('credits')) {
            
            // High quality fallback mockup design links
            const fallbackMockups = [
                "https://images.unsplash.com/photo-1542744094-3a31f103e35f?auto=format&fit=crop&w=600&q=80",
                "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=600&q=80",
                "https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=600&q=80"
            ];

            const finalFallbackAds = generatedAds.map((ad, index) => ({
                ...ad,
                image_url: fallbackMockups[index]
            }));

            // Graceful return containing fallback mock data and exact instruction string
            return res.json({ 
                errorType: "DEMO_LIMIT_REACHED",
                message: "DEMO LIMIT REACHED: Stability AI free tier quota exhausted. Displaying pre-generated marketing mockup placeholders instead.",
                images: finalFallbackAds 
            });
        }
        
        // Rethrow if it's a completely unhandled catastrophic error
        throw apiError;
    }

    // --- 4. Combine Standard Successful Results ---
    const finalAds = generatedAds.map((ad, index) => ({
        ...ad,
        image_url: imageUrls[index], 
    }));

    // 5. Send the structured data to the frontend
    res.json({ images: finalAds });

  } catch (error) {
     console.error('CRITICAL: Image/Copy Route Crash:', error);
     res.status(500).json({ error: 'Failed to generate ad concepts with Gemini/Stability AI.' });
  }
});

/**
 * Endpoint to generate Video Ad (SIMULATED)
 */
app.post('/api/generate-video', async (req, res) => {
  try {
    res.json({
      videoUrl: 'https://cdn.plyr.io/static/demo/View_From_A_Blue_Moon_Trailer-720p.mp4',
    });
  } catch (error) {
    console.error('CRITICAL: Video Route Crash:', error);
    res.status(500).json({ error: 'Internal server error during video generation.' });
  }
});

// --- SERVER STARTUP LOGIC ---

if (fs.existsSync(path.join(__dirname, 'certs', 'key.pem')) &&
    fs.existsSync(path.join(__dirname, 'certs', 'cert.pem'))) {

  const options = {
    key: fs.readFileSync(path.join(__dirname, 'certs', 'key.pem')),
    cert: fs.readFileSync(path.join(__dirname, 'certs', 'cert.pem')),
  };

  https.createServer(options, app).listen(port, '0.0.0.0', () => {
    console.log(`✅ HTTPS Server running on port ${port}`);
    console.log(`🔑 Using Gemini Key: ${process.env.GEMINI_API_KEY ? 'Yes' : 'No'}`);
    console.log(`🖼️ Using Stability Key: ${STABILITY_API_KEY ? 'Yes' : 'No'}`);
  });
} else {
  app.listen(port, () => {
    console.log(`✅ HTTP Server running on port ${port}`);
    console.log(`🔑 Using Gemini Key: ${process.env.GEMINI_API_KEY ? 'Yes' : 'No'}`);
    console.log(`🖼️ Using Stability Key: ${STABILITY_API_KEY ? 'Yes' : 'No'}`);
  });
}
