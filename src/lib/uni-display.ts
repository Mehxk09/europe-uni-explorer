export type UniFieldCategory =
  | "music-performing"
  | "arts-design"
  | "medical-health"
  | "technical"
  | "business"
  | "education"
  | "law"
  | "agriculture"
  | "theology"
  | "sports"
  | "applied-sciences"
  | "general"
  | "specialist";

export interface UniFieldInfo {
  category: UniFieldCategory;
  label: string;
  emoji: string;
}

export interface UniversityDisplay {
  englishName: string;
  originalName: string;
  translated: boolean;
  field: UniFieldInfo;
}

const FIELD_RULES: {
  category: UniFieldCategory;
  label: string;
  emoji: string;
  patterns: RegExp[];
}[] = [
  {
    category: "music-performing",
    label: "Music & performing arts",
    emoji: "🎵",
    patterns: [
      /muzick/i,
      /musik/i,
      /music/i,
      /musique/i,
      /musica/i,
      /hudb/i,
      /darstellend/i,
      /performing/i,
      /konservator/i,
      /conservatoire/i,
      /conservatory/i,
      /theatre/i,
      /theater/i,
      /teatro/i,
      /opera/i,
      /jazz/i,
      /ballet/i,
      /drama/i,
      /schauspiel/i,
    ],
  },
  {
    category: "arts-design",
    label: "Fine arts & design",
    emoji: "🎨",
    patterns: [
      /\bumeni\b/i,
      /\bkunst\b/i,
      /\barts\b/i,
      /beaux.?arts/i,
      /design/i,
      /architekt/i,
      /architect/i,
      /malarst/i,
      /sculpt/i,
      /fotograf/i,
      /filmov/i,
      /cinema/i,
    ],
  },
  {
    category: "medical-health",
    label: "Medicine & health",
    emoji: "🏥",
    patterns: [
      /medizin/i,
      /medicin/i,
      /medical/i,
      /medicine/i,
      /zdravot/i,
      /health/i,
      /kranken/i,
      /nursing/i,
      /verpleeg/i,
      /farmac/i,
      /pharm/i,
      /odontolog/i,
      /dental/i,
      /veterinar/i,
      /veterinary/i,
      /tierarzt/i,
      /psycholog/i,
      /physiother/i,
    ],
  },
  {
    category: "technical",
    label: "Engineering & technology",
    emoji: "⚙️",
    patterns: [
      /technic/i,
      /technisch/i,
      /technical/i,
      /polytechnic/i,
      /ingenieur/i,
      /engineer/i,
      /informatik/i,
      /informatic/i,
      /computer/i,
      /elektrotech/i,
    ],
  },
  {
    category: "business",
    label: "Business & economics",
    emoji: "💼",
    patterns: [
      /wirtschaft/i,
      /business/i,
      /econom/i,
      /handel/i,
      /commerce/i,
      /management/i,
      /betriebsw/i,
      /handels/i,
      /bank/i,
      /finance/i,
    ],
  },
  {
    category: "education",
    label: "Teacher training & education",
    emoji: "📚",
    patterns: [/padagog/i, /pädagog/i, /pedagog/i, /teacher/i, /lehrer/i, /didakt/i],
  },
  {
    category: "law",
    label: "Law & legal studies",
    emoji: "⚖️",
    patterns: [/recht/i, /\blaw\b/i, /jurid/i, /juris/i, /legal/i],
  },
  {
    category: "agriculture",
    label: "Agriculture & forestry",
    emoji: "🌾",
    patterns: [/agrar/i, /agricult/i, /landbouw/i, /forestry/i, /lesnic/i],
  },
  {
    category: "theology",
    label: "Theology & religious studies",
    emoji: "⛪",
    patterns: [/theolog/i, /ecclesiast/i, /kirch/i],
  },
  {
    category: "sports",
    label: "Sports & physical education",
    emoji: "🏃",
    patterns: [/sport/i, /physical educ/i, /telo vychov/i],
  },
  {
    category: "applied-sciences",
    label: "Applied sciences (FH / HBO)",
    emoji: "🔬",
    patterns: [
      /fachhochschule/i,
      /hogeschool/i,
      /hochschule fur angewandte/i,
      /applied sciences/i,
      /angevand/i,
      /\bfh\b/i,
    ],
  },
];

