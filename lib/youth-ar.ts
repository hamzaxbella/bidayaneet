import {
  opportunities,
  fieldActions,
  stories,
  profileFixtures,
} from "./demo-data";

export const locationsAr: Record<string, string> = {
  Agadir: "أكادير",
  Casablanca: "الدار البيضاء",
  "En ligne": "عن بُعد",
  Inezgane: "إنزكان",
  Taroudant: "تارودانت",
  Tiznit: "تيزنيت",
  Tata: "طاطا",
  Laâyoune: "العيون",
  Dakhla: "الداخلة",
  Autre: "مدينة أخرى",
};
export const typesAr: Record<string, string> = {
  Formation: "تكوين",
  Stage: "تدريب",
  Emploi: "عمل",
  Programme: "برنامج",
};
const organizationsAr: Record<string, string> = {
  GOMYCODE: "غو ماي كود",
  "StartUp Maroc": "ستارت أب المغرب",
  Marjane: "مرجان",
  "INJAZ Maroc": "إنجاز المغرب",
};
const offers = [
  [
    "تطوير الويب المتكامل",
    "6 أشهر",
    "تعلّم إنشاء تطبيقات الويب، وطوّر ملف أعمالك واستعد لأول تدريب مهني.",
    "تكوين حضوري من الاثنين إلى الجمعة، مع مواكبة للبحث عن تدريب. يمكن للمبتدئين الالتحاق بعد مقابلة تحفيزية.",
    ["HTML وCSS", "JavaScript", "العمل الجماعي"],
    "20 أكتوبر 2026",
  ],
  [
    "تدريب في التسويق الرقمي",
    "3 أشهر",
    "انضم إلى فريق مبدع وطوّر مهاراتك في التواصل وشبكات التواصل الاجتماعي.",
    "تدريب مؤطّر لمدة ثلاثة أشهر. يُفضّل امتلاك تجربة أولية في شبكات التواصل. ناقش ترتيبات التنقل مع وسيطتك.",
    ["التواصل", "شبكات التواصل", "الإبداع"],
    "15 أكتوبر 2026",
  ],
  [
    "مستشار خدمة العملاء",
    "عقد غير محدد المدة",
    "استقبل العملاء وساعدهم ضمن فريق يواكبك منذ يومك الأول.",
    "عمل بدوام كامل مع تكوين عند الالتحاق وساعات متغيرة. حضّر سيرتك الذاتية وتواصل مع وسيطتك قبل الترشح.",
    ["خدمة العملاء", "التنظيم", "الفرنسية"],
    "25 أكتوبر 2026",
  ],
  [
    "ابدأ مشروعك مع إنجاز",
    "8 أسابيع",
    "حوّل فكرتك إلى مشروع عبر ورشات عملية ومرشد يرافقك.",
    "ورشات عن بُعد مرتين أسبوعياً لاختبار الفكرة وإعداد الميزانية وتقديم المشروع. متاح دون شرط شهادة.",
    ["ريادة الأعمال", "التسيير", "العرض والتقديم"],
    "30 أكتوبر 2026",
  ],
] as const;
export const arabicOpportunities = opportunities.map((item, index) => ({
  ...item,
  organization: organizationsAr[item.organization] ?? item.organization,
  title: offers[index][0],
  duration: offers[index][1],
  description: offers[index][2],
  details: offers[index][3],
  skills: [...offers[index][4]],
  deadline: offers[index][5],
  type: typesAr[item.type],
  location: locationsAr[item.location],
}));
const actions = [
  [
    "سيرة ذاتية تعبّر عنك",
    "ورشة",
    "19 أكتوبر",
    "ساعتان",
    "أبرز مهاراتك واخرج بنسخة أولى من سيرتك الذاتية.",
  ],
  [
    "استعد لأول مقابلة عمل",
    "مواكبة",
    "21 أكتوبر",
    "ساعة واحدة",
    "تدرّب مع وسيط واكتشف كيف تقدّم مسارك بثقة.",
  ],
  [
    "اكتشف مهن العالم الرقمي",
    "اكتشاف",
    "24 أكتوبر",
    "ساعتان",
    "التقِ بمهنيين واكتشف مسارات تكوين متاحة لك.",
  ],
  [
    "تعرّف على طموحاتك",
    "حسب إيقاعك",
    "متى شئت",
    "15 دقيقة",
    "حدّد ثلاث مهن تهمّك وشاركها مع وسيطتك.",
  ],
];
export const arabicActions = fieldActions.map((item, index) => ({
  ...item,
  title: actions[index][0],
  category: actions[index][1],
  date: actions[index][2],
  duration: actions[index][3],
  description: actions[index][4],
  city: locationsAr[item.city],
}));
const storyCopy = [
  [
    "سلمى",
    "مطوّرة ويب",
    "كنت أظن أن المجال الرقمي ليس لي. واليوم أصبح مهنتي.",
    "بدأت سلمى بورشة اكتشاف بعد فترة دون عمل. ساعدتها وسيطتها على الالتحاق بتكوين وإعداد ملف أعمال والعثور على تدريب. أهداف صغيرة كل أسبوع أعادت لها الثقة.",
  ],
  [
    "عمر",
    "رائد أعمال",
    "احتاجت فكرتي إلى خطوة أولى وإلى شخص يؤمن بها.",
    "أراد عمر تأسيس نشاط محلي. ساعده برنامج مواكبة على اختبار الفكرة وفهم التكاليف ولقاء أول عملائه. نصيحته: تحدّث عن مشروعك واطلب المساعدة مبكراً.",
  ],
  [
    "فاطمة",
    "مساعدة موارد بشرية",
    "تعلّمت أن أتحدّث عن مهاراتي بثقة.",
    "طوّرت فاطمة سيرتها الذاتية واستعدت للمقابلات مع وسيطها. مكّنتها تجربة مهنية من اكتشاف الموارد البشرية وبناء مشروع يناسبها.",
  ],
  [
    "يوسف",
    "تقني",
    "فتح لي التكوين العملي طريقاً جديداً.",
    "اكتشف يوسف الصيانة خلال زيارة لمركز تكوين. اختار مساراً تقنياً وتابع لقاء وسيطه لتنظيم التنقل والتدريب.",
  ],
  [
    "أمينة",
    "وسيطة قرب",
    "قد يكفي لقاء واحد لإعادة مشروع إلى الطريق.",
    "وجدت أمينة طريقها بمواكبة شباب حيّها. بعد تكوين، انضمت إلى فريق وساطة. تستمع أولاً ثم تقترح هدفاً بسيطاً، وتساعد اليوم شباباً آخرين على اختيار خطوتهم المقبلة.",
  ],
  [
    "خالد",
    "مستشار عملاء",
    "كانت البداية أصعب خطوة. وبعدها صار لكل خطوة معنى.",
    "بدأ خالد بتجديد سيرته الذاتية وحضور ورشة مقابلات. ساعدته وسيطته على التعرّف على مهاراته ولقاء مشغّل محلي. يعمل اليوم ضمن فريق يتعلّم معه باستمرار.",
  ],
];
export const arabicStories = stories.map((item, index) => ({
  ...item,
  name: storyCopy[index][0],
  role: storyCopy[index][1],
  quote: storyCopy[index][2],
  text: storyCopy[index][3],
  city: locationsAr[item.city],
}));
export const youthProfileFixture: Record<string, string> = {
  ...profileFixtures.neet,
  firstName: "ياسين",
  lastName: "العمراني",
  goal: "تكوين",
  skills: "خدمة العملاء، الأدوات المكتبية، التواصل",
  interests: "أرغب في اكتشاف تطوير الويب والعمل ضمن فريق.",
};
export function youthName(first: string, last = "") {
  return `${first === "Yassine" ? "ياسين" : first} ${last === "El Amrani" ? "العمراني" : last}`.trim();
}

