import { createJSONStorage } from 'zustand/middleware'

const DB_NAME = 'ketmonjon'
const STORE_NAME = 'zustand'
const DB_VERSION = 1

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION)
    request.onupgradeneeded = () => {
      const db = request.result
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME)
      }
    }
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
}

function tx(mode: IDBTransactionMode): Promise<IDBObjectStore> {
  return openDB().then(db => {
    const transaction = db.transaction(STORE_NAME, mode)
    return transaction.objectStore(STORE_NAME)
  })
}

// StateStorage interfeysi — string qaytaradi
const rawStorage = {
  getItem: async (name: string): Promise<string | null> => {
    try {
      const store = await tx('readonly')
      return new Promise((resolve, reject) => {
        const request = store.get(name)
        request.onsuccess = () => resolve(request.result ?? null)
        request.onerror = () => reject(request.error)
      })
    } catch {
      return localStorage.getItem(name)
    }
  },

  setItem: async (name: string, value: string): Promise<void> => {
    try {
      const store = await tx('readwrite')
      return new Promise((resolve, reject) => {
        const request = store.put(value, name)
        request.onsuccess = () => resolve()
        request.onerror = () => reject(request.error)
      })
    } catch {
      localStorage.setItem(name, value)
    }
  },

  removeItem: async (name: string): Promise<void> => {
    try {
      const store = await tx('readwrite')
      return new Promise((resolve, reject) => {
        const request = store.delete(name)
        request.onsuccess = () => resolve()
        request.onerror = () => reject(request.error)
      })
    } catch {
      localStorage.removeItem(name)
    }
  },
}

// Zustand persist uchun createJSONStorage orqali wrap
export const idbStorage = createJSONStorage(() => rawStorage)