const PHRASE_TRANSLATIONS: [RegExp, string][] = [
  [/akademie muzickych umeni v praze/i, "Academy of Musical Arts, Prague"],
  [/janackova akademie muzickych umeni v brne/i, "Janáček Academy of Musical Arts, Brno"],
  [/vysoke uceni technicke v brne/i, "Brno University of Technology"],
  [/ceske vysoke uceni technicke v praze/i, "Czech Technical University in Prague"],
  [/univerzita karlova/i, "Charles University"],
  [/universitat fur musik und darstellende kunst/i, "University of Music and Performing Arts"],
  [/medizinische universitat/i, "Medical University"],
  [/padagogische hochschule|pädagogische hochschule/i, "Teacher Training College"],
  [/fachhochschule/i, "University of Applied Sciences"],
  [/technische universitat/i, "Technical University"],
];

const CITY_IN_NAME: [RegExp, string][] = [
  [/\bv praze\b/i, ", Prague"],
  [/\bv brne\b/i, ", Brno"],
  [/\bgra[cz]\b/i, ", Graz"],
  [/\bwien\b/i, ", Vienna"],
];

function normalize(text: string) {
  return text
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .replace(/\s+/g, " ")
    .trim();
}

function stripLegalSuffix(name: string) {
  return name
    .replace(/\s*(gmbh|mbh|s\.r\.o\.|spol\.|a\.s\.|oy|ab|as)\.?\s*$/i, "")
    .trim();
}

export function classifyUniversityField(name: string): UniFieldInfo {
  const hay = normalize(name);

  for (const rule of FIELD_RULES) {
    if (rule.patterns.some((p) => p.test(hay))) {
      return { category: rule.category, label: rule.label, emoji: rule.emoji };
    }
  }

  if (/univer/i.test(hay)) {
    return { category: "general", label: "General university", emoji: "🎓" };
  }

  if (/institut|college|hochschule|skola|school/i.test(hay)) {
    return { category: "specialist", label: "Specialist college", emoji: "🏫" };
  }

  return { category: "general", label: "Higher education institution", emoji: "🎓" };
}

export type StudyInterestId =
  | "it-cs"
  | "web-dev"
  | "ai-data"
  | "animation-games"
  | "design-media";

export const STUDY_INTEREST_FILTERS: {
  id: StudyInterestId;
  label: string;
  emoji: string;
}[] = [
  { id: "it-cs", label: "IT & CS", emoji: "💻" },
  { id: "web-dev", label: "Web & software", emoji: "🌐" },
  { id: "ai-data", label: "AI & data", emoji: "🤖" },
  { id: "animation-games", label: "Animation & games", emoji: "🎬" },
  { id: "design-media", label: "Design & media", emoji: "🎨" },
];

const STUDY_INTEREST_RULES: Record<
  StudyInterestId,
  { patterns: RegExp[]; categories?: UniFieldCategory[] }
