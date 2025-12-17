import React, { useEffect, useRef, useState } from 'react';

/**
 * A single Todo item row with:
 * - checkbox to toggle completion
 * - inline editable text
 * - action buttons for save/cancel while editing and delete
 *
 * Accessibility/keyboard:
 * - Double-click text or press Enter on focused text to edit
 * - Escape cancels edit, Enter submits
 */
// PUBLIC_INTERFACE
export default function TodoItem({ todo, onToggle, onDelete, onUpdate }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(todo.text);
  const inputRef = useRef(null);

  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editing]);

  useEffect(() => {
    // sync external changes (e.g., toggle) into draft if not editing
    if (!editing) setDraft(todo.text);
  }, [todo.text, editing]);

  const startEdit = () => setEditing(true);

  const submitEdit = () => {
    const text = draft.trim();
    if (text && text !== todo.text) {
      onUpdate(todo.id, text);
    }
    setEditing(false);
  };

  const cancelEdit = () => {
    setDraft(todo.text);
    setEditing(false);
  };

  return (
    <li className="todo-item" role="listitem" aria-label={`Task: ${todo.text}`}>
      <input
        type="checkbox"
        className="todo-checkbox"
        aria-label={todo.completed ? 'Mark as active' : 'Mark as completed'}
        checked={todo.completed}
        onChange={() => onToggle(todo.id)}
      />
      {editing ? (
        <input
          ref={inputRef}
          className="inline-edit"
          aria-label="Edit task text"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') submitEdit();
            if (e.key === 'Escape') cancelEdit();
          }}
          onBlur={submitEdit}
        />
      ) : (
        <div
          className={`todo-text ${todo.completed ? 'completed' : ''}`}
          tabIndex={0}
          role="textbox"
          aria-readonly="true"
          aria-label={`Task text: ${todo.text}${todo.completed ? ', completed' : ''}`}
          onDoubleClick={startEdit}
          onKeyDown={(e) => {
            if (e.key === 'Enter') startEdit();
          }}
        >
          {todo.text}
        </div>
      )}
      <div className="todo-actions" role="group" aria-label="Item actions">
        {!editing && (
          <button
            className="icon-btn"
            aria-label="Edit task"
            title="Edit"
            onClick={startEdit}
          >
            ✏️
          </button>
        )}
        <button
          className="icon-btn"
          aria-label="Delete task"
          title="Delete"
          onClick={() => onDelete(todo.id)}
        >
          🗑️
        </button>
      </div>
    </li>
  );
}
