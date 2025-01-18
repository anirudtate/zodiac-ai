import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY!);

export async function getAstroResponse(prompt: string) {
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });
  
  const result = await model.generateContent(`You are a knowledgeable and compassionate AI astrologer. Please provide a thoughtful response to the following query:

${prompt}

Guidelines:
- Keep responses concise yet insightful
- Use markdown for formatting
- Focus on practical guidance and positive insights
- Maintain a warm, professional tone`);
  
  return result.response.text();
} 