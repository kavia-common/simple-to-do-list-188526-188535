import React, { useEffect, useMemo, useRef, useState } from 'react';
import Header from './Header';
import TodoList from './TodoList';
import api, { getApi } from '../utils/api';
import useLocalStorage from '../hooks/useLocalStorage';

/**
 * PUBLIC_INTERFACE
 * Main Todo application composing header, input form, filters, list, and actions.
 * Uses API abstraction that falls back to localStorage adapter.
 */
export default function TodoApp() {
  // local mirror of todos to power UI; persists through api (local storage or REST)
  const [todos, setTodos] = useState([]);
  // filter: all | active | completed
  const [filter, setFilter] = useState('all');
  // controlled input
  const [text, setText] = useState('');
  const inputRef = useRef(null);

  // Keep a small state in localStorage to preserve last selected filter
  const [prefs, setPrefs] = useLocalStorage('todo:prefs', { filter: 'all' });

  // Load todos on mount
  useEffect(() => {
    let mounted = true;
    const adapter = getApi();
    adapter.list().then(list => {
      if (mounted) setTodos(list);
    }).catch(() => {
      // On error, no crash: show empty list
      if (mounted) setTodos([]);
    });
    setFilter(prefs?.filter || 'all');
    return () => { mounted = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setPrefs((prev) => ({ ...(prev || {}), filter }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  const remaining = useMemo(() => todos.filter(t => !t.completed).length, [todos]);

  const filteredTodos = useMemo(() => {
    if (filter === 'active') return todos.filter(t => !t.completed);
    if (filter === 'completed') return todos.filter(t => t.completed);
    return todos;
  }, [todos, filter]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const value = text.trim();
    if (!value) return;
    try {
      const added = await api.add(value);
      setTodos(prev => [...prev, added]);
      setText('');
      inputRef.current?.focus();
    } catch {
      // noop
    }
  };

  const toggleTodo = async (id) => {
    try {
      const updated = await api.toggleComplete(id);
      setTodos(prev => prev.map(t => (t.id === id ? updated : t)));
    } catch {
      // noop
    }
  };

  const deleteTodo = async (id) => {
    try {
      await api.delete(id);
      setTodos(prev => prev.filter(t => t.id !== id));
    } catch {
      // noop
    }
  };

  const updateTodo = async (id, newText) => {
    try {
      const updated = await api.update(id, newText);
      setTodos(prev => prev.map(t => (t.id === id ? updated : t)));
    } catch {
      // noop
    }
  };

  const clearCompleted = async () => {
    try {
      await api.clearCompleted();
      setTodos(prev => prev.filter(t => !t.completed));
    } catch {
      // noop
    }
  };

  return (
    <>
      <Header />
      <main className="container" role="main">
        <form className="todo-form" onSubmit={handleSubmit} aria-label="Add todo form">
          <label htmlFor="new-todo" className="sr-only">Add a new task</label>
          <input
            id="new-todo"
            ref={inputRef}
            className="todo-input"
            aria-label="Task name"
            placeholder="Add a new task..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <button className="btn" aria-label="Add task" type="submit">Add</button>
        </form>

        <div className="toolbar" role="toolbar" aria-label="Filters and actions">
          <div className="filters" role="group" aria-label="Filter tasks">
            <button
              type="button"
              className="filter-btn"
              aria-pressed={filter === 'all'}
              onClick={() => setFilter('all')}
            >
              All
            </button>
            <button
              type="button"
              className="filter-btn"
              aria-pressed={filter === 'active'}
              onClick={() => setFilter('active')}
            >
              Active
            </button>
            <button
              type="button"
              className="filter-btn"
              aria-pressed={filter === 'completed'}
              onClick={() => setFilter('completed')}
            >
              Completed
            </button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span aria-live="polite" aria-atomic="true">{remaining} remaining</span>
            <button type="button" className="btn btn-clear" onClick={clearCompleted}>
              Clear completed
            </button>
          </div>
        </div>

        <TodoList
          todos={filteredTodos}
          onToggle={toggleTodo}
          onDelete={deleteTodo}
          onUpdate={updateTodo}
        />
      </main>
    </>
  );
}
