import { Routes, Route, Navigate } from 'react-router-dom';
import Login from '@pages/Auth/Login';
import Register from '@pages/Auth/Register';
import VerifyEmail from '@pages/Auth/VerifyEmail';
import ForgotPassword from '@pages/Auth/ForgotPassword';
import ResetPassword from '@pages/Auth/ResetPassword';
import Dashboard from '@pages/Dashboard/Dashboard';
import ProfileEdit from '@pages/CVEditor/ProfileEdit';
import ExperienceSection from '@pages/CVEditor/ExperienceSection';
import EducationSection from '@pages/CVEditor/EducationSection';
import SkillsSection from '@pages/CVEditor/SkillsSection';
import LanguagesSection from '@pages/CVEditor/LanguagesSection';
import CertificationsSection from '@pages/CVEditor/CertificationsSection';
import SocialNetworksSection from '@pages/CVEditor/SocialNetworksSection';
import TemplatesAndExport from '@pages/CVEditor/TemplatesAndExport';
import ProtectedRoute from './ProtectedRoute';
import MainLayout from '@components/layout/MainLayout';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/verify-email/:token" element={<VerifyEmail />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />

      {/* Protected Routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <MainLayout>
              <Dashboard />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/profiles/:id/edit"
        element={
          <ProtectedRoute>
            <MainLayout>
              <ProfileEdit />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/profiles/:id/experience"
        element={
          <ProtectedRoute>
            <MainLayout>
              <ExperienceSection />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/profiles/:id/education"
        element={
          <ProtectedRoute>
            <MainLayout>
              <EducationSection />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/profiles/:id/skills"
        element={
          <ProtectedRoute>
            <MainLayout>
              <SkillsSection />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/profiles/:id/languages"
        element={
          <ProtectedRoute>
            <MainLayout>
              <LanguagesSection />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/profiles/:id/certifications"
        element={
          <ProtectedRoute>
            <MainLayout>
              <CertificationsSection />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/profiles/:id/social-networks"
        element={
          <ProtectedRoute>
            <MainLayout>
              <SocialNetworksSection />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/profiles/:id/templates-export"
        element={
          <ProtectedRoute>
            <MainLayout>
              <TemplatesAndExport />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      {/* Default Route */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};

export default AppRoutes;
