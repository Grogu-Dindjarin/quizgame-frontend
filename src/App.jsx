import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

import AdminRoute from './components/AdminRoute';
import PrivateRoute from './components/PrivateRoute';
import { AuthProvider } from './context/AuthContext';
import LoginPage from './pages/LoginPage';

const DashboardPage = () => <div>Dashboard</div>;
const QuizPage = () => <div>Quiz</div>;
const ResultsPage = () => <div>Results</div>;
const LeaderboardPage = () => <div>Leaderboard</div>;
const ProfilePage = () => <div>Profile</div>;
const AdminPage = () => <div>Admin</div>;
const NotFoundPage = () => <div>404</div>;

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
