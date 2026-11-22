import type { Article, Category, HeroSlide } from "@/types";

const asset = (file: string) => `${import.meta.env.BASE_URL}assets/${file}`;

/** Arabic category copy keyed by slug. */
export const categoriesAr: Record<string, Pick<Category, "name" | "headline" | "description">> = {
  face: {
    name: "الوجه",
    headline: "العناية بالوجه والشفاه",
    description: "مرطبات خفيفة وعناية مُصلحة للشفاه تحافظ على توازن البشرة وهدوئها وراحتها.",
  },
  body: {
    name: "الجسم",
    headline: "العناية بالجسم",
    description:
      "غسولات غنية باليوريا وكريمات لليدين ومقشرات ولوشن للجسم تنعّم البشرة وترطبها من الرأس حتى القدمين.",
  },
  hair: {
    name: "الشعر",
    headline: "العناية بالشعر وفروة الرأس",
    description: "شامبو وبلسم يزيلان القشرة ويهدّئان فروة الرأس ويعيدان بناء الأطراف التالفة.",
  },
  "sun-care": {
    name: "الحماية من الشمس",
    headline: "الحماية من الشمس",
    description:
      "كريمات وجل وسبراي SPF 50+ واسعة الطيف مصممة للأيام الحارة والرطبة — بدون أثر أبيض أو دهون.",
  },
  deodorants: {
    name: "مزيلات العرق",
    headline: "مزيلات العرق ومضادات التعرق",
    description:
      "مزيلات عرق رول أون للتفتيح خالية من الكحول وسبراي بلمسة جافة بحماية 48 ساعة، بكل الروائح التي تحبينها.",
  },
  bundles: {
    name: "المجموعات",
    headline: "المجموعات والعروض",
    description: "روتين متكامل مختار لنتائج أفضل — وبأسعار توفّر حتى 64%.",
  },
};

type ArticleCopy = Pick<Article, "title" | "excerpt" | "topic" | "body"> & {
  author: Article["author"];
};

/** Arabic journal copy keyed by article id. */
export const articlesAr: Record<string, ArticleCopy> = {
  "a-001": {
    title: "لماذا يهمّ حاجز بشرتك؟",
    excerpt: "تعرّفي كيف يحمي حاجز البشرة الصحي من الجفاف والتهيّج والإجهاد البيئي.",
    topic: "علوم البشرة",
    author: { name: "د. إليز مارشان", role: "استشارية الأمراض الجلدية" },
    body: [
      {
        type: "paragraph",
        text: "حاجز بشرتك هو الطبقة الخارجية منها — جدار محكم من الخلايا والدهون يحافظ على الرطوبة ويمنع المهيّجات.",
      },
      { type: "heading", text: "علامات ضعف الحاجز" },
      {
        type: "paragraph",
        text: "الشد بعد التنظيف والحساسية المفاجئة والتقشّر علامات شائعة على أن حاجز بشرتك يحتاج إلى دعم.",
      },
      {
        type: "quote",
        text: "البشرة الصحية نادراً ما تحتاج إلى المزيد، بل إلى حماية ما هو موجود بالفعل.",
      },
    ],
  },
  "a-002": {
    title: "روتين صباحي لبشرة متوهجة",
    excerpt: "اصنعي روتين عناية بسيطاً يحافظ على ترطيب بشرتك طوال اليوم.",
    topic: "الروتين",
    author: { name: "كاميل روسو", role: "رئيسة قسم التركيبات" },
    body: [
      { type: "paragraph", text: "الروتين الصباحي الرائع قصير وثابت ومبني على الحماية." },
      { type: "heading", text: "نظّفي، عالجي، احمي" },
      {
        type: "paragraph",
        text: "ابدئي بغسول لطيف، ثم سيروم فيتامين سي، واختمي بالمرطب وواقي الشمس.",
      },
    ],
  },
  "a-003": {
    title: "كيف تختارين المرطب المناسب؟",
    excerpt: "اعثري على المرطب المثالي حسب نوع بشرتك وأسلوب حياتك.",
    topic: "أدلة",
    author: { name: "د. إليز مارشان", role: "استشارية الأمراض الجلدية" },
    body: [
      { type: "paragraph", text: "يعتمد المرطب المناسب على نوع بشرتك والمناخ وباقي روتينك." },
      { type: "heading", text: "القوام هو المفتاح" },
      {
        type: "paragraph",
        text: "الجل يناسب البشرة الدهنية، واللوشن يوازن البشرة المختلطة، والكريمات الغنية تريح البشرة الجافة.",
      },
    ],
  },
  "a-004": {
    title: "فن تدليك الوجه",
    excerpt: "خمس دقائق يومياً بأداة النحت تخفف التوتر وتعيد للبشرة مظهرها المرتاح.",
    topic: "طقوس",
    author: { name: "كاميل روسو", role: "رئيسة قسم التركيبات" },
    body: [
      {
        type: "paragraph",
        text: "تدليك الوجه ينشّط الدورة الدموية ويساعد السيروم على العمل بفعالية أكبر.",
      },
    ],
  },
};

/** Arabic labels and image descriptions for the Shop-by-concern tiles, keyed by tile id. */
export const concernTilesAr: Record<string, { label: string; alt: string }> = {
  "skin-healing": { label: "علاج البشرة", alt: "جل مهدّئ على بشرة متهيّجة في الكتف" },
  "anti-aging": { label: "مكافحة الشيخوخة", alt: "امرأة تضع كريم عين بالريتينول تحت عينها" },
  "sun-protection": {
    label: "الحماية من الشمس",
    alt: "امرأة تحمل أنبوب واقي شمس SPF 50+ قرب وجنتها",
  },
  "hair-care": { label: "العناية بالشعر", alt: "امرأة بشعر طويل لامع تحمل علبة ماسك للشعر" },
  "health-nutrition": {
    label: "الصحة والتغذية",
    alt: "امرأة مبتسمة تحمل مكمّلاً غذائياً للبشرة والشعر والأظافر",
  },
  deodorants: { label: "مزيلات العرق", alt: "امرأة مبتسمة تحمل مزيل عرق رول أون قرب وجنتها" },
};

/**
 * Arabic hero banners keyed by the English slide id: Arabic artwork (3:1, like
 * the English set), its description, and a destination when it differs.
 */
export const heroSlidesAr: Record<string, Pick<HeroSlide, "alt" | "image"> & { href?: string }> = {
  "hero-black-friday": {
    alt: "الجمعة البيضاء من Veroné — خصم يصل إلى 50%. تسوقي الآن.",
    image: { url: asset("hero-black-friday-ar.webp"), width: 2400, height: 800 },
  },
  "hero-biggest-sale": {
    alt: "أكبر تخفيض في السنة! منتجات Soralone وVacation وCapixy مع شريط الجمعة البيضاء. تسوقي الآن.",
    image: { url: asset("hero-biggest-sale-ar.webp"), width: 2400, height: 800 },
  },
  "hero-beauty-ritual": {
    alt: "جمالك.. طقسك اليومي — مستحضرات العناية بالبشرة والشعر لإشراقة تدوم كل يوم، مع حليب الجسم Hydra Bomb وماسك الشفاه Jelly Lip Mask بالبطيخ من Vacation. اكتشفي جمالك.",
    image: { url: asset("hero-beauty-ritual-ar.webp"), width: 2400, height: 800 },
  },
};
