import { IStorageValue } from './storage.interface';

export abstract class StorageService implements Storage {
  constructor(protected _api: Storage) {}

  get length(): number {
    return this._api.length;
  }

  [name: string]: any;

  clear(): void {
    this._api.clear();
  }

  getItem<T>(key: string): T | null;
  getItem<T>(key: string, otherwise: T): T;
  getItem<T>(key: string, otherwise?: T): T | null {
    const data: string | null = this._api.getItem(key);

    if (data !== null) {
      try {
        const storageValue = JSON.parse(data) as IStorageValue<T>;
        return storageValue.value;
      } catch (error) {
        return null;
      }
    }

    if (otherwise) {
      return otherwise;
    }

    return null;
  }

  key(index: number): string | null {
    return this._api.key(index);
  }

  removeItem(key: string): void {
    this._api.removeItem(key);
  }

  setItem(key: string, value: unknown): void {
    let data = JSON.stringify({ value });
    this._api.setItem(key, data);
  }

  changeStorage(api: Storage) {
    this._api = api;
  }
}
