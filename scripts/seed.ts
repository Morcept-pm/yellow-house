/**
 * Seeds Firestore with: site_settings defaults, the existing hard-coded
 * news/cases content (so the site isn't empty the moment it switches to
 * Firestore-backed rendering), and 2 demo for-sale properties (clearly
 * fake — replace or delete them from /admin once real listings exist).
 *
 * Usage: npm run seed
 * Safe to re-run: news/cases use the same doc id as their slug, so re-running
 * overwrites rather than duplicates. Properties use fixed demo ids likewise.
 */
import { FieldValue } from "firebase-admin/firestore";
import { adminDb } from "./firebaseAdmin";
import { NEWS_DATA } from "../src/data/newsData";
import { CASES_DATA } from "../src/data/casesData";
import { PROPERTIES_DATA } from "../src/data/propertiesData";

const DEFAULT_GENERAL = {
  companyNameZh: "株式会社イエローハウスカンパニー\n(YELLOW HOUSE COMPANY)",
  companyNameEn: "Yellow House Company Inc.\n(株式会社イエローハウスカンパニー)",
  companyNameJp: "株式会社イエローハウスカンパニー",
  licenseZh: "神奈川縣知事（1）第32070號",
  licenseEn: "Governor of Kanagawa (1) No. 32070",
  licenseJp: "神奈川県知事（1）第32070号",
  addressZh: "神奈川縣伊勢原市櫻台1-22-15\nネオハイツ伊勢原112 (〒259-1132)",
  addressEn: "#112 Neo Heights Isehara, 1-22-15 Sakuradai,\nIsehara-shi, Kanagawa 259-1132, Japan",
  addressJp: "神奈川県伊勢原市桜台1-22-15\nネオハイツ伊勢原112 (〒259-1132)",
  email: "contact@yellowhouse.jp",
  phone: "",
  hoursZh: "週一至週五 09:00 - 18:00 (JST)\n週末與日本國定假日可預約線上諮詢",
  hoursEn: "Mon - Fri 09:00 - 18:00 (JST)\nOnline consultations available on weekends by appointment",
  hoursJp: "月曜〜金曜 09:00 - 18:00 (JST)\n週末・祝日はオンライン相談予約可",
  // Demo placeholders — replace with real accounts from /admin/settings.
  // "#" keeps the floating icon visibly wired up without linking anywhere real.
  social: { line: "#", instagram: "#", whatsapp: "#", facebook: "", linkedin: "", x: "" },
};

const DEFAULT_HOME = {
  heroTitleLine1Zh: "日本在地的",
  heroTitleLine1En: "Your Practical Partner in",
  heroTitleLine1Jp: "日本に根差した",
  heroTitleLine2Zh: "不動產實務夥伴",
  heroTitleLine2En: "Japan Real Estate",
  heroTitleLine2Jp: "不動産実務パートナー",
  heroDescZh: "我們不只介紹物件，更理解持有與經營。從取得、持有、管理、開發、營運到出售，以15年實務經驗協助客戶做出更完整的判斷。",
  heroDescEn:
    "We don't just introduce properties; we understand what it takes to own and operate them. From acquisition, holding, management, development, and operations to resale, our 15 years of hands-on experience empower you to make informed decisions.",
  heroDescJp: "私たちは物件をご紹介するだけではなく、所有と経営の実態を理解しています。取得、保有、管理、開発、運営から売却まで、15年の実務経験でお客様の的確な判断をサポートします。",
  heroImage: "",
  primaryCtaZh: "預約諮詢",
  primaryCtaEn: "BOOK CONSULTATION",
  primaryCtaJp: "相談を予約する",
};

const DEFAULT_SEO = {
  defaultTitleZh: "Yellow House - 日本在地的實務不動產夥伴 | 株式会社イエローハウスカンパニー",
  defaultTitleEn: "Yellow House - Your Practical Real Estate Partner in Japan",
  defaultTitleJp: "Yellow House - 日本の不動産を実務目線でサポート",
  defaultDescriptionZh: "立足日本，持有正式宅地建物取引業執照，提供不動產買賣、租賃管理、開發與住宿設施營運的全方位實務支持。",
  defaultDescriptionEn:
    "Licensed Japan real estate brokerage offering brokerage, leasing management, development, and hospitality operations for overseas clients.",
  defaultDescriptionJp: "日本国内で宅地建物取引業の免許を持ち、売買仲介から賃貸管理、開発、宿泊施設運営まで支援します。",
  ogImage: "",
  pages: {},
};

async function main() {
  const batchWrites: Promise<unknown>[] = [];

  batchWrites.push(adminDb.collection("site_settings").doc("general").set({ ...DEFAULT_GENERAL, updatedAt: FieldValue.serverTimestamp() }, { merge: true }));
  batchWrites.push(adminDb.collection("site_settings").doc("home").set({ ...DEFAULT_HOME, updatedAt: FieldValue.serverTimestamp() }, { merge: true }));
  batchWrites.push(adminDb.collection("site_settings").doc("seo").set({ ...DEFAULT_SEO, updatedAt: FieldValue.serverTimestamp() }, { merge: true }));

  NEWS_DATA.forEach((item, idx) => {
    // Strip the data file's own `id` (e.g. "news-1") — the Firestore doc id
    // (set below to the slug) is what the app actually uses; keeping both
    // would let this stale field shadow the real doc id when read back.
    const { id: _unused, ...rest } = item;
    batchWrites.push(
      adminDb
        .collection("news")
        .doc(item.slug)
        .set({
          ...rest,
          status: "published",
          sortOrder: idx,
          publishedAt: FieldValue.serverTimestamp(),
          createdAt: FieldValue.serverTimestamp(),
          updatedAt: FieldValue.serverTimestamp(),
        })
    );
  });

  CASES_DATA.forEach((item, idx) => {
    const { id: _unused, ...rest } = item;
    batchWrites.push(
      adminDb
        .collection("cases")
        .doc(item.slug)
        .set({
          ...rest,
          priceJPY: item.priceJPY ?? null,
          status: "published",
          sortOrder: idx,
          publishedAt: FieldValue.serverTimestamp(),
          createdAt: FieldValue.serverTimestamp(),
          updatedAt: FieldValue.serverTimestamp(),
        })
    );
  });

  PROPERTIES_DATA.forEach((item) => {
    const { id, ...data } = item;
    batchWrites.push(
      adminDb
        .collection("properties")
        .doc(id)
        .set({
          ...data,
          status: "published",
          publishedAt: FieldValue.serverTimestamp(),
          createdAt: FieldValue.serverTimestamp(),
          updatedAt: FieldValue.serverTimestamp(),
        })
    );
  });

  await Promise.all(batchWrites);
  console.log(`Seeded: site_settings (3), news (${NEWS_DATA.length}), cases (${CASES_DATA.length}), demo properties (${PROPERTIES_DATA.length}).`);
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
