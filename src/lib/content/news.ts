import type { NewsArticle, NewsArticleDoc } from "../../types/content";
import { listPublished, getPublishedBySlug, listAllAdmin, getById, createDoc, updateDocById, deleteDocById, slugExists } from "./collectionHelpers";

const COLLECTION = "news";

export const listPublishedNews = () => listPublished<NewsArticleDoc>(COLLECTION) as Promise<NewsArticle[]>;
export const getPublishedNewsBySlug = (slug: string) =>
  getPublishedBySlug<NewsArticleDoc>(COLLECTION, slug) as Promise<NewsArticle | null>;
export const listAllNewsAdmin = () => listAllAdmin<NewsArticleDoc>(COLLECTION) as Promise<NewsArticle[]>;
export const getNewsById = (id: string) => getById<NewsArticleDoc>(COLLECTION, id) as Promise<NewsArticle | null>;
export const createNews = (data: NewsArticleDoc) => createDoc(COLLECTION, data);
export const updateNews = (id: string, data: Partial<NewsArticleDoc>) => updateDocById(COLLECTION, id, data);
export const deleteNews = (id: string) => deleteDocById(COLLECTION, id);
export const newsSlugExists = (slug: string, excludeId?: string) => slugExists(COLLECTION, slug, excludeId);
