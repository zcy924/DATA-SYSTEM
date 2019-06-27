export abstract class BaseStorage<T> {
  protected _map: Map<string, T> = new Map();

  setItem(key: string, value: T) {
    this._map.set(key, value);
  }

  removeItem(key: string) {
    this._map.delete(key);
  }

  getItem(key: string): T {
    return this._map.get(key);
  }

  clear() {
    if (this._map) {
      this._map.clear();
    }
  }
}
