import { useEffect, useRef, useState } from "react";

import useTheme from "../../context/useTheme.js";

const ThemeToggle = ({ className = "" }) => {
  const { mode, setMode } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);
  const options = [
    { value: "light", label: "☀ Light" },
    { value: "system", label: "◐ System" },
    { value: "dark", label: "🌙 Dark" },
  ];

  useEffect(() => {
    const closeOnOutsideClick = (event) => {
      if (!containerRef.current?.contains(event.target)) setIsOpen(false);
    };

    document.addEventListener("mousedown", closeOnOutsideClick);
    return () => document.removeEventListener("mousedown", closeOnOutsideClick);
  }, []);

  const handleKeyDown = (event) => {
    if (event.key === "Escape") {
      setIsOpen(false);
      event.currentTarget.querySelector("button")?.focus();
    }
  };

  return (
    <div ref={containerRef} className={`theme-toggle ${className}`.trim()} onKeyDown={handleKeyDown}>
      <button
        className="theme-toggle__button"
        type="button"
        aria-label="Choose color theme"
        aria-expanded={isOpen}
        aria-haspopup="menu"
        onClick={() => setIsOpen((open) => !open)}
      >
        <span aria-hidden="true">🌙</span><span>Theme</span><span className="theme-toggle__chevron" aria-hidden="true">⌄</span>
      </button>
      {isOpen && <div className="theme-toggle__menu" role="menu" aria-label="Color theme">
        {options.map((option) => <button
          key={option.value}
          className={`theme-toggle__option ${mode === option.value ? "theme-toggle__option--active" : ""}`}
          type="button"
          role="menuitemradio"
          aria-checked={mode === option.value}
          onClick={() => { setMode(option.value); setIsOpen(false); }}
        >{option.label}</button>)}
      </div>}
    </div>
  );
};

export default ThemeToggle;
