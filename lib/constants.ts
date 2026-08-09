export const APP_URL = "https://app.writidian.com";
export const CONTACT_EMAIL = "info@writidian.com";

export const SITE = {
  name: "Writidian",
  tagline: "A space for intentional writing.",
  description:
    "Writidian is a distraction-free writing haven for people who want to think and write for themselves. Soundscapes, daily prompts, and a built-in editor. No AI.",
};

export const SOCIALS = [
  {
    id: "email",
    label: "Email",
    href: `mailto:${CONTACT_EMAIL}`,
  },
  {
    id: "linkedin",
    label: "LinkedIn",
    href: "https://www.linkedin.com/company/writidian/",
  },
  {
    id: "instagram",
    label: "Instagram",
    href: "https://www.instagram.com/writidian/",
  },
] as const;

export const FOOTER_LINKS = {
  product: [
    { label: "Open app", href: APP_URL, external: true as const },
    { label: "Features", href: "/#soundscapes" },
    { label: "Daily prompt", href: "/#prompt" },
    { label: "Editor", href: "/#editor" },
  ],
  company: [
    { label: "About us", href: "/about" },
    { label: "Contact", href: `mailto:${CONTACT_EMAIL}` },
  ],
  legal: [
    { label: "Terms & conditions", href: "/terms" },
    { label: "Privacy policy", href: "/privacy" },
  ],
} as const;

export const COPY = {
  heroEyebrow: "A distraction-free writing haven",
  heroHeadline: "to grow your inner human writer",
  heroSupport:
    "Experience a supportive digital environment for anyone who wants to write.",
  sanctuaryHeadline: "In here, it's just you, your thoughts and the page.",
  sanctuaryBody:
    "Each feature within Writidian is built to help you think critically through the art of writing. We value the power of the human mind.",
  problemWords:
    "The modern digital environment is hostile to the human writing process. Distractions are everywhere, and the chance to think critically is now often deferred to AI models.",
  problemPurpose:
    "Writidian's purpose is to help you create a dedicated, immersive ecosystem for critical thinking through writing.",
  problemBridge: "We're doing this with:",
  soundscapesTitle: "Soundscapes that support your flow",
  soundscapesBody:
    "Writidian's in-built library of soundscapes puts you in the right headspace to carve out the world you're building in your mind, and sustain the focus you need to finish your drafts.",
  soundscapeBullets: [
    "Binaural sounds for peak attention and focus",
    "Non-binaural sounds for everyday auditory experiences",
    "Genre soundscapes for putting you in the mood while you write in a specific genre, from science fiction to fantasy, romance, and journaling",
  ],
  promptTitle:
    "A new writing prompt every day to spark your creative and reflective mind.",
  promptBody:
    "Quickly get rid of writer's block with Writidian's prompt of the day! Every day presents an opportunity for a new story.",
  samplePromptLabel: "Nostalgia",
  samplePrompt:
    "There is a song you refuse to listen to anymore because it transports you to a time you can't get back. What time is that?",
  editorTitle: "Your uncluttered editor lives here",

  editorBody:
    'A clean sheet for your words awaits you with only the features you need, where you need them. A true representation of "Less is more".',
  streakTitle: "Building a writing habit with a momentum that stays with you",
  streakBody:
    "With only 100 words a day, you can start building your writing streak. You're practically building a critical thinking streak too!",
  statsTitle: "Learn from advanced statistics",
  statsBody:
    "The patterns behind your practice, gathered quietly while you write.",
  statsBullets: [
    "Understand which prompt categories you gravitate to a lot more",
    'Find out which soundscapes you prefer most when "zoning in"',
    "Track your peak writing hours for higher productivity",
  ],
  analyticsTitle: "See your writing rhythm",
  analyticsBody:
    "Track Sanctuary hours, words flowed, and your daily momentum. Log off-device writing in case you prefer to write in a physical book.",
  platformNote:
    "Writidian is a web app today. A mobile app is in the pipeline.",
  finalCta: "Start your Writidian journey today",
  finalSupport: "Sign up for free — No credit card required",
};

export const SAMPLE_PROMPTS = [
  {
    id: "nostalgia",
    label: "Nostalgia",
    text: "There is a song you refuse to listen to anymore because it transports you to a time you can't get back. What time is that?",
  },
  {
    id: "scene-starter",
    label: "Scene starter",
    text: "The last train has gone. Two strangers are still standing on the platform, and neither of them is waiting for a train.",
  },
  {
    id: "character",
    label: "Character",
    text: "Write about someone who keeps a promise nobody asked them to make, years after the person they made it to has forgotten.",
  },
] as const;

