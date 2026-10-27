import type { Timestamp } from "firebase/firestore";

/** CMS visibility. Only "published" is ever readable by the public site. */
export type PublishStatus = "draft" | "published" | "archived";

export interface Trilingual {
  zh: string;
  en: string;
  jp: string;
}

// A single category entry for News or Cases — `key` is assigned once (at
// creation) and never changes, since published articles reference it by
// this key. Only the labels are meant to be edited afterwards.
export interface CategoryItem {
  key: string;
  labelZh: string;
  labelEn: string;
  labelJp: string;
}

export interface SiteSettingsCategories {
  news: CategoryItem[];
  cases: CategoryItem[];
  updatedAt?: Timestamp;
}

// ---------------------------------------------------------------------------
// site_settings/*
// ---------------------------------------------------------------------------

export interface SiteSettingsGeneral {
  companyNameZh: string;
  companyNameEn: string;
  companyNameJp: string;
  licenseZh: string;
  licenseEn: string;
  licenseJp: string;
  addressZh: string;
  addressEn: string;
  addressJp: string;
  email: string;
  phone: string;
  hoursZh: string;
  hoursEn: string;
  hoursJp: string;
  social: {
    line: string;
    instagram: string;
    whatsapp: string;
    facebook: string;
    linkedin: string;
    x: string;
  };
  // Shared closing-banner CTA reused verbatim across Home, Company, and
  // other pages — lives here (not per-page) so it only needs editing once.
  ctaTitleZh: string;
  ctaTitleEn: string;
  ctaTitleJp: string;
  ctaButtonZh: string;
  ctaButtonEn: string;
  ctaButtonJp: string;
  // Raw CSS injected site-wide via a <style> tag — an escape hatch for
  // developers to make small visual tweaks without a code deploy. Empty by
  // default; only ever touched by someone who reads the admin's warning.
  customCss: string;
  updatedAt?: Timestamp;
}

export interface HomeStat {
  valueZh: string;
  valueEn: string;
  valueJp: string;
}

export interface HomeBizItem {
  titleZh: string;
  titleEn: string;
  titleJp: string;
  descZh: string;
  descEn: string;
  descJp: string;
  item1Zh: string;
  item1En: string;
  item1Jp: string;
  item2Zh: string;
  item2En: string;
  item2Jp: string;
  item3Zh: string;
  item3En: string;
  item3Jp: string;
}

export interface HomePerspectiveItem {
  titleZh: string;
  titleEn: string;
  titleJp: string;
  descZh: string;
  descEn: string;
  descJp: string;
}

export interface HomeProcessStep {
  titleZh: string;
  titleEn: string;
  titleJp: string;
  descZh: string;
  descEn: string;
  descJp: string;
}

export interface HomeRepresentative {
  nameZh: string;
  nameEn: string;
  nameJp: string;
  roleZh: string;
  roleEn: string;
  roleJp: string;
  descZh: string;
  descEn: string;
  descJp: string;
  image: string;
}

/** One frame of the homepage hero carousel. */
export interface HeroSlide {
  /** Storage download URL. Blank entries are skipped by the carousel. */
  image: string;
  /** Optional per-slide caption shown beside the slide index; blank hides it. */
  captionZh: string;
  captionEn: string;
  captionJp: string;
}

