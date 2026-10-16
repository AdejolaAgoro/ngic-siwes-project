import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import Login from "./components/login";
import Signup from "./components/signup";

export default function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="*" element={<Navigate to="/signup" replace />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}
