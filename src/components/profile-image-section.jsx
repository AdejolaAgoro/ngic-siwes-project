export default function ProfileImageSection() {
  return (
    <div className="first-profile">
      <div className="profile-section">
        <a href="#">Back</a>
        <div className="progress">
          <div className="line" id="active-line"></div>
          <div className="line"></div>
          <div className="line"></div>
          <div className="line"></div>
        </div>
        <div className="profile-descript">
          <h2>Profile Image</h2>
          <p>
            Uploaded image should be a corporate image because it is sent as
            part of yout internship application
          </p>
        </div>
        <div className="profile-icon">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="35"
            height="35"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="lucide lucide-user preview-icon"
          >
            <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
          <button>Proceed</button>
        </div>
      </div>
    </div>
  );
}
