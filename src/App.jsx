import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage.js';
import DashboardLayout from './layouts/DashboardLayout.js';
import { ProtectedRoute } from './components/auth/ProtectedRoute.js';
import { Toaster } from './components/ui/sonner.js';

// Import dashboard page components
import Overview from './pages/dashboard/Overview.jsx';
import Users from './pages/dashboard/Users.jsx';
import UserDetailPage from './pages/dashboard/UserDetailPage.jsx'; // Import the UserDetailPage component
import WordForTheDay from './pages/dashboard/WordForTheDay.jsx';
import DailyDevotional from './pages/dashboard/DailyDevotional.jsx';
import Sermons from './pages/dashboard/Sermons.jsx';
import AudioMessages from './pages/dashboard/AudioMessages.jsx';
import SundaySchool from './pages/dashboard/SundaySchool.jsx';
import AdminManagement from './pages/dashboard/AdminManagement.jsx';
import { AuthProvider } from "@/contexts/AuthContext"; // Import the AuthProvider

function App() {
  return (
    <BrowserRouter>
      <AuthProvider> 
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
            <Route path="users/:userId" element={<UserDetailPage />} /> {/* Add the user detail route */}
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
      </AuthProvider>   
    </BrowserRouter>    
  );
}

export default App;