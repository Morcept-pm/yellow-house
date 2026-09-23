import type { Property, PropertyDoc } from "../../types/content";
import { listPublished, getPublishedBySlug, listAllAdmin, getById, createDoc, updateDocById, deleteDocById, slugExists, withFallback } from "./collectionHelpers";
import { PROPERTIES_DATA } from "../../data/propertiesData";

const COLLECTION = "properties";

/** Bundled sample listings, used only when the live Firestore read fails (e.g. Firebase isn't configured yet). */
const DEMO_PROPERTIES: Property[] = PROPERTIES_DATA.map((item) => ({
  ...item,
  status: "published",
  publishedAt: null,
  createdAt: null,
  updatedAt: null,
}) as unknown as Property);

export const listPublishedProperties = () =>
  withFallback(() => listPublished<PropertyDoc>(COLLECTION) as Promise<Property[]>, DEMO_PROPERTIES);
export const getPublishedPropertyBySlug = (slug: string) =>
  withFallback(
    () => getPublishedBySlug<PropertyDoc>(COLLECTION, slug) as Promise<Property | null>,
    DEMO_PROPERTIES.find((p) => p.slug === slug) ?? null
  );
export const listAllPropertiesAdmin = () => listAllAdmin<PropertyDoc>(COLLECTION) as Promise<Property[]>;
export const getPropertyById = (id: string) => getById<PropertyDoc>(COLLECTION, id) as Promise<Property | null>;
export const createProperty = (data: PropertyDoc) => createDoc(COLLECTION, data);
export const updateProperty = (id: string, data: Partial<PropertyDoc>) => updateDocById(COLLECTION, id, data);
export const deleteProperty = (id: string) => deleteDocById(COLLECTION, id);
export const propertySlugExists = (slug: string, excludeId?: string) => slugExists(COLLECTION, slug, excludeId);
