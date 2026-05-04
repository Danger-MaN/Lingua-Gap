import { useEffect } from "react";
import { useTranslation } from "@/lib/i18n";
import { getLang } from "@/lib/languages";

/** Sync <html dir/lang> with the user's native language. */
export function useLanguageDirection(nativeCode: string | null) {
  const { i18n } = useTranslation();
  useEffect(() => {
    if (!nativeCode) return;
    const info = getLang(nativeCode);
    const dir = info?.rtl ? "rtl" : "ltr";
    document.documentElement.setAttribute("dir", dir);
    document.documentElement.setAttribute("lang", nativeCode);
    if (i18n.language !== nativeCode) {
      i18n.changeLanguage(nativeCode);
    }
  }, [nativeCode, i18n]);
}
