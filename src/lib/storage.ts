import Cookies from "js-cookie";

// Cookies have a ~4KB limit per cookie. We chunk JSON across multiple cookies
// transparently so callers can store arbitrarily-sized blobs.
const CHUNK_SIZE = 3500;
const COOKIE_OPTS: Cookies.CookieAttributes = {
  expires: 365,
  sameSite: "lax",
  path: "/",
};

const LOCAL_KEY_SUFFIX = "__json";

function readLocal<T>(key: string): T | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(`${key}${LOCAL_KEY_SUFFIX}`);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

function writeLocal<T>(key: string, value: T): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(`${key}${LOCAL_KEY_SUFFIX}`, JSON.stringify(value));
  } catch {
    // ignore quota / privacy mode errors
  }
}

export function readJSON<T>(key: string, fallback: T): T {
  try {
    const local = readLocal<T>(key);
    if (local !== null) return local;

    const meta = Cookies.get(`${key}__n`);
    if (!meta) return fallback;
    const n = parseInt(meta, 10);
    let raw = "";
    for (let i = 0; i < n; i++) {
      raw += Cookies.get(`${key}__${i}`) ?? "";
    }
    if (!raw) return fallback;
    return JSON.parse(decodeURIComponent(raw)) as T;
  } catch {
    return fallback;
  }
}

export function writeJSON<T>(key: string, value: T): void {
  try {
    writeLocal(key, value);

    const raw = encodeURIComponent(JSON.stringify(value));
    const chunks = Math.ceil(raw.length / CHUNK_SIZE) || 1;
    // Clear leftover chunks from a previous larger value
    const prev = parseInt(Cookies.get(`${key}__n`) ?? "0", 10);
    for (let i = chunks; i < prev; i++) Cookies.remove(`${key}__${i}`, { path: "/" });

    for (let i = 0; i < chunks; i++) {
      Cookies.set(`${key}__${i}`, raw.slice(i * CHUNK_SIZE, (i + 1) * CHUNK_SIZE), COOKIE_OPTS);
    }
    Cookies.set(`${key}__n`, String(chunks), COOKIE_OPTS);
  } catch {
    // ignore quota errors
  }
}
