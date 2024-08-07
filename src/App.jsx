import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import { auth } from './FirebaseConfig';
import Sidebar from './Components/Sidebar';
import Dashboard from './Components/Dashboard';
import Department from './Components/Department';
import Visitors from './Components/Visitors';
import BwDates from './Components/BwDates';
import VisitorManagement from './Components/VisitorManagement';
import Landing from './Auth/Landing';
import Login from './Auth/Login';
import Register from './Auth/Register';
import ProtectedRoute from './Auth/ProtectedRoute';
import { onAuthStateChanged } from 'firebase/auth';
import VisitorPass from './Components/VisitorPass';
import Employees from './Components/Employees';

function AppContent() {
  const location = useLocation();
  const showSidebar = !['/', '/login', '/register'].includes(location.pathname);

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div>Loading...</div>; // You can replace this with a proper loading indicator
  }

  return (
    <div className="flex">
      {showSidebar && <Sidebar />}
      <main className={`flex-1 ${showSidebar ? 'ml-64' : ''}`}>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/dashboard"
            element={<ProtectedRoute element={Dashboard} user={user} />}
          />
          <Route
            path="/department"
            element={<ProtectedRoute element={Department} user={user} />}
          />
          <Route
            path="/employees"
            element={<ProtectedRoute element={Employees} user={user} />}
          />
          <Route
            path="/visitors"
            element={<ProtectedRoute element={Visitors} user={user} />}
          />
          <Route
            path="/visitorma"
            element={<ProtectedRoute element={VisitorManagement} user={user} />}
          />
          <Route
            path="/Bw"
            element={<ProtectedRoute element={BwDates} user={user} />}
          />
          <Route
            path="/pass"
            element={<ProtectedRoute element={VisitorPass} user={user} />}
          />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
