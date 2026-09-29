import { useEffect, useId, useRef, useState } from "react";

const SelectMenu = ({ label, icon, value, options, onChange }) => {
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const rootRef = useRef(null);
  const buttonRef = useRef(null);
  const listRef = useRef(null);
  const id = useId();

  const selectedIndex = Math.max(
    0,
    options.findIndex((option) => option.value === value)
  );
  const selected = options[selectedIndex];

  useEffect(() => {
    if (!open) return;
    listRef.current.focus();
    const closeOnOutside = (e) => {
      if (!rootRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("pointerdown", closeOnOutside);
    return () => document.removeEventListener("pointerdown", closeOnOutside);
  }, [open]);

  function openMenu() {
    setActiveIndex(selectedIndex);
    setOpen(true);
  }

  function closeMenu() {
    setOpen(false);
    buttonRef.current.focus();
  }

  function choose(index) {
    if (options[index].value !== value) onChange(options[index].value);
    closeMenu();
  }

  function onButtonKeyDown(e) {
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      openMenu();
    }
  }

  function onListKeyDown(e) {
    const last = options.length - 1;
    const moves = {
      ArrowDown: (i) => Math.min(i + 1, last),
      ArrowUp: (i) => Math.max(i - 1, 0),
      Home: () => 0,
      End: () => last,
    };
    if (moves[e.key]) {
      e.preventDefault();
      setActiveIndex(moves[e.key]);
    } else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      choose(activeIndex);
    } else if (e.key === "Escape") {
      e.preventDefault();
      closeMenu();
    } else if (e.key === "Tab") {
      setOpen(false);
    }
  }

  return (
    <div className={`select-menu ${open ? "is-open" : ""}`} ref={rootRef}>
      <span id={`${id}-label`} className="visually-hidden">
        {label}
      </span>
      <button
        ref={buttonRef}
        type="button"
        className="select-menu-trigger"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-labelledby={`${id}-label ${id}-value`}
        onClick={() => (open ? setOpen(false) : openMenu())}
        onKeyDown={onButtonKeyDown}
      >
        <i className={`fa-solid fa-${icon} select-menu-icon`} />
        <span className="select-menu-text">
          <span className="select-menu-eyebrow">{label}</span>
          <span id={`${id}-value`} className="select-menu-value">
            {selected.label}
          </span>
        </span>
        <i className="fa-solid fa-chevron-down select-menu-caret" />
      </button>

      {open && (
        <ul
          ref={listRef}
          role="listbox"
          tabIndex={-1}
          className="select-menu-list"
          aria-labelledby={`${id}-label`}
          aria-activedescendant={`${id}-option-${activeIndex}`}
          onKeyDown={onListKeyDown}
        >
          {options.map((option, index) => (
            <li
              key={option.value}
              id={`${id}-option-${index}`}
              role="option"
              aria-selected={index === selectedIndex}
              className={`select-menu-option ${
                index === activeIndex ? "is-active" : ""
              }`}
              onMouseEnter={() => setActiveIndex(index)}
              onClick={() => choose(index)}
            >
              {option.icon && (
                <i className={`fa-solid fa-${option.icon} select-menu-option-icon`} />
              )}
              <span>{option.label}</span>
              <i className="fa-solid fa-check select-menu-check" />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SelectMenu;
