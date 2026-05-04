// Lightweight in-house i18n replacement to avoid Vite's broken optimize-deps
// state for the i18next package in this sandbox. Same API surface as the
// previous useTranslation() usage: t("key", { var }) and i18n.changeLanguage().

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

type Dict = Record<string, string>;
type Resources = Record<string, Dict>;

const resources: Resources = {
  en: {
    appName: "Lingua Gap",
    tagline: "Learn vocabulary the way your brain remembers — in context.",
    getStarted: "Get Started",
    iSpeak: "I speak",
    iWantToLearn: "I want to learn",
    continue: "Continue",
    dashboard: "Dashboard",
    training: "Training",
    addSentence: "Add sentence",
    addSentenceHint: "Write a sentence in your language and use “...” for the gap. Then enter the target word and its translation.",
    sentenceTemplate: "e.g. I drink a glass of ... every morning.",
    targetWord: "Target word",
    nativeWord: "Translation in your language",
    sentencesInBank: "Sentences in your bank",
    startTraining: "Start training",
    needMore: "Add {n} more sentence(s) to start training",
    yourSentences: "Your sentences",
    empty: "No sentences yet. Add your first one above.",
    mastered: "Mastered",
    accuracy: "Accuracy",
    pickAnswer: "Pick the correct word",
    translation: "Translation",
    next: "Next",
    finish: "Finish session",
    score: "Score",
    backToDashboard: "Back to dashboard",
    changeLanguages: "Change languages",
    replay: "Replay",
    newSession: "New session",
    sessionComplete: "Session complete",
    sessionCompleteDesc: "You answered {correct} of {total} correctly.",
    bulkAdd: "Bulk add",
    singleAdd: "Single",
    bulkHint: "One sentence per line. Format: sentence with ... | target word | translation",
    bulkExample: "I drink a glass of ... every morning. | water | ماء",
    bulkAddBtn: "Add all",
    bulkAdded: "Added {n} sentence(s)",
    bulkInvalid: "{n} line(s) skipped (invalid format)",
    confirmDelete: "Delete this sentence?",
    confirmDeleteDesc: "This will permanently remove “{word}” from your bank. This action cannot be undone.",
    cancel: "Cancel",
    delete: "Delete",
    progress: "Your progress",
    overallMastery: "Overall mastery",
    masteredCount: "Mastered",
    learningCount: "Learning",
    freshCount: "New",
    difficulty: "Difficulty",
    easy: "Easy",
    medium: "Medium",
    hard: "Hard",
    new: "New",
    manageSentences: "Manage sentences",
    manageSentencesDesc: "Add new sentences or edit your bank.",
    viewSentences: "View sentences",
    viewSentencesDesc: "Browse, listen to, and delete your saved sentences.",
    backToManage: "Back to add sentences",
    back: "Back",
    goToManage: "Add & manage sentences",
  },
  ar: {
    appName: "Lingua Gap",
    tagline: "تعلّم المفردات بالطريقة التي يتذكر بها دماغك — داخل السياق.",
    getStarted: "ابدأ الآن",
    iSpeak: "أنا أتحدث",
    iWantToLearn: "أريد أن أتعلم",
    continue: "متابعة",
    dashboard: "لوحة التحكم",
    training: "التدريب",
    addSentence: "أضف جملة",
    addSentenceHint: "اكتب جملة بلغتك واستخدم «...» لتحديد الفراغ، ثم أدخل الكلمة المستهدفة وترجمتها.",
    sentenceTemplate: "مثال: أشرب كوباً من ال... كل صباح.",
    targetWord: "الكلمة المستهدفة",
    nativeWord: "الترجمة بلغتك",
    sentencesInBank: "الجمل في بنكك",
    startTraining: "ابدأ التدريب",
    needMore: "أضف {n} جملة أخرى لبدء التدريب",
    yourSentences: "جملك",
    empty: "لا توجد جمل بعد. أضف أول جملة في الأعلى.",
    mastered: "مُتقنة",
    accuracy: "الدقة",
    pickAnswer: "اختر الكلمة الصحيحة",
    translation: "الترجمة",
    next: "التالي",
    finish: "إنهاء الجلسة",
    score: "النتيجة",
    backToDashboard: "العودة إلى لوحة التحكم",
    changeLanguages: "تغيير اللغات",
    replay: "إعادة النطق",
    newSession: "جلسة جديدة",
    sessionComplete: "اكتملت الجلسة",
    sessionCompleteDesc: "أجبت بشكل صحيح على {correct} من {total}.",
    bulkAdd: "إضافة جماعية",
    singleAdd: "إضافة فردية",
    bulkHint: "جملة واحدة في كل سطر. الصيغة: جملة مع ... | الكلمة المستهدفة | الترجمة",
    bulkExample: "أشرب كوباً من ال... كل صباح | water | ماء",
    bulkAddBtn: "أضف الكل",
    bulkAdded: "تمت إضافة {n} جملة",
    bulkInvalid: "تم تجاهل {n} سطر (صيغة غير صحيحة)",
    confirmDelete: "حذف هذه الجملة؟",
    confirmDeleteDesc: "سيتم حذف «{word}» نهائياً من بنك جملك. لا يمكن التراجع عن هذا الإجراء.",
    cancel: "إلغاء",
    delete: "حذف",
    progress: "تقدمك",
    overallMastery: "مستوى الإتقان العام",
    masteredCount: "مُتقنة",
    learningCount: "قيد التعلم",
    freshCount: "جديدة",
    difficulty: "الصعوبة",
    easy: "سهلة",
    medium: "متوسطة",
    hard: "صعبة",
    new: "جديدة",
    manageSentences: "إدارة الجمل",
    manageSentencesDesc: "أضف جملاً جديدة أو عدّل بنكك.",
    viewSentences: "عرض الجمل",
    viewSentencesDesc: "تصفّح جملك المحفوظة، استمع إليها، أو احذفها.",
    backToManage: "العودة إلى إضافة الجمل",
    back: "رجوع",
    goToManage: "إضافة وإدارة الجمل",
  },
  fr: {
    appName: "Lingua Gap",
    tagline: "Apprenez le vocabulaire comme votre cerveau s'en souvient — en contexte.",
    getStarted: "Commencer",
    iSpeak: "Je parle",
    iWantToLearn: "Je veux apprendre",
    continue: "Continuer",
    dashboard: "Tableau de bord",
    training: "Entraînement",
    addSentence: "Ajouter une phrase",
    addSentenceHint: "Écrivez une phrase dans votre langue et utilisez « ... » pour le trou. Puis entrez le mot cible et sa traduction.",
    sentenceTemplate: "ex. Je bois un verre d'... chaque matin.",
    targetWord: "Mot cible",
    nativeWord: "Traduction dans votre langue",
    sentencesInBank: "Phrases dans votre banque",
    startTraining: "Commencer l'entraînement",
    needMore: "Ajoutez {n} phrase(s) de plus pour commencer",
    yourSentences: "Vos phrases",
    empty: "Aucune phrase. Ajoutez la première ci-dessus.",
    mastered: "Maîtrisé",
    accuracy: "Précision",
    pickAnswer: "Choisissez le bon mot",
    translation: "Traduction",
    next: "Suivant",
    finish: "Terminer",
    score: "Score",
    backToDashboard: "Retour au tableau de bord",
    changeLanguages: "Changer de langues",
    replay: "Réécouter",
    newSession: "Nouvelle session",
    sessionComplete: "Session terminée",
    sessionCompleteDesc: "Vous avez {correct} bonnes réponses sur {total}.",
    bulkAdd: "Ajout groupé",
    singleAdd: "Une seule",
    bulkHint: "Une phrase par ligne. Format: phrase avec ... | mot cible | traduction",
    bulkExample: "Je bois un verre d'... chaque matin. | eau | ماء",
    bulkAddBtn: "Tout ajouter",
    bulkAdded: "{n} phrase(s) ajoutée(s)",
    bulkInvalid: "{n} ligne(s) ignorée(s) (format invalide)",
    confirmDelete: "Supprimer cette phrase ?",
    confirmDeleteDesc: "« {word} » sera définitivement retirée de votre banque. Action irréversible.",
    cancel: "Annuler",
    delete: "Supprimer",
    progress: "Votre progression",
    overallMastery: "Maîtrise globale",
    masteredCount: "Maîtrisées",
    learningCount: "En cours",
    freshCount: "Nouvelles",
    difficulty: "Difficulté",
    easy: "Facile",
    medium: "Moyenne",
    hard: "Difficile",
    new: "Nouvelle",
    manageSentences: "Gérer les phrases",
    manageSentencesDesc: "Ajoutez de nouvelles phrases ou modifiez votre banque.",
    viewSentences: "Voir les phrases",
    viewSentencesDesc: "Parcourez, écoutez et supprimez vos phrases.",
    backToManage: "Retour à l'ajout",
    back: "Retour",
    goToManage: "Ajouter et gérer",
  },
};

