import { Link } from "react-router-dom";
import Nav_header from "./Nav_header";

export default function Signup() {
  return (
    <div className="signup">
      <Nav_header />
      <div className="main-section">
        <form>
          <div className="login-descript">
            <h2>Register as an Intern</h2>
            <p>Create an account to apply for an internship at NGIC</p>
          </div>

          <div className="main-form">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              name="name"
              id="name"
              placeholder="Your full name"
            />
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
            <label htmlFor="confirmpassword">Confirm Password</label>
            <input
              type="password"
              name="confirmpassword"
              id="confirmpassword"
              placeholder="Repeat Password"
            />
            <button>Create Account</button>

            <p>
              Already have an account? <Link to="/">Login In</Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
