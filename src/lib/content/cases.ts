import type { CaseArticle, CaseArticleDoc } from "../../types/content";
import { listPublished, getPublishedBySlug, listAllAdmin, getById, createDoc, updateDocById, deleteDocById, slugExists, withFallback } from "./collectionHelpers";
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
export const listAllCasesAdmin = () => listAllAdmin<CaseArticleDoc>(COLLECTION) as Promise<CaseArticle[]>;
export const getCaseById = (id: string) => getById<CaseArticleDoc>(COLLECTION, id) as Promise<CaseArticle | null>;
export const createCase = (data: CaseArticleDoc) => createDoc(COLLECTION, data);
export const updateCase = (id: string, data: Partial<CaseArticleDoc>) => updateDocById(COLLECTION, id, data);
export const deleteCase = (id: string) => deleteDocById(COLLECTION, id);
export const caseSlugExists = (slug: string, excludeId?: string) => slugExists(COLLECTION, slug, excludeId);
