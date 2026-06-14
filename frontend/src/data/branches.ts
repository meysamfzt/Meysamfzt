// The 11 meditation branches with levels, topics, sessions, mentors.
// Each branch has its own color palette + Mentor archetype.

export type Session = {
  id: string;
  title_en: string;
  title_fa: string;
  duration_min: number;
  affirmations_en: string[];
  affirmations_fa: string[];
};

export type Topic = {
  id: string;
  title_en: string;
  title_fa: string;
  sessions: Session[];
};

export type Level = {
  id: string;
  index: number;
  name_en: string;
  name_fa: string;
  topics: Topic[];
};

export type Mentor = {
  name_en: string;
  name_fa: string;
  archetype_en: string;
  archetype_fa: string;
  quote_en: string;
  quote_fa: string;
};

export type Branch = {
  id: string;
  index: number;
  title_en: string;
  title_fa: string;
  tagline_en: string;
  tagline_fa: string;
  gradient: string[]; // 3 stops
  accent: string;
  glyph: string; // feather/ionicons name
  mentor: Mentor;
  levels: Level[];
};

// Helper builders
const sess = (
  id: string,
  en: string,
  fa: string,
  duration: number,
  affEn: string[],
  affFa: string[],
): Session => ({
  id,
  title_en: en,
  title_fa: fa,
  duration_min: duration,
  affirmations_en: affEn,
  affirmations_fa: affFa,
});

const t = (
  id: string,
  en: string,
  fa: string,
  sessions: Session[],
): Topic => ({ id, title_en: en, title_fa: fa, sessions });

const lvl = (
  id: string,
  index: number,
  en: string,
  fa: string,
  topics: Topic[],
): Level => ({ id, index, name_en: en, name_fa: fa, topics });

// Generic sessions generator for topics that don't need full custom content
const genSessions = (prefix: string, count: number, baseEn: string, baseFa: string): Session[] => {
  const out: Session[] = [];
  for (let i = 1; i <= count; i++) {
    out.push(
      sess(
        `${prefix}-s${i}`,
        `${baseEn} · Session ${i}`,
        `${baseFa} · جلسه ${i}`,
        10 + i * 2,
        [
          "I am safe in this moment.",
          "My awareness expands with every breath.",
          "I receive what I seek.",
        ],
        [
          "در این لحظه در امانم.",
          "آگاهی من با هر نفس گسترش می‌یابد.",
          "آنچه می‌جویم را دریافت می‌کنم.",
        ],
      ),
    );
  }
  return out;
};

