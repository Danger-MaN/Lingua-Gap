import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo } from "react";
import { useTranslation } from "@/lib/i18n";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { AppLoadingScreen } from "@/components/AppLoadingScreen";
import {
  useSettings,
  useSentences,
  computeProgress,
  MIN_SENTENCES,
} from "@/lib/store";
import { getLang } from "@/lib/languages";
import { useLanguageDirection } from "@/hooks/useLanguageDirection";

function DashboardPage() {
  const [settings, , settingsHydrated] = useSettings();
  const { sentences, hydrated: sentencesHydrated } = useSentences();
  const { t } = useTranslation();
  const navigate = useNavigate();
  useLanguageDirection(settings.native);

  useEffect(() => {
    if (!settingsHydrated) return;
    if (!settings.native || !settings.target) navigate({ to: "/setup" });
  }, [settings, settingsHydrated, navigate]);

  const native = getLang(settings.native ?? "en");
  const target = getLang(settings.target ?? "en");

  const remaining = Math.max(0, MIN_SENTENCES - sentences.length);
  const progress = Math.min(100, (sentences.length / MIN_SENTENCES) * 100);
  const stats = useMemo(() => computeProgress(sentences), [sentences]);

  if (!settingsHydrated || !sentencesHydrated) return <AppLoadingScreen />;

  return (
    <main className="min-h-screen px-4 sm:px-6 py-8 max-w-4xl mx-auto">
      <header className="flex items-center justify-between mb-6">
        <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
          {native?.flag} {native?.nativeName} → {target?.flag} {target?.nativeName}
        </div>
        <Button asChild variant="ghost" size="sm">
          <Link to="/setup">{t("changeLanguages")}</Link>
        </Button>
      </header>

      <h1 className="font-display text-4xl md:text-5xl font-bold text-center mb-6">
        {t("appName")}
      </h1>

      <motion.section
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-3xl bg-[image:var(--gradient-card)] border border-border/60 p-6 shadow-[var(--shadow-soft)] mb-6"
      >
        <div className="flex items-end justify-between mb-3 gap-3 flex-wrap">
          <div>
            <div className="text-sm text-muted-foreground">{t("sentencesInBank")}</div>
            <div className="font-display text-5xl font-bold mt-1">
              {sentences.length}
              <span className="text-2xl text-muted-foreground"> / {MIN_SENTENCES}+</span>
            </div>
          </div>
          <Button
            variant="hero"
            size="lg"
            disabled={sentences.length < MIN_SENTENCES}
            onClick={() => navigate({ to: "/training" })}
          >
            {t("startTraining")}
          </Button>
        </div>
        <div className="h-2 rounded-full bg-secondary overflow-hidden">
          <motion.div
            className="h-full bg-[image:var(--gradient-hero)]"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.6 }}
          />
        </div>
        {remaining > 0 && (
          <p className="text-sm text-muted-foreground mt-3">{t("needMore", { n: remaining })}</p>
        )}
      </motion.section>

      {sentences.length > 0 && (
        <section className="rounded-3xl bg-card border border-border/60 p-6 mb-6">
          <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
            <h2 className="font-display text-xl font-semibold">{t("progress")}</h2>
            <div className="text-sm text-muted-foreground">
              {t("overallMastery")}:{" "}
              <span className="font-bold text-foreground">
                {Math.round(stats.overallMastery * 100)}%
              </span>
            </div>
          </div>
          <div className="h-3 rounded-full bg-secondary overflow-hidden mb-4">
            <motion.div
              className="h-full bg-[image:var(--gradient-hero)]"
              initial={{ width: 0 }}
              animate={{ width: `${stats.overallMastery * 100}%` }}
              transition={{ duration: 0.6 }}
            />
          </div>
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="rounded-2xl bg-success/10 border border-success/30 p-3">
              <div className="font-display text-2xl font-bold text-success">{stats.mastered}</div>
              <div className="text-xs text-muted-foreground mt-1">{t("masteredCount")}</div>
            </div>
            <div className="rounded-2xl bg-amber-500/10 border border-amber-500/30 p-3">
              <div className="font-display text-2xl font-bold text-amber-600 dark:text-amber-400">
                {stats.learning}
              </div>
              <div className="text-xs text-muted-foreground mt-1">{t("learningCount")}</div>
            </div>
            <div className="rounded-2xl bg-primary/10 border border-primary/30 p-3">
              <div className="font-display text-2xl font-bold text-primary">{stats.fresh}</div>
              <div className="text-xs text-muted-foreground mt-1">{t("freshCount")}</div>
            </div>
          </div>
        </section>
      )}

      <section className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <Link
          to="/manage"
          className="group rounded-3xl bg-card border border-border/60 p-6 hover:border-primary/60 hover:shadow-[var(--shadow-soft)] transition-all"
        >
          <div className="text-3xl mb-3">✍️</div>
          <h3 className="font-display text-lg font-semibold group-hover:text-primary transition-colors">
            {t("manageSentences")}
          </h3>
          <p className="text-sm text-muted-foreground mt-1">{t("manageSentencesDesc")}</p>
        </Link>
        <Link
          to="/sentences"
          className="group rounded-3xl bg-card border border-border/60 p-6 hover:border-primary/60 hover:shadow-[var(--shadow-soft)] transition-all"
        >
          <div className="text-3xl mb-3">📚</div>
          <h3 className="font-display text-lg font-semibold group-hover:text-primary transition-colors">
            {t("viewSentences")} ({sentences.length})
          </h3>
          <p className="text-sm text-muted-foreground mt-1">{t("viewSentencesDesc")}</p>
        </Link>
      </section>
    </main>
  );
}

export const Route = createFileRoute("/dashboard")({
  component: DashboardPage,
});
