// Breathwork content: 3 tiers x 2 streams (Activity / Goal).
// Each pattern has a defined breath rhythm (inhale / hold / exhale / hold_empty) in seconds.

export type BreathPhase = "inhale" | "hold" | "exhale" | "hold_empty";

export type BreathPattern = {
  inhale: number;
  hold: number;
  exhale: number;
  hold_empty: number;
};

export type BreathworkSession = {
  id: string;
  tier: "beginner" | "intermediate" | "advanced";
  stream: "activity" | "goal";
  category_en: string;
  category_fa: string;
  title_en: string;
  title_fa: string;
  description_en: string;
  description_fa: string;
  pattern: BreathPattern;
  cycles: number;
  duration_min: number;
};

const m = (s: BreathworkSession): BreathworkSession => ({
  ...s,
  duration_min: Math.max(
    1,
    Math.round(
      (s.cycles *
        (s.pattern.inhale +
          s.pattern.hold +
          s.pattern.exhale +
          s.pattern.hold_empty)) /
        60,
    ),
  ),
});

export const BREATHWORK_SESSIONS: BreathworkSession[] = [
  // ---------- BEGINNER ----------
  // Activity stream
  m({
    id: "bw-b-act-wake",
    tier: "beginner",
    stream: "activity",
    category_en: "Upon Waking",
    category_fa: "هنگام بیداری",
    title_en: "Morning Awakening Breath",
    title_fa: "نفس بیداری صبح",
    description_en: "Gentle energizing breath to ease into your day.",
    description_fa: "نفسی ملایم و انرژی‌بخش برای شروع روز.",
    pattern: { inhale: 4, hold: 2, exhale: 4, hold_empty: 0 },
    cycles: 12,
    duration_min: 0,
  }),
  m({
    id: "bw-b-act-sleep",
    tier: "beginner",
    stream: "activity",
    category_en: "Pre-Sleep",
    category_fa: "پیش از خواب",
    title_en: "4-7-8 Soothing",
    title_fa: "آرام‌بخش ۴-۷-۸",
    description_en: "Slow exhale calms the nervous system for sleep.",
    description_fa: "بازدم کند، سیستم عصبی را برای خواب آرام می‌کند.",
    pattern: { inhale: 4, hold: 7, exhale: 8, hold_empty: 0 },
    cycles: 8,
    duration_min: 0,
  }),
  m({
    id: "bw-b-act-study",
    tier: "beginner",
    stream: "activity",
    category_en: "Pre-Study / Deep Focus",
    category_fa: "پیش از مطالعه / تمرکز عمیق",
    title_en: "Coherent Focus",
    title_fa: "تمرکز هماهنگ",
    description_en: "Balanced breath at 5.5s in / 5.5s out for clarity.",
    description_fa: "نفس متوازن ۵.۵ ثانیه برای شفافیت ذهنی.",
    pattern: { inhale: 6, hold: 0, exhale: 6, hold_empty: 0 },
    cycles: 15,
    duration_min: 0,
  }),
  m({
    id: "bw-b-act-workout",
    tier: "beginner",
    stream: "activity",
    category_en: "Pre-Workout",
    category_fa: "پیش از تمرین",
    title_en: "Activation Breath",
    title_fa: "نفس فعال‌سازی",
    description_en: "Quick energizing rhythm before movement.",
    description_fa: "ریتم سریع انرژی‌بخش پیش از حرکت.",
    pattern: { inhale: 3, hold: 1, exhale: 3, hold_empty: 0 },
    cycles: 20,
    duration_min: 0,
  }),
  // Goal stream
  m({
    id: "bw-b-goal-calm",
    tier: "beginner",
    stream: "goal",
    category_en: "Calm",
    category_fa: "آرامش",
    title_en: "Box Breathing 4-4-4-4",
    title_fa: "نفس مربعی ۴-۴-۴-۴",
    description_en: "Equal cycle box to settle anxiety.",
    description_fa: "چرخه مساوی برای آرام‌سازی اضطراب.",
    pattern: { inhale: 4, hold: 4, exhale: 4, hold_empty: 4 },
    cycles: 10,
    duration_min: 0,
  }),
  m({
    id: "bw-b-goal-energy",
    tier: "beginner",
    stream: "goal",
    category_en: "Energy",
    category_fa: "انرژی",
    title_en: "Bellows Lite",
    title_fa: "نفس دم‌و‌بازدم سبک",
    description_en: "Lively rhythm to lift fatigue.",
    description_fa: "ریتم پرتحرک برای رفع خستگی.",
    pattern: { inhale: 2, hold: 0, exhale: 2, hold_empty: 0 },
    cycles: 30,
    duration_min: 0,
  }),

  // ---------- INTERMEDIATE ----------
  // Activity
  m({
    id: "bw-i-act-intimacy",
    tier: "intermediate",
    stream: "activity",
    category_en: "Pre-Intimacy",
    category_fa: "پیش از صمیمیت",
    title_en: "Heart Coherence",
    title_fa: "هماهنگی قلب",
    description_en: "Soft, heart-centered breath to open presence.",
    description_fa: "نفسی نرم و قلب‌محور برای حضور.",
    pattern: { inhale: 5, hold: 0, exhale: 7, hold_empty: 0 },
    cycles: 14,
    duration_min: 0,
  }),
  m({
    id: "bw-i-act-deep-focus",
    tier: "intermediate",
    stream: "activity",
    category_en: "Pre-Study / Deep Focus",
    category_fa: "پیش از مطالعه / تمرکز عمیق",
    title_en: "Yogic Triangle",
    title_fa: "مثلث یوگی",
    description_en: "Inhale-hold-exhale with sharp focus.",
    description_fa: "دم-مکث-بازدم با تمرکز تیز.",
    pattern: { inhale: 6, hold: 6, exhale: 6, hold_empty: 0 },
    cycles: 12,
    duration_min: 0,
  }),
  // Goal
  m({
    id: "bw-i-goal-sleep",
    tier: "intermediate",
    stream: "goal",
    category_en: "Deep Sleep",
    category_fa: "خواب عمیق",
    title_en: "Extended 4-7-8",
    title_fa: "۴-۷-۸ گسترده",
    description_en: "Extended exhale to drop into sleep.",
    description_fa: "بازدم طولانی برای فرو رفتن در خواب.",
    pattern: { inhale: 4, hold: 7, exhale: 8, hold_empty: 0 },
    cycles: 16,
    duration_min: 0,
  }),
  m({
    id: "bw-i-goal-clarity",
    tier: "intermediate",
    stream: "goal",
    category_en: "Mental Clarity",
    category_fa: "صفای ذهن",
    title_en: "Box 6-6-6-6",
    title_fa: "مربع ۶-۶-۶-۶",
    description_en: "Deeper square cycle for clarity.",
    description_fa: "چرخه مربع عمیق‌تر برای وضوح.",
    pattern: { inhale: 6, hold: 6, exhale: 6, hold_empty: 6 },
    cycles: 10,
    duration_min: 0,
  }),

  // ---------- ADVANCED ----------
  // Activity
  m({
    id: "bw-a-act-altered",
    tier: "advanced",
    stream: "activity",
    category_en: "Pre-Meditation Journey",
    category_fa: "پیش از سفر مدیتیشن",
    title_en: "Pranayama 8-16-8",
    title_fa: "پرانایاما ۸-۱۶-۸",
    description_en: "Deep retention to expand awareness.",
    description_fa: "مکث عمیق برای گسترش آگاهی.",
    pattern: { inhale: 8, hold: 16, exhale: 8, hold_empty: 0 },
    cycles: 8,
    duration_min: 0,
  }),
  m({
    id: "bw-a-act-cold",
    tier: "advanced",
    stream: "activity",
    category_en: "Pre-Cold Exposure",
    category_fa: "پیش از سرما",
    title_en: "Wim Hof Style",
    title_fa: "سبک ویم هاف",
    description_en: "Power breathing primer before cold.",
    description_fa: "نفس قدرتی پیش از مواجهه با سرما.",
    pattern: { inhale: 2, hold: 0, exhale: 2, hold_empty: 0 },
    cycles: 30,
    duration_min: 0,
  }),
  // Goal
  m({
    id: "bw-a-goal-altered-state",
    tier: "advanced",
    stream: "goal",
    category_en: "Altered States",
    category_fa: "حالت‌های دگرگون",
    title_en: "Holotropic Lite",
    title_fa: "هولوتروپیک سبک",
    description_en: "Continuous fast breath to shift state.",
    description_fa: "نفس سریع پیوسته برای تغییر حالت.",
    pattern: { inhale: 1, hold: 0, exhale: 1, hold_empty: 0 },
    cycles: 60,
    duration_min: 0,
  }),
  m({
    id: "bw-a-goal-stillness",
    tier: "advanced",
    stream: "goal",
    category_en: "Profound Stillness",
    category_fa: "سکون عمیق",
    title_en: "Ultra Slow 10-10-10-10",
    title_fa: "بسیار آرام ۱۰-۱۰-۱۰-۱۰",
    description_en: "Master-level box for radical stillness.",
    description_fa: "مربع پیشرفته برای سکون رادیکال.",
    pattern: { inhale: 10, hold: 10, exhale: 10, hold_empty: 10 },
    cycles: 6,
    duration_min: 0,
  }),
];

export const TIERS: Array<"beginner" | "intermediate" | "advanced"> = [
  "beginner",
  "intermediate",
  "advanced",
];

export function getBreathSession(id: string): BreathworkSession | undefined {
  return BREATHWORK_SESSIONS.find((s) => s.id === id);
}

export function sessionsByTier(tier: string): BreathworkSession[] {
  return BREATHWORK_SESSIONS.filter((s) => s.tier === tier);
}
