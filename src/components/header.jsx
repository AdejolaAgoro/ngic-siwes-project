import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../utils/supabase";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  async function handleSignOut() {
    setMenuOpen(false);
    const { error } = await supabase.auth.signOut();
    if (error) console.error("Could not sign out:", error.message);
    navigate("/", { replace: true });
  }

  useEffect(() => {
    if (!menuOpen) return undefined;
    const closeOnEscape = (event) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    const closeOnScroll = () => setMenuOpen(false);
    window.addEventListener("keydown", closeOnEscape);
    window.addEventListener("scroll", closeOnScroll, { passive: true });
    return () => {
      window.removeEventListener("keydown", closeOnEscape);
      window.removeEventListener("scroll", closeOnScroll);
    };
  }, [menuOpen]);

  return (
    <div className="Nav_header">
      <header>
        <Link className="logo" to="/home" aria-label="Intern home">
          <img className="logo-image" src="/icons/nnpc.png" alt="nnpc logo" />
          <span>Intern</span>
        </Link>
        <button
          className="menu-icon"
          type="button"
          aria-label="Toggle navigation"
          aria-expanded={menuOpen}
          aria-controls="main-navigation"
          onClick={() => setMenuOpen((open) => !open)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M4 5h16" />
            <path d="M4 12h16" />
            <path d="M4 19h16" />
          </svg>
        </button>
      </header>
      {menuOpen && (
        <>
          <button
            className="menu-backdrop"
            type="button"
            aria-label="Close navigation menu"
            onClick={() => setMenuOpen(false)}
          />
          <nav
            className="menu-drawer"
            id="main-navigation"
            aria-label="Main navigation"
            role="dialog"
            aria-modal="true"
          >
            <h2>Navigation</h2>
            <ul>
              <li>
                <Link to="/home" onClick={() => setMenuOpen(false)}>
                  Home
                </Link>
              </li>
              <li>
                <Link to="/profile/image" onClick={() => setMenuOpen(false)}>
                  My Profile
                </Link>
              </li>
              <li>
                <Link to="/application" onClick={() => setMenuOpen(false)}>
                  My Application
                </Link>
              </li>
              <li>
                <Link to="/admin" onClick={() => setMenuOpen(false)}>
                  Admin
                </Link>
              </li>
            </ul>
            <button
              className="menu-signout"
              type="button"
              onClick={handleSignOut}
            >
              Sign out
            </button>
          </nav>
        </>
      )}
    </div>
  );
}
