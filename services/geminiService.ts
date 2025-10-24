
import { GoogleGenAI, Type } from "@google/genai";
import type { GeminiCompressionParams } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

export async function getCompressionParams(
  originalSizeInBytes: number,
  width: number,
  height: number,
  targetSizeInBytes: number,
  mimeType: string
): Promise<GeminiCompressionParams> {

  const originalSizeInKB = (originalSizeInBytes / 1024).toFixed(2);
  const targetSizeInKB = (targetSizeInBytes / 1024).toFixed(2);

  const prompt = `
    I need to compress an image with the following properties:
    - Original file size: ${originalSizeInKB} KB
    - Dimensions: ${width}x${height} pixels
    - MIME type: ${mimeType}

    My target file size is approximately ${targetSizeInKB} KB.

    I will be using the HTML5 Canvas method 'toDataURL("${mimeType}", quality)'. 
    Please suggest the optimal parameters to achieve this.

    Consider these factors:
    1.  **Quality:** What is the best 'quality' parameter (a float between 0.1 and 1.0) to hit the target size while preserving visual fidelity?
    2.  **Resizing:** Would resizing the image to a smaller width be beneficial for quality at the target file size? If so, suggest a new width in pixels. If not, return null for the new width.

    Respond ONLY with a valid JSON object in the specified format. Do not include markdown formatting, explanations, or any other text.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            quality: {
              type: Type.NUMBER,
              description: "A float between 0.1 and 1.0 for the image quality."
            },
            newWidth: {
              type: Type.INTEGER,
              description: "The suggested new width in pixels, or null if no resize is needed.",
              nullable: true,
            }
          },
          required: ["quality", "newWidth"]
        }
      }
    });

    const responseText = response.text.trim();
    const params = JSON.parse(responseText) as GeminiCompressionParams;

    // Validate the received parameters
    if (typeof params.quality !== 'number' || params.quality < 0.1 || params.quality > 1.0) {
        throw new Error('Invalid quality value received from API.');
    }
    if (params.newWidth !== null && (typeof params.newWidth !== 'number' || params.newWidth <= 0)) {
        throw new Error('Invalid newWidth value received from API.');
    }
    
    return params;

  } catch (error) {
    console.error("Error fetching compression parameters from Gemini:", error);
    throw new Error("Could not get AI-powered compression settings. Please try again.");
  }
}
