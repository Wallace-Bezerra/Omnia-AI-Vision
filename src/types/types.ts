export interface Results {
  object: string;
  translations: {
    [key: string]: string;
  };
  phrases: {
    [key: string]: string;
  };
}

export type LanguageKey =
  | "Inglês"
  | "Espanhol"
  | "Francês"
  | "Alemão"
  | "Chinês"
  | "Português (BR)"
  | "Português (PT)"
  | "Italiano"
  | "Russo"
  | "Japonês"
  | "Coreano"
  | "Árabe"
  | "Indiano"
  | "Turco"
  | "Polonês"
  | "Holandês"
  | "Indonésio";
