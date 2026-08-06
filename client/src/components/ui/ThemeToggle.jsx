import useTheme from "../../context/useTheme.js";

const ThemeToggle = ({ className = "" }) => {
  const { mode, setMode } = useTheme();

  return (
    <label className={`theme-toggle ${className}`.trim()}>
      <span aria-hidden="true">◐</span>
      <span className="theme-toggle__label">Theme</span>
      <select aria-label="Choose color theme" value={mode} onChange={(event) => setMode(event.target.value)}>
        <option value="system">System</option>
        <option value="light">Light</option>
        <option value="dark">Dark</option>
      </select>
    </label>
  );
};

export default ThemeToggle;
