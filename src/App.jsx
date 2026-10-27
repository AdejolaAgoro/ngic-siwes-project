import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import AppLayout from "./layouts/app-layout";
import Login from "./components/auth/login";
import Signup from "./components/auth/signup";



export default function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route element={<AppLayout />}>
            <Route path="/" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="*" element={<Navigate to="/signup" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}
