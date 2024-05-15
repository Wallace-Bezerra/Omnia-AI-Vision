import * as Speech from "expo-speech";
import { tags } from "../utils/languageUtils";
import { LanguageKey } from "../types/types";

export const speakService = (text: string, selectedLanguage: LanguageKey) => {
  Speech.speak(text, {
    language: tags[selectedLanguage],
  });
};
