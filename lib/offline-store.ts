import type { Diagnosis, User } from "./platform-types";
export type Draft = {
  id: string;
  owner: string;
  data: Diagnosis;
  createdAt: string;
  error?: string;
};
function open(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("bidaya-terrain", 1);
    request.onupgradeneeded = () => {
      request.result.createObjectStore("records", { keyPath: "id" });
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () =>
      reject(
        new Error(
          "Stockage indisponible. Le diagnostic n’a pas été enregistré.",
        ),
      );
  });
}
async function operation<T>(
  mode: IDBTransactionMode,
  run: (store: IDBObjectStore) => IDBRequest<T>,
): Promise<T> {
  const db = await open();
  return new Promise((resolve, reject) => {
    const tx = db.transaction("records", mode);
    const request = run(tx.objectStore("records"));
    tx.oncomplete = () => {
      db.close();
      resolve(request.result);
    };
    tx.onabort = tx.onerror = () => {
      db.close();
      reject(new Error("Échec du stockage local. Réessaie avant de quitter."));
    };
  });
}
export const allRecords = () =>
  operation("readonly", (s) => s.getAll()) as Promise<
    Array<Draft | { id: "identity"; user: User }>
  >;
export const putRecord = (value: Draft | { id: "identity"; user: User }) =>
  operation("readwrite", (s) => s.put(value));
export const removeRecord = (id: string) =>
  operation("readwrite", (s) => s.delete(id));
