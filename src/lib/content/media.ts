import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from "firebase/storage";
import { storage } from "../firebase";

export const MAX_IMAGE_BYTES = 8 * 1024 * 1024; // 8MB
export const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

export interface UploadResult {
  url: string;
  path: string;
}

/**
 * Uploads an image under `folder` (e.g. "properties/{propertyId}") with a
 * collision-proof filename. Validates type/size client-side; Storage rules
 * enforce the same limits server-side so this can't be bypassed.
 */
export function uploadImage(
  file: File,
  folder: string,
  onProgress?: (pct: number) => void
): { promise: Promise<UploadResult>; cancel: () => void } {
  if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
    throw new Error("僅支援 JPG、PNG、WebP 圖片格式");
  }
  if (file.size > MAX_IMAGE_BYTES) {
    throw new Error("檔案大小不可超過 8MB");
  }

  const ext = file.name.split(".").pop() ?? "jpg";
  const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const path = `${folder}/${filename}`;
  const storageRef = ref(storage, path);
  const task = uploadBytesResumable(storageRef, file, { contentType: file.type });

  const promise = new Promise<UploadResult>((resolve, reject) => {
    task.on(
      "state_changed",
      (snapshot) => {
        onProgress?.(Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100));
      },
      (err) => reject(err),
      async () => {
        const url = await getDownloadURL(task.snapshot.ref);
        resolve({ url, path });
      }
    );
  });

  return { promise, cancel: () => task.cancel() };
}

export async function deleteImage(path: string): Promise<void> {
  await deleteObject(ref(storage, path));
}
