import type { Property, PropertyDoc } from "../../types/content";
import { listPublished, getPublishedBySlug, listAllAdmin, getById, createDoc, updateDocById, deleteDocById, slugExists } from "./collectionHelpers";

const COLLECTION = "properties";

export const listPublishedProperties = () => listPublished<PropertyDoc>(COLLECTION) as Promise<Property[]>;
export const getPublishedPropertyBySlug = (slug: string) =>
  getPublishedBySlug<PropertyDoc>(COLLECTION, slug) as Promise<Property | null>;
export const listAllPropertiesAdmin = () => listAllAdmin<PropertyDoc>(COLLECTION) as Promise<Property[]>;
export const getPropertyById = (id: string) => getById<PropertyDoc>(COLLECTION, id) as Promise<Property | null>;
export const createProperty = (data: PropertyDoc) => createDoc(COLLECTION, data);
export const updateProperty = (id: string, data: Partial<PropertyDoc>) => updateDocById(COLLECTION, id, data);
export const deleteProperty = (id: string) => deleteDocById(COLLECTION, id);
export const propertySlugExists = (slug: string, excludeId?: string) => slugExists(COLLECTION, slug, excludeId);