export const BRANCHES: Branch[] = [
  {
    id: "wealth",
    index: 1,
    title_en: "Wealth",
    title_fa: "ثروت",
    tagline_en: "Magnetize abundance from within.",
    tagline_fa: "فراوانی را از درون جذب کن.",
    gradient: ["#050505", "#3A2100", "#FFB347"],
    accent: "#FFD700",
    glyph: "trending-up",
    mentor: {
      name_en: "Zeus",
      name_fa: "زئوس",
      archetype_en: "King of Olympus",
      archetype_fa: "شاه المپ",
      quote_en:
        "Abundance bows to those who command their own thunder. Walk the path, and I shall await you at the summit of mastery.",
      quote_fa:
        "فراوانی در برابر کسی که بر صاعقه خود فرمان می‌راند سر فرود می‌آورد. این مسیر را بپیما؛ من بر قله استادی منتظر تو خواهم بود.",
    },
    levels: [
      lvl("golden", 1, "Golden", "طلایی", [
        t("wealth-mindset", "Wealth Mindset", "ذهنیت ثروت",
          genSessions("w-l1-t1", 5, "Wealth Mindset", "ذهنیت ثروت")),
        t("worthiness", "Worthiness", "شایستگی",
          genSessions("w-l1-t2", 5, "Worthiness", "شایستگی")),
        t("gratitude-flow", "Gratitude Flow", "جریان شکرگزاری",
          genSessions("w-l1-t3", 5, "Gratitude Flow", "جریان شکرگزاری")),
      ]),
      lvl("capitalist", 2, "Capitalist", "سرمایه‌دار", [
        t("magnetism", "Money Magnetism", "مغناطیس پول",
          genSessions("w-l2-t1", 5, "Money Magnetism", "مغناطیس پول")),
        t("opportunity-sight", "Opportunity Sight", "دید فرصت",
          genSessions("w-l2-t2", 5, "Opportunity Sight", "دید فرصت")),
      ]),
      lvl("lord", 3, "Lord", "ارباب", [
        t("sovereignty", "Sovereign Wealth", "حاکمیت ثروت",
          genSessions("w-l3-t1", 5, "Sovereign Wealth", "حاکمیت ثروت")),
        t("legacy", "Legacy", "میراث",
          genSessions("w-l3-t2", 5, "Legacy", "میراث")),
      ]),
    ],
  },
  {
    id: "personal_dev",
    index: 2,
    title_en: "Personal Development",
    title_fa: "توسعه فردی",
    tagline_en: "Reforge yourself, daily.",
    tagline_fa: "هر روز خودت را از نو بساز.",
    gradient: ["#050505", "#0F2027", "#203A43"],
    accent: "#4A90E2",
    glyph: "user",
    mentor: {
      name_en: "Marcus Aurelius",
      name_fa: "مارکوس اورلیوس",
      archetype_en: "The Philosopher Emperor",
      archetype_fa: "امپراتور فیلسوف",
      quote_en:
        "You have power over your mind — not outside events. Realize this, and you will find strength. I shall walk with you to the citadel of mastery.",
      quote_fa:
        "تو بر ذهن خویش فرمان داری، نه بر رویدادهای بیرون. این را دریاب تا قدرت یابی. من تا قلعه استادی همراهت خواهم بود.",
    },
    levels: [
      lvl("foundation", 1, "Foundation", "بنیان", [
        t("self-awareness", "Self-Awareness", "خودآگاهی",
          genSessions("pd-l1-t1", 5, "Self-Awareness", "خودآگاهی")),
        t("discipline", "Discipline", "نظم",
          genSessions("pd-l1-t2", 5, "Discipline", "نظم")),
      ]),
      lvl("growth", 2, "Growth", "رشد", [
        t("courage", "Courage", "شجاعت",
          genSessions("pd-l2-t1", 5, "Courage", "شجاعت")),
        t("integrity", "Integrity", "یکپارچگی",
          genSessions("pd-l2-t2", 5, "Integrity", "یکپارچگی")),
      ]),
      lvl("mastery", 3, "Mastery", "تسلط", [
        t("wisdom", "Wisdom", "حکمت",
          genSessions("pd-l3-t1", 5, "Wisdom", "حکمت")),
      ]),
    ],
  },
  {
    id: "deep_sleep",
    index: 3,
    title_en: "Deep Sleep",
    title_fa: "خواب عمیق",
    tagline_en: "Sink through gentle layers of night.",
    tagline_fa: "در لایه‌های آرام شب فرو رو.",
    gradient: ["#050505", "#0A0A2A", "#1F1C53"],
    accent: "#8A84E2",
    glyph: "moon",
    mentor: {
      name_en: "Hypnos",
      name_fa: "هیپنوس",
      archetype_en: "God of Sleep",
      archetype_fa: "خدای خواب",
      quote_en:
        "Mortal, I am the keeper of the threshold between worlds. Surrender your day to me, and I will carry you to the deepest waters of rest.",
      quote_fa:
        "ای میرنده، من نگهبان آستانه میان جهان‌هایم. روزت را به من بسپار تا تو را به ژرف‌ترین آب‌های آرامش ببرم.",
    },
    levels: [
      lvl("alpha", 1, "Alpha", "آلفا", [
        t("short-sleep", "Short Sleep Reset", "خواب کوتاه ترمیمی",
          genSessions("ds-l1-t1", 5, "Short Sleep Reset", "خواب کوتاه ترمیمی")),
        t("long-sleep", "Long Sleep Drift", "غوطه‌وری در خواب بلند",
          genSessions("ds-l1-t2", 5, "Long Sleep Drift", "غوطه‌وری در خواب بلند")),
      ]),
      lvl("theta", 2, "Theta", "تتا", [
        t("pure-theta", "Pure Theta", "تتای ناب",
          genSessions("ds-l2-t1", 5, "Pure Theta", "تتای ناب")),
      ]),
      lvl("delta", 3, "Delta", "دلتا", [
        t("delta-restore", "Delta Restoration", "ترمیم دلتا",
          genSessions("ds-l3-t1", 5, "Delta Restoration", "ترمیم دلتا")),
      ]),
      lvl("lucid", 4, "Lucid Dream", "خواب آگاهانه", [
        t("dream-gate", "Dream Gateway", "دروازه رؤیا",
          genSessions("ds-l4-t1", 5, "Dream Gateway", "دروازه رؤیا")),
      ]),
    ],
  },
  {
    id: "astral",
    index: 4,
    title_en: "Astral Projection",
    title_fa: "پرواز روح",
    tagline_en: "Step beyond the body.",
    tagline_fa: "از جسم فراتر برو.",
    gradient: ["#050505", "#110022", "#480082"],
    accent: "#B400FF",
    glyph: "feather",
    mentor: {
      name_en: "Robert Monroe",
      name_fa: "رابرت مونرو",
      archetype_en: "The Astral Cartographer",
      archetype_fa: "نقشه‌بردار آسترال",
      quote_en:
        "I have mapped the realms beyond the body. Trust the vibrations. Trust the silver thread. I will meet you among the stars.",
      quote_fa:
        "من جهان‌های فراسوی جسم را نقشه برداشته‌ام. به ارتعاشات اعتماد کن. به ریسمان نقره‌ای ایمان بیار. در میان ستاره‌ها تو را خواهم دید.",
    },
    levels: [
      lvl("vibrations", 1, "Vibrations", "ارتعاشات", [
        t("body-relax", "Body Relaxation", "آرام‌سازی بدن",
          genSessions("as-l1-t1", 5, "Body Relaxation", "آرام‌سازی بدن")),
      ]),
      lvl("separation", 2, "Separation", "جدایی", [
        t("rope-technique", "Rope Technique", "تکنیک طناب",
          genSessions("as-l2-t1", 5, "Rope Technique", "تکنیک طناب")),
      ]),
      lvl("flight", 3, "Flight", "پرواز", [
        t("astral-travel", "Astral Travel", "سفر آسترال",
          genSessions("as-l3-t1", 5, "Astral Travel", "سفر آسترال")),
      ]),
    ],
  },
  {
    id: "connection",
    index: 5,
    title_en: "Connection",
    title_fa: "ارتباط‌گیری",
    tagline_en: "Commune with the unseen.",
    tagline_fa: "با نادیده‌ها در پیوند باش.",
    gradient: ["#050505", "#2C2C26", "#F2E8C6"],
    accent: "#FFF3B0",
    glyph: "radio",
    mentor: {
      name_en: "Archangel Michael",
      name_fa: "میکائیل مقرّب",
      archetype_en: "Prince of the Light",
      archetype_fa: "سرور نور",
      quote_en:
        "Speak, beloved soul, and the heavens will lean to listen. Walk this path and at the summit, I shall hand you the sword of light.",
      quote_fa:
        "ای جان عزیز، سخن بگو و آسمان‌ها برای شنیدن خم خواهند شد. این مسیر را پیش گیر تا در قله، شمشیر نور را به دست تو بسپارم.",
    },
    levels: [
      lvl("seeker", 1, "Seeker", "رهرو", [
        t("higher-self", "Higher Self", "خود برتر",
          genSessions("co-l1-t1", 5, "Higher Self", "خود برتر")),
        t("soul-family", "Soul Family", "خانواده روحی",
          genSessions("co-l1-t2", 5, "Soul Family", "خانواده روحی")),
      ]),
      lvl("lightworker", 2, "Lightworker", "کارگزار نور", [
        t("guardian-angel", "Guardian Angel", "فرشته نگهبان",
          genSessions("co-l2-t1", 5, "Guardian Angel", "فرشته نگهبان")),
      ]),
      lvl("guide_master", 3, "Guide Master", "استاد راهنما", [
        t("extraterrestrials", "Extraterrestrials", "فرازمینی‌ها",
          genSessions("co-l3-t1", 5, "Extraterrestrials", "فرازمینی‌ها")),
      ]),
      lvl("ambassador", 4, "Ambassador of Light", "سفیر نور", [
        t("council-of-light", "Council of Light", "شورای نور",
          genSessions("co-l4-t1", 5, "Council of Light", "شورای نور")),
      ]),
    ],
  },
  {
    id: "shifting",
    index: 6,
    title_en: "Shifting",
    title_fa: "شیفتینگ",
    tagline_en: "Slip into other realities.",
    tagline_fa: "به واقعیت‌های دیگر بلغز.",
    gradient: ["#050505", "#2E004B", "#6A006A"],
    accent: "#D100D1",
    glyph: "shuffle",
    mentor: {
      name_en: "The Architect",
      name_fa: "معمار",
      archetype_en: "Weaver of Realities",
      archetype_fa: "بافنده واقعیت‌ها",
      quote_en:
        "Every reality is a thread on my loom. Loosen your grip on this one. Soon you will weave with me.",
      quote_fa:
        "هر واقعیت رشته‌ای بر دستگاه بافندگی من است. این یکی را رها کن. به‌زودی همراه من خواهی بافت.",
    },
    levels: [
      lvl("s1", 1, "Initiate", "آغازین", [
        t("reality-script", "Reality Script", "اسکریپت واقعیت",
          genSessions("sh-l1-t1", 5, "Reality Script", "اسکریپت واقعیت")),
      ]),
      lvl("s2", 2, "Drifter", "غوطه‌ور", [
        t("raven-method", "Raven Method", "روش کلاغ",
          genSessions("sh-l2-t1", 5, "Raven Method", "روش کلاغ")),
      ]),
      lvl("s3", 3, "Walker", "رهسپار", [
        t("pillow-method", "Pillow Method", "روش بالش",
          genSessions("sh-l3-t1", 5, "Pillow Method", "روش بالش")),
      ]),
      lvl("s4", 4, "Crosser", "گذرکننده", [
        t("staircase", "Staircase Method", "روش پله",
          genSessions("sh-l4-t1", 5, "Staircase Method", "روش پله")),
      ]),
      lvl("s5", 5, "Weaver", "بافنده", [
        t("alice-method", "Alice in Wonderland", "آلیس در سرزمین عجایب",
          genSessions("sh-l5-t1", 5, "Alice in Wonderland", "آلیس در سرزمین عجایب")),
      ]),
      lvl("s6", 6, "Architect", "معمار", [
        t("anchor-symbol", "Anchor Symbol", "نماد لنگر",
          genSessions("sh-l6-t1", 5, "Anchor Symbol", "نماد لنگر")),
      ]),
      lvl("s7", 7, "Sovereign", "حاکم", [
        t("permanent-shift", "Permanent Shift", "شیفت پایدار",
          genSessions("sh-l7-t1", 5, "Permanent Shift", "شیفت پایدار")),
      ]),
    ],
  },
  {
    id: "healing",
    index: 7,
    title_en: "Healing",
    title_fa: "شفا",
    tagline_en: "Restore body, heart, and field.",
    tagline_fa: "بدن، قلب و میدان را ترمیم کن.",
    gradient: ["#050505", "#002B1E", "#006B4B"],
    accent: "#00FF9D",
    glyph: "heart",
    mentor: {
      name_en: "Quan Yin",
      name_fa: "کوآن یین",
      archetype_en: "Goddess of Compassion",
      archetype_fa: "الهه شفقت",
      quote_en:
        "Beloved, every cell remembers its origin in light. Breathe with me, and I shall hold you until the wound becomes the door.",
      quote_fa:
        "ای عزیز، هر سلول، خاستگاه خویش در نور را به یاد دارد. با من نفس بکش تا زخم به دروازه بدل شود.",
    },
    levels: [
      lvl("physical", 1, "Physical", "جسمی", [
        t("cellular", "Cellular Renewal", "ترمیم سلولی",
          genSessions("he-l1-t1", 5, "Cellular Renewal", "ترمیم سلولی")),
      ]),
      lvl("emotional", 2, "Emotional", "عاطفی", [
        t("inner-child", "Inner Child", "کودک درون",
          genSessions("he-l2-t1", 5, "Inner Child", "کودک درون")),
      ]),
      lvl("spiritual", 3, "Spiritual", "روحی", [
        t("soul-retrieval", "Soul Retrieval", "بازیابی روح",
          genSessions("he-l3-t1", 5, "Soul Retrieval", "بازیابی روح")),
      ]),
    ],
  },
  {
    id: "hypnosis",
    index: 8,
    title_en: "Hypnosis",
    title_fa: "هیپنوتیزم",
    tagline_en: "Descend the staircase of mind.",
    tagline_fa: "از پلکان ذهن فرو رو.",
    gradient: ["#050505", "#000B29", "#002B99"],
    accent: "#0048FF",
    glyph: "eye",
    mentor: {
      name_en: "Milton Erickson",
      name_fa: "میلتون اریکسون",
      archetype_en: "Master of Indirect Trance",
      archetype_fa: "استاد خلسه غیرمستقیم",
      quote_en:
        "Your unconscious already knows the way. I only whisper, and you remember. Follow the spiral down with me.",
      quote_fa:
        "ناخودآگاه تو راه را می‌داند. من فقط نجوا می‌کنم و تو به یاد می‌آوری. مارپیچ را به‌سوی پایین، همراه من دنبال کن.",
    },
    levels: [
      lvl("trance", 1, "Trance", "خلسه", [
        t("descent", "The Descent", "فرود",
          genSessions("hy-l1-t1", 5, "The Descent", "فرود")),
      ]),
      lvl("suggestion", 2, "Suggestion", "تلقین", [
        t("habit-change", "Habit Change", "تغییر عادت",
          genSessions("hy-l2-t1", 5, "Habit Change", "تغییر عادت")),
      ]),
      lvl("deep", 3, "Deep Hypnosis", "هیپنوز عمیق", [
        t("regression", "Past Regression", "بازگشت به گذشته",
          genSessions("hy-l3-t1", 5, "Past Regression", "بازگشت به گذشته")),
      ]),
    ],
  },
  {
    id: "matrix",
    index: 9,
    title_en: "Overcoming the Matrix",
    title_fa: "غلبه بر ماتریکس",
    tagline_en: "Pierce the veil of consensus.",
    tagline_fa: "از حجاب اجماع عبور کن.",
    gradient: ["#050505", "#0A1F0A", "#143D14"],
    accent: "#00FF00",
    glyph: "code",
    mentor: {
      name_en: "Morpheus",
      name_fa: "مورفیوس",
      archetype_en: "Awakener of the Real",
      archetype_fa: "بیدارگر حقیقت",
      quote_en:
        "I can only show you the door. You have to walk through it. At the end of this path, the construct dissolves.",
      quote_fa:
        "من فقط می‌توانم در را به تو نشان دهم. عبور از آن با توست. در پایان این مسیر، سازه فرو می‌ریزد.",
    },
    levels: [
      lvl("awareness", 1, "Awareness", "آگاهی", [
        t("seeing", "Seeing Through", "دیدن از ورای",
          genSessions("mx-l1-t1", 5, "Seeing Through", "دیدن از ورای")),
      ]),
      lvl("decoding", 2, "Decoding", "رمزگشایی", [
        t("symbols", "Symbol Decoding", "رمزگشایی نمادها",
          genSessions("mx-l2-t1", 5, "Symbol Decoding", "رمزگشایی نمادها")),
      ]),
      lvl("sovereignty", 3, "Sovereignty", "حاکمیت", [
        t("unplug", "Unplug", "خروج از پریز",
          genSessions("mx-l3-t1", 5, "Unplug", "خروج از پریز")),
      ]),
    ],
  },
  {
    id: "study",
    index: 10,
    title_en: "Study & Learning",
    title_fa: "مطالعه و یادگیری",
    tagline_en: "Sharpen the lightning of mind.",
    tagline_fa: "صاعقه ذهن را تیز کن.",
    gradient: ["#050505", "#00183A", "#005580"],
    accent: "#00B4D8",
    glyph: "book-open",
    mentor: {
      name_en: "Nikola Tesla",
      name_fa: "نیکولا تسلا",
      archetype_en: "Architect of Electric Mind",
      archetype_fa: "معمار ذهن الکتریکی",
      quote_en:
        "If you wish to find the secrets of the universe, think in terms of energy, frequency, and vibration. Begin here; meet me at the summit.",
      quote_fa:
        "اگر می‌خواهی رازهای کیهان را بیابی، با زبان انرژی، فرکانس و ارتعاش بیندیش. اینجا آغاز کن؛ در قله مرا خواهی دید.",
    },
    levels: [
      lvl("focus", 1, "Focus", "تمرکز", [
        t("deep-focus", "Deep Focus", "تمرکز عمیق",
          genSessions("st-l1-t1", 5, "Deep Focus", "تمرکز عمیق")),
      ]),
      lvl("memory", 2, "Memory", "حافظه", [
        t("palace", "Memory Palace", "کاخ حافظه",
          genSessions("st-l2-t1", 5, "Memory Palace", "کاخ حافظه")),
      ]),
      lvl("genius", 3, "Genius", "نبوغ", [
        t("flow-state", "Flow State", "حالت روان",
          genSessions("st-l3-t1", 5, "Flow State", "حالت روان")),
      ]),
    ],
  },
  {
    id: "silence",
    index: 11,
    title_en: "Mind Silence",
    title_fa: "خاموشی ذهن",
    tagline_en: "Return to the still point.",
    tagline_fa: "به نقطه سکون بازگرد.",
    gradient: ["#050505", "#080808", "#1A1A1A"],
    accent: "#FFFFFF",
    glyph: "circle",
    mentor: {
      name_en: "Gautama Buddha",
      name_fa: "گوتاما بودا",
      archetype_en: "The Awakened One",
      archetype_fa: "بیدارشده",
      quote_en:
        "Sit. Breathe. Notice. The mind that watches the mind is already free. I shall sit beside you, in silence, at the end of the path.",
      quote_fa:
        "بنشین. نفس بکش. مشاهده کن. ذهنی که ذهن را می‌نگرد، آزاد است. در پایان مسیر، در سکوت، کنار تو خواهم نشست.",
    },
    levels: [
      lvl("stillness", 1, "Stillness", "سکون", [
        t("breath-watching", "Breath Watching", "نظاره نفس",
          genSessions("si-l1-t1", 5, "Breath Watching", "نظاره نفس")),
      ]),
      lvl("void", 2, "Void", "خلأ", [
        t("formless", "Formless Awareness", "آگاهی بی‌شکل",
          genSessions("si-l2-t1", 5, "Formless Awareness", "آگاهی بی‌شکل")),
      ]),
      lvl("source", 3, "Source", "سرچشمه", [
        t("nothingness", "Pure Nothingness", "نیستی ناب",
          genSessions("si-l3-t1", 5, "Pure Nothingness", "نیستی ناب")),
      ]),
    ],
  },
];

export function getBranch(id: string): Branch | undefined {
  return BRANCHES.find((b) => b.id === id);
}

export function getLevel(branchId: string, levelId: string): Level | undefined {
  return getBranch(branchId)?.levels.find((l) => l.id === levelId);
}

export function getTopic(
  branchId: string,
  levelId: string,
  topicId: string,
): Topic | undefined {
  return getLevel(branchId, levelId)?.topics.find((t) => t.id === topicId);
}

export function getSession(
  branchId: string,
  levelId: string,
  topicId: string,
  sessionId: string,
): Session | undefined {
  return getTopic(branchId, levelId, topicId)?.sessions.find(
    (s) => s.id === sessionId,
  );
}
