export function getAuthErrorMessage(error, fallback) {
  const message = error?.message || "";
  if (error?.name === "TypeError" || /failed to fetch|network request failed|fetch failed/i.test(message)) {
    return "Could not reach the authentication service. Check the Supabase project URL, publishable key, and project status.";
  }
  return message || fallback;
}
