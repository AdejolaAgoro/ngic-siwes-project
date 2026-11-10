import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getMyProfile, listMyApplications, submitApplication } from "../utils/portal-api";

const periods = [1, 2, 3, 6, 12, 18, 24];

export default function Application() {
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [profileLoadError, setProfileLoadError] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [showStatusPrompt, setShowStatusPrompt] = useState(false);
  const submittedApplication = applications[0];

  const refreshApplications = useCallback(async () => {
    setLoadError("");
    setLoading(true);
    try {
      const items = await listMyApplications();
      setApplications(items);
      if (items.length) {
        try {
          setProfile(await getMyProfile());
          setProfileLoadError("");
        } catch (issue) {
          setProfileLoadError(issue.message);
        }
      } else {
        setProfile(null);
        setProfileLoadError("");
      }
    }
    catch (issue) { setLoadError(issue.message); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { refreshApplications(); }, [refreshApplications]);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setSaving(true);
    const values = new FormData(event.currentTarget);
    try {
      const application = await submitApplication({
        periodMonths: values.get("period"), cv: values.get("cv-upload"),
        studentId: values.get("id-upload"), institutionLetter: values.get("upload-letter"),
      });
      setApplications((current) => [application, ...current]);
      getMyProfile().then(setProfile).catch((profileIssue) => setProfileLoadError(profileIssue.message));
      navigate("/application", { replace: true });
    } catch (issue) {
      if (issue.code === "APPLICATION_EXISTS" && issue.application) {
        setApplications([issue.application]);
        getMyProfile().then(setProfile).catch((profileIssue) => setProfileLoadError(profileIssue.message));
        setShowStatusPrompt(true);
      } else {
        setError(issue.message);
      }
    }
    finally { setSaving(false); }
  }

  if (loading) return <div className="second-section"><p className="form-message" role="status">Loading application status…</p></div>;

  return (
    <>
    <div className="second-section"><div className="profile-section">
      <Link to={submittedApplication ? "/home" : "/profile/complete"}>Back</Link>
      <div className="progress"><div className="line" id="active-line"></div><div className="line" id="active-line"></div><div className="line" id="active-line"></div><div className="line" id="active-line"></div></div>
      <div className="second-info"><h3>NGIC Internship Application</h3></div>
      {loadError ? (
        <div role="alert"><p className="form-message">Could not load your application status: {loadError}</p><button type="button" onClick={refreshApplications}>Try again</button></div>
      ) : submittedApplication ? (
        <>
        <section className="application-status-card" aria-labelledby="application-status-heading">
          <h3 id="application-status-heading">Application status</h3>
          <strong className={`admin-status status-${submittedApplication.status}`}>{submittedApplication.status.replaceAll("_", " ")}</strong>
          <p>Internship period: {submittedApplication.internship_period_months} months</p>
          <p>Submitted: {new Date(submittedApplication.submitted_at).toLocaleDateString()}</p>
        </section>
        <section className="application-profile-card" aria-labelledby="application-profile-heading">
          <h3 id="application-profile-heading">Profile details</h3>
          {profileLoadError ? <p className="form-message" role="alert">Could not load profile details: {profileLoadError}</p> : profile ? (
            <dl className="application-profile-details">
              <div><dt>Full name</dt><dd>{profile.full_name || "Not provided"}</dd></div>
              <div><dt>Email</dt><dd>{profile.email || "Not provided"}</dd></div>
              <div><dt>Phone number</dt><dd>{profile.phone || "Not provided"}</dd></div>
              <div><dt>Date of birth</dt><dd>{profile.date_of_birth ? new Date(`${profile.date_of_birth}T00:00:00`).toLocaleDateString() : "Not provided"}</dd></div>
              <div><dt>Gender</dt><dd>{profile.gender || "Not provided"}</dd></div>
              <div><dt>Residential address</dt><dd>{profile.residential_address || "Not provided"}</dd></div>
              <div><dt>Institution</dt><dd>{profile.institution || "Not provided"}</dd></div>
              <div><dt>Course</dt><dd>{profile.course || "Not provided"}</dd></div>
              <div><dt>Level</dt><dd>{profile.academic_level || "Not provided"}</dd></div>
              <div><dt>Matric number</dt><dd>{profile.matric_number || "Not provided"}</dd></div>
              <div><dt>CGPA</dt><dd>{profile.cgpa ?? "Not provided"}</dd></div>
            </dl>
          ) : <p role="status">Loading profile details…</p>}
        </section>
        </>
      ) : (
        <form className="profile-section-form" onSubmit={handleSubmit}>
          <label htmlFor="period">Internship Period</label>
          <select name="period" id="period" defaultValue="" required><option value="" disabled>Select duration</option>{periods.map((months) => <option key={months} value={months}>{months} {months === 1 ? "month" : "months"}</option>)}</select>
          <label htmlFor="cv-upload">Upload CV</label><input type="file" name="cv-upload" id="cv-upload" accept=".pdf,.doc,.docx" required />
          <label htmlFor="id-upload">Upload Student ID</label><input type="file" name="id-upload" id="id-upload" accept=".pdf,.jpg,.jpeg,.png,.webp" required />
          <label htmlFor="upload-letter">Institution Internship Letter</label><input type="file" name="upload-letter" id="upload-letter" accept=".pdf,.doc,.docx" required />
          {error && <p className="form-message" role="alert">{error}</p>}
          <button type="submit" disabled={saving}>{saving ? "Submitting…" : "Submit Application"}</button>
        </form>
      )}
      {error && submittedApplication && <p className="form-message" role="alert">{error}</p>}
    </div></div>
    {showStatusPrompt && (
      <div className="status-prompt-backdrop">
        <section className="status-prompt" role="dialog" aria-modal="true" aria-labelledby="status-prompt-heading">
          <h2 id="status-prompt-heading">Application already submitted</h2>
          <p>You already have an application. Would you like to view its status?</p>
          <div className="status-prompt-actions">
            <button type="button" onClick={() => { setShowStatusPrompt(false); navigate("/application", { replace: true }); }}>
              View application status
            </button>
            <button className="status-prompt-dismiss" type="button" onClick={() => setShowStatusPrompt(false)}>Stay here</button>
          </div>
        </section>
      </div>
    )}
    </>
  );
}
