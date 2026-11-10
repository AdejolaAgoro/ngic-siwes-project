import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { supabase } from "../../utils/supabase";
import { getAuthenticatedLandingPath } from "../../utils/portal-api";
import { getAuthErrorMessage } from "../../utils/auth-error-message";

export default function Login() {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setSubmitting(true);
    const values = new FormData(event.currentTarget);
    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: values.get("email"),
        password: values.get("password"),
      });
      if (signInError) throw signInError;
      navigate(await getAuthenticatedLandingPath(), { replace: true });
    } catch (signInError) {
      setError(getAuthErrorMessage(signInError, "Could not sign in. Please try again."));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="first-page">
      <div className="main-section">
        <form className="login" onSubmit={handleSubmit}>
          <div className="login-descript"><h2>Welcome back</h2><p>Sign in to continue your application</p></div>
          <div className="main-form">
            <label htmlFor="email">Email</label>
            <input type="email" name="email" id="email" required autoComplete="email" placeholder="you@example.com" />
            <label htmlFor="password">Password</label>
            <input type="password" name="password" id="password" required autoComplete="current-password" placeholder="Your password" />
            {error && <p className="form-message" role="alert">{error}</p>}
            <button type="submit" disabled={submitting}>{submitting ? "Signing in…" : "Sign In"}</button>
            <p>Don't have an account? <Link to="/signup">Create account</Link></p>
          </div>
        </form>
      </div>
    </div>
  );
}