export interface SiteSettingsHome {
  /**
   * Hero carousel frames. Not edited by the current admin (which saves only
   * `heroImage`), kept so older docs that carry slides still render them.
   */
  heroSlides?: HeroSlide[];
  heroTitleLine1Zh: string;
  heroTitleLine1En: string;
  heroTitleLine1Jp: string;
  heroTitleLine2Zh: string;
  heroTitleLine2En: string;
  heroTitleLine2Jp: string;
  heroDescZh: string;
  heroDescEn: string;
  heroDescJp: string;
  heroImage: string;
  primaryCtaZh: string;
  primaryCtaEn: string;
  primaryCtaJp: string;
  trustStats: HomeStat[];
  bizTourTitleZh: string;
  bizTourTitleEn: string;
  bizTourTitleJp: string;
  bizTourDescZh: string;
  bizTourDescEn: string;
  bizTourDescJp: string;
  bizTourItems: HomeBizItem[];
  perspectiveTitleZh: string;
  perspectiveTitleEn: string;
  perspectiveTitleJp: string;
  perspectiveDescZh: string;
  perspectiveDescEn: string;
  perspectiveDescJp: string;
  perspectiveItems: HomePerspectiveItem[];
  processTitleZh: string;
  processTitleEn: string;
  processTitleJp: string;
  processDescZh: string;
  processDescEn: string;
  processDescJp: string;
  processFlowSteps: HomeProcessStep[];
  advisorTitleZh: string;
  advisorTitleEn: string;
  advisorTitleJp: string;
  representative: HomeRepresentative;
  updatedAt?: Timestamp;
}

export interface SiteSettingsCompany {
  bannerTagZh: string;
  bannerTagEn: string;
  bannerTagJp: string;
  bannerH1Zh: string;
  bannerH1En: string;
  bannerH1Jp: string;
  bannerDescZh: string;
  bannerDescEn: string;
  bannerDescJp: string;
  bannerBadgeZh: string;
  bannerBadgeEn: string;
  bannerBadgeJp: string;
  repTagZh: string;
  repTagEn: string;
  repTagJp: string;
  repHeadlineZh: string;
  repHeadlineEn: string;
  repHeadlineJp: string;
  repP1Zh: string;
  repP1En: string;
  repP1Jp: string;
  repP2Zh: string;
  repP2En: string;
  repP2Jp: string;
  repNameRoleZh: string;
  repNameRoleEn: string;
  repNameRoleJp: string;
  overviewTagZh: string;
  overviewTagEn: string;
  overviewTagJp: string;
  overviewTitleZh: string;
  overviewTitleEn: string;
  overviewTitleJp: string;
  quoteZh: string;
  quoteEn: string;
  quoteJp: string;
  quoteDescZh: string;
  quoteDescEn: string;
  quoteDescJp: string;
  visitTagZh: string;
  visitTagEn: string;
  visitTagJp: string;
  visitTitleZh: string;
  visitTitleEn: string;
  visitTitleJp: string;
  updatedAt?: Timestamp;
}

export interface SiteSettingsContact {
  bannerTagZh: string;
  bannerTagEn: string;
  bannerTagJp: string;
  bannerH1Zh: string;
  bannerH1En: string;
  bannerH1Jp: string;
  bannerDescZh: string;
  bannerDescEn: string;
  bannerDescJp: string;
  quoteZh: string;
  quoteEn: string;
  quoteJp: string;
  updatedAt?: Timestamp;
}

export interface SiteSettingsNews {
  bannerTagZh: string;
  bannerTagEn: string;
  bannerTagJp: string;
  bannerH1Zh: string;
  bannerH1En: string;
  bannerH1Jp: string;
  bannerDescZh: string;
  bannerDescEn: string;
  bannerDescJp: string;
  categoryTitleZh: string;
  categoryTitleEn: string;
  categoryTitleJp: string;
  updatedAt?: Timestamp;
}

export interface SiteSettingsCases {
  bannerTagZh: string;
  bannerTagEn: string;
  bannerTagJp: string;
  bannerH1Zh: string;
  bannerH1En: string;
  bannerH1Jp: string;
  bannerDescZh: string;
  bannerDescEn: string;
  bannerDescJp: string;
  updatedAt?: Timestamp;
}

export interface ServicesPhaseItem {
  titleZh: string;
  titleEn: string;
  titleJp: string;
  descZh: string;
  descEn: string;
  descJp: string;
  item1Zh: string;
  item1En: string;
  item1Jp: string;
  item2Zh: string;
  item2En: string;
  item2Jp: string;
  item3Zh: string;
  item3En: string;
  item3Jp: string;
}

