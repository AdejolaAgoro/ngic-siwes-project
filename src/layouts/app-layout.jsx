import { Outlet } from "react-router-dom";
import Nav_header from "../components/Nav_header";

export default function AppLayout() {
  return (
    <>
      <Nav_header />
      <Outlet />
    </>
  );
}
