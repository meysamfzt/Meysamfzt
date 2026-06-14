// Global app context: locale, profile, history, audio prefs.
// Persisted to AsyncStorage via the @/src/utils/storage helper.

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { storage } from "@/src/utils/storage";
import type { Locale } from "@/src/data/i18n";

const K = {
  locale: "anima.locale",
  onboarded: "anima.onboarded",
  profile: "anima.profile",
  history: "anima.history",
  audio: "anima.audio_prefs",
  mentorsMet: "anima.mentors_met",
};

export type Profile = {
  id: string;
  goals: string[];
  experience: "new" | "some" | "seasoned";
  createdAt: string;
};

export type HistoryEntry = {
  id: string;
  kind: "breathwork" | "meditation";
  refId: string; // session id (or branch/topic chain for meditation)
  title_en: string;
  title_fa: string;
  duration_min: number;
  completedAt: string;
};

export type AudioPrefs = {
  vocalGuide: boolean;
  ambient: boolean;
  affirmations: boolean;
  intervalCount: number; // for interval custom track
};

type Ctx = {
  ready: boolean;
  locale: Locale;
  setLocale: (l: Locale) => Promise<void>;
  onboarded: boolean;
  setOnboarded: (v: boolean) => Promise<void>;
  profile: Profile | null;
  setProfile: (p: Profile) => Promise<void>;
  history: HistoryEntry[];
  addHistory: (h: Omit<HistoryEntry, "id" | "completedAt">) => Promise<void>;
  clearHistory: () => Promise<void>;
  audio: AudioPrefs;
  setAudio: (a: Partial<AudioPrefs>) => Promise<void>;
  mentorsMet: string[];
  markMentorMet: (branchId: string) => Promise<void>;
};

const DEFAULT_AUDIO: AudioPrefs = {
  vocalGuide: true,
  ambient: true,
  affirmations: true,
  intervalCount: 10,
};

const AppCtx = createContext<Ctx | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [locale, setLocaleState] = useState<Locale>("en");
  const [onboarded, setOnboardedState] = useState(false);
  const [profile, setProfileState] = useState<Profile | null>(null);
  const [history, setHistoryState] = useState<HistoryEntry[]>([]);
  const [audio, setAudioState] = useState<AudioPrefs>(DEFAULT_AUDIO);
  const [mentorsMet, setMentorsMet] = useState<string[]>([]);

  useEffect(() => {
    (async () => {
      const [lo, ob, pr, hi, au, mm] = await Promise.all([
        storage.getItem<string>(K.locale, "en"),
        storage.getItem<boolean>(K.onboarded, false),
        storage.getItem<string>(K.profile, ""),
        storage.getItem<string>(K.history, ""),
        storage.getItem<string>(K.audio, ""),
        storage.getItem<string>(K.mentorsMet, ""),
      ]);
      if (lo === "fa" || lo === "en") setLocaleState(lo);
      setOnboardedState(ob === true);
      if (pr && typeof pr === "string") {
        try {
          setProfileState(JSON.parse(pr) as Profile);
        } catch {}
      }
      if (hi && typeof hi === "string") {
        try {
          setHistoryState(JSON.parse(hi) as HistoryEntry[]);
        } catch {}
      }
      if (au && typeof au === "string") {
        try {
          setAudioState({ ...DEFAULT_AUDIO, ...JSON.parse(au) });
        } catch {}
      }
      if (mm && typeof mm === "string") {
        try {
          setMentorsMet(JSON.parse(mm) as string[]);
        } catch {}
      }
      setReady(true);
    })();
  }, []);

  const setLocale = useCallback(async (l: Locale) => {
    setLocaleState(l);
    await storage.setItem(K.locale, l);
  }, []);

  const setOnboarded = useCallback(async (v: boolean) => {
    setOnboardedState(v);
    await storage.setItem(K.onboarded, v);
  }, []);

  const setProfile = useCallback(async (p: Profile) => {
    setProfileState(p);
    await storage.setItem(K.profile, JSON.stringify(p));
  }, []);

  const addHistory = useCallback(
    async (h: Omit<HistoryEntry, "id" | "completedAt">) => {
      const entry: HistoryEntry = {
        ...h,
        id: `h-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        completedAt: new Date().toISOString(),
      };
      const next = [entry, ...history].slice(0, 200);
      setHistoryState(next);
      await storage.setItem(K.history, JSON.stringify(next));
    },
    [history],
  );

  const clearHistory = useCallback(async () => {
    setHistoryState([]);
    await storage.setItem(K.history, JSON.stringify([]));
  }, []);

  const setAudio = useCallback(
    async (a: Partial<AudioPrefs>) => {
      const next = { ...audio, ...a };
      setAudioState(next);
      await storage.setItem(K.audio, JSON.stringify(next));
    },
    [audio],
  );

  const markMentorMet = useCallback(
    async (branchId: string) => {
      if (mentorsMet.includes(branchId)) return;
      const next = [...mentorsMet, branchId];
      setMentorsMet(next);
      await storage.setItem(K.mentorsMet, JSON.stringify(next));
    },
    [mentorsMet],
  );

  const value = useMemo<Ctx>(
    () => ({
      ready,
      locale,
      setLocale,
      onboarded,
      setOnboarded,
      profile,
      setProfile,
      history,
      addHistory,
      clearHistory,
      audio,
      setAudio,
      mentorsMet,
      markMentorMet,
    }),
    [
      ready,
      locale,
      setLocale,
      onboarded,
      setOnboarded,
      profile,
      setProfile,
      history,
      addHistory,
      clearHistory,
      audio,
      setAudio,
      mentorsMet,
      markMentorMet,
    ],
  );

  return <AppCtx.Provider value={value}>{children}</AppCtx.Provider>;
}

export function useApp(): Ctx {
  const v = useContext(AppCtx);
  if (!v) throw new Error("useApp must be used within AppProvider");
  return v;
}
