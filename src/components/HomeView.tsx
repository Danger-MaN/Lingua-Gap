
import { Link, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useTranslation } from "@/lib/i18n";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AppLoadingScreen } from "@/components/AppLoadingScreen";
import { useSettings, useSentences } from "@/lib/store";
import { useLanguageDirection } from "@/hooks/useLanguageDirection";

export function HomeView() {
  const { t } = useTranslation();
  const [settings, , settingsHydrated] = useSettings();
  const { sentences, hydrated: sentencesHydrated } = useSentences();
  const navigate = useNavigate();
  useLanguageDirection(settings.native);

  useEffect(() => {
    if (!settingsHydrated || !sentencesHydrated) return;

    if (settings.native && settings.target && sentences.length > 0) {
      navigate({ to: "/dashboard" });
    } else if (settings.native && settings.target) {
      navigate({ to: "/setup" });
    }
  }, [settings, settingsHydrated, sentences.length, sentencesHydrated, navigate]);

  if (!settingsHydrated || !sentencesHydrated) return <AppLoadingScreen />;

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 py-16 text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="max-w-2xl"
      >
        <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/60 backdrop-blur px-4 py-1.5 text-xs uppercase tracking-widest text-muted-foreground mb-8">
          <span className="h-1.5 w-1.5 rounded-full bg-primary" />
          Lingua Gap · contextual learning
        </div>
        <h1 className="font-display text-5xl md:text-7xl font-bold leading-[0.95]">
          {t("appName")}
        </h1>
        <p className="mt-6 text-lg md:text-xl text-muted-foreground leading-relaxed">
          {t("tagline")}
        </p>
        <div className="mt-10 flex justify-center">
          <Button asChild variant="hero" size="xl">
            <Link to="/setup">{t("getStarted")} →</Link>
          </Button>
        </div>
      </motion.div>
    </main>
  );
}
