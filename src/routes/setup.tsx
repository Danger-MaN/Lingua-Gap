import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useTranslation } from "@/lib/i18n";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { AppLoadingScreen } from "@/components/AppLoadingScreen";
import { LANGUAGES, type LangCode } from "@/lib/languages";
import { useSettings, useSentences } from "@/lib/store";
import { useLanguageDirection } from "@/hooks/useLanguageDirection";

function SetupPage() {
  const [settings, setSettings, settingsHydrated] = useSettings();
  const { seedIfEmpty, hydrated: sentencesHydrated } = useSentences();
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [native, setNative] = useState<LangCode | null>(settings.native);
  const [target, setTarget] = useState<LangCode | null>(settings.target);
  useLanguageDirection(native);

  useEffect(() => {
    if (settings.native && settings.target) {
      setNative(settings.native);
      setTarget(settings.target);
    }
  }, [settings.native, settings.target]);

  if (!settingsHydrated || !sentencesHydrated) return <AppLoadingScreen />;

  const handleNative = (code: LangCode) => {
    setNative(code);
    i18n.changeLanguage(code);
  };

  const canContinue = native && target && native !== target;

  const submit = () => {
    if (!canContinue) return;
    setSettings({ native, target });
    seedIfEmpty(native!, target!);
    navigate({ to: "/dashboard" });
  };

  return (
    <main className="min-h-screen px-6 py-12 max-w-3xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display text-4xl md:text-5xl font-bold mb-10 text-center">
          {t("appName")}
        </h1>

        <Section title={t("iSpeak")}>
          <LangGrid value={native} onChange={handleNative} excluded={target} />
        </Section>

        <Section title={t("iWantToLearn")}>
          <LangGrid value={target} onChange={(c) => setTarget(c)} excluded={native} />
        </Section>

        <div className="mt-12 flex justify-center">
          <Button variant="hero" size="xl" disabled={!canContinue} onClick={submit}>
            {t("continue")} →
          </Button>
        </div>
      </motion.div>
    </main>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-10">
      <h2 className="text-sm uppercase tracking-[0.2em] text-muted-foreground mb-4">{title}</h2>
      {children}
    </div>
  );
}

function LangGrid({
  value,
  onChange,
  excluded,
}: {
  value: LangCode | null;
  onChange: (c: LangCode) => void;
  excluded: LangCode | null;
}) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
      {LANGUAGES.map((l) => {
        const disabled = l.code === excluded;
        const active = l.code === value;
        return (
          <button
            key={l.code}
            disabled={disabled}
            onClick={() => onChange(l.code)}
            className={`rounded-2xl border p-4 text-start transition-all ${
              active
                ? "border-primary bg-primary/10 shadow-[var(--shadow-soft)]"
                : "border-border/60 bg-card hover:border-primary/40"
            } ${disabled ? "opacity-30 cursor-not-allowed" : ""}`}
          >
            <div className="text-2xl">{l.flag}</div>
            <div className="mt-2 font-semibold">{l.nativeName}</div>
            <div className="text-xs text-muted-foreground">{l.name}</div>
          </button>
        );
      })}
    </div>
  );
}

export const Route = createFileRoute("/setup")({
  component: SetupPage,
});
