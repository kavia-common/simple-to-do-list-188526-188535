import React from 'react';

/**
 * Simple app header with title and brand accent.
 */
// PUBLIC_INTERFACE
export default function Header() {
  return (
    <header className="todo-header container" role="banner">
      <h1 className="todo-title" aria-label="Application title">
        To<span className="brand-accent">Do</span> List
      </h1>
    </header>
  );
}