export const GENRES = [
  "Romance",
  "Horror",
  "Sci-fi",
  "Fantasy",
  "Literary",
  "Journaling",
  "Mystery",
  "Poetry",
] as const;

/**
 * Social-style notification clutter for the sanctuary reveal.
 * Layout: left + right columns below the narration band (y ≈ 16–36%),
 * so the center headline stays clear with breathing room.
 */
export const SOCIAL_CLUTTER = [
  {
    id: "s1",
    brand: "instagram" as const,
    platform: "Instagram",
    title: "maya · liked your photo",
    body: "and 14 others · 2m",
    accent: "#E1306C",
    x: 16,
    y: 42,
    mx: 18,
    my: 40,
    ox: -48,
    oy: -28,
    rot: -5,
    mobile: true,
  },
  {
    id: "s2",
    brand: "x" as const,
    platform: "X",
    title: "Trending in your area",
    body: "Hot take thread you do not need",
    accent: "#000000",
    x: 84,
    y: 42,
    mx: 82,
    my: 40,
    ox: 48,
    oy: -30,
    rot: 5,
    mobile: true,
  },
  {
    id: "s3",
    brand: "discord" as const,
    platform: "Discord",
    title: "#general · writers-den",
    body: "12 new mentions waiting for you",
    accent: "#5865F2",
    x: 18,
    y: 56,
    mx: 20,
    my: 54,
    ox: -52,
    oy: 6,
    rot: -4,
    mobile: true,
  },
  {
    id: "s4",
    brand: "tiktok" as const,
    platform: "TikTok",
    title: "For You",
    body: "Watch this before you write",
    accent: "#FE2C55",
    x: 86,
    y: 56,
    mx: 80,
    my: 56,
    ox: 50,
    oy: 4,
    rot: 6,
    mobile: false,
  },
  {
    id: "s5",
    brand: "pinterest" as const,
    platform: "Pinterest",
    title: "47 new ideas for you",
    body: "Writing desks & quiet corners",
    accent: "#E60023",
    x: 50,
    y: 62,
    mx: 50,
    my: 66,
    ox: 0,
    oy: 36,
    rot: -3,
    mobile: true,
  },
  {
    id: "s6",
    brand: "slack" as const,
    platform: "Slack",
    title: "design-team",
    body: "Another ping. Another tab.",
    accent: "#4A154B",
    x: 82,
    y: 70,
    mx: 78,
    my: 70,
    ox: 44,
    oy: 32,
    rot: 4,
    mobile: true,
  },
  {
    id: "s7",
    brand: "whatsapp" as const,
    platform: "WhatsApp",
    title: "Jordan",
    body: "hey u free rn???",
    accent: "#25D366",
    x: 15,
    y: 70,
    mx: 20,
    my: 78,
    ox: -50,
    oy: 38,
    rot: -5,
    mobile: true,
  },
  {
    id: "s8",
    brand: "calendar" as const,
    platform: "Calendar",
    title: "Standup",
    body: "Starts in 5 minutes",
    accent: "#E74C3C",
    x: 85,
    y: 82,
    mx: 82,
    my: 82,
    ox: 46,
    oy: 36,
    rot: 5,
    mobile: false,
  },
  {
    id: "s9",
    brand: "chatgpt" as const,
    platform: "ChatGPT",
    title: "Rewrite this?",
    body: "Generate a better paragraph",
    accent: "#10A37F",
    x: 20,
    y: 84,
    mx: 36,
    my: 84,
    ox: -44,
    oy: 28,
    rot: -4,
    mobile: false,
  },
  {
    id: "s10",
    brand: "youtube" as const,
    platform: "YouTube",
    title: "Suggested for you",
    body: "Infinite scroll is calling",
    accent: "#FF0000",
    x: 50,
    y: 78,
    mx: 50,
    my: 88,
    ox: 8,
    oy: 40,
    rot: 3,
    mobile: false,
  },
] as const;

export const STAT_WEEK = [
  { day: "Mon", h: 28 },
  { day: "Tue", h: 62 },
  { day: "Wed", h: 44 },
  { day: "Thu", h: 78 },
  { day: "Fri", h: 36 },
  { day: "Sat", h: 90 },
  { day: "Sun", h: 54 },
] as const;

