import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getMyProfile, saveProfile } from "../utils/portal-api";
import { useAuth } from "../auth/auth-state";

export default function PersonalInfo() {
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
        full_name: values.get("fullname"), phone: values.get("phone"),
        date_of_birth: values.get("dob") || null, gender: values.get("gender"),
        residential_address: values.get("address"),
      });
      await refreshProfile();
      navigate("/profile/institution");
    } catch (issue) { setError(issue.message); }
    finally { setSaving(false); }
  }

  if (!profile) return <div className="second-section"><p className="form-message" role={error ? "alert" : "status"}>{error || "Loading profile…"}</p></div>;

  return (
    <div className="second-section"><div className="profile-section">
      <Link to="/profile/image">Back</Link>
      <div className="progress"><div className="line" id="active-line"></div><div className="line" id="active-line"></div><div className="line"></div><div className="line"></div></div>
      <div className="second-info"><h3>Personal Information</h3></div>
      <form className="profile-section-form" onSubmit={handleSubmit}>
        <label htmlFor="fullname">Full Name</label><input type="text" name="fullname" id="fullname" defaultValue={profile.full_name ?? ""} required placeholder="Type Fullname Here" />
        <label htmlFor="phone">Phone No</label><input type="tel" name="phone" id="phone" placeholder="0902345678" defaultValue={profile.phone ?? ""} required />
        <label htmlFor="dob">Date of Birth</label><input type="date" name="dob" id="dob" defaultValue={profile.date_of_birth ?? ""} required />
        <label htmlFor="gender">Gender</label><select name="gender" id="gender" defaultValue={profile.gender ?? ""} required><option value="" disabled>Select gender</option><option>Male</option><option>Female</option><option>Other</option></select>
        <label htmlFor="address">Residential Address</label><input type="text" name="address" id="address" defaultValue={profile.residential_address ?? ""} required />
        {error && <p className="form-message" role="alert">{error}</p>}
        <button type="submit" disabled={saving}>{saving ? "Saving…" : "Proceed"}</button>
      </form>
    </div></div>
  );
}
