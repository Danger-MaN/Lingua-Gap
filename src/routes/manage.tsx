import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useTranslation } from "@/lib/i18n";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { AppLoadingScreen } from "@/components/AppLoadingScreen";
import { useSettings, useSentences } from "@/lib/store";
import { getLang } from "@/lib/languages";
import { useLanguageDirection } from "@/hooks/useLanguageDirection";

function ManagePage() {
  const [settings, , settingsHydrated] = useSettings();
  const { sentences, add, addMany, hydrated: sentencesHydrated } = useSentences();
  const { t } = useTranslation();
  const navigate = useNavigate();
  useLanguageDirection(settings.native);

  useEffect(() => {
    if (!settingsHydrated) return;
    if (!settings.native || !settings.target) navigate({ to: "/setup" });
  }, [settings, settingsHydrated, navigate]);

  const native = getLang(settings.native ?? "en");
  const target = getLang(settings.target ?? "en");

  const [template, setTemplate] = useState("");
  const [targetWord, setTargetWord] = useState("");
  const [nativeWord, setNativeWord] = useState("");
  const [bulk, setBulk] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!template.trim() || !targetWord.trim() || !nativeWord.trim()) return;
    if (!template.includes("...")) {
      toast.error(t("addSentenceHint"));
      return;
    }
    add({
      template: template.trim(),
      targetWord: targetWord.trim(),
      nativeWord: nativeWord.trim(),
    });
    setTemplate("");
    setTargetWord("");
    setNativeWord("");
    toast.success(t("bulkAdded", { n: 1 }));
  };

  const submitBulk = (e: React.FormEvent) => {
    e.preventDefault();
    const lines = bulk.split("\n").map((l) => l.trim()).filter(Boolean);
    const valid: { template: string; targetWord: string; nativeWord: string }[] = [];
    let invalid = 0;
    for (const line of lines) {
      const parts = line.split("|").map((p) => p.trim());
      if (parts.length !== 3 || !parts[0].includes("...") || !parts[1] || !parts[2]) {
        invalid++;
        continue;
      }
      valid.push({ template: parts[0], targetWord: parts[1], nativeWord: parts[2] });
    }
    if (valid.length > 0) {
      const added = addMany(valid);
      toast.success(t("bulkAdded", { n: added }));
      setBulk("");
    }
    if (invalid > 0) {
      toast.error(t("bulkInvalid", { n: invalid }));
    }
  };

  if (!settingsHydrated || !sentencesHydrated) return <AppLoadingScreen />;

  return (
    <main className="min-h-screen px-4 sm:px-6 py-8 max-w-4xl mx-auto">
      <header className="flex items-center justify-between mb-8 gap-3 flex-wrap">
        <div>
          <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
            {native?.flag} {native?.nativeName} → {target?.flag} {target?.nativeName}
          </div>
          <h1 className="font-display text-3xl md:text-4xl font-bold mt-1">
            {t("manageSentences")}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">{t("manageSentencesDesc")}</p>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="ghost" size="sm">
            <Link to="/dashboard">{t("back")}</Link>
          </Button>
          <Button asChild variant="default" size="sm">
            <Link to="/sentences">
              {t("viewSentences")} ({sentences.length})
            </Link>
          </Button>
        </div>
      </header>

      <section className="rounded-3xl bg-card border border-border/60 p-6">
        <h2 className="font-display text-xl font-semibold mb-4">{t("addSentence")}</h2>
        <Tabs defaultValue="single">
          <TabsList className="mb-4">
            <TabsTrigger value="single">{t("singleAdd")}</TabsTrigger>
            <TabsTrigger value="bulk">{t("bulkAdd")}</TabsTrigger>
          </TabsList>

          <TabsContent value="single">
            <p className="text-sm text-muted-foreground mb-4">{t("addSentenceHint")}</p>
            <form onSubmit={submit} className="grid grid-cols-1 gap-3">
              <textarea
                value={template}
                onChange={(e) => setTemplate(e.target.value)}
                placeholder={t("sentenceTemplate")}
                rows={2}
                className="w-full rounded-xl border border-border/60 bg-background px-4 py-3 outline-none focus:border-primary resize-none"
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <input
                  value={targetWord}
                  onChange={(e) => setTargetWord(e.target.value)}
                  placeholder={`${t("targetWord")} (${target?.nativeName ?? ""})`}
                  className="h-11 rounded-xl border border-border/60 bg-background px-4 outline-none focus:border-primary"
                />
                <input
                  value={nativeWord}
                  onChange={(e) => setNativeWord(e.target.value)}
                  placeholder={`${t("nativeWord")} (${native?.nativeName ?? ""})`}
                  className="h-11 rounded-xl border border-border/60 bg-background px-4 outline-none focus:border-primary"
                />
              </div>
              <Button type="submit" variant="default" className="h-11 justify-self-end px-6">
                + {t("addSentence")}
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="bulk">
            <p className="text-sm text-muted-foreground mb-2">{t("bulkHint")}</p>
            <p className="text-xs text-muted-foreground mb-4 font-mono bg-secondary/50 px-3 py-2 rounded-lg">
              {t("bulkExample")}
            </p>
            <form onSubmit={submitBulk} className="grid grid-cols-1 gap-3">
              <textarea
                value={bulk}
                onChange={(e) => setBulk(e.target.value)}
                placeholder={t("bulkExample")}
                rows={8}
                className="w-full rounded-xl border border-border/60 bg-background px-4 py-3 outline-none focus:border-primary resize-y font-mono text-sm"
              />
              <Button
                type="submit"
                variant="default"
                disabled={!bulk.trim()}
                className="h-11 justify-self-end px-6"
              >
                + {t("bulkAddBtn")}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </section>
    </main>
  );
}

export const Route = createFileRoute("/manage")({
  component: ManagePage,
});
