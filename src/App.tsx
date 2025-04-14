import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import DashboardLayout from './layouts/DashboardLayout.jsx';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { Toaster } from './components/ui/sonner';

// Import dashboard page components
import Overview from './pages/dashboard/Overview';
import Users from './pages/dashboard/Users';
import WordForTheDay from './pages/dashboard/WordForTheDay';
import DailyDevotional from './pages/dashboard/DailyDevotional';
import Sermons from './pages/dashboard/Sermons.jsx';
import AudioMessages from './pages/dashboard/AudioMessages';
import SundaySchool from './pages/dashboard/SundaySchool';
import AdminManagement from './pages/dashboard/AdminManagement';

function App() {
  return (
    <BrowserRouter>
      <Toaster richColors position="top-right" />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        
        {/* Dashboard routes */}
        <Route 
          path="/"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/overview" replace />} />
          <Route path="overview" element={<Overview />} />
          <Route path="users" element={<Users />} />
          <Route path="word-for-the-day" element={<WordForTheDay />} />
          <Route path="daily-devotional" element={<DailyDevotional />} />
          <Route path="sermons" element={<Sermons />} />
          <Route path="audio-messages" element={<AudioMessages />} />
          <Route path="sunday-school" element={<SundaySchool />} />
          
          {/* Super Admin only route */}
          <Route 
            path="admin-management" 
            element={
              <ProtectedRoute requiredRole="SUPER_ADMIN">
                <AdminManagement />
              </ProtectedRoute>
            } 
          />
        </Route>
        
        {/* Catch all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;