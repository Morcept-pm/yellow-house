import { doc, getDoc, onSnapshot, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";
import type { SiteSettingsGeneral, SiteSettingsHome, SiteSettingsSeo } from "../../types/content";

export const DEFAULT_GENERAL: SiteSettingsGeneral = {
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
  // "#" keeps the floating icon visibly wired up without linking anywhere real.
  social: { line: "#", instagram: "#", whatsapp: "#", facebook: "", linkedin: "", x: "" },
};

export const DEFAULT_HOME: SiteSettingsHome = {
  heroSlides: [],
  heroTitleLine1Zh: "日本在地的",
  heroTitleLine1En: "Your Practical Partner in",
  heroTitleLine1Jp: "日本に根差した",
  heroTitleLine2Zh: "不動產實務夥伴",
  heroTitleLine2En: "Japan Real Estate",
  heroTitleLine2Jp: "不動産実務パートナー",
  heroDescZh:
    "我們不只介紹物件，更理解持有與經營。從取得、持有、管理、開發、營運到出售，以15年實務經驗協助客戶做出更完整的判斷。",
  heroDescEn:
    "We don't just introduce properties; we understand what it takes to own and operate them. From acquisition, holding, management, development, and operations to resale, our 15 years of hands-on experience empower you to make informed decisions.",
  heroDescJp:
    "私たちは物件をご紹介するだけではなく、所有と経営の実態を理解しています。取得、保有、管理、開発、運営から売却まで、15年の実務経験でお客様の的確な判断をサポートします。",
  heroImage: "",
  primaryCtaZh: "預約諮詢",
  primaryCtaEn: "BOOK CONSULTATION",
  primaryCtaJp: "相談を予約する",
};

export const DEFAULT_SEO: SiteSettingsSeo = {
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

export function watchGeneral(cb: (v: SiteSettingsGeneral) => void) {
  return onSnapshot(doc(db, "site_settings", "general"), (snap) => {
    cb(snap.exists() ? { ...DEFAULT_GENERAL, ...(snap.data() as SiteSettingsGeneral) } : DEFAULT_GENERAL);
  });
}

export function watchHome(cb: (v: SiteSettingsHome) => void) {
  return onSnapshot(doc(db, "site_settings", "home"), (snap) => {
    cb(snap.exists() ? { ...DEFAULT_HOME, ...(snap.data() as SiteSettingsHome) } : DEFAULT_HOME);
  });
}

export function watchSeo(cb: (v: SiteSettingsSeo) => void) {
  return onSnapshot(doc(db, "site_settings", "seo"), (snap) => {
    cb(snap.exists() ? { ...DEFAULT_SEO, ...(snap.data() as SiteSettingsSeo) } : DEFAULT_SEO);
  });
}

export async function getGeneralOnce(): Promise<SiteSettingsGeneral> {
  const snap = await getDoc(doc(db, "site_settings", "general"));
  return snap.exists() ? { ...DEFAULT_GENERAL, ...(snap.data() as SiteSettingsGeneral) } : DEFAULT_GENERAL;
}

export async function saveGeneral(value: SiteSettingsGeneral) {
  await setDoc(doc(db, "site_settings", "general"), { ...value, updatedAt: serverTimestamp() });
}

export async function saveHome(value: SiteSettingsHome) {
  await setDoc(doc(db, "site_settings", "home"), { ...value, updatedAt: serverTimestamp() });
}

export async function saveSeo(value: SiteSettingsSeo) {
  await setDoc(doc(db, "site_settings", "seo"), { ...value, updatedAt: serverTimestamp() });
}
