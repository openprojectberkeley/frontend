import React, { useEffect, useId, useRef, useState } from 'react';
import styles from '../css/Projects.module.css';

/*
 * A dropdown of options, one to be picked or, with `multiple`, any number: a
 * button and the list it opens, the list taking the focus and marking the option
 * the arrow keys are on. `options` are `{ value, label }`, `selected` is the list
 * of values picked, and `summary` is what the button says about them.
 *
 * Picking one of many leaves the list open for the next. Escape, or a click
 * anywhere else, closes it.
 */
export default function FilterSelect({ name, summary, options, selected, multiple, onChange }) {
  const rootRef = useRef(null);
  const buttonRef = useRef(null);
  const listRef = useRef(null);
  const id = useId();
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);

  // Within the list only: a long one scrolls, and the page should not with it.
  const scrollToOption = (index) => {
    const list = listRef.current;
    const option = list?.children[index];

    if (!option) return;

    if (option.offsetTop < list.scrollTop) {
      list.scrollTop = option.offsetTop;
    } else if (option.offsetTop + option.offsetHeight > list.scrollTop + list.clientHeight) {
      list.scrollTop = option.offsetTop + option.offsetHeight - list.clientHeight;
    }
  };

  const close = (refocus) => {
    setOpen(false);
    if (refocus) buttonRef.current?.focus();
  };

  const show = () => {
    setActive(Math.max(0, options.findIndex(({ value }) => selected.includes(value))));
    setOpen(true);
  };

  const choose = ({ value }) => {
    if (!multiple) {
      onChange([value]);
      close(true);
      return;
    }

    onChange(selected.includes(value) ? selected.filter((other) => other !== value) : [...selected, value]);
  };

  useEffect(() => {
    if (!open) return undefined;

    const closeIfOutside = (event) => {
      if (!rootRef.current?.contains(event.target)) setOpen(false);
    };

    listRef.current?.focus();
    scrollToOption(active);
    document.addEventListener('pointerdown', closeIfOutside);

    return () => document.removeEventListener('pointerdown', closeIfOutside);
    // Only as it opens, not as the arrow keys move on.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const onButtonKeyDown = (event) => {
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      show();
    }
  };

  const onListKeyDown = (event) => {
    const moves = {
      ArrowDown: Math.min(active + 1, options.length - 1),
      ArrowUp: Math.max(active - 1, 0),
      Home: 0,
      End: options.length - 1,
    };

    if (event.key in moves) {
      event.preventDefault();
      setActive(moves[event.key]);
      scrollToOption(moves[event.key]);
    } else if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      choose(options[active]);
    } else if (event.key === 'Escape') {
      close(true);
    } else if (event.key === 'Tab') {
      close(false);
    }
  };

  return (
    <div ref={rootRef} className={styles.filterSelect}>
      <button
        ref={buttonRef}
        type="button"
        className={`${styles.filterChip} ${styles.filterSelectButton}`}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={summary.startsWith(name) ? summary : `${name}: ${summary}`}
        onClick={() => (open ? close(false) : show())}
        onKeyDown={onButtonKeyDown}
      >
        {summary}
      </button>

      {open && (
        <ul
          ref={listRef}
          role="listbox"
          tabIndex={-1}
          className={styles.filterSelectList}
          aria-label={name}
          aria-multiselectable={multiple || undefined}
          aria-activedescendant={`${id}-${active}`}
          onKeyDown={onListKeyDown}
        >
          {options.map((option, index) => (
            <li
              key={option.value}
              id={`${id}-${index}`}
              role="option"
              aria-selected={selected.includes(option.value)}
              className={`${styles.filterOption} ${index === active ? styles.filterOptionActive : ''}`}
              onClick={() => choose(option)}
              onPointerMove={() => setActive(index)}
            >
              <span
                className={`${styles.filterOptionMark} ${multiple ? styles.filterOptionBox : ''}`}
                aria-hidden="true"
              />
              {option.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