> = {
  "it-cs": {
    patterns: [
      /informatik/i,
      /informatic/i,
      /computer/i,
      /software/i,
      /digital/i,
      /cyber/i,
      /elektrotech/i,
      /technolog/i,
      /technic/i,
      /polytechnic/i,
      /engineer/i,
      /ingenieur/i,
      /it\b/i,
      /ict\b/i,
    ],
    categories: ["technical"],
  },
  "web-dev": {
    patterns: [
      /web/i,
      /software/i,
      /programm/i,
      /developer/i,
      /informatik/i,
      /informatic/i,
      /computer/i,
      /digital/i,
      /fullstack/i,
      /frontend/i,
      /backend/i,
    ],
  },
  "ai-data": {
    patterns: [
      /\bai\b/i,
      /artificial.?intellig/i,
      /machine.?learn/i,
      /data.?scien/i,
      /big.?data/i,
      /analytics/i,
      /deep.?learn/i,
      /künstliche.?intellig/i,
      /kunstliche.?intellig/i,
      /informatik/i,
      /informatic/i,
      /computer/i,
      /software/i,
      /digital/i,
      /cyber/i,
      /technolog/i,
      /technic/i,
      /polytechnic/i,
    ],
    categories: ["technical"],
  },
  "animation-games": {
    patterns: [
      /animat/i,
      /\bgame/i,
      /spiel/i,
      /multimedia/i,
      /filmov/i,
      /film/i,
      /cinema/i,
      /motion/i,
      /vfx/i,
      /graphic/i,
      /\b3d\b/i,
      /medien/i,
      /media/i,
      /visual effect/i,
    ],
  },
  "design-media": {
    patterns: [
      /design/i,
      /media/i,
      /\bux\b/i,
      /communication/i,
      /visual/i,
      /interactive/i,
      /malarst/i,
      /grafik/i,
    ],
    categories: ["arts-design"],
  },
};

export function matchesStudyInterest(name: string, interest: StudyInterestId): boolean {
  const hay = normalize(name);
  const rule = STUDY_INTEREST_RULES[interest];

  if (rule.patterns.some((p) => p.test(hay))) {
    return true;
  }

  if (rule.categories) {
    const field = classifyUniversityField(name);
    return rule.categories.includes(field.category);
  }

  return false;
}

function translateName(name: string, city: string | null | undefined): string {
  let working = stripLegalSuffix(name);
  const normalized = normalize(working);
  let matchedPhrase = false;

  for (const [pattern, replacement] of PHRASE_TRANSLATIONS) {
    if (pattern.test(normalized)) {
      working = normalized.replace(pattern, replacement);
      matchedPhrase = true;
      break;
    }
  }

  if (!matchedPhrase) {
    working = normalized
      .replace(/\bv praze\b/i, "in Prague")
      .replace(/\bv brne\b/i, "in Brno")
      .replace(/\bfur\b|\bfür\b/gi, "for")
      .replace(/\bund\b/gi, "and")
      .replace(/\bumeni\b/gi, "Arts")
      .replace(/\bmuzickych\b|\bmuzicke\b/gi, "Musical")
      .replace(/\bakademie\b/gi, "Academy")
      .replace(/\buniversita\b/gi, "University")
      .replace(/\buniversitat\b/gi, "University")
      .replace(/\buniverzita\b/gi, "University")
      .replace(/\btechnick\b/gi, "Technical")
      .replace(/\bvysoke uceni\b/gi, "University")
      .replace(/\bmedizinische\b/gi, "Medical")
      .replace(/\bpadagogische\b|\bpädagogische\b/gi, "Teacher Training");

    working = working
      .split(/\s+/)
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
      .join(" ");
  }

  for (const [pattern, replacement] of CITY_IN_NAME) {
    if (!working.includes(replacement.replace(/^, /, ""))) {
      working = working.replace(pattern, replacement);
    }
  }

  if (city && !matchedPhrase) {
    const cityClean = city.split("|")[0].trim();
    const cityMap: Record<string, string> = {
      Praha: "Prague",
      Wien: "Vienna",
    };
    const cityEng = cityMap[cityClean] ?? cityClean;
    if (!working.toLowerCase().includes(cityEng.toLowerCase())) {
      working = `${working.replace(/,\s*$/, "")}, ${cityEng}`;
    }
  }

  return working.trim();
}

export function getUniversityDisplay(
  name: string,
  city?: string | null,
): UniversityDisplay {
  const field = classifyUniversityField(name);
  const englishName = translateName(name, city);
  const translated =
    normalize(englishName).toLowerCase() !== normalize(name).toLowerCase();

  return {
    englishName: translated ? englishName : name,
    originalName: name,
    translated,
    field,
  };
}
