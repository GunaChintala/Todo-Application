export default function Navbar({ title, onMenu }) {
  return (
    <header className="topbar">
      <button className="menu-btn" onClick={onMenu} aria-label="Open navigation">
        ☰
      </button>
      <h1>{title}</h1>
    </header>
  )
}
