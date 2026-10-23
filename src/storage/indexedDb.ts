/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Safe IndexedDB Persistence with Schema Versioning & LocalStorage Fallback
 * نظام التخزين المحلي الآمن مع الترقية الإصدارية والبديل التلقائي
 */

import { SimulationCheckpoint, Scenario, ProjectStateExport } from '../types/simulation';

const DB_NAME = 'NationalSimulatorDB';
const DB_VERSION = 1;

const STORES = {
  CHECKPOINTS: 'checkpoints',
  SCENARIOS: 'scenarios',
  PROJECT_STATE: 'project_state',
};

class MemoryStorage {
  private map = new Map<string, string>();
  getItem(k: string): string | null {
    return this.map.get(k) || null;
  }
  setItem(k: string, v: string): void {
    this.map.set(k, v);
  }
  removeItem(k: string): void {
    this.map.delete(k);
  }
}

const memoryStore = new MemoryStorage();

function getSafeStorage() {
  if (typeof window !== 'undefined' && 'localStorage' in window) {
    return window.localStorage;
  }
  return memoryStore;
}

class StorageManager {
  private db: IDBDatabase | null = null;
  private isUsingFallback = false;
  private initPromise: Promise<boolean> | null = null;

  constructor() {
    this.initPromise = this.init();
  }

  /**
   * Initializes IndexedDB or flags fallback to localStorage
   */
  public async init(): Promise<boolean> {
    if (typeof window === 'undefined') {
      this.isUsingFallback = true;
      return false;
    }

    if (!('indexedDB' in window)) {
      console.warn('IndexedDB not supported in this browser. Falling back to localStorage.');
      this.isUsingFallback = true;
      return false;
    }

    return new Promise((resolve) => {
      try {
        const request = window.indexedDB.open(DB_NAME, DB_VERSION);

        request.onupgradeneeded = (event) => {
          const db = (event.target as IDBOpenDBRequest).result;
          if (!db.objectStoreNames.contains(STORES.CHECKPOINTS)) {
            db.createObjectStore(STORES.CHECKPOINTS, { keyPath: 'id' });
          }
          if (!db.objectStoreNames.contains(STORES.SCENARIOS)) {
            db.createObjectStore(STORES.SCENARIOS, { keyPath: 'id' });
          }
          if (!db.objectStoreNames.contains(STORES.PROJECT_STATE)) {
            db.createObjectStore(STORES.PROJECT_STATE, { keyPath: 'id' });
          }
        };

        request.onsuccess = (event) => {
          this.db = (event.target as IDBOpenDBRequest).result;
          this.isUsingFallback = false;
          resolve(true);
        };

        request.onerror = (event) => {
          console.warn('IndexedDB open error, falling back to localStorage:', (event.target as IDBOpenDBRequest).error);
          this.isUsingFallback = true;
          resolve(false);
        };
      } catch (err) {
        console.warn('IndexedDB initialization exception, using fallback:', err);
        this.isUsingFallback = true;
        resolve(false);
      }
    });
  }

  private async ensureReady(): Promise<void> {
    if (this.initPromise) {
      await this.initPromise;
    }
  }

  // -------------------------------------------------------------
  // Checkpoints Storage
  // -------------------------------------------------------------
  public async saveCheckpoint(checkpoint: SimulationCheckpoint): Promise<void> {
    await this.ensureReady();
    if (this.isUsingFallback || !this.db) {
      const existing = this.getFallbackCheckpoints();
      const filtered = existing.filter((c) => c.id !== checkpoint.id);
      filtered.push(checkpoint);
      getSafeStorage().setItem('nss_checkpoints', JSON.stringify(filtered));
      return;
    }

    return new Promise((resolve, reject) => {
      try {
        const tx = this.db!.transaction(STORES.CHECKPOINTS, 'readwrite');
        const store = tx.objectStore(STORES.CHECKPOINTS);
        const req = store.put(checkpoint);
        req.onsuccess = () => resolve();
        req.onerror = () => reject(req.error);
      } catch (err) {
        reject(err);
      }
    });
  }

  public async getCheckpoints(): Promise<SimulationCheckpoint[]> {
    await this.ensureReady();
    if (this.isUsingFallback || !this.db) {
      return this.getFallbackCheckpoints();
    }

    return new Promise((resolve) => {
      try {
        const tx = this.db!.transaction(STORES.CHECKPOINTS, 'readonly');
        const store = tx.objectStore(STORES.CHECKPOINTS);
        const req = store.getAll();
        req.onsuccess = () => resolve(req.result || []);
        req.onerror = () => resolve(this.getFallbackCheckpoints());
      } catch {
        resolve(this.getFallbackCheckpoints());
      }
    });
  }

  public async deleteCheckpoint(id: string): Promise<void> {
    await this.ensureReady();
    if (this.isUsingFallback || !this.db) {
      const existing = this.getFallbackCheckpoints();
      const filtered = existing.filter((c) => c.id !== id);
      getSafeStorage().setItem('nss_checkpoints', JSON.stringify(filtered));
      return;
    }

    return new Promise((resolve, reject) => {
      try {
        const tx = this.db!.transaction(STORES.CHECKPOINTS, 'readwrite');
        const store = tx.objectStore(STORES.CHECKPOINTS);
        const req = store.delete(id);
        req.onsuccess = () => resolve();
        req.onerror = () => reject(req.error);
      } catch (err) {
        reject(err);
      }
    });
  }

