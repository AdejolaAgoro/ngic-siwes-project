import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  createDocumentLink,
  getMyProfile,
  uploadProfileImage,
} from "../utils/portal-api";

const DEFAULT_AVATAR =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='48' height='48' viewBox='0 0 24 24' fill='none' stroke='%23008000' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Ccircle cx='12' cy='8' r='4'/%3E%3Cpath d='M5 21a7 7 0 0 1 14 0'/%3E%3C/svg%3E";

export default function ProfileImageSection() {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [avatarUrl, setAvatarUrl] = useState("");
  const [previewUrl, setPreviewUrl] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const previewRef = useRef("");

  useEffect(() => {
    let active = true;
    getMyProfile()
      .then(async (profile) => {
        if (profile.avatar_path) {
          const url = await createDocumentLink(profile.avatar_path);
          if (active) setAvatarUrl(url);
        }
      })
      .catch((issue) => {
        if (active) setError(issue.message);
      });
    return () => {
      active = false;
    };
  }, []);

  useEffect(
    () => () => {
      if (previewRef.current) URL.revokeObjectURL(previewRef.current);
    },
    [],
  );

  function handleFileChange(event) {
    const nextFile = event.target.files?.[0] ?? null;
    if (previewRef.current) URL.revokeObjectURL(previewRef.current);
    previewRef.current = nextFile ? URL.createObjectURL(nextFile) : "";
    setPreviewUrl(previewRef.current);
    setFile(nextFile);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setSaving(true);
    try {
      if (file) await uploadProfileImage(file);
      navigate("/profile/personal");
    } catch (issue) {
      setError(issue.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="first-profile">
      <div className="profile-section">
        <Link to="/home">Back</Link>
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
            part of your internship application
          </p>
        </div>
        <form className="profile-icon" onSubmit={handleSubmit}>
          <input
            className="avatar-file"
            id="user-icon"
            type="file"
            accept="image/png,image/jpeg,image/webp"
            onChange={handleFileChange}
          />
          <label
            className="avatar-upload"
            htmlFor="user-icon"
            aria-label="Choose a profile image"
          >
            <img
              src={previewUrl || avatarUrl || DEFAULT_AVATAR}
              alt="Profile preview"
            />
          </label>
          {error && (
            <p className="form-message" role="alert">
              {error}
            </p>
          )}
          <button type="submit" disabled={saving}>
            {saving ? "Saving…" : "Proceed"}
          </button>
        </form>
      </div>
    </div>
  );
}