/** Upgrade only known prototype copy. Personal edits are kept verbatim. */
const legacyGoals: Record<string, string> = {
  "Une formation": "تكوين", Formation: "تكوين", "Une formation en développement web": "تكوين",
  "Un stage": "تدريب", Stage: "تدريب", "Un emploi": "عمل", Emploi: "عمل",
  "Créer mon projet": "إنشاء مشروعي", "J’ai besoin d’orientation": "أحتاج إلى توجيه",
  "Créer mon activité": "إنشاء مشروعي", "Créer mon entreprise": "إنشاء مشروعي",
  "Créer une activité": "إنشاء مشروعي", "Créer un projet": "إنشاء مشروعي",
  "Besoin d’orientation": "أحتاج إلى توجيه", "Je ne sais pas encore": "أحتاج إلى توجيه",
};
const legacySkills: Record<string, string> = {
  "relation client": "خدمة العملاء", "outils bureautiques": "الأدوات المكتبية",
  communication: "التواصل", "travail en équipe": "العمل الجماعي", organisation: "التنظيم",
  "réseaux sociaux": "شبكات التواصل", créativité: "الإبداع", vente: "البيع",
  français: "الفرنسية", arabe: "العربية", informatique: "المعلوميات",
};
export function normalizeYouthProfile(value: unknown): Record<string, string> {
  const record = value && typeof value === "object" && !Array.isArray(value) ? value as Record<string, unknown> : {};
  const result = Object.fromEntries(Object.entries(youthProfileFixture).map(([key, fallback]) =>
    [key, typeof record[key] === "string" ? record[key] : fallback],
  ));
  result.firstName = result.firstName === "Yassine" ? "ياسين" : result.firstName;
  result.lastName = result.lastName === "El Amrani" ? "العمراني" : result.lastName;
  result.goal = legacyGoals[result.goal] ?? result.goal;
  const city = Object.entries(locationsAr).find(([, label]) => label === result.city);
  if (city) result.city = city[0];
  result.skills = result.skills.split(/[,،]/).map((skill) => legacySkills[skill.trim().toLocaleLowerCase("fr")] ?? skill.trim()).join("، ");
  if (result.interests === profileFixtures.neet.interests) result.interests = youthProfileFixture.interests;
  return result;
}
export function normalizeArabicSearch(value: string) {
  return value.toLocaleLowerCase().replace(/[\u064B-\u065F\u0670ـ]/g, "").replace(/[أإآ]/g, "ا").replace(/ى/g, "ي");
}
