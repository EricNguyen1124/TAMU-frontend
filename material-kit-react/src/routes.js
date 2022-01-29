import { Navigate, useRoutes } from "react-router-dom";
// layouts
import DashboardLayout from "./layouts/dashboard";
import LogoOnlyLayout from "./layouts/LogoOnlyLayout";
//
import Login from "./pages/Login";
import ForgotPass from "./pages/ForgotPass";
import Register from "./pages/Register";
import DashboardApp from "./pages/DashboardApp";
import Products from "./pages/Products";
import Blog from "./pages/Blog";
import User from "./pages/User";
import NotFound from "./pages/Page404";

// ----------------------------------------------------------------------
import EducationIndex from "./components/_dashboard/educations/EducationIndex";
import PrivateRoute from "src/authentication/PrivateRoute";
import AdminRoute from "src/authentication/AdminRoute";
import Profile from "src/pages/Profile";
import Members from "src/pages/Members";
import Events from "src/pages/Events";
import Professionals from "./pages/Professionals";
import AdminProfessionals from "./pages/AdminProfessionals";
import MemberBoard from "./pages/MemberBoard";
import AdminEvents from "./pages/AdminEvents";
import { Attended_events } from "./components/_dashboard/profile";
import EventLinkCheckin from "./components/_dashboard/events/EventLinkCheckin";

export default function Router() {
  return useRoutes([
    {
      path: "/dashboard",
      element: (
        <PrivateRoute>
          <DashboardLayout />
        </PrivateRoute>
      ),
      children: [
        { path: "/", element: <Navigate to="/dashboard/app" replace /> },
        {
          path: `/database/:folderId/:title`,
          element: (
            <PrivateRoute>
              <EducationIndex />
            </PrivateRoute>
          ),
        },
        {
          path: "/java/:folderId/:title",
          element: (
            <PrivateRoute>
              <EducationIndex />
            </PrivateRoute>
          ),
        },
        {
          path: "/tp/:folderId/:title",
          element: (
            <PrivateRoute>
              <EducationIndex />
            </PrivateRoute>
          ),
        },
        {
          path: "app",
          element: (
            <PrivateRoute>
              <Events />
            </PrivateRoute>
          ),
        },
        {
          path: "profile",
          element: (
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          ),
        },
        // { path: "user", element: <User /> },
        {
          path: "members",
          element: (
            <AdminRoute>
              <Members />
            </AdminRoute>
          ),
        },
        {
          path: "edu",
          element: (
            <PrivateRoute>
              <DashboardApp />
            </PrivateRoute>
          ),
        },
        {
          path: "professionals",
          element: (
            <PrivateRoute>
              <Professionals />
            </PrivateRoute>
          ),
        },
        {
          path: "my_events",
          element: (
            <PrivateRoute>
              <Attended_events />
            </PrivateRoute>
          ),
        },
        {
          path: "event_checkin_by_link/:event_id/:checkin_code",
          element: (
            <PrivateRoute>
              <EventLinkCheckin />
            </PrivateRoute>
          ),
        },
        {
          path: "member_board",
          element: (
            <PrivateRoute>
              <MemberBoard />
            </PrivateRoute>
          ),
        },
        {
          path: "admin_professionals",
          element: (
            <AdminRoute>
              <AdminProfessionals />
            </AdminRoute>
          ),
        },
        {
          path: "admin_events",
          element: (
            <AdminRoute>
              <AdminEvents />
            </AdminRoute>
          ),
        },
        { path: "products", element: <Products /> },
        { path: "blog", element: <Blog /> },
      ],
    },
    {
      path: "/",
      // element: <LogoOnlyLayout />,
      children: [
        { path: "login", element: <Login /> },
        { path: "register", element: <Register /> },
        { path: "forgot_pass", element: <ForgotPass /> },
        { path: "404", element: <NotFound /> },
        { path: "400", element: <NotFound /> }, // bad request
        { path: "/", element: <Navigate to="/dashboard" /> },
        { path: "*", element: <Navigate to="/404" /> },
      ],
    },

    { path: "*", element: <Navigate to="/404" replace /> },
  ]);
}
