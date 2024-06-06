import { useState } from "react";
import * as FileSystem from "expo-file-system";
import { genAI } from "../lib/gemini";
import { Results } from "../types/types";
import { prompt } from "./prompt";

export const useImageClassification = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<Results>({
    object: "",
    translations: {},
    phrases: {},
  });

  const classifyImage = async (imageUri: string) => {
    setIsLoading(true);
    setResults({
      object: "",
      translations: {},
      phrases: {},
    });

    try {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      const imageBase64 = await FileSystem.readAsStringAsync(imageUri, {
        encoding: FileSystem.EncodingType.Base64,
      });
      const image = {
        inlineData: {
          data: imageBase64,
          mimeType: "image/png",
        },
      };

      const result = await model.generateContent([prompt, image]);
      if (result?.response?.candidates?.length! > 0) {
        const parsedResult = result.response.text();
        try {
          const resultJSON = JSON.parse(parsedResult);
          if (resultJSON.object === "Not identified") {
            console.error("Não foi possível identificar o objeto na imagem.");
          } else {
            setResults(resultJSON);
          }
        } catch (error) {
          console.error("Erro ao analisar a resposta do modelo:", error);
        }
      } else {
        console.error("Nenhum resultado encontrado.");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return { classifyImage, results, isLoading };
};