export interface ServicesStep {
  titleZh: string;
  titleEn: string;
  titleJp: string;
  descZh: string;
  descEn: string;
  descJp: string;
}

export interface SiteSettingsServices {
  bannerTagZh: string;
  bannerTagEn: string;
  bannerTagJp: string;
  bannerH1Zh: string;
  bannerH1En: string;
  bannerH1Jp: string;
  bannerDescZh: string;
  bannerDescEn: string;
  bannerDescJp: string;
  flowTitleZh: string;
  flowTitleEn: string;
  flowTitleJp: string;
  flowDescZh: string;
  flowDescEn: string;
  flowDescJp: string;
  transactionPhases: ServicesPhaseItem[];
  stepsTitleZh: string;
  stepsTitleEn: string;
  stepsTitleJp: string;
  acquisitionSteps: ServicesStep[];
  taxesTitleZh: string;
  taxesTitleEn: string;
  taxesTitleJp: string;
  buyLabelZh: string;
  buyLabelEn: string;
  buyLabelJp: string;
  buyValZh: string;
  buyValEn: string;
  buyValJp: string;
  holdLabelZh: string;
  holdLabelEn: string;
  holdLabelJp: string;
  holdValZh: string;
  holdValEn: string;
  holdValJp: string;
  sellLabelZh: string;
  sellLabelEn: string;
  sellLabelJp: string;
  sellValZh: string;
  sellValEn: string;
  sellValJp: string;
  mgmtTitleZh: string;
  mgmtTitleEn: string;
  mgmtTitleJp: string;
  mgmtDescZh: string;
  mgmtDescEn: string;
  mgmtDescJp: string;
  mgmtItem1Zh: string;
  mgmtItem1En: string;
  mgmtItem1Jp: string;
  mgmtItem2Zh: string;
  mgmtItem2En: string;
  mgmtItem2Jp: string;
  mgmtItem3Zh: string;
  mgmtItem3En: string;
  mgmtItem3Jp: string;
  mgmtItem4Zh: string;
  mgmtItem4En: string;
  mgmtItem4Jp: string;
  ctaTitleZh: string;
  ctaTitleEn: string;
  ctaTitleJp: string;
  ctaBtnZh: string;
  ctaBtnEn: string;
  ctaBtnJp: string;
  updatedAt?: Timestamp;
}

export interface SiteSettingsProperties {
  bannerTagZh: string;
  bannerTagEn: string;
  bannerTagJp: string;
  bannerH1Zh: string;
  bannerH1En: string;
  bannerH1Jp: string;
  bannerDescZh: string;
  bannerDescEn: string;
  bannerDescJp: string;
  ctaTitleZh: string;
  ctaTitleEn: string;
  ctaTitleJp: string;
  ctaButtonZh: string;
  ctaButtonEn: string;
  ctaButtonJp: string;
  updatedAt?: Timestamp;
}

export interface SeoPageEntry {
  titleZh: string;
  titleEn: string;
  titleJp: string;
  descriptionZh: string;
  descriptionEn: string;
  descriptionJp: string;
}

export interface SiteSettingsSeo {
  defaultTitleZh: string;
  defaultTitleEn: string;
  defaultTitleJp: string;
  defaultDescriptionZh: string;
  defaultDescriptionEn: string;
  defaultDescriptionJp: string;
  ogImage: string;
  pages: Record<string, SeoPageEntry>;
  updatedAt?: Timestamp;
}

// ---------------------------------------------------------------------------
// news/{id}
// ---------------------------------------------------------------------------

export interface NewsContentBody {
  lead: string;
  sections: { heading: string; body: string }[];
  summary: string;
}

// References a CategoryItem.key from site_settings/categories.news — an
// admin-managed list rather than a fixed enum, so categories can be added,
// relabeled, or removed without a code change.
export type NewsCategory = string;

