
import { GoogleGenAI, Type } from "@google/genai";
import { CarSpecs, ComparisonInsight } from "../types";

const getAIInstance = () => {
  return new GoogleGenAI({ apiKey: process.env.API_KEY || "" });
};

export const generateCarImage = async (carName: string): Promise<string | undefined> => {
  const ai = getAIInstance();
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            text: `Photorealistic high-fidelity image of the actual ${carName}. The car must be exactly as manufactured by the brand, matching its authentic bodywork, front grille, specific LED headlamp design, and stock wheels. Professional studio automotive lighting, 8k UHD, clean neutral background, side profile or three-quarter view to show distinct design features. No modifications, just the original factory version.`,
          },
        ],
      },
      config: {
        imageConfig: {
          aspectRatio: "16:9"
        }
      }
    });

    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
  } catch (error) {
    console.error("Failed to generate car image:", error);
  }
  return undefined;
};

export const fetchCarSpecs = async (carName: string): Promise<CarSpecs> => {
  const ai = getAIInstance();
  
  // Fetch specs and generate image in parallel
  const specsPromise = ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Forneça as especificações técnicas detalhadas do carro: ${carName}. Seja o mais preciso possível para o mercado brasileiro, incluindo detalhes de conforto e acabamento.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          brand: { type: Type.STRING },
          model: { type: Type.STRING },
          year: { type: Type.INTEGER },
          price: { type: Type.STRING, description: "Preço estimado ou sugerido no Brasil" },
          engine: { type: Type.STRING },
          power: { type: Type.STRING },
          torque: { type: Type.STRING },
          transmission: { type: Type.STRING },
          fuelType: { type: Type.STRING },
          consumptionCity: { type: Type.STRING },
          consumptionHighway: { type: Type.STRING },
          acceleration0to100: { type: Type.STRING },
          topSpeed: { type: Type.STRING },
          bootSpace: { type: Type.STRING },
          dimensions: { type: Type.STRING },
          weight: { type: Type.STRING },
          rearAirCon: { type: Type.STRING, description: "Possui ar condicionado traseiro? (Ex: Sim, dutos centrais / Não)" },
          multimediaSize: { type: Type.STRING, description: "Tamanho da tela multimídia em polegadas" },
          doorQuality: { type: Type.STRING, description: "Qualidade do acabamento das portas dianteiras e traseiras (Soft touch, plástico rígido, etc)" },
          driverSeatAdjustments: { type: Type.STRING, description: "Ajustes do banco do motorista (Manual ou Elétrico e quantidade de posições)" },
          passengerSeatAdjustments: { type: Type.STRING, description: "Ajustes do banco do passageiro (Manual ou Elétrico)" },
        },
        required: ["brand", "model", "year", "engine", "power", "rearAirCon", "multimediaSize", "doorQuality", "driverSeatAdjustments", "passengerSeatAdjustments"]
      },
    },
  });

  const imagePromise = generateCarImage(carName);

  const [specsResponse, imageUrl] = await Promise.all([specsPromise, imagePromise]);
  const specs = JSON.parse(specsResponse.text || "{}") as CarSpecs;
  
  return { ...specs, imageUrl };
};

export const fetchComparisonInsights = async (cars: CarSpecs[]): Promise<ComparisonInsight> => {
  const ai = getAIInstance();
  const carsStr = cars.map(c => `${c.brand} ${c.model} (${c.year})`).join(", ");
  
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Realize uma análise comparativa profunda e exaustiva entre estes carros: ${carsStr}. 
    Leve em consideração performance, economia, tecnologia embarcada (tamanho de multimídia), conforto (ar traseiro, ajustes elétricos/manuais dos bancos), e qualidade real dos materiais (acabamento de portas). 
    
    Por favor, forneça uma lista MAIOR e mais DETALHADA de insights:
    - Pelo menos 8 pontos positivos (pros) destacando as vantagens competitivas entre os modelos.
    - Pelo menos 8 pontos de atenção ou negativos (cons) indicando onde cada modelo peca ou fica atrás do concorrente.
    - Um veredito final robusto.
    - Um público-alvo bem definido.
    
    Responda em Português.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          pros: { 
            type: Type.ARRAY, 
            items: { type: Type.STRING },
            description: "Lista extensa de benefícios e vantagens comparativas" 
          },
          cons: { 
            type: Type.ARRAY, 
            items: { type: Type.STRING },
            description: "Lista extensa de desvantagens e pontos que requerem atenção" 
          },
          verdict: { type: Type.STRING, description: "Conclusão detalhada sobre qual carro vence em quais categorias" },
          targetAudience: { type: Type.STRING },
        },
        required: ["pros", "cons", "verdict", "targetAudience"]
      },
    },
  });

  return JSON.parse(response.text || "{}") as ComparisonInsight;
};
