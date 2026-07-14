import type { RouteObject } from "react-router-dom";
import NotFound from "../pages/NotFound";
import Home from "../pages/home/page";
import Reservar from "../pages/reservar/page";
import Admin from "../pages/admin/page";
import AdminCalendario from "../pages/admin/calendario/page";

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
    path: "/admin",
    element: <Admin />,
  },
  {
    path: "/admin/calendario",
    element: <AdminCalendario />,
  },
  {
    path: "*",
    element: <NotFound />,
  },
];

export default routes;
