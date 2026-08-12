"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Icon } from "@iconify/react";

export type SelectOption = { value: string; label: string };

type SelectProps = {
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  ariaLabel?: string;
};

export function Select({ value, onChange, options, ariaLabel }: SelectProps) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(() => Math.max(0, options.findIndex((o) => o.value === value)));
  const rootRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const listId = useId();

  const selected = options.find((o) => o.value === value) ?? options[0];

  useEffect(() => {
    if (!open) return;
    function onPointerDown(event: PointerEvent) {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    }
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open]);

  useEffect(() => {
    if (open) listRef.current?.focus();
  }, [open]);

  function toggle() {
    setOpen((wasOpen) => {
      if (!wasOpen) setActive(Math.max(0, options.findIndex((o) => o.value === value)));
      return !wasOpen;
    });
  }

  function commit(index: number) {
    const option = options[index];
    if (option) onChange(option.value);
    setOpen(false);
  }

  function onListKeyDown(event: React.KeyboardEvent) {
    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        setActive((i) => Math.min(options.length - 1, i + 1));
        break;
      case "ArrowUp":
        event.preventDefault();
        setActive((i) => Math.max(0, i - 1));
        break;
      case "Home":
        event.preventDefault();
        setActive(0);
        break;
      case "End":
        event.preventDefault();
        setActive(options.length - 1);
        break;
      case "Enter":
      case " ":
        event.preventDefault();
        commit(active);
        break;
      case "Escape":
        event.preventDefault();
        setOpen(false);
        break;
      case "Tab":
        setOpen(false);
        break;
    }
  }

  return (
    <div className={`select ${open ? "is-open" : ""}`} ref={rootRef}>
      <button
        type="button"
        className="select-trigger"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={ariaLabel}
        onClick={toggle}
      >
        <span>{selected?.label}</span>
        <Icon icon="ph:caret-down" width="16" aria-hidden="true" />
      </button>

      {open && (
        <ul
          ref={listRef}
          id={listId}
          className="select-list"
          role="listbox"
          tabIndex={-1}
          aria-label={ariaLabel}
          aria-activedescendant={`${listId}-${active}`}
          onKeyDown={onListKeyDown}
        >
          {options.map((option, index) => (
            <li
              key={option.value}
              id={`${listId}-${index}`}
              role="option"
              aria-selected={option.value === value}
              className={`select-option ${index === active ? "is-active" : ""}`}
              onMouseEnter={() => setActive(index)}
              onClick={() => commit(index)}
            >
              <Icon
                icon="ph:check"
                width="15"
                className="select-check"
                aria-hidden="true"
                data-visible={option.value === value}
              />
              {option.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
