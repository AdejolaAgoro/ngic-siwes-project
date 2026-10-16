import { Link } from "react-router-dom";

export default function Login() {
  return (
    <div className="first-page">
      <div className="main-section  ">
        {/* Sign In form */}
        <form>
          {/* Sign up flex */}
          <div className="login-descript">
            <h2>Welcome back</h2>
            <p>Sign in to continue your appliaction</p>
          </div>

          <div className="main-form">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              name="email"
              id="email"
              placeholder="you@examle.com"
            />

            <label htmlFor="password">Password</label>
            <input
              type="password"
              name="password"
              id="password"
              placeholder="At least 8 characters"
            />

            <button>Sign In</button>

            <p>
              Don't have an account?  <Link to="/signup"> Create account</Link></p>
          </div>
        </form>
      </div>
    </div>
  );
}
