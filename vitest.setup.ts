// jsdom (com origem opaca) não expõe localStorage nesta configuração. Instalamos um
// polyfill em memória determinístico para os testes de auth/account. Compartilhado entre
// `globalThis` (uso via `localStorage`) e `window` (uso via `window.localStorage`).

class MemoryStorage implements Storage {
  private store = new Map<string, string>();
  get length() {
    return this.store.size;
  }
  clear() {
    this.store.clear();
  }
  getItem(key: string) {
    return this.store.has(key) ? this.store.get(key)! : null;
  }
  setItem(key: string, value: string) {
    this.store.set(key, String(value));
  }
  removeItem(key: string) {
    this.store.delete(key);
  }
  key(index: number) {
    return Array.from(this.store.keys())[index] ?? null;
  }
}

if (typeof globalThis.localStorage === "undefined") {
  const ls = new MemoryStorage();
  Object.defineProperty(globalThis, "localStorage", { value: ls, configurable: true });
  if (typeof globalThis.window !== "undefined") {
    Object.defineProperty(globalThis.window, "localStorage", { value: ls, configurable: true });
  }
}
