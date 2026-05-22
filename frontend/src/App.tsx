import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import type { ReactNode } from 'react';
import { Provider, useSelector } from 'react-redux';
import { store } from './store/store';
import { LoginPage } from './features/auth/pages';
import { SearchPage } from './features/search/pages';
import { RegisterVictimPage } from './features/victims/pages/RegisterVictimPage';

import { AdminDashboardPage } from './features/admin/pages/AdminDashboardPage';
import { AcceptInvitePage } from './features/auth/pages/AcceptInvitePage';
import { VictimListPage } from './features/victims/pages/VictimListPage';

// Auth Guard Component
const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const isAuthenticated = useSelector((state: any) => state.auth.isAuthenticated);
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/invite" element={<AcceptInvitePage />} />
          <Route path="/admin/dashboard" element={<ProtectedRoute><AdminDashboardPage /></ProtectedRoute>} />
          <Route path="/search" element={<ProtectedRoute><SearchPage /></ProtectedRoute>} />
          <Route path="/register-victim" element={<ProtectedRoute><RegisterVictimPage /></ProtectedRoute>} />
          <Route path="/victims" element={<ProtectedRoute><VictimListPage /></ProtectedRoute>} />
        </Routes>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
