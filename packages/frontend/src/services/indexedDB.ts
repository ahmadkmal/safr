class IndexedDBService {
  private dbName = 'FlightInspirationDB';
  private version = 1;
  private db: IDBDatabase | null = null;
  private error: Error | null = null;
  private initPromise: Promise<void> | null = null;

  async init(): Promise<void> {
    if (this.initPromise) {
      return this.initPromise;
    }

    this.initPromise = new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version);

      request.onerror = () => {
        this.error = new Error('Failed to open IndexedDB');
        reject(this.error);
      };

      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains('react-query')) {
          db.createObjectStore('react-query', { keyPath: 'key' });
        }
      };
    });

    return this.initPromise;
  }


  async getItem(key: string): Promise<string | null> {
    await this.init();
    
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('Database not initialized'));
        return;
      }
      const request = this.db.transaction('react-query', 'readonly').objectStore('react-query').get(key);
      request.onsuccess = () => resolve(request.result?.value || null);
      request.onerror = () => reject(new Error('Failed to get item from IndexedDB'));
    });
  }

  async setItem(key: string, value: string): Promise<void> {
    await this.init();
    
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('Database not initialized'));
        return;
      }
      const request = this.db.transaction('react-query', 'readwrite').objectStore('react-query').put({ key, value });
      request.onsuccess = () => resolve();
      request.onerror = () => reject(new Error('Failed to set item in IndexedDB'));
    });
  }

  async removeItem(key: string): Promise<void> {
    await this.init();
    
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('Database not initialized'));
        return;
      }
      const request = this.db.transaction('react-query', 'readwrite').objectStore('react-query').delete(key);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(new Error('Failed to remove item from IndexedDB'));
    });
  }
}

export const indexedDBService = new IndexedDBService(); 