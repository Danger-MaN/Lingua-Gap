import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { AppLoadingScreen } from "@/components/AppLoadingScreen";
import {
  useSettings,
  useSentences,
  accuracy,
  isMastered,
  masteryLevel,
  type Sentence,
} from "@/lib/store";
import { getLang } from "@/lib/languages";
import { useLanguageDirection } from "@/hooks/useLanguageDirection";
import { speak } from "@/lib/speech";

type DifficultyTag = "new" | "hard" | "medium" | "easy";

function difficultyOf(s: Sentence): DifficultyTag {
  if (s.attempts === 0) return "new";
  const m = masteryLevel(s);
  if (m >= 0.7) return "easy";
  if (m >= 0.35) return "medium";
  return "hard";
}

function SentencesPage() {
  const [settings, , settingsHydrated] = useSettings();
  const { sentences, remove, hydrated: sentencesHydrated } = useSentences();
  const { t } = useTranslation();
  const navigate = useNavigate();
  useLanguageDirection(settings.native);

  useEffect(() => {
    if (!settingsHydrated) return;
    if (!settings.native || !settings.target) navigate({ to: "/setup" });
  }, [settings, settingsHydrated, navigate]);

  const native = getLang(settings.native ?? "en");
  const target = getLang(settings.target ?? "en");

  const [pendingDelete, setPendingDelete] = useState<Sentence | null>(null);

  const sorted = useMemo(
    () =>
      [...sentences].sort((a, b) => {
        const am = isMastered(a) ? 1 : 0;
        const bm = isMastered(b) ? 1 : 0;
        if (am !== bm) return am - bm;
        return masteryLevel(a) - masteryLevel(b);
      }),
    [sentences],
  );

  if (!settingsHydrated || !sentencesHydrated) return <AppLoadingScreen />;

  const renderTemplate = (tpl: string, fill?: string) => {
    const parts = tpl.split("...");
    return (
      <>
        {parts[0]}
        <span className="inline-flex items-center justify-center mx-1 px-2 py-0.5 rounded-md bg-primary/15 text-primary border border-dashed border-primary/40 min-w-[3ch]">
          {fill ?? "…"}
        </span>
        {parts.slice(1).join("...")}
      </>
    );
  };

  const difficultyClass: Record<DifficultyTag, string> = {
    new: "bg-primary/15 text-primary",
    hard: "bg-destructive/15 text-destructive",
    medium: "bg-amber-500/15 text-amber-600 dark:text-amber-400",
    easy: "bg-success/15 text-success",
  };

  return (
    <main className="min-h-screen px-4 sm:px-6 py-8 max-w-4xl mx-auto">
      <header className="flex items-center justify-between mb-8 gap-3 flex-wrap">
        <div>
          <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
            {native?.flag} {native?.nativeName} → {target?.flag} {target?.nativeName}
          </div>
          <h1 className="font-display text-3xl md:text-4xl font-bold mt-1">
            {t("yourSentences")}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {sentences.length} · {t("viewSentencesDesc")}
          </p>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="ghost" size="sm">
            <Link to="/dashboard">← {t("dashboard")}</Link>
          </Button>
          <Button asChild variant="default" size="sm">
            <Link to="/manage">{t("backToManage")}</Link>
          </Button>
        </div>
      </header>

      <section className="rounded-3xl bg-card border border-border/60 p-6">
        {sentences.length === 0 ? (
          <p className="text-muted-foreground text-sm">{t("empty")}</p>
        ) : (
          <ul className="divide-y divide-border/60">
            {sorted.map((s) => {
              const diff = difficultyOf(s);
              return (
                <li key={s.id} className="py-4 flex items-start gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-base leading-relaxed">{renderTemplate(s.template)}</p>
                    <div className="text-sm mt-1 flex items-center gap-2 flex-wrap">
                      <span className="text-primary font-semibold">{s.targetWord}</span>
                      <span className="text-muted-foreground">=</span>
                      <span>{s.nativeWord}</span>
                      <span
                        className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full ${difficultyClass[diff]}`}
                      >
                        {t(diff)}
                      </span>
                      {isMastered(s) && (
                        <span className="text-[10px] uppercase tracking-wider bg-success/20 text-success px-2 py-0.5 rounded-full">
                          {t("mastered")}
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {t("accuracy")}: {Math.round(accuracy(s) * 100)}% ({s.correct}/{s.attempts})
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => speak(s.targetWord, settings.target ?? "en")}
                    aria-label="play"
                  >
                    🔊
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setPendingDelete(s)}
                    aria-label="delete"
                  >
                    ✕
                  </Button>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      <AlertDialog
        open={pendingDelete !== null}
        onOpenChange={(open) => !open && setPendingDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("confirmDelete")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("confirmDeleteDesc", { word: pendingDelete?.targetWord ?? "" })}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("cancel")}</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (pendingDelete) remove(pendingDelete.id);
                setPendingDelete(null);
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {t("delete")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </main>
  );
}

export const Route = createFileRoute("/sentences")({
  component: SentencesPage,
});