/** Seeded organic heatmap (84 cells) — sparse weeks, bursty streaks, not a repeating stripe. */
function buildHeatLevels(seed = 0x57a7): number[] {
  let s = seed >>> 0;
  const rand = () => {
    s =
      (Math.imul(s ^ (s >>> 16), 2246822507) >>> 0) ^
      (Math.imul(s ^ (s >>> 13), 3266489909) >>> 0);
    return (s >>> 0) / 4294967296;
  };

  const levels: number[] = [];
  for (let week = 0; week < 12; week++) {
    // Each month-column has its own energy: quiet, steady, or hot
    const energy = rand();
    const activeBias =
      energy < 0.22 ? 0.18 : energy < 0.55 ? 0.42 : energy < 0.8 ? 0.62 : 0.82;

    for (let day = 0; day < 7; day++) {
      const r = rand();
      // Small chance of a 2–3 day burst after an active day
      const prev = levels[levels.length - 1] ?? 0;
      const streakBoost = prev >= 2 && rand() < 0.45 ? 0.2 : 0;
      const p = Math.min(0.95, activeBias + streakBoost);

      if (r > p) {
        levels.push(0);
      } else if (r > p * 0.55) {
        levels.push(1);
      } else if (r > p * 0.25) {
        levels.push(2);
      } else {
        levels.push(3);
      }
    }
  }
  return levels;
}

export const STAT_HEAT_LEVELS = buildHeatLevels();


export const STAT_PANELS = [
  {
    id: "momentum",
    label: "Momentum",
    value: "12",
    unit: "Days",
    caption: "Each day you show up, the flame grows.",
    daysActive: [true, true, true, true, true, true, false] as boolean[],
  },
  {
    id: "words",
    label: "Words Flowed",
    value: "28.4k",
    unit: "",
    caption: "The shape of your week on the page.",
    week: STAT_WEEK,
  },
  {
    id: "sanctuary",
    label: "Sanctuary Hours",
    value: "14.5",
    unit: "hrs",
    caption: "Quiet hours protected for writing alone.",
    progress: 0.72,
    sessions: 18,
  },
  {
    id: "compass",
    label: "Thematic Compass",
    value: "Fantasy",
    unit: "42%",
    caption: "Your drafts lean toward worlds that ask for wonder.",
    axes: [
      { label: "Fantasy", value: 0.42 },
      { label: "Literary", value: 0.24 },
      { label: "Romance", value: 0.18 },
      { label: "Horror", value: 0.16 },
      { label: "Sci-fi", value: 0.12 },
      { label: "Mystery", value: 0.1 },
    ],
  },
  {
    id: "resonance",
    label: "Soundscape Resonance",
    value: "Journaling",
    unit: "top",
    caption: "The rooms you return to while you write.",
    bars: [
      { label: "Journaling", value: 0.92 },
      { label: "Literary fiction", value: 0.78 },
      { label: "Romance", value: 0.64 },
      { label: "Horror", value: 0.51 },
      { label: "Non-binaural", value: 0.38 },
    ],
  },
  {
    id: "rhythm",
    label: "Flow Rhythm",
    value: "Sat",
    unit: "peak",
    caption: "When your writing finds its deepest current.",
    months: ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"] as const,
  },
] as const;

export type StatPanelId = (typeof STAT_PANELS)[number]["id"];

export const SOUNDSCAPE_SCENES = [
  {
    id: "journaling",
    title: "Bubbly Reflection",
    category: "Journaling",
    image: "/images/soundscape-journaling-environment.png",
    foreground: "/images/soundscape-journaling-foreground.png",
  },
  {
    id: "literary-fiction",
    title: "Dusty Photo Frame",
    category: "Literary fiction",
    image: "/images/soundscape-literary-environment.png",
    foreground: "/images/soundscape-literary-foreground.png",
  },
  {
    id: "romance",
    title: "Amber Drift",
    category: "Romance",
    image: "/images/soundscape-romance-environment.png",
    foreground: "/images/soundscape-romance-foreground.png",
  },
  {
    id: "horror",
    title: "Basement Door Ajar",
    category: "Horror",
    image: "/images/soundscape-horror.png",
    foreground: "/images/soundscape-horror-foreground.png",
  },
  {
    id: "non-binaural",
    title: "Light rain + birdsong",
    category: "Non-binaural",
    image: "/images/soundscape-non-binaural-environment.png",
    foreground: "/images/soundscape-rain-foreground.png",
  },
] as const;
