import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { LangCode } from "./languages";
import { getSeedSentences } from "./seedSentences";
import { readJSON, writeJSON } from "./storage";

export interface Sentence {
  id: string;
  template: string;
  targetWord: string;
  nativeWord: string;
  correct: number;
  attempts: number;
}

export interface Settings {
  native: LangCode | null;
  target: LangCode | null;
}

const SETTINGS_KEY = "lg_settings";
const SENTENCES_KEY_LEGACY = "lg_sentences";
const sentencesKeyFor = (native: LangCode | null, target: LangCode | null) =>
  native && target ? `lg_sentences__${native}__${target}` : null;
export const MIN_SENTENCES = 4;

interface AppStateValue {
  hydrated: boolean;
  settings: Settings;
  sentences: Sentence[];
  setSettings: (settings: Settings) => void;
  seedIfEmpty: (native: LangCode, target: LangCode) => void;
  addSentence: (sentence: Omit<Sentence, "id" | "correct" | "attempts">) => void;
  addSentences: (sentences: Omit<Sentence, "id" | "correct" | "attempts">[]) => number;
  removeSentence: (id: string) => void;
  recordAnswer: (id: string, correct: boolean) => void;
  clearSentences: () => void;
}

const AppStateContext = createContext<AppStateValue | null>(null);

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [hydrated, setHydrated] = useState(false);
  const [settings, setSettingsState] = useState<Settings>({ native: null, target: null });
  const [sentences, setSentences] = useState<Sentence[]>([]);

  // Load settings + per-language sentences on mount, with one-time legacy migration.
  useEffect(() => {
    const loaded = readJSON<Settings>(SETTINGS_KEY, { native: null, target: null });
    setSettingsState(loaded);
    const key = sentencesKeyFor(loaded.native, loaded.target);
    if (key) {
      let stored = readJSON<Sentence[]>(key, []);
      // One-time migration: if this language pair has no bank but the legacy
      // global bank exists, move it under the current pair.
      if (stored.length === 0) {
        const legacy = readJSON<Sentence[]>(SENTENCES_KEY_LEGACY, []);
        if (legacy.length > 0) {
          stored = legacy;
          writeJSON(key, legacy);
          writeJSON(SENTENCES_KEY_LEGACY, []);
        }
      }
      setSentences(stored);
    } else {
      setSentences([]);
    }
    setHydrated(true);
  }, []);

  // When the language pair changes, swap the active sentence bank.
  useEffect(() => {
    if (!hydrated) return;
    const key = sentencesKeyFor(settings.native, settings.target);
    setSentences(key ? readJSON<Sentence[]>(key, []) : []);
  }, [hydrated, settings.native, settings.target]);

  const setSettings = useCallback((next: Settings) => {
    writeJSON(SETTINGS_KEY, next);
    setSettingsState(next);
  }, []);

  const persistSentences = useCallback(
    (updater: (prev: Sentence[]) => Sentence[]) => {
      const key = sentencesKeyFor(settings.native, settings.target);
      setSentences((prev) => {
        const next = updater(prev);
        if (key) writeJSON(key, next);
        return next;
      });
    },
    [settings.native, settings.target],
  );

  const seedIfEmpty = useCallback(
    (native: LangCode, target: LangCode) => {
      persistSentences((prev) => {
        if (prev.length > 0) return prev;
        return getSeedSentences(native, target).map((s) => ({
          id: crypto.randomUUID(),
          template: s.template,
          targetWord: s.targetWord,
          nativeWord: s.nativeWord,
          correct: 0,
          attempts: 0,
        }));
      });
    },
    [persistSentences],
  );

  const addSentence = useCallback(
    (sentence: Omit<Sentence, "id" | "correct" | "attempts">) => {
      persistSentences((prev) => [
        ...prev,
        { ...sentence, id: crypto.randomUUID(), correct: 0, attempts: 0 },
      ]);
    },
    [persistSentences],
  );

  const addSentences = useCallback(
    (items: Omit<Sentence, "id" | "correct" | "attempts">[]) => {
      let added = 0;
      persistSentences((prev) => {
        const fresh = items.map((s) => ({
          ...s,
          id: crypto.randomUUID(),
          correct: 0,
          attempts: 0,
        }));
        added = fresh.length;
        return [...prev, ...fresh];
      });
      return added;
    },
    [persistSentences],
  );

  const removeSentence = useCallback(
    (id: string) => {
      persistSentences((prev) => prev.filter((sentence) => sentence.id !== id));
    },
    [persistSentences],
  );

  const recordAnswer = useCallback(
    (id: string, correct: boolean) => {
      persistSentences((prev) =>
        prev.map((sentence) =>
          sentence.id === id
            ? {
                ...sentence,
                attempts: sentence.attempts + 1,
                correct: sentence.correct + (correct ? 1 : 0),
              }
            : sentence,
        ),
      );
    },
    [persistSentences],
  );

  const clearSentences = useCallback(() => {
    const key = sentencesKeyFor(settings.native, settings.target);
    if (key) writeJSON(key, []);
    setSentences([]);
  }, [settings.native, settings.target]);

  const value = useMemo(
    () => ({
      hydrated,
      settings,
      sentences,
      setSettings,
      seedIfEmpty,
      addSentence,
      addSentences,
      removeSentence,
      recordAnswer,
      clearSentences,
    }),
    [hydrated, settings, sentences, setSettings, seedIfEmpty, addSentence, addSentences, removeSentence, recordAnswer, clearSentences],
  );

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
}

