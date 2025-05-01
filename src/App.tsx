import  { Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import AdminPanel from './pages/AdminPanel';
import ToolPage from './pages/ToolPage';
import { UserProvider } from './context/UserContext';

function App() {
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Simulate initial loading
    setTimeout(() => setIsLoading(false), 1000);
  }, []);

  if (isLoading) {
    return (
      <div className="flex w-full h-screen items-center justify-center flex-col space-y-3 p-2 bg-white">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        <div className="text-base font-semibold">Loading EPROJECTS...</div>
      </div>
    );
  }

  return (
    <UserProvider>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/admin" element={<AdminPanel />} />
        <Route path="/tool/:toolId" element={<ToolPage />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </UserProvider>
  );
}

export default App;
 