export interface NewsArticleDoc {
  slug: string;
  category?: NewsCategory;
  /**
   * Pre-category-key labels. Documents seeded before the admin switched to
   * `category` keys still carry these instead; the public site falls back to
   * them (see lib/categories.ts) until the doc is re-saved in the admin.
   */
  categoryZh?: string;
  categoryEn?: string;
  categoryJp?: string;
  titleZh: string;
  titleEn: string;
  titleJp: string;
  excerptZh: string;
  excerptEn: string;
  excerptJp: string;
  image: string;
  readTimeZh: string;
  readTimeEn: string;
  readTimeJp: string;
  contentZh: NewsContentBody;
  contentEn: NewsContentBody;
  contentJp: NewsContentBody;
  status: PublishStatus;
  sortOrder: number;
  publishedAt: Timestamp | null;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export type NewsArticle = NewsArticleDoc & { id: string };

// ---------------------------------------------------------------------------
// cases/{id}  (past closed-deal case studies — "實績案例", unchanged concept)
// ---------------------------------------------------------------------------

export interface CaseDetailsBody {
  overview: string;
  highlights: string[];
  strategy: string;
  outcome: string;
}

// References a CategoryItem.key from site_settings/categories.cases — same
// rationale as NewsCategory above.
export type CaseCategory = string;

export interface CaseArticleDoc {
  slug: string;
  category?: CaseCategory;
  /**
   * Pre-category-key labels. Documents seeded before the admin switched to
   * `category` keys still carry these instead; the public site falls back to
   * them (see lib/categories.ts) until the doc is re-saved in the admin.
   */
  categoryZh?: string;
  categoryEn?: string;
  categoryJp?: string;
  titleZh: string;
  titleEn: string;
  titleJp: string;
  descZh: string;
  descEn: string;
  descJp: string;
  image: string;
  locationZh: string;
  locationEn: string;
  locationJp: string;
  priceJPY?: number | null;
  detailsZh: CaseDetailsBody;
  detailsEn: CaseDetailsBody;
  detailsJp: CaseDetailsBody;
  status: PublishStatus;
  sortOrder: number;
  publishedAt: Timestamp | null;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export type CaseArticle = CaseArticleDoc & { id: string };

// ---------------------------------------------------------------------------
// properties/{id}  (current for-sale listings — new module)
// ---------------------------------------------------------------------------

export type PropertyCategory = "residential" | "commercial" | "land" | "hospitality";
export type ListingStatus = "available" | "negotiating" | "sold";

export interface PropertyDoc {
  slug: string;
  category: PropertyCategory;
  listingStatus: ListingStatus;
  titleZh: string;
  titleEn: string;
  titleJp: string;
  summaryZh: string;
  summaryEn: string;
  summaryJp: string;
  descriptionZh: string;
  descriptionEn: string;
  descriptionJp: string;
  locationZh: string;
  locationEn: string;
  locationJp: string;
  /** null = price on request (price disclosed on inquiry) */
  priceJPY: number | null;
  layout: string; // e.g. "3LDK"
  landAreaSqm: number | null;
  floorAreaSqm: number | null;
  buildYear: string;
  coverImage: string;
  gallery: string[];
  status: PublishStatus;
  sortOrder: number;
  publishedAt: Timestamp | null;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export type Property = PropertyDoc & { id: string };

// ---------------------------------------------------------------------------
// form_submissions/{id}
// ---------------------------------------------------------------------------

export type SubmissionStatus = "new" | "processing" | "completed";

export interface FormSubmissionDoc {
  company: string;
  name: string;
  email: string;
  phone: string;
  type: string;
  message: string;
  /** Which property this inquiry relates to, if submitted from a property page. */
  propertySlug: string | null;
  consent: boolean;
  status: SubmissionStatus;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export type FormSubmission = FormSubmissionDoc & { id: string };

// ---------------------------------------------------------------------------
// admin_users/{uid}
// ---------------------------------------------------------------------------

export type AdminRole = "owner" | "admin" | "editor";

export interface AdminUserDoc {
  email: string;
  displayName: string;
  role: AdminRole;
  active: boolean;
  createdAt: Timestamp;
}
