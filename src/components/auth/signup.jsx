import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { supabase } from "../../utils/supabase";
import { getAuthenticatedLandingPath } from "../../utils/portal-api";
import { getAuthErrorMessage } from "../../utils/auth-error-message";

export default function Signup() {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setMessage("");
    const values = new FormData(event.currentTarget);
    const password = values.get("password");
    if (password !== values.get("confirmpassword")) {
      setError("The passwords do not match.");
      return;
    }
    setSubmitting(true);
    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: values.get("email"),
        password,
        options: { data: { full_name: values.get("name") } },
      });
      if (signUpError) throw signUpError;
      if (data.session) navigate(await getAuthenticatedLandingPath(), { replace: true });
      else setMessage("Account created. Confirm your email, then sign in to continue.");
    } catch (signUpError) {
      setError(getAuthErrorMessage(signUpError, "Could not create your account. Please try again."));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="signup">
      <div className="main-section">
        <form className="login" onSubmit={handleSubmit}>
          <div className="login-descript"><h2>Register as an Intern</h2><p>Create an account to apply for an internship at NGIC</p></div>
          <div className="main-form">
            <label htmlFor="name">Name</label><input type="text" name="name" id="name" required autoComplete="name" placeholder="Your full name" />
            <label htmlFor="email">Email</label><input type="email" name="email" id="email" required autoComplete="email" placeholder="you@example.com" />
            <label htmlFor="password">Password</label><input type="password" name="password" id="password" minLength={8} required autoComplete="new-password" placeholder="At least 8 characters" />
            <label htmlFor="confirmpassword">Confirm Password</label><input type="password" name="confirmpassword" id="confirmpassword" minLength={8} required autoComplete="new-password" placeholder="Repeat password" />
            {error && <p className="form-message" role="alert">{error}</p>}
            {message && <p className="form-message" role="status">{message}</p>}
            <button type="submit" disabled={submitting}>{submitting ? "Creating account…" : "Create Account"}</button>
            <p>Already have an account? <Link to="/">Log in</Link></p>
          </div>
        </form>
      </div>
    </div>
  );
}
