import type { RouteObject } from "react-router-dom";
import NotFound from "../pages/NotFound";
import Home from "../pages/home/page";
import Reservar from "../pages/reservar/page";
import Admin from "../pages/admin/page";
import AdminCalendario from "../pages/admin/calendario/page";
import AdminLogin from "../pages/admin/login/page";
import AuthGuard from "../pages/admin/components/AuthGuard";

const routes: RouteObject[] = [
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/reservar",
    element: <Reservar />,
  },
  {
    path: "/admin/login",
    element: <AdminLogin />,
  },
  {
    path: "/admin",
    element: <AuthGuard><Admin /></AuthGuard>,
  },
  {
    path: "/admin/calendario",
    element: <AuthGuard><AdminCalendario /></AuthGuard>,
  },
  {
    path: "*",
    element: <NotFound />,
  },
];

export default routes;