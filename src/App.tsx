import { BrowserRouter as Router, Navigate, Route, Routes } from "react-router";
import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";
import SignIn from "./pages/AuthPages/SignIn";
import NotFound from "./pages/OtherPage/NotFound";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import StaffProfilePage from "./pages/Staff/StaffProfilePage";
import StaffVacancyPage from "./pages/Staff/StaffVacancyPage";
import StaffApplicationsPage from "./pages/Staff/StaffApplicationsPage";

export default function App() {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        <Route path="/signin" element={<SignIn />} />
        <Route
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/staff-profile" replace />} />
          <Route path="/staff-profile" element={<StaffProfilePage />} />
          <Route path="/staff-vacancies" element={<StaffVacancyPage />} />
          <Route path="/staff-applications" element={<StaffApplicationsPage />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}