  // -------------------------------------------------------------
  // Scenarios Storage
  // -------------------------------------------------------------
  public async saveScenario(scenario: Scenario): Promise<void> {
    await this.ensureReady();
    if (this.isUsingFallback || !this.db) {
      const existing = this.getFallbackScenarios();
      const filtered = existing.filter((s) => s.id !== scenario.id);
      filtered.push(scenario);
      getSafeStorage().setItem('nss_scenarios', JSON.stringify(filtered));
      return;
    }

    return new Promise((resolve, reject) => {
      try {
        const tx = this.db!.transaction(STORES.SCENARIOS, 'readwrite');
        const store = tx.objectStore(STORES.SCENARIOS);
        const req = store.put(scenario);
        req.onsuccess = () => resolve();
        req.onerror = () => reject(req.error);
      } catch (err) {
        reject(err);
      }
    });
  }

  public async getScenarios(): Promise<Scenario[]> {
    await this.ensureReady();
    if (this.isUsingFallback || !this.db) {
      return this.getFallbackScenarios();
    }

    return new Promise((resolve) => {
      try {
        const tx = this.db!.transaction(STORES.SCENARIOS, 'readonly');
        const store = tx.objectStore(STORES.SCENARIOS);
        const req = store.getAll();
        req.onsuccess = () => resolve(req.result || []);
        req.onerror = () => resolve(this.getFallbackScenarios());
      } catch {
        resolve(this.getFallbackScenarios());
      }
    });
  }

  public async deleteScenario(id: string): Promise<void> {
    await this.ensureReady();
    if (this.isUsingFallback || !this.db) {
      const existing = this.getFallbackScenarios();
      const filtered = existing.filter((s) => s.id !== id);
      getSafeStorage().setItem('nss_scenarios', JSON.stringify(filtered));
      return;
    }

    return new Promise((resolve, reject) => {
      try {
        const tx = this.db!.transaction(STORES.SCENARIOS, 'readwrite');
        const store = tx.objectStore(STORES.SCENARIOS);
        const req = store.delete(id);
        req.onsuccess = () => resolve();
        req.onerror = () => reject(req.error);
      } catch (err) {
        reject(err);
      }
    });
  }

  // -------------------------------------------------------------
  // Full Project Bundle Persistence
  // -------------------------------------------------------------
  public async saveProjectBundle(bundle: ProjectStateExport): Promise<void> {
    await this.ensureReady();
    const bundleWithId = { id: 'latest_bundle', ...bundle };
    if (this.isUsingFallback || !this.db) {
      getSafeStorage().setItem('nss_project_bundle', JSON.stringify(bundleWithId));
      return;
    }

    return new Promise((resolve, reject) => {
      try {
        const tx = this.db!.transaction(STORES.PROJECT_STATE, 'readwrite');
        const store = tx.objectStore(STORES.PROJECT_STATE);
        const req = store.put(bundleWithId);
        req.onsuccess = () => resolve();
        req.onerror = () => reject(req.error);
      } catch (err) {
        reject(err);
      }
    });
  }

  public async getProjectBundle(): Promise<ProjectStateExport | null> {
    await this.ensureReady();
    if (this.isUsingFallback || !this.db) {
      const data = getSafeStorage().getItem('nss_project_bundle');
      return data ? JSON.parse(data) : null;
    }

    return new Promise((resolve) => {
      try {
        const tx = this.db!.transaction(STORES.PROJECT_STATE, 'readonly');
        const store = tx.objectStore(STORES.PROJECT_STATE);
        const req = store.get('latest_bundle');
        req.onsuccess = () => resolve(req.result || null);
        req.onerror = () => {
          const data = getSafeStorage().getItem('nss_project_bundle');
          resolve(data ? JSON.parse(data) : null);
        };
      } catch {
        const data = getSafeStorage().getItem('nss_project_bundle');
        resolve(data ? JSON.parse(data) : null);
      }
    });
  }

  public async clearAllData(): Promise<void> {
    await this.ensureReady();
    getSafeStorage().removeItem('nss_checkpoints');
    getSafeStorage().removeItem('nss_scenarios');
    getSafeStorage().removeItem('nss_project_bundle');

    if (!this.isUsingFallback && this.db) {
      return new Promise((resolve) => {
        try {
          const tx = this.db!.transaction([STORES.CHECKPOINTS, STORES.SCENARIOS, STORES.PROJECT_STATE], 'readwrite');
          tx.objectStore(STORES.CHECKPOINTS).clear();
          tx.objectStore(STORES.SCENARIOS).clear();
          tx.objectStore(STORES.PROJECT_STATE).clear();
          tx.oncomplete = () => resolve();
          tx.onerror = () => resolve();
        } catch {
          resolve();
        }
      });
    }
  }

  // -------------------------------------------------------------
  // Fallback Helpers
  // -------------------------------------------------------------
  private getFallbackCheckpoints(): SimulationCheckpoint[] {
    try {
      const data = getSafeStorage().getItem('nss_checkpoints');
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  private getFallbackScenarios(): Scenario[] {
    try {
      const data = getSafeStorage().getItem('nss_scenarios');
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }
}

export const storageManager = new StorageManager();
