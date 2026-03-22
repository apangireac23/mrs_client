import sunIcon from '../assets/sun.svg'
import { useTheme } from '../hooks/useTheme'

function MoonIcon() {
  return (
    <svg viewBox="0 0 24 24" className="button-icon-svg" aria-hidden="true">
      <path
        d="M14.5 2.5A8.5 8.5 0 1 0 21.5 16 9 9 0 0 1 14.5 2.5Z"
        fill="currentColor"
      />
    </svg>
  )
}

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()

  return (
    <button
      className="secondary-button icon-button theme-toggle-button"
      type="button"
      onClick={toggleTheme}
      title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
      aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {theme === 'dark' ? (
        <img src={sunIcon} alt="" className="button-icon-image" />
      ) : (
        <MoonIcon />
      )}
    </button>
  )
}
