import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { AnimatePresence } from "framer-motion";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AdminLayout from "./router/AdminLayout";
import StaffLayout from "./router/StaffLayout";
import Auth from "./router/Auth";
import routes from "./router/routes";

const App = () => {
  const user = useSelector((state) => state.auth);
  const isAuthenticated = user.isAuthenticated;
  const userRole = user.user?.role;

  return (
    <Router>
      <ToastContainer theme="light" position="top-right" />
      <AnimatePresence>
        <Routes>
          {!isAuthenticated &&
            routes.unauthenticated.map((route) => (
              <Route key={route.path} path={route.path} element={<route.component />} />
            ))}

          {isAuthenticated && (userRole === 'admin') && (
            <>
              <Route
                path="/"
                element={<Auth role="admin">
                  <AdminLayout />
                </Auth>}
              >
                {routes.admin.map((route) => (
                  <Route key={route.path} path={route.path} element={<route.component />} />
                ))}
                {routes.admin.map((route) => (
                  <Route key={route.path} path={route.path} element={<route.component />} />
                ))}
              </Route>
              <Route path="*" element={<Navigate to="/dashboard" />} />
            </>
          )}

          {isAuthenticated && userRole === 'user' && (
            <Route
              path="/"
              element={
                <Auth role="user">
                  <StaffLayout />
                </Auth>
              }
            >
              {routes.staff.map((route) => (
                <Route key={route.path} path={route.path} element={<route.component />} />
              ))}
              <Route path="*" element={<Navigate to="/dashboard" />} />
            </Route>
          )}

          <Route path="*" element={<Navigate to={isAuthenticated ? "/dashboard" : "/"} />} />
        </Routes>
      </AnimatePresence>
    </Router>
  );
};

export default App;
