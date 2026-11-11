import { useEffect, useState } from "react";
import { AuthContext } from "./auth-state";
import { supabase } from "../utils/supabase";

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [profileResult, setProfileResult] = useState({
    userId: null,
    profile: null,
  });
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    let active = true;
    supabase.auth.getSession().then(({ data, error }) => {
      if (!active) return;
      if (error) console.error("Could not restore the session:", error.message);
      setSession(data?.session ?? null);
      setAuthLoading(false);
    });
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      if (!nextSession) setProfileResult({ userId: null, profile: null });
      setAuthLoading(false);
    });
    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  const userId = session?.user?.id;
  useEffect(() => {
    let active = true;
    if (!userId)
      return () => {
        active = false;
      };
    supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .maybeSingle()
      .then(({ data, error }) => {
        if (!active) return;
        if (error) console.error("Could not load profile:", error.message);
        setProfileResult({ userId, profile: data ?? null });
      });
    return () => {
      active = false;
    };
  }, [userId]);

  const profileMatchesSession = Boolean(
    userId && profileResult.userId === userId,
  );
  const profile = profileMatchesSession ? profileResult.profile : null;
  const profileLoading = Boolean(userId && !profileMatchesSession);

  const value = {
    session,
    user: session?.user ?? null,
    profile,
    authLoading,
    profileLoading,
    refreshProfile: async () => {
      if (!userId) return null;
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();
      if (error) throw error;
      setProfileResult({ userId, profile: data });
      return data;
    },
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
