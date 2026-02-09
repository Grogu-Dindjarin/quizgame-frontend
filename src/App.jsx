import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

import AdminRoute from './components/AdminRoute';
import PrivateRoute from './components/PrivateRoute';
import { AuthProvider } from './context/AuthContext';
import AdminPage from './pages/AdminPage';
import DashboardPage from './pages/DashboardPage';
import LeaderboardPage from './pages/LeaderboardPage';
import LoginPage from './pages/LoginPage';
import NotFoundPage from './pages/NotFoundPage';
import ProfilePage from './pages/ProfilePage';
import QuizPage from './pages/QuizPage';
import ResultsPage from './pages/ResultsPage';

const App = () => (
  <BrowserRouter>
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <DashboardPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/quiz"
          element={
            <PrivateRoute>
              <QuizPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/results"
          element={
            <PrivateRoute>
              <ResultsPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/leaderboard"
          element={
            <PrivateRoute>
              <LeaderboardPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <ProfilePage />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminPage />
            </AdminRoute>
          }
        />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </AuthProvider>
  </BrowserRouter>
);

export default App;
