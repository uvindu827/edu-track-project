
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate, Link, useNavigate, useLocation } from 'react-router-dom';
import { LogOut, User, LayoutDashboard, Users, PlusCircle, ShieldCheck } from 'lucide-react';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import TeacherList from './pages/TeacherList';
import TeacherDetails from './pages/TeacherDetails';
import TeacherForm from './pages/TeacherForm';

const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(localStorage.getItem('isLoggedIn') === 'true');

  useEffect(() => {
    const checkAuth = () => {
      setIsAuthenticated(localStorage.getItem('isLoggedIn') === 'true');
    };
    window.addEventListener('authChange', checkAuth);
    return () => window.removeEventListener('authChange', checkAuth);
  }, []);

  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [auth, setAuth] = useState({
    isLoggedIn: localStorage.getItem('isLoggedIn') === 'true',
    userType: localStorage.getItem('userType'),
    userName: localStorage.getItem('userName') || 'Admin',
    userPhoto: localStorage.getItem('userPhoto'),
    userEmail: localStorage.getItem('userEmail')
  });

  useEffect(() => {
    const handleAuthChange = () => {
      setAuth({
        isLoggedIn: localStorage.getItem('isLoggedIn') === 'true',
        userType: localStorage.getItem('userType'),
        userName: localStorage.getItem('userName') || 'Admin',
        userPhoto: localStorage.getItem('userPhoto'),
        userEmail: localStorage.getItem('userEmail')
      });
    };
    window.addEventListener('authChange', handleAuthChange);
    return () => window.removeEventListener('authChange', handleAuthChange);
  }, []);

  if (!auth.isLoggedIn) return null;

  const handleLogout = () => {
    localStorage.clear();
    window.dispatchEvent(new Event('authChange'));
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
            <Link to="/" className="flex items-center gap-2 group">
              <div className="bg-white p-1 rounded-lg transition-transform group-hover:scale-110">
                <Users className="text-indigo-700" size={24} />
              </div>
              <span className="font-extrabold text-xl tracking-tight">EduTrack</span>
            </Link>
            
            <div className="hidden md:flex space-x-1">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                    location.pathname === item.path 
                      ? 'bg-indigo-800 text-white shadow-inner' 
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
            <div className="flex items-center gap-3 pl-3 pr-4 py-1.5 bg-indigo-800/60 rounded-full border border-indigo-500/30 group cursor-default">
              {auth.userPhoto ? (
                <img src={auth.userPhoto} className="w-8 h-8 rounded-full border-2 border-indigo-400 shadow-sm" alt="Profile" />
              ) : (
                <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-white">
                  <User size={16} />
                </div>
              )}
              <div className="hidden sm:flex flex-col items-start leading-none">
                <span className="text-sm font-bold text-white flex items-center gap-1">
                  {auth.userName}
                  {auth.userType === 'google' && <ShieldCheck size={12} className="text-emerald-400" />}
                </span>
                <span className="text-[10px] text-indigo-200 mt-0.5">{auth.userEmail}</span>
              </div>
            </div>
            
            <button
              onClick={handleLogout}
              className="p-2.5 bg-indigo-800 hover:bg-red-500 rounded-xl transition-all shadow-md group active:scale-95"
              title="Logout"
            >
              <LogOut size={20} className="group-hover:translate-x-0.5 transition-transform" />
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
        
        <footer className="bg-white border-t py-8">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-indigo-600 font-bold">
                <Users size={20} />
                <span>EduTrack Admin</span>
              </div>
              <p className="text-slate-400 text-xs font-medium uppercase tracking-widest">
                &copy; {new Date().getFullYear()} School Administration System
              </p>
              <div className="flex gap-6 text-slate-400 text-xs font-bold uppercase tracking-widest">
                <a href="#" className="hover:text-indigo-600">Privacy</a>
                <a href="#" className="hover:text-indigo-600">Terms</a>
                <a href="#" className="hover:text-indigo-600">Support</a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </HashRouter>
  );
}
