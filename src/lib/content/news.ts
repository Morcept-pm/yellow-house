import type { NewsArticle, NewsArticleDoc } from "../../types/content";
import { listPublished, getPublishedBySlug, listAllAdmin, getById, createDoc, updateDocById, deleteDocById, slugExists, withFallback } from "./collectionHelpers";
import { NEWS_DATA } from "../../data/newsData";

const COLLECTION = "news";

/** Bundled sample articles, used only when the live Firestore read fails (e.g. Firebase isn't configured yet). */
const DEMO_NEWS: NewsArticle[] = NEWS_DATA.map(({ id: _unused, ...rest }, idx) => ({
  ...rest,
  id: rest.slug,
  status: "published",
  sortOrder: idx,
  publishedAt: null,
  createdAt: null,
  updatedAt: null,
}) as unknown as NewsArticle);

export const listPublishedNews = () =>
  withFallback(() => listPublished<NewsArticleDoc>(COLLECTION) as Promise<NewsArticle[]>, DEMO_NEWS);
export const getPublishedNewsBySlug = (slug: string) =>
  withFallback(
    () => getPublishedBySlug<NewsArticleDoc>(COLLECTION, slug) as Promise<NewsArticle | null>,
    DEMO_NEWS.find((n) => n.slug === slug) ?? null
  );
export const listAllNewsAdmin = () => listAllAdmin<NewsArticleDoc>(COLLECTION) as Promise<NewsArticle[]>;
export const getNewsById = (id: string) => getById<NewsArticleDoc>(COLLECTION, id) as Promise<NewsArticle | null>;
export const createNews = (data: NewsArticleDoc) => createDoc(COLLECTION, data);
export const updateNews = (id: string, data: Partial<NewsArticleDoc>) => updateDocById(COLLECTION, id, data);
export const deleteNews = (id: string) => deleteDocById(COLLECTION, id);
export const newsSlugExists = (slug: string, excludeId?: string) => slugExists(COLLECTION, slug, excludeId);
