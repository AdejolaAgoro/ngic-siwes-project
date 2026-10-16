export default function Welcome() {
  return (
    <div className="complete-profile">
      <div className="welcome-section">
        <div className="welcome-details">
          <span className="wave">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="50"
              height="50"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="lucide lucide-face-slightly-smiling preview-icon"
            >
              <path d="M15 10V9" />
              <path d="M16.472 15a6 6 0 01-8.943 0" />
              <path d="M9 10V9" />
              <circle cx="12" cy="12" r="10" />
            </svg>
          </span>
          <h2>Welcome Jola</h2>
          <p>Complete your profile to apply for an internship role</p>
          <button>complete Profile</button>
        </div>
      </div>
    </div>
  );
}