function useAppState() {
  const context = useContext(AppStateContext);
  if (!context) throw new Error("useAppState must be used within AppStateProvider");
  return context;
}

export function useSettings() {
  const { settings, setSettings, hydrated } = useAppState();
  return [settings, setSettings, hydrated] as const;
}

export function useSentences() {
  const {
    sentences,
    addSentence,
    addSentences,
    removeSentence,
    recordAnswer,
    seedIfEmpty,
    clearSentences,
    hydrated,
  } = useAppState();

  return {
    sentences,
    add: addSentence,
    addMany: addSentences,
    remove: removeSentence,
    recordAnswer,
    seedIfEmpty,
    clear: clearSentences,
    hydrated,
  };
}

export const accuracy = (sentence: Sentence) =>
  sentence.attempts === 0 ? 0 : sentence.correct / sentence.attempts;

export const isMastered = (sentence: Sentence) => sentence.attempts >= 3 && accuracy(sentence) >= 0.8;

// Mastery level 0..1 — combines accuracy with experience (more attempts = more confident)
export function masteryLevel(sentence: Sentence): number {
  if (sentence.attempts === 0) return 0;
  const acc = accuracy(sentence);
  const experience = Math.min(1, sentence.attempts / 5); // saturates at 5 attempts
  return acc * experience;
}

// Weight for picking sentences during training: harder sentences appear more often.
// New sentences (0 attempts) get a strong boost so user sees them.
export function difficultyWeight(sentence: Sentence): number {
  if (sentence.attempts === 0) return 5;
  const m = masteryLevel(sentence);
  // Mastered → minimal exposure (0.15), struggling → high exposure (up to ~4)
  return 0.15 + Math.pow(1 - m, 2) * 4;
}

export interface ProgressStats {
  total: number;
  mastered: number;
  learning: number;
  fresh: number;
  overallMastery: number; // 0..1
  totalAttempts: number;
  totalCorrect: number;
}

export function computeProgress(sentences: Sentence[]): ProgressStats {
  const total = sentences.length;
  if (total === 0) {
    return { total: 0, mastered: 0, learning: 0, fresh: 0, overallMastery: 0, totalAttempts: 0, totalCorrect: 0 };
  }
  let mastered = 0;
  let fresh = 0;
  let masterySum = 0;
  let totalAttempts = 0;
  let totalCorrect = 0;
  for (const s of sentences) {
    if (isMastered(s)) mastered++;
    if (s.attempts === 0) fresh++;
    masterySum += masteryLevel(s);
    totalAttempts += s.attempts;
    totalCorrect += s.correct;
  }
  return {
    total,
    mastered,
    fresh,
    learning: total - mastered - fresh,
    overallMastery: masterySum / total,
    totalAttempts,
    totalCorrect,
  };
}