export type LangCode =
  | "en" | "ar" | "fr" | "es" | "de" | "it" | "tr" | "ja" | "zh" | "ru" | "pt" | "hi"
  | "ko" | "nl" | "sv" | "no" | "da" | "fi" | "pl" | "cs" | "sk" | "hu" | "ro" | "bg"
  | "el" | "uk" | "he" | "fa" | "ur" | "bn" | "ta" | "te" | "ml" | "mr" | "pa" | "gu"
  | "th" | "vi" | "id" | "ms" | "tl" | "sw" | "am" | "ha" | "yo" | "zu" | "af"
  | "sr" | "hr" | "sl" | "lt" | "lv" | "et" | "is" | "ga" | "cy" | "sq" | "mk"
  | "bs" | "ka" | "hy" | "az" | "kk" | "uz" | "mn" | "ne" | "si" | "km" | "lo" | "my"
  | "ca" | "eu" | "gl" | "lb" | "mt" | "yi" | "eo" | "la" | "ps" | "sd" | "ku";

export interface LangInfo {
  code: LangCode;
  name: string;
  nativeName: string;
  flag: string;
  bcp47: string;
  rtl?: boolean;
}

export const LANGUAGES: LangInfo[] = [
  // Major world languages
  { code: "en", name: "English", nativeName: "English", flag: "🇬🇧", bcp47: "en-US" },
  { code: "zh", name: "Chinese (Mandarin)", nativeName: "中文", flag: "🇨🇳", bcp47: "zh-CN" },
  { code: "es", name: "Spanish", nativeName: "Español", flag: "🇪🇸", bcp47: "es-ES" },
  { code: "hi", name: "Hindi", nativeName: "हिन्दी", flag: "🇮🇳", bcp47: "hi-IN" },
  { code: "ar", name: "Arabic", nativeName: "العربية", flag: "🇸🇦", bcp47: "ar-SA", rtl: true },
  { code: "pt", name: "Portuguese", nativeName: "Português", flag: "🇵🇹", bcp47: "pt-PT" },
  { code: "bn", name: "Bengali", nativeName: "বাংলা", flag: "🇧🇩", bcp47: "bn-BD" },
  { code: "ru", name: "Russian", nativeName: "Русский", flag: "🇷🇺", bcp47: "ru-RU" },
  { code: "ja", name: "Japanese", nativeName: "日本語", flag: "🇯🇵", bcp47: "ja-JP" },
  { code: "fr", name: "French", nativeName: "Français", flag: "🇫🇷", bcp47: "fr-FR" },
  { code: "de", name: "German", nativeName: "Deutsch", flag: "🇩🇪", bcp47: "de-DE" },
  { code: "ko", name: "Korean", nativeName: "한국어", flag: "🇰🇷", bcp47: "ko-KR" },
  { code: "tr", name: "Turkish", nativeName: "Türkçe", flag: "🇹🇷", bcp47: "tr-TR" },
  { code: "it", name: "Italian", nativeName: "Italiano", flag: "🇮🇹", bcp47: "it-IT" },
  { code: "vi", name: "Vietnamese", nativeName: "Tiếng Việt", flag: "🇻🇳", bcp47: "vi-VN" },
  { code: "fa", name: "Persian", nativeName: "فارسی", flag: "🇮🇷", bcp47: "fa-IR", rtl: true },
  { code: "ur", name: "Urdu", nativeName: "اردو", flag: "🇵🇰", bcp47: "ur-PK", rtl: true },
  { code: "pl", name: "Polish", nativeName: "Polski", flag: "🇵🇱", bcp47: "pl-PL" },
  { code: "uk", name: "Ukrainian", nativeName: "Українська", flag: "🇺🇦", bcp47: "uk-UA" },
  { code: "nl", name: "Dutch", nativeName: "Nederlands", flag: "🇳🇱", bcp47: "nl-NL" },
  { code: "th", name: "Thai", nativeName: "ไทย", flag: "🇹🇭", bcp47: "th-TH" },
  { code: "id", name: "Indonesian", nativeName: "Bahasa Indonesia", flag: "🇮🇩", bcp47: "id-ID" },
  { code: "ms", name: "Malay", nativeName: "Bahasa Melayu", flag: "🇲🇾", bcp47: "ms-MY" },
  { code: "tl", name: "Filipino", nativeName: "Filipino", flag: "🇵🇭", bcp47: "fil-PH" },
  { code: "sw", name: "Swahili", nativeName: "Kiswahili", flag: "🇰🇪", bcp47: "sw-KE" },
  { code: "he", name: "Hebrew", nativeName: "עברית", flag: "🇮🇱", bcp47: "he-IL", rtl: true },
  { code: "el", name: "Greek", nativeName: "Ελληνικά", flag: "🇬🇷", bcp47: "el-GR" },
  { code: "sv", name: "Swedish", nativeName: "Svenska", flag: "🇸🇪", bcp47: "sv-SE" },
  { code: "no", name: "Norwegian", nativeName: "Norsk", flag: "🇳🇴", bcp47: "nb-NO" },
  { code: "da", name: "Danish", nativeName: "Dansk", flag: "🇩🇰", bcp47: "da-DK" },
  { code: "fi", name: "Finnish", nativeName: "Suomi", flag: "🇫🇮", bcp47: "fi-FI" },
  { code: "is", name: "Icelandic", nativeName: "Íslenska", flag: "🇮🇸", bcp47: "is-IS" },
  { code: "cs", name: "Czech", nativeName: "Čeština", flag: "🇨🇿", bcp47: "cs-CZ" },
  { code: "sk", name: "Slovak", nativeName: "Slovenčina", flag: "🇸🇰", bcp47: "sk-SK" },
  { code: "hu", name: "Hungarian", nativeName: "Magyar", flag: "🇭🇺", bcp47: "hu-HU" },
  { code: "ro", name: "Romanian", nativeName: "Română", flag: "🇷🇴", bcp47: "ro-RO" },
  { code: "bg", name: "Bulgarian", nativeName: "Български", flag: "🇧🇬", bcp47: "bg-BG" },
  { code: "sr", name: "Serbian", nativeName: "Српски", flag: "🇷🇸", bcp47: "sr-RS" },
  { code: "hr", name: "Croatian", nativeName: "Hrvatski", flag: "🇭🇷", bcp47: "hr-HR" },
  { code: "sl", name: "Slovenian", nativeName: "Slovenščina", flag: "🇸🇮", bcp47: "sl-SI" },
  { code: "bs", name: "Bosnian", nativeName: "Bosanski", flag: "🇧🇦", bcp47: "bs-BA" },
  { code: "mk", name: "Macedonian", nativeName: "Македонски", flag: "🇲🇰", bcp47: "mk-MK" },
  { code: "sq", name: "Albanian", nativeName: "Shqip", flag: "🇦🇱", bcp47: "sq-AL" },
  { code: "lt", name: "Lithuanian", nativeName: "Lietuvių", flag: "🇱🇹", bcp47: "lt-LT" },
  { code: "lv", name: "Latvian", nativeName: "Latviešu", flag: "🇱🇻", bcp47: "lv-LV" },
  { code: "et", name: "Estonian", nativeName: "Eesti", flag: "🇪🇪", bcp47: "et-EE" },
  { code: "ga", name: "Irish", nativeName: "Gaeilge", flag: "🇮🇪", bcp47: "ga-IE" },
  { code: "cy", name: "Welsh", nativeName: "Cymraeg", flag: "🏴󠁧󠁢󠁷󠁬󠁳󠁿", bcp47: "cy-GB" },
  { code: "ca", name: "Catalan", nativeName: "Català", flag: "🇪🇸", bcp47: "ca-ES" },
  { code: "eu", name: "Basque", nativeName: "Euskara", flag: "🇪🇸", bcp47: "eu-ES" },
  { code: "gl", name: "Galician", nativeName: "Galego", flag: "🇪🇸", bcp47: "gl-ES" },
  { code: "lb", name: "Luxembourgish", nativeName: "Lëtzebuergesch", flag: "🇱🇺", bcp47: "lb-LU" },
  { code: "mt", name: "Maltese", nativeName: "Malti", flag: "🇲🇹", bcp47: "mt-MT" },
  { code: "ka", name: "Georgian", nativeName: "ქართული", flag: "🇬🇪", bcp47: "ka-GE" },
  { code: "hy", name: "Armenian", nativeName: "Հայերեն", flag: "🇦🇲", bcp47: "hy-AM" },
  { code: "az", name: "Azerbaijani", nativeName: "Azərbaycan", flag: "🇦🇿", bcp47: "az-AZ" },
  { code: "kk", name: "Kazakh", nativeName: "Қазақша", flag: "🇰🇿", bcp47: "kk-KZ" },
  { code: "uz", name: "Uzbek", nativeName: "Oʻzbekcha", flag: "🇺🇿", bcp47: "uz-UZ" },
  { code: "mn", name: "Mongolian", nativeName: "Монгол", flag: "🇲🇳", bcp47: "mn-MN" },
  { code: "ne", name: "Nepali", nativeName: "नेपाली", flag: "🇳🇵", bcp47: "ne-NP" },
  { code: "si", name: "Sinhala", nativeName: "සිංහල", flag: "🇱🇰", bcp47: "si-LK" },
  { code: "km", name: "Khmer", nativeName: "ខ្មែរ", flag: "🇰🇭", bcp47: "km-KH" },
  { code: "lo", name: "Lao", nativeName: "ລາວ", flag: "🇱🇦", bcp47: "lo-LA" },
  { code: "my", name: "Burmese", nativeName: "မြန်မာ", flag: "🇲🇲", bcp47: "my-MM" },
  { code: "ta", name: "Tamil", nativeName: "தமிழ்", flag: "🇮🇳", bcp47: "ta-IN" },
  { code: "te", name: "Telugu", nativeName: "తెలుగు", flag: "🇮🇳", bcp47: "te-IN" },
  { code: "ml", name: "Malayalam", nativeName: "മലയാളം", flag: "🇮🇳", bcp47: "ml-IN" },
  { code: "mr", name: "Marathi", nativeName: "मराठी", flag: "🇮🇳", bcp47: "mr-IN" },
  { code: "pa", name: "Punjabi", nativeName: "ਪੰਜਾਬੀ", flag: "🇮🇳", bcp47: "pa-IN" },
  { code: "gu", name: "Gujarati", nativeName: "ગુજરાતી", flag: "🇮🇳", bcp47: "gu-IN" },
  { code: "sd", name: "Sindhi", nativeName: "سنڌي", flag: "🇵🇰", bcp47: "sd-PK", rtl: true },
  { code: "ps", name: "Pashto", nativeName: "پښتو", flag: "🇦🇫", bcp47: "ps-AF", rtl: true },
  { code: "ku", name: "Kurdish", nativeName: "Kurdî", flag: "🏳️", bcp47: "ku" },
  { code: "am", name: "Amharic", nativeName: "አማርኛ", flag: "🇪🇹", bcp47: "am-ET" },
  { code: "ha", name: "Hausa", nativeName: "Hausa", flag: "🇳🇬", bcp47: "ha-NG" },
  { code: "yo", name: "Yoruba", nativeName: "Yorùbá", flag: "🇳🇬", bcp47: "yo-NG" },
  { code: "zu", name: "Zulu", nativeName: "isiZulu", flag: "🇿🇦", bcp47: "zu-ZA" },
  { code: "af", name: "Afrikaans", nativeName: "Afrikaans", flag: "🇿🇦", bcp47: "af-ZA" },
  { code: "yi", name: "Yiddish", nativeName: "ייִדיש", flag: "🏳️", bcp47: "yi", rtl: true },
  { code: "eo", name: "Esperanto", nativeName: "Esperanto", flag: "🏳️", bcp47: "eo" },
  { code: "la", name: "Latin", nativeName: "Latina", flag: "🏛️", bcp47: "la" },
];

export const getLang = (code: string) => LANGUAGES.find((l) => l.code === code);

export const CATEGORIES = ["food", "travel", "home", "greetings"] as const;
export type Category = typeof CATEGORIES[number];
