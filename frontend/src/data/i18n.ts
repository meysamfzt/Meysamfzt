// Bilingual strings for the Meditation & Breathwork app.
// Persian (fa) + English (en). Persian is RTL.

export type Locale = "en" | "fa";

type Dict = Record<string, { en: string; fa: string }>;

export const STRINGS: Dict = {
  // App
  app_name: { en: "Anima", fa: "آنیما" },
  app_tagline: {
    en: "Sacred breath. Boundless mind.",
    fa: "نفس مقدس. ذهن بی‌کران.",
  },

  // Onboarding
  welcome_title: { en: "Welcome", fa: "خوش آمدی" },
  welcome_body: {
    en: "A sanctuary for breath and mind. Begin where you stand.",
    fa: "پناهگاهی برای نفس و ذهن. از همین‌جا که هستی آغاز کن.",
  },
  recommended: { en: "Recommended", fa: "پیشنهادی" },
  start_baseline: { en: "Start Baseline Session", fa: "شروع تمرین پایه" },
  personalize: { en: "Personalize My Practice", fa: "شخصی‌سازی تمرین" },
  what_brings_you: {
    en: "What brings you here?",
    fa: "چه چیزی تو را به اینجا آورده؟",
  },
  goal_calm: { en: "Calm anxiety", fa: "آرام کردن اضطراب" },
  goal_sleep: { en: "Sleep deeper", fa: "خواب عمیق‌تر" },
  goal_focus: { en: "Sharper focus", fa: "تمرکز عمیق‌تر" },
  goal_energy: { en: "More energy", fa: "انرژی بیشتر" },
  goal_explore: { en: "Explore consciousness", fa: "کاوش آگاهی" },
  goal_heal: { en: "Heal emotionally", fa: "شفای عاطفی" },
  experience: { en: "Your experience", fa: "سابقه تو" },
  exp_new: { en: "New to this", fa: "تازه‌کار" },
  exp_some: { en: "Some practice", fa: "کمی تجربه" },
  exp_seasoned: { en: "Seasoned", fa: "باتجربه" },
  next: { en: "Continue", fa: "ادامه" },
  skip: { en: "Skip", fa: "رد کن" },
  enter: { en: "Enter Anima", fa: "ورود به آنیما" },

  // Tabs
  tab_breathwork: { en: "Breath", fa: "تنفس" },
  tab_meditation: { en: "Meditate", fa: "مدیتیشن" },
  tab_profile: { en: "Self", fa: "خود" },

  // Breathwork
  breathwork_title: { en: "Breathwork", fa: "تنفس‌درمانی" },
  breathwork_sub: {
    en: "Your breath shapes your state.",
    fa: "نفس تو، حالت تو را می‌سازد.",
  },
  tier_beginner: { en: "Beginner", fa: "مبتدی" },
  tier_intermediate: { en: "Intermediate", fa: "متوسط" },
  tier_advanced: { en: "Advanced", fa: "پیشرفته" },
  stream_activity: { en: "Specific Activity", fa: "فعالیت خاص" },
  stream_goal: { en: "Specific Goal", fa: "هدف خاص" },

  // Meditation
  meditation_title: { en: "Meditation", fa: "مدیتیشن" },
  meditation_sub: {
    en: "Eleven gates of inner mastery.",
    fa: "یازده دروازه برای تسلط درون.",
  },
  level: { en: "Level", fa: "سطح" },
  levels: { en: "Levels", fa: "سطوح" },
  topics: { en: "Topics", fa: "موضوعات" },
  sessions: { en: "Sessions", fa: "جلسات" },
  session: { en: "Session", fa: "جلسه" },
  start_session: { en: "Start Session", fa: "شروع جلسه" },

  // Intercept
  prepare: { en: "Prepare", fa: "آمادگی" },
  prereq_title: { en: "Before You Begin", fa: "پیش از شروع" },
  prereq_1: {
    en: "Clear your nasal passages",
    fa: "مجاری بینی را پاک کن",
  },
  prereq_2: {
    en: "Loosen any tight clothing",
    fa: "لباس‌های تنگ را شل کن",
  },
  prereq_3: {
    en: "Adjust room temperature; dim the lights",
    fa: "دمای اتاق را تنظیم کن؛ نور را کم کن",
  },
  prereq_4: {
    en: "Silence notifications, sit or lie comfortably",
    fa: "اعلان‌ها را قطع کن، راحت بنشین یا دراز بکش",
  },
  hold_to_begin: {
    en: "Press & hold to begin",
    fa: "برای شروع، نگه دار",
  },
  release_to_start: { en: "Release to start", fa: "رها کن تا شروع شود" },

  // Audio matrix
  audio_matrix: { en: "Audio", fa: "صدا" },
  vocal_guide: { en: "Vocal Guide", fa: "راهنمای صوتی" },
  vocal_guide_sub: {
    en: "Counts inhale / hold / exhale",
    fa: "شمارش دم / مکث / بازدم",
  },
  ambient_layer: { en: "Ambient Soundscape", fa: "صدای محیطی" },
  ambient_sub: {
    en: "Music · frequencies · nature",
    fa: "موسیقی · فرکانس · طبیعت",
  },
  affirmations: { en: "Affirmations", fa: "افیرمیشن" },
  affirmations_sub: {
    en: "Suggestion scripts at intervals",
    fa: "اسکریپت‌های تلقین در فواصل زمانی",
  },
  custom_audio: { en: "Custom Audio", fa: "صدای سفارشی" },
  intro_track: { en: "Intro track", fa: "تراک شروع" },
  outro_track: { en: "Outro track", fa: "تراک پایان" },
  interval_track: { en: "Interval track", fa: "تراک تناوبی" },
  interval_every: {
    en: "Plays every N breath counts",
    fa: "هر N شمارش پخش می‌شود",
  },
  set_count: { en: "Every N breaths", fa: "هر N نفس" },

  // Player
  inhale: { en: "Inhale", fa: "دم" },
  hold: { en: "Hold", fa: "نگه دار" },
  exhale: { en: "Exhale", fa: "بازدم" },
  hold_empty: { en: "Empty", fa: "خالی" },
  breath_count: { en: "Breath", fa: "نفس" },
  cycles: { en: "Cycles", fa: "چرخه‌ها" },
  end_session: { en: "End", fa: "پایان" },
  pause: { en: "Pause", fa: "مکث" },
  resume: { en: "Resume", fa: "ادامه" },
  session_complete: { en: "Session Complete", fa: "جلسه کامل شد" },
  complete_sub: {
    en: "You returned a little closer to yourself.",
    fa: "کمی نزدیک‌تر به خودت بازگشتی.",
  },
  back_home: { en: "Return Home", fa: "بازگشت" },

  // Profile
  profile_title: { en: "Self", fa: "خود" },
  language: { en: "Language", fa: "زبان" },
  history: { en: "Practice History", fa: "تاریخچه تمرین" },
  total_sessions: { en: "Total sessions", fa: "مجموع جلسات" },
  total_minutes: { en: "Minutes practiced", fa: "دقایق تمرین" },
  streak: { en: "Day streak", fa: "روز پیاپی" },
  no_history: {
    en: "Nothing yet. Take your first breath.",
    fa: "هنوز چیزی نیست. اولین نفست را بکش.",
  },
  audio_defaults: { en: "Audio Defaults", fa: "تنظیمات صدا" },

  // Mentor
  mentor_speaks: { en: "speaks", fa: "می‌گوید" },
  acknowledge: { en: "I am listening", fa: "گوش می‌سپارم" },

  // Generic
  minutes: { en: "min", fa: "دقیقه" },
  back: { en: "Back", fa: "بازگشت" },
};

export function t(locale: Locale, key: string): string {
  const entry = STRINGS[key];
  if (!entry) return key;
  return entry[locale] ?? entry.en;
}

export function isRTL(locale: Locale): boolean {
  return locale === "fa";
}
