import { getLang } from "./languages";

let cachedVoices: SpeechSynthesisVoice[] = [];

function loadVoices(): Promise<SpeechSynthesisVoice[]> {
  return new Promise((resolve) => {
    const v = window.speechSynthesis.getVoices();
    if (v && v.length) {
      cachedVoices = v;
      resolve(v);
      return;
    }
    const onChange = () => {
      cachedVoices = window.speechSynthesis.getVoices();
      window.speechSynthesis.removeEventListener("voiceschanged", onChange);
      resolve(cachedVoices);
    };
    window.speechSynthesis.addEventListener("voiceschanged", onChange);
    setTimeout(() => resolve(window.speechSynthesis.getVoices()), 800);
  });
}

export async function speak(text: string, langCode: string) {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  const info = getLang(langCode);
  const bcp = info?.bcp47 ?? langCode;
  const voices = cachedVoices.length ? cachedVoices : await loadVoices();
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = bcp;
  const match =
    voices.find((v) => v.lang.toLowerCase() === bcp.toLowerCase()) ||
    voices.find((v) => v.lang.toLowerCase().startsWith(bcp.split("-")[0].toLowerCase()));
  if (match) u.voice = match;
  u.rate = 0.95;
  u.pitch = 1;
  window.speechSynthesis.speak(u);
}
