import "dotenv/config";
import { GoogleGenAI } from "@google/genai";
import { ApiError } from "../utils/ApiError.js";

const ai = new GoogleGenAI({apiKey:process.env.GEMINI_API_KEY});

async function generateContent(prompt) {
    try {
    
        const interaction = await ai.interactions.create({
            model: process.env.GEMINI_MODEL,
            input: prompt,
        });

        if(!interaction || !interaction.output_text){
            throw new ApiError(500,"Error while generating content from AI")
        }
        return interaction.output_text.trim();
    }catch(error){
        throw new ApiError(500,error.message || "AI Error")
    }
}

async function generateContentFromFile(prompt,resumePath){
    try {
        const uploadedFile = await ai.files.upload({
        file: resumePath,
        config: { mimeType: "application/pdf" }
      });

      if(!uploadedFile){
        throw new ApiError(500,"Error uploading file to gemini")
      }
    
      const interaction = await ai.interactions.create({
        model:process.env.GEMINI_MODEL,
        input: [
          {type: "text", text: prompt},
          {
            type: "document",
            uri: uploadedFile.uri,
            mime_type: uploadedFile.mimeType
          }
        ],
      });
    
      if(!interaction || !interaction.output_text){
        throw new ApiError(500,"Error while generating content from AI")
      }
    
      return interaction.output_text.trim();
    } catch (error) {
        throw new ApiError(500,error.message || "AI Error")
        
    }
}


export {
    generateContent,
    generateContentFromFile
}