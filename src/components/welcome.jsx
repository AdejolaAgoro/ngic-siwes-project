import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/auth-state";

export default function Welcome() {
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const name = profile?.full_name || user?.user_metadata?.full_name || "Intern";
  return (
    <div className="second-section">
      <div className="welcome-section">
        <h2>
          Welcome {name}{" "}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="30"
            height="30"
            viewBox="0 0 24 24"
            fill="green"
            stroke="black"
            stroke-width="5"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M15 10V9" />
            <path d="M16.472 15a6 6 0 01-8.943 0" />
            <path d="M9 10V9" />
            <circle cx="12" cy="12" r="10" />
          </svg>{" "}
        </h2>
        <p>Complete your profile to apply for an internship</p>
        <button onClick={() => navigate("/profile/image")}>
          Complete Profile
        </button>
      </div>
    </div>
  );
}
