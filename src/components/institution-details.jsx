import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getMyProfile, saveProfile } from "../utils/portal-api";
import { useAuth } from "../auth/auth-state";

export default function InstitutionDetails() {
  const navigate = useNavigate();
  const { refreshProfile } = useAuth();
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => { getMyProfile().then(setProfile).catch((issue) => setError(issue.message)); }, []);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setSaving(true);
    const values = new FormData(event.currentTarget);
    try {
      await saveProfile({
        institution: values.get("institution"), course: values.get("course"),
        academic_level: values.get("level"), matric_number: values.get("matric"),
        cgpa: Number(values.get("cgpa")), profile_completed_at: new Date().toISOString(),
      });
      await refreshProfile();
      navigate("/profile/complete");
    } catch (issue) { setError(issue.message); }
    finally { setSaving(false); }
  }

  if (!profile) return <div className="second-section"><p className="form-message" role={error ? "alert" : "status"}>{error || "Loading profile…"}</p></div>;

  return (
    <div className="second-section"><div className="profile-section">
      <Link to="/profile/personal">Back</Link>
      <div className="progress"><div className="line" id="active-line"></div><div className="line" id="active-line"></div><div className="line" id="active-line"></div><div className="line"></div></div>
      <div className="second-info"><h3>Institution Details</h3></div>
      <form className="profile-section-form" onSubmit={handleSubmit}>
        <label htmlFor="institution">Institution</label><input type="text" name="institution" id="institution" defaultValue={profile.institution ?? ""} required placeholder="e.g Lagos State University" />
        <label htmlFor="course">Course</label><input type="text" name="course" id="course" placeholder="e.g Computer Science" defaultValue={profile.course ?? ""} required />
        <label htmlFor="level">Level</label><select name="level" id="level" defaultValue={profile.academic_level ?? ""} required><option value="" disabled>Select level</option><option>100 Level</option><option>200 Level</option><option>300 Level</option><option>400 Level</option><option>500 Level</option><option>600 Level</option><option>Other</option></select>
        <label htmlFor="matric">Matric No</label><input type="text" name="matric" id="matric" defaultValue={profile.matric_number ?? ""} required />
        <label htmlFor="cgpa">CGPA</label><input type="number" name="cgpa" id="cgpa" placeholder="e.g 4.97" min="0" max="5" step="0.01" defaultValue={profile.cgpa ?? ""} required />
        {error && <p className="form-message" role="alert">{error}</p>}
        <button type="submit" disabled={saving}>{saving ? "Saving…" : "Submit"}</button>
      </form>
    </div></div>
  );
}
