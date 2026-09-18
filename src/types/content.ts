import type { Timestamp } from "firebase/firestore";

/** CMS visibility. Only "published" is ever readable by the public site. */
export type PublishStatus = "draft" | "published" | "archived";

export interface Trilingual {
  zh: string;
  en: string;
  jp: string;
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
  updatedAt?: Timestamp;
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
   * Hero carousel frames. Supersedes the single `heroImage`, which is kept for
   * backwards compatibility: when this is empty the hero falls back to
   * `heroImage`, and then to the images bundled in /public/hero.
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

export interface NewsArticleDoc {
  slug: string;
  categoryZh: string;
  categoryEn: string;
  categoryJp: string;
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

export interface CaseArticleDoc {
  slug: string;
  categoryZh: string;
  categoryEn: string;
  categoryJp: string;
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
