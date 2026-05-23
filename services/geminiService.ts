
import { GoogleGenAI, Type } from "@google/genai";
import { StyleAnalysis, StyledItem } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateImageForItem = async (itemName: string, category: string, style: string): Promise<string> => {
  const model = 'gemini-2.5-flash-image';
  const prompt = `A professional studio fashion product photograph of a ${itemName} (${category}) in a ${style} style. High-end fashion catalog aesthetic, clean background, 4k.`;
  
  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: [{ parts: [{ text: prompt }] }],
      config: {
        imageConfig: { aspectRatio: "1:1" }
      }
    });

    const part = response.candidates?.[0]?.content?.parts.find(p => p.inlineData);
    if (part?.inlineData) {
      return `data:image/png;base64,${part.inlineData.data}`;
    }
  } catch (e) {
    console.error("Image generation failed", e);
  }
  return "";
};

export const generateOutfitPreview = async (imageUrls: string[], items: StyledItem[], style: string): Promise<string> => {
  const model = 'gemini-2.5-flash-image';
  const itemNames = items.map(i => i.name).join(', ');
  
  const imageParts = imageUrls.map(url => ({
    inlineData: {
      data: url.split(',')[1],
      mimeType: "image/jpeg"
    }
  }));

  const prompt = `
    PHOTOREALISTIC TASK: Visualize the EXACT person from the first image wearing the items from the other images AND these specific new pieces: ${itemNames}.
    
    CRITICAL REQUIREMENTS:
    1. IDENTITY: You MUST maintain the exact face, facial features, hair, and body type of the person in image 1. It must look like a real photo of them.
    2. CLOTHING: Seamlessly dress them in the combination of reference garments and the recommended items.
    3. STYLE: ${style} aesthetic. High-fashion magazine editorial. 
    4. QUALITY: Photorealistic, 8k, sharp focus, professional lighting.
  `;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: [{ parts: [...imageParts, { text: prompt }] }],
      config: {
        imageConfig: { aspectRatio: "3:4" }
      }
    });

    const part = response.candidates?.[0]?.content?.parts.find(p => p.inlineData);
    if (part?.inlineData) {
      return `data:image/png;base64,${part.inlineData.data}`;
    }
  } catch (e) {
    console.error("Outfit preview generation failed", e);
  }
  return "";
};

export const analyzeStyle = async (imageUrls: string[], userPrompt: string): Promise<StyleAnalysis> => {
  const model = "gemini-3-pro-preview";

  const imageParts = imageUrls.map(url => ({
    inlineData: {
      data: url.split(',')[1],
      mimeType: "image/jpeg"
    }
  }));

  const promptText = `
    Act as a world-class celebrity fashion stylist. 
    ${userPrompt ? `USER REQUEST: "${userPrompt}"` : ""}
    Analyze the photos. Image 1 is the user. Images 2+ are reference items to include.
    Identify the style, colors, and body type.
    Curate exactly 5 additional items from Amazon to complete the look.
    Provide product name, category, and reasoning.
  `;

  const response = await ai.models.generateContent({
    model: model,
    contents: { parts: [...imageParts, { text: promptText }] },
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          summary: { type: Type.STRING },
          identifiedStyle: { type: Type.STRING },
          colorPalette: { type: Type.ARRAY, items: { type: Type.STRING } },
          vibeDescription: { type: Type.STRING },
          recommendations: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                name: { type: Type.STRING },
                category: { type: Type.STRING },
                description: { type: Type.STRING },
                priceRange: { type: Type.STRING },
                reasoning: { type: Type.STRING }
              },
              required: ["id", "name", "category", "description", "reasoning"]
            }
          }
        },
        required: ["summary", "identifiedStyle", "colorPalette", "recommendations", "vibeDescription"]
      }
    }
  });

  const jsonStr = response.text?.trim() || '{}';
  const analysis = JSON.parse(jsonStr) as StyleAnalysis;
  
  if (analysis.recommendations) {
    const enriched = await Promise.all(analysis.recommendations.map(async (item) => {
      const imageUrl = await generateImageForItem(item.name, item.category, analysis.identifiedStyle);
      return {
        ...item,
        imageUrl,
        amazonSearchUrl: `https://www.amazon.com/s?k=${encodeURIComponent(item.name + " " + item.category)}`
      };
    }));
    analysis.recommendations = enriched;
    
    // GENERATE THE FULL LOOK IMMEDIATELY
    analysis.fullLookImageUrl = await generateOutfitPreview(imageUrls, enriched, analysis.identifiedStyle);
  }

  return analysis;
};
