import React from 'react';
import TodoItem from './TodoItem';

/**
 * TodoList renders a list of todos with handlers passed from parent.
 */
// PUBLIC_INTERFACE
export default function TodoList({ todos, onToggle, onDelete, onUpdate }) {
  if (!todos.length) {
    return <div className="todo-empty" role="status">No tasks yet. Add one above to get started.</div>;
  }
  return (
    <ul className="todo-list" role="list" aria-label="Todo items">
      {todos.map(t => (
        <TodoItem
          key={t.id}
          todo={t}
          onToggle={onToggle}
          onDelete={onDelete}
          onUpdate={onUpdate}
        />
      ))}
    </ul>
  );
}
