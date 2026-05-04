import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "@/lib/i18n";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { AppLoadingScreen } from "@/components/AppLoadingScreen";
import {
  useSettings,
  useSentences,
  difficultyWeight,
  MIN_SENTENCES,
  type Sentence,
} from "@/lib/store";
import { useLanguageDirection } from "@/hooks/useLanguageDirection";
import { speak } from "@/lib/speech";

interface Question {
  sentence: Sentence;
  options: string[];
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function buildQuestion(sentences: Sentence[], lastId?: string): Question {
  // Weighted pick: harder sentences (low mastery) appear far more often than easy ones.
  const pool = sentences.length > 1 ? sentences.filter((s) => s.id !== lastId) : sentences;
  const weights = pool.map((s) => difficultyWeight(s));
  const total = weights.reduce((sum, x) => sum + x, 0);
  let r = Math.random() * total;
  let target = pool[0];
  for (let i = 0; i < pool.length; i++) {
    r -= weights[i];
    if (r <= 0) {
      target = pool[i];
      break;
    }
  }
  // Distractors: pull random target-words from the user's other sentences
  const others = shuffle(
    sentences.filter((s) => s.id !== target.id && s.targetWord !== target.targetWord),
  ).slice(0, 3);
  const options = shuffle([target.targetWord, ...others.map((o) => o.targetWord)]);
  return { sentence: target, options };
}

function TrainingPage() {
  const [settings, , settingsHydrated] = useSettings();
  const { sentences, recordAnswer, hydrated: sentencesHydrated } = useSentences();
  const { t } = useTranslation();
  const navigate = useNavigate();
  useLanguageDirection(settings.native);

  const [question, setQuestion] = useState<Question | null>(null);
  const [picked, setPicked] = useState<string | null>(null);
  const [stats, setStats] = useState({ correct: 0, total: 0 });
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!settingsHydrated || !sentencesHydrated) return;
    if (!settings.native || !settings.target) navigate({ to: "/setup" });
    else if (sentences.length < MIN_SENTENCES) navigate({ to: "/dashboard" });
  }, [settings, settingsHydrated, sentences.length, sentencesHydrated, navigate]);

  const next = useMemo(
    () => () => {
      if (sentences.length < MIN_SENTENCES) return;
      setPicked(null);
      setQuestion((prev) => buildQuestion(sentences, prev?.sentence.id));
    },
    [sentences],
  );

  useEffect(() => {
    if (!question && sentences.length >= MIN_SENTENCES) next();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!settingsHydrated || !sentencesHydrated) return <AppLoadingScreen />;

  if (!question) return null;

  const handlePick = (opt: string) => {
    if (picked) return;
    setPicked(opt);
    const correct = opt === question.sentence.targetWord;
    recordAnswer(question.sentence.id, correct);
    setStats((s) => ({ correct: s.correct + (correct ? 1 : 0), total: s.total + 1 }));
    speak(question.sentence.targetWord, settings.target ?? "en");
  };

  const handleNext = () => {
    if (stats.total >= 8) {
      setDone(true);
      return;
    }
    next();
  };

  const restart = () => {
    setStats({ correct: 0, total: 0 });
    setDone(false);
    next();
  };

  const parts = question.sentence.template.split("...");
  const fill = picked ? question.sentence.targetWord : null;

  return (
    <main className="min-h-screen px-4 sm:px-6 py-8 max-w-2xl mx-auto flex flex-col">
      <header className="flex items-center justify-between mb-8">
        <Button asChild variant="ghost" size="sm">
          <Link to="/dashboard">←</Link>
        </Button>
        <div className="text-sm text-muted-foreground">
          {t("score")}:{" "}
          <span className="font-bold text-foreground">
            {stats.correct}/{stats.total}
          </span>
        </div>
      </header>

      {done ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex-1 flex flex-col items-center justify-center text-center"
        >
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="font-display text-3xl font-bold">{t("sessionComplete")}</h2>
          <p className="text-muted-foreground mt-3">
            {t("sessionCompleteDesc", { correct: stats.correct, total: stats.total })}
          </p>
          <div className="mt-8 flex gap-3 flex-wrap justify-center">
            <Button variant="hero" size="lg" onClick={restart}>
              {t("newSession")}
            </Button>
            <Button asChild variant="soft" size="lg">
              <Link to="/dashboard">{t("backToDashboard")}</Link>
            </Button>
          </div>
        </motion.div>
      ) : (
        <AnimatePresence mode="wait">
          <motion.div
            key={question.sentence.id + stats.total}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.35 }}
            className="flex-1 flex flex-col"
          >
            <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-3">
              {t("pickAnswer")}
            </div>
            <div className="rounded-3xl bg-[image:var(--gradient-card)] border border-border/60 p-8 shadow-[var(--shadow-soft)] mb-4">
              <p className="font-display text-2xl md:text-3xl leading-relaxed">
                {parts[0]}
                <span className="inline-flex items-center justify-center mx-2 px-4 py-1 rounded-xl bg-primary/15 text-primary border-2 border-dashed border-primary/40 min-w-[5ch]">
                  {fill ?? "____"}
                </span>
                {parts.slice(1).join("...")}
              </p>
            </div>

            {picked && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 rounded-2xl border border-border/60 bg-card p-4 text-center"
              >
                <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-1">
                  {t("translation")}
                </div>
                <div className="text-lg">
                  <span className="text-primary font-bold">{question.sentence.targetWord}</span>
                  <span className="text-muted-foreground mx-2">=</span>
                  <span className="font-medium">{question.sentence.nativeWord}</span>
                </div>
              </motion.div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {question.options.map((opt) => {
                const isCorrect = opt === question.sentence.targetWord;
                const isPicked = picked === opt;
                const reveal = picked !== null;
                let cls = "border-border/60 bg-card hover:border-primary/40";
                if (reveal && isCorrect) cls = "border-success bg-success/10 text-success";
                else if (reveal && isPicked)
                  cls = "border-destructive bg-destructive/10 text-destructive";
                else if (reveal) cls = "border-border/40 bg-card opacity-60";
                return (
                  <button
                    key={opt}
                    onClick={() => handlePick(opt)}
                    disabled={!!picked}
                    className={`rounded-2xl border-2 p-5 text-lg font-medium transition-all text-start ${cls}`}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>

            {picked && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 flex items-center justify-between gap-3"
              >
                <Button
                  variant="ghost"
                  onClick={() => speak(question.sentence.targetWord, settings.target ?? "en")}
                >
                  🔊 {t("replay")}
                </Button>
                <Button variant="hero" size="lg" onClick={handleNext}>
                  {stats.total >= 8 ? t("finish") : t("next")} →
                </Button>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      )}
    </main>
  );
}

export const Route = createFileRoute("/training")({
  component: TrainingPage,
});
