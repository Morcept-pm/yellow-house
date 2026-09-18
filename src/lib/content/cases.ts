import type { CaseArticle, CaseArticleDoc } from "../../types/content";
import { listPublished, getPublishedBySlug, listAllAdmin, getById, createDoc, updateDocById, deleteDocById, slugExists } from "./collectionHelpers";

const COLLECTION = "cases";

export const listPublishedCases = () => listPublished<CaseArticleDoc>(COLLECTION) as Promise<CaseArticle[]>;
export const getPublishedCaseBySlug = (slug: string) =>
  getPublishedBySlug<CaseArticleDoc>(COLLECTION, slug) as Promise<CaseArticle | null>;
export const listAllCasesAdmin = () => listAllAdmin<CaseArticleDoc>(COLLECTION) as Promise<CaseArticle[]>;
export const getCaseById = (id: string) => getById<CaseArticleDoc>(COLLECTION, id) as Promise<CaseArticle | null>;
export const createCase = (data: CaseArticleDoc) => createDoc(COLLECTION, data);
export const updateCase = (id: string, data: Partial<CaseArticleDoc>) => updateDocById(COLLECTION, id, data);
export const deleteCase = (id: string) => deleteDocById(COLLECTION, id);
export const caseSlugExists = (slug: string, excludeId?: string) => slugExists(COLLECTION, slug, excludeId);
