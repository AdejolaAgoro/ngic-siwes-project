export default function Header() {
  return (
    <div className="Nav_header">
      <header>
        {/* Header-logo */}
        <div className="logo">
          <img className="logo-image" src="/icons/nnpc.png" alt="nnpc logo" />
          <span>Intern</span>
        </div>
        {/* header list */}
        <ul>
          <li>
            <a href="#">Home</a>
          </li>
          <li>
            <a href="#">My Profile</a>
          </li>
          <li>
            <a href="#">My Application</a>
          </li>
        </ul>
        {/* Header meni-icon */}
        <div className="menu-icon">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="lucide lucide-menu preview-icon"
          >
            <path d="M4 5h16" />
            <path d="M4 12h16" />
            <path d="M4 19h16" />
          </svg>
        </div>
      </header>
    </div>
  );
}
