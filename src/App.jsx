import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import AppLayout from "./layouts/app-layout";
import Login from "./components/auth/login";
import Signup from "./components/auth/signup";
import Welcome from "./components/welcome";
import ProfileImageSection from "./components/profile-image-section";
import PersonalInfo from "./components/personal-info";
import InstitutionDetails from "./components/institution-details";
import ApplyPage from "./components/apply-page";
import Application from "./components/application";
import AdminDashboard from "./components/admin/admin-dashboard";
import { AuthProvider } from "./auth/auth-context";
import { PublicOnly, RequireAuth } from "./auth/route-guards";

export default function App() {
  return (
    <>
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route
              path="/"
              element={
                <PublicOnly>
                  <Login />
                </PublicOnly>
              }
            />
            <Route
              path="/signup"
              element={
                <PublicOnly>
                  <Signup />
                </PublicOnly>
              }
            />
            <Route element={<RequireAuth />}>
              <Route element={<AppLayout />}>
                <Route path="/home" element={<Welcome />} />
                <Route
                  path="/profile/image"
                  element={<ProfileImageSection />}
                />
                <Route path="/profile/personal" element={<PersonalInfo />} />
                <Route
                  path="/profile/institution"
                  element={<InstitutionDetails />}
                />
                <Route path="/profile/complete" element={<ApplyPage />} />
                <Route path="/application" element={<Application />} />
                <Route element={<RequireAuth adminOnly />}>
                  <Route path="/admin" element={<AdminDashboard />} />
                </Route>
              </Route>
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </>
  );
}
