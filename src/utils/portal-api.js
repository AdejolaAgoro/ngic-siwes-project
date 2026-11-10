import { supabase } from "./supabase";

const DOCUMENT_BUCKET = "internship-documents";

function throwIfError(error) {
  if (error) {
    const requestError = new Error(error.message || "The request could not be completed.");
    requestError.code = error.code;
    requestError.details = error.details;
    requestError.constraint = error.constraint;
    throw requestError;
  }
}

export async function getMyProfile() {
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  throwIfError(userError);
  if (!user) throw new Error("Sign in to view your profile.");
  const { data, error } = await supabase.from("profiles").select("*").eq("id", user.id).maybeSingle();
  throwIfError(error);
  if (data) return data;

  const { data: createdProfile, error: createError } = await supabase.from("profiles")
    .upsert({ id: user.id, email: user.email, full_name: user.user_metadata?.full_name || "" }, { onConflict: "id" })
    .select("*").single();
  throwIfError(createError);
  return createdProfile;
}

export async function saveProfile(updates) {
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  throwIfError(userError);
  if (!user) throw new Error("Sign in before saving your profile.");
  const { data, error } = await supabase.from("profiles").update(updates).eq("id", user.id).select("*").single();
  throwIfError(error);
  return data;
}

export async function uploadProfileImage(file) {
  if (!file) return getMyProfile();
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  throwIfError(userError);
  if (!user) throw new Error("Sign in before uploading a profile image.");
  if (!file.type.startsWith("image/")) throw new Error("Choose a JPG, PNG, or WebP image.");
  if (file.size > 10 * 1024 * 1024) throw new Error("The image must be 10 MB or smaller.");

  const extension = file.name.split(".").pop()?.toLowerCase().replace(/[^a-z0-9]/g, "") || "jpg";
  const path = `${user.id}/profile/avatar.${extension}`;
  const { error } = await supabase.storage.from(DOCUMENT_BUCKET).upload(path, file, {
    upsert: true,
    contentType: file.type,
  });
  throwIfError(error);
  return saveProfile({ avatar_path: path });
}

export async function createDocumentLink(path) {
  if (!path) return "";
  const { data, error } = await supabase.storage.from(DOCUMENT_BUCKET).createSignedUrl(path, 300);
  throwIfError(error);
  return data.signedUrl;
}

export async function listMyApplications() {
  const { data, error } = await supabase.from("applications").select("*").order("submitted_at", { ascending: false });
  throwIfError(error);
  return data ?? [];
}

export async function submitApplication({ periodMonths, cv, studentId, institutionLetter }) {
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  throwIfError(userError);
  if (!user) throw new Error("Sign in before submitting an application.");

  const existingApplications = await listMyApplications();
  if (existingApplications.length) {
    throw Object.assign(new Error("An application already exists for this account."), {
      code: "APPLICATION_EXISTS",
      application: existingApplications[0],
    });
  }

  const applicationId = crypto.randomUUID();
  const files = [["cv", cv], ["student-id", studentId], ["institution-letter", institutionLetter]];
  if (files.some(([, file]) => !file)) throw new Error("Upload your CV, student ID, and institution letter.");

  const uploadedPaths = [];
  try {
    for (const [label, file] of files) {
      if (file.size > 10 * 1024 * 1024) throw new Error(`${file.name} exceeds the 10 MB upload limit.`);
      const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
      const path = `${user.id}/${applicationId}/${label}-${safeName}`;
      const { error } = await supabase.storage.from(DOCUMENT_BUCKET).upload(path, file, {
        upsert: false,
        contentType: file.type || "application/octet-stream",
      });
      throwIfError(error);
      uploadedPaths.push(path);
    }

    const { data, error } = await supabase.from("applications").insert({
      id: applicationId,
      applicant_id: user.id,
      internship_period_months: Number(periodMonths),
      cv_path: uploadedPaths[0],
      student_id_path: uploadedPaths[1],
      institution_letter_path: uploadedPaths[2],
    }).select("*").single();
    throwIfError(error);
    return data;
  } catch (error) {
    if (uploadedPaths.length) await supabase.storage.from(DOCUMENT_BUCKET).remove(uploadedPaths);
    const isDuplicateApplication = error.code === "23505" ||
      error.constraint === "applications_one_per_applicant_uidx" ||
      error.message?.includes("applications_one_per_applicant_uidx");
    if (isDuplicateApplication) {
      const applications = await listMyApplications();
      if (applications.length) {
        throw Object.assign(new Error("An application already exists for this account."), {
          code: "APPLICATION_EXISTS",
          application: applications[0],
        });
      }
    }
    throw error;
  }
}

export async function listAllApplications() {
  const { data, error } = await supabase.from("applications")
    .select("*, applicant:profiles!applications_applicant_id_fkey(full_name, email, institution, course, matric_number)")
    .order("submitted_at", { ascending: false });
  throwIfError(error);
  return data ?? [];
}

export async function reviewApplication(id, status) {
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  throwIfError(userError);
  if (!user) throw new Error("Sign in before reviewing applications.");
  const { data, error } = await supabase.from("applications").update({ status, reviewer_id: user.id })
    .eq("id", id).select("*").single();
  throwIfError(error);
  return data;
}

export async function getAuthenticatedLandingPath() {
  const profile = await getMyProfile();
  const applications = await listMyApplications();
  if (applications.length) return "/application";
  if (!profile.avatar_path) return "/profile/image";
  if (!profile.phone || !profile.date_of_birth || !profile.gender || !profile.residential_address) return "/profile/personal";
  if (!profile.institution || !profile.course || !profile.academic_level || !profile.matric_number || profile.cgpa == null) return "/profile/institution";
  return "/application";
}

