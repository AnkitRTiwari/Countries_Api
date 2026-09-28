import { useEffect, useRef, useState } from "react";

const SearchBar = ({ value, onChange }) => {
  const [text, setText] = useState(value);
  const lastSent = useRef(value);
  const inputRef = useRef(null);

  // Pick up changes made outside the input (e.g. "Clear filters")
  useEffect(() => {
    if (value !== lastSent.current) {
      lastSent.current = value;
      setText(value);
    }
  }, [value]);

  // Debounce so the list doesn't re-filter on every keystroke
  useEffect(() => {
    if (text.trim() === lastSent.current) return;
    const id = setTimeout(() => {
      lastSent.current = text.trim();
      onChange(text);
    }, 250);
    return () => clearTimeout(id);
  }, [text]);

  // Press "/" anywhere to jump to the search box
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key !== "/" || e.ctrlKey || e.metaKey || e.altKey) return;
      const el = document.activeElement;
      if (["INPUT", "TEXTAREA", "SELECT"].includes(el?.tagName)) return;
      if (el?.isContentEditable) return;
      e.preventDefault();
      inputRef.current?.focus();
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  function clear() {
    setText("");
    lastSent.current = "";
    onChange("");
    inputRef.current?.focus();
  }

  return (
    <div className="search-container">
      <i className="fa-solid fa-magnifying-glass" />
      <input
        ref={inputRef}
        type="text"
        value={text}
        aria-label="Search countries"
        placeholder="Search by country, capital or region..."
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => e.key === "Escape" && text && clear()}
      />
      {text ? (
        <button
          type="button"
          className="search-clear"
          aria-label="Clear search"
          onClick={clear}
        >
          <i className="fa-solid fa-xmark" />
        </button>
      ) : (
        <kbd className="search-kbd">/</kbd>
      )}
    </div>
  );
};

export default SearchBar;
