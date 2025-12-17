/**
 * Abstraction for Todo data operations.
 * If REACT_APP_API_BASE is defined, uses REST endpoints at `${base}/todos`.
 * Otherwise uses a localStorage adapter.
 *
 * Methods:
 *  - list(): Promise<Todo[]>
 *  - add(text): Promise<Todo>
 *  - update(id, text): Promise<Todo>
 *  - toggleComplete(id): Promise<Todo>
 *  - delete(id): Promise<void>
 *  - clearCompleted(): Promise<void>
 */

/**
 * @typedef {Object} Todo
 * @property {string} id
 * @property {string} text
 * @property {boolean} completed
 * @property {number} createdAt
 */

const STORAGE_KEY = 'todos:v1';

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function save(todos) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  } catch {
    // ignore
  }
}

function uid() {
  return Math.random().toString(36).slice(2, 9) + Date.now().toString(36).slice(-4);
}

const localAdapter = {
  // PUBLIC_INTERFACE
  async list() {
    return load();
  },
  // PUBLIC_INTERFACE
  async add(text) {
    const t = {
      id: uid(),
      text: String(text).trim(),
      completed: false,
      createdAt: Date.now(),
    };
    const list = load();
    list.push(t);
    save(list);
    return t;
  },
  // PUBLIC_INTERFACE
  async update(id, text) {
    const list = load();
    const idx = list.findIndex(t => t.id === id);
    if (idx !== -1) {
      list[idx] = { ...list[idx], text: String(text).trim() };
      save(list);
      return list[idx];
    }
    throw new Error('Todo not found');
  },
  // PUBLIC_INTERFACE
  async toggleComplete(id) {
    const list = load();
    const idx = list.findIndex(t => t.id === id);
    if (idx !== -1) {
      list[idx] = { ...list[idx], completed: !list[idx].completed };
      save(list);
      return list[idx];
    }
    throw new Error('Todo not found');
  },
  // PUBLIC_INTERFACE
  async delete(id) {
    const list = load();
    const next = list.filter(t => t.id !== id);
    save(next);
  },
  // PUBLIC_INTERFACE
  async clearCompleted() {
    const list = load();
    save(list.filter(t => !t.completed));
  },
};

function createRestAdapter(base) {
  const baseUrl = base.replace(/\/+$/, '');
  const url = (path = '') => `${baseUrl}/todos${path}`;

  const headers = { 'Content-Type': 'application/json' };

  return {
    // PUBLIC_INTERFACE
    async list() {
      const res = await fetch(url(), { headers });
      if (!res.ok) throw new Error('Failed to list');
      return res.json();
    },
    // PUBLIC_INTERFACE
    async add(text) {
      const res = await fetch(url(), { method: 'POST', headers, body: JSON.stringify({ text }) });
      if (!res.ok) throw new Error('Failed to add');
      return res.json();
    },
    // PUBLIC_INTERFACE
    async update(id, text) {
      const res = await fetch(url(`/${encodeURIComponent(id)}`), { method: 'PUT', headers, body: JSON.stringify({ text }) });
      if (!res.ok) throw new Error('Failed to update');
      return res.json();
    },
    // PUBLIC_INTERFACE
    async toggleComplete(id) {
      const res = await fetch(url(`/${encodeURIComponent(id)}/toggle`), { method: 'POST', headers });
      if (!res.ok) throw new Error('Failed to toggle');
      return res.json();
    },
    // PUBLIC_INTERFACE
    async delete(id) {
      const res = await fetch(url(`/${encodeURIComponent(id)}`), { method: 'DELETE', headers });
      if (!res.ok) throw new Error('Failed to delete');
    },
    // PUBLIC_INTERFACE
    async clearCompleted() {
      const res = await fetch(url('/clear-completed'), { method: 'POST', headers });
      if (!res.ok) throw new Error('Failed to clear completed');
    },
  };
}

// PUBLIC_INTERFACE
export function getApi() {
  const base = process.env.REACT_APP_API_BASE;
  if (base) return createRestAdapter(base);
  return localAdapter;
}

export default getApi();
