import type { LangCode } from "./languages";

export interface SeedSentence {
  // Native-language sentence with "..." marking the gap
  template: string;
  // The target-language word that fills the gap
  targetWord: string;
  // The translation of targetWord back into the native language (shown after answer)
  nativeWord: string;
}

type SeedMap = Partial<Record<LangCode, Partial<Record<LangCode, SeedSentence[]>>>>;

const ar_to_en: SeedSentence[] = [
  { template: "أشرب كوباً من ال... كل صباح.", targetWord: "Water", nativeWord: "ماء" },
  { template: "أكلت قطعة من ال... مع الجبن.", targetWord: "Bread", nativeWord: "خبز" },
  { template: "وصلت الطائرة إلى ال... متأخرة.", targetWord: "Airport", nativeWord: "مطار" },
  { template: "قلت له ... عندما دخل الغرفة.", targetWord: "Hello", nativeWord: "مرحباً" },
];

const ar_to_fr: SeedSentence[] = [
  { template: "أشرب كوباً من ال... كل صباح.", targetWord: "Eau", nativeWord: "ماء" },
  { template: "أكلت قطعة من ال... مع الجبن.", targetWord: "Pain", nativeWord: "خبز" },
  { template: "وصلت الطائرة إلى ال... متأخرة.", targetWord: "Aéroport", nativeWord: "مطار" },
  { template: "قلت له ... عندما دخل الغرفة.", targetWord: "Bonjour", nativeWord: "مرحباً" },
];

const ar_to_tr: SeedSentence[] = [
  { template: "أشرب كوباً من ال... كل صباح.", targetWord: "Su", nativeWord: "ماء" },
  { template: "أكلت قطعة من ال... مع الجبن.", targetWord: "Ekmek", nativeWord: "خبز" },
  { template: "وصلت الطائرة إلى ال... متأخرة.", targetWord: "Havalimanı", nativeWord: "مطار" },
  { template: "قلت له ... عندما دخل الغرفة.", targetWord: "Merhaba", nativeWord: "مرحباً" },
];

const ar_to_es: SeedSentence[] = [
  { template: "أشرب كوباً من ال... كل صباح.", targetWord: "Agua", nativeWord: "ماء" },
  { template: "أكلت قطعة من ال... مع الجبن.", targetWord: "Pan", nativeWord: "خبز" },
  { template: "وصلت الطائرة إلى ال... متأخرة.", targetWord: "Aeropuerto", nativeWord: "مطار" },
  { template: "قلت له ... عندما دخل الغرفة.", targetWord: "Hola", nativeWord: "مرحباً" },
];

const en_to_fr: SeedSentence[] = [
  { template: "I drink a glass of ... every morning.", targetWord: "Eau", nativeWord: "Water" },
  { template: "I ate a slice of ... with cheese.", targetWord: "Pain", nativeWord: "Bread" },
  { template: "The plane landed at the ... late.", targetWord: "Aéroport", nativeWord: "Airport" },
  { template: "I said ... when he walked in.", targetWord: "Bonjour", nativeWord: "Hello" },
];

const en_to_es: SeedSentence[] = [
  { template: "I drink a glass of ... every morning.", targetWord: "Agua", nativeWord: "Water" },
  { template: "I ate a slice of ... with cheese.", targetWord: "Pan", nativeWord: "Bread" },
  { template: "The plane landed at the ... late.", targetWord: "Aeropuerto", nativeWord: "Airport" },
  { template: "I said ... when he walked in.", targetWord: "Hola", nativeWord: "Hello" },
];

const en_to_de: SeedSentence[] = [
  { template: "I drink a glass of ... every morning.", targetWord: "Wasser", nativeWord: "Water" },
  { template: "I ate a slice of ... with cheese.", targetWord: "Brot", nativeWord: "Bread" },
  { template: "The plane landed at the ... late.", targetWord: "Flughafen", nativeWord: "Airport" },
  { template: "I said ... when he walked in.", targetWord: "Hallo", nativeWord: "Hello" },
];

const en_to_it: SeedSentence[] = [
  { template: "I drink a glass of ... every morning.", targetWord: "Acqua", nativeWord: "Water" },
  { template: "I ate a slice of ... with cheese.", targetWord: "Pane", nativeWord: "Bread" },
  { template: "The plane landed at the ... late.", targetWord: "Aeroporto", nativeWord: "Airport" },
  { template: "I said ... when he walked in.", targetWord: "Ciao", nativeWord: "Hello" },
];

const en_to_ja: SeedSentence[] = [
  { template: "I drink a glass of ... every morning.", targetWord: "水", nativeWord: "Water" },
  { template: "I ate a slice of ... with cheese.", targetWord: "パン", nativeWord: "Bread" },
  { template: "The plane landed at the ... late.", targetWord: "空港", nativeWord: "Airport" },
  { template: "I said ... when he walked in.", targetWord: "こんにちは", nativeWord: "Hello" },
];

const en_to_tr: SeedSentence[] = [
  { template: "I drink a glass of ... every morning.", targetWord: "Su", nativeWord: "Water" },
  { template: "I ate a slice of ... with cheese.", targetWord: "Ekmek", nativeWord: "Bread" },
  { template: "The plane landed at the ... late.", targetWord: "Havalimanı", nativeWord: "Airport" },
  { template: "I said ... when he walked in.", targetWord: "Merhaba", nativeWord: "Hello" },
];

const en_to_ar: SeedSentence[] = [
  { template: "I drink a glass of ... every morning.", targetWord: "ماء", nativeWord: "Water" },
  { template: "I ate a slice of ... with cheese.", targetWord: "خبز", nativeWord: "Bread" },
  { template: "The plane landed at the ... late.", targetWord: "مطار", nativeWord: "Airport" },
  { template: "I said ... when he walked in.", targetWord: "مرحباً", nativeWord: "Hello" },
];

const fr_to_en: SeedSentence[] = [
  { template: "Je bois un verre d'... chaque matin.", targetWord: "Water", nativeWord: "Eau" },
  { template: "J'ai mangé une tranche de ... avec du fromage.", targetWord: "Bread", nativeWord: "Pain" },
  { template: "L'avion a atterri à l'... en retard.", targetWord: "Airport", nativeWord: "Aéroport" },
  { template: "J'ai dit ... quand il est entré.", targetWord: "Hello", nativeWord: "Bonjour" },
];

const SEEDS: SeedMap = {
  ar: { en: ar_to_en, fr: ar_to_fr, tr: ar_to_tr, es: ar_to_es },
  en: { fr: en_to_fr, es: en_to_es, de: en_to_de, it: en_to_it, ja: en_to_ja, tr: en_to_tr, ar: en_to_ar },
  fr: { en: fr_to_en },
};

export function getSeedSentences(native: LangCode, target: LangCode): SeedSentence[] {
  return (
    SEEDS[native]?.[target] ?? [
      { template: "I drink a glass of ... every morning.", targetWord: "Water", nativeWord: "Water" },
      { template: "I ate a slice of ... with cheese.", targetWord: "Bread", nativeWord: "Bread" },
      { template: "The plane landed at the ... late.", targetWord: "Airport", nativeWord: "Airport" },
      { template: "I said ... when he walked in.", targetWord: "Hello", nativeWord: "Hello" },
    ]
  );
}
