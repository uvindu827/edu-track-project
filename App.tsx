
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate, Link, useNavigate, useLocation } from 'react-router-dom';
import { LogOut, User, LayoutDashboard, Users, PlusCircle } from 'lucide-react';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import TeacherList from './pages/TeacherList';
import TeacherDetails from './pages/TeacherDetails';
import TeacherForm from './pages/TeacherForm';

const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const isAuthenticated = localStorage.getItem('isLoggedIn') === 'true';
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isAdmin = localStorage.getItem('isLoggedIn') === 'true';
  const userType = localStorage.getItem('userType');
  const userName = localStorage.getItem('userName') || 'Admin';

  if (!isAdmin) return null;

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const navItems = [
    { label: 'Dashboard', path: '/', icon: <LayoutDashboard size={20} /> },
    { label: 'Teachers', path: '/teachers', icon: <Users size={20} /> },
    { label: 'Add Teacher', path: '/teachers/new', icon: <PlusCircle size={20} /> },
  ];

  return (
    <nav className="bg-indigo-700 text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2">
              <div className="bg-white p-1 rounded-md">
                <Users className="text-indigo-700" size={24} />
              </div>
              <span className="font-bold text-xl tracking-tight">EduTrack</span>
            </Link>
            
            <div className="hidden md:flex space-x-4">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    location.pathname === item.path 
                      ? 'bg-indigo-800 text-white' 
                      : 'hover:bg-indigo-600 text-indigo-100'
                  }`}
                >
                  {item.icon}
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-indigo-100 mr-2 bg-indigo-800/50 px-3 py-1.5 rounded-full border border-indigo-500/30">
              {userType === 'google' ? (
                <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-4 h-4" alt="G" />
              ) : (
                <User size={16} />
              )}
              <span className="hidden sm:inline font-medium">{userName}</span>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-indigo-800 hover:bg-red-600 px-4 py-2 rounded-lg text-sm font-medium transition-all"
            >
              <LogOut size={18} />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default function App() {
  return (
    <HashRouter>
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/login" element={<Login />} />
            
            <Route path="/" element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            } />
            
            <Route path="/teachers" element={
              <PrivateRoute>
                <TeacherList />
              </PrivateRoute>
            } />
            
            <Route path="/teachers/new" element={
              <PrivateRoute>
                <TeacherForm />
              </PrivateRoute>
            } />
            
            <Route path="/teachers/edit/:id" element={
              <PrivateRoute>
                <TeacherForm />
              </PrivateRoute>
            } />
            
            <Route path="/teachers/:id" element={
              <PrivateRoute>
                <TeacherDetails />
              </PrivateRoute>
            } />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        
        <footer className="bg-white border-t py-6">
          <div className="max-w-7xl mx-auto px-4 text-center text-slate-500 text-sm">
            &copy; {new Date().getFullYear()} EduTrack School Administration System. All rights reserved.
          </div>
        </footer>
      </div>
    </HashRouter>
  );
}
