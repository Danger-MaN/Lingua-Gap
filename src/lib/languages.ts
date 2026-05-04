export type LangCode = "en" | "ar" | "fr" | "es" | "de" | "it" | "tr" | "ja" | "zh" | "ru" | "pt" | "hi";

export interface LangInfo {
  code: LangCode;
  name: string;
  nativeName: string;
  flag: string;
  bcp47: string; // for speechSynthesis
  rtl?: boolean;
}

export const LANGUAGES: LangInfo[] = [
  { code: "en", name: "English", nativeName: "English", flag: "🇬🇧", bcp47: "en-US" },
  { code: "ar", name: "Arabic", nativeName: "العربية", flag: "🇸🇦", bcp47: "ar-SA", rtl: true },
  { code: "fr", name: "French", nativeName: "Français", flag: "🇫🇷", bcp47: "fr-FR" },
  { code: "es", name: "Spanish", nativeName: "Español", flag: "🇪🇸", bcp47: "es-ES" },
  { code: "de", name: "German", nativeName: "Deutsch", flag: "🇩🇪", bcp47: "de-DE" },
  { code: "it", name: "Italian", nativeName: "Italiano", flag: "🇮🇹", bcp47: "it-IT" },
  { code: "tr", name: "Turkish", nativeName: "Türkçe", flag: "🇹🇷", bcp47: "tr-TR" },
  { code: "ja", name: "Japanese", nativeName: "日本語", flag: "🇯🇵", bcp47: "ja-JP" },
  { code: "zh", name: "Chinese", nativeName: "中文", flag: "🇨🇳", bcp47: "zh-CN" },
  { code: "ru", name: "Russian", nativeName: "Русский", flag: "🇷🇺", bcp47: "ru-RU" },
  { code: "pt", name: "Portuguese", nativeName: "Português", flag: "🇵🇹", bcp47: "pt-PT" },
  { code: "hi", name: "Hindi", nativeName: "हिन्दी", flag: "🇮🇳", bcp47: "hi-IN" },
];

export const getLang = (code: string) => LANGUAGES.find((l) => l.code === code);

export const CATEGORIES = ["food", "travel", "home", "greetings"] as const;
export type Category = typeof CATEGORIES[number];
