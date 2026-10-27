import type { CaseArticle, CaseArticleDoc } from "../../types/content";
import { listPublished, getPublishedBySlug, withFallback } from "./collectionHelpers";
import { CASES_DATA } from "../../data/casesData";

const COLLECTION = "cases";

/** Bundled sample case studies, used only when the live Firestore read fails (e.g. Firebase isn't configured yet). */
const DEMO_CASES: CaseArticle[] = CASES_DATA.map(({ id: _unused, ...rest }, idx) => ({
  ...rest,
  id: rest.slug,
  priceJPY: rest.priceJPY ?? null,
  status: "published",
  sortOrder: idx,
  publishedAt: null,
  createdAt: null,
  updatedAt: null,
}) as unknown as CaseArticle);

export const listPublishedCases = () =>
  withFallback(() => listPublished<CaseArticleDoc>(COLLECTION) as Promise<CaseArticle[]>, DEMO_CASES);
export const getPublishedCaseBySlug = (slug: string) =>
  withFallback(
    () => getPublishedBySlug<CaseArticleDoc>(COLLECTION, slug) as Promise<CaseArticle | null>,
    DEMO_CASES.find((c) => c.slug === slug) ?? null
  );