type Vars = Record<string, string | number>;

function interpolate(str: string, vars?: Vars): string {
  if (!vars) return str;
  return str.replace(/\{(\w+)\}/g, (_, k) => (k in vars ? String(vars[k]) : `{${k}}`));
}

const I18nCtx = createContext<{
  lang: string;
  setLang: (l: string) => void;
}>({ lang: "en", setLang: () => {} });

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<string>("en");
  // After hydration, optionally pick up a saved language from cookie
  useEffect(() => {
    if (typeof document === "undefined") return;
    const m = document.cookie.match(/(?:^|;\s*)lg_lang=([^;]+)/);
    if (m && resources[m[1]]) setLang(m[1]);
  }, []);
  useEffect(() => {
    if (typeof document !== "undefined") {
      document.cookie = `lg_lang=${lang}; path=/; max-age=31536000; samesite=lax`;
    }
  }, [lang]);
  return <I18nCtx.Provider value={{ lang, setLang }}>{children}</I18nCtx.Provider>;
}

export function useTranslation() {
  const { lang, setLang } = useContext(I18nCtx);
  const dict = resources[lang] ?? resources.en;
  const t = (key: string, vars?: Vars): string => {
    const raw = dict[key] ?? resources.en[key] ?? key;
    return interpolate(raw, vars);
  };
  return {
    t,
    i18n: {
      language: lang,
      changeLanguage: (l: string) => setLang(resources[l] ? l : "en"),
    },
  };
}
