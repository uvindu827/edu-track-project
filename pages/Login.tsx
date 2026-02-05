
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, User, AlertCircle, School, X, Check, Eye, EyeOff } from 'lucide-react';

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showGoogleModal, setShowGoogleModal] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Simulated Auth logic with requested credentials
    setTimeout(() => {
      if (username === 'admin' && password === 'admin@123') {
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('userType', 'password');
        localStorage.setItem('userName', 'System Administrator');
        localStorage.setItem('userEmail', 'admin@system.local');
        window.dispatchEvent(new Event('authChange'));
        navigate('/');
      } else {
        setError('Invalid username or password. Use admin / admin@123');
      }
      setLoading(false);
    }, 800);
  };

  const selectGoogleAccount = (acc: { name: string, email: string, pic: string }) => {
    setLoading(true);
    setShowGoogleModal(false);
    
    // Simulate network delay
    setTimeout(() => {
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('userType', 'google');
      localStorage.setItem('userName', acc.name);
      localStorage.setItem('userEmail', acc.email);
      localStorage.setItem('userPhoto', acc.pic);
      window.dispatchEvent(new Event('authChange'));
      navigate('/');
      setLoading(false);
    }, 1000);
  };

  const mockGoogleAccounts = [
    { name: 'Aruna Perera', email: 'aruna.perera@gmail.com', pic: 'https://i.pravatar.cc/150?u=aruna' },
    { name: 'Admin Staff', email: 'admin.staff@gmail.com', pic: 'https://i.pravatar.cc/150?u=staff' },
  ];

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-64px)] p-4 bg-slate-50">
      <div className="bg-white p-8 rounded-3xl shadow-2xl w-full max-w-md border border-slate-100 relative overflow-hidden">
        {/* Branding Background Decor */}
        <div className="absolute top-0 left-0 w-full h-1.5 bg-indigo-600"></div>
        
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-indigo-50 text-indigo-600 rounded-2xl mb-4 shadow-sm border border-indigo-100">
            <School size={40} />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">EduTrack</h1>
          <p className="text-slate-500 mt-2 font-medium">School Administration Portal</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-700 p-4 rounded-xl mb-6 flex items-start gap-3 text-sm border border-red-100 animate-in fade-in slide-in-from-top-2">
            <AlertCircle className="shrink-0 mt-0.5" size={18} />
            <p className="font-medium">{error}</p>
          </div>
        )}

        <button
          onClick={() => setShowGoogleModal(true)}
          disabled={loading}
          className="w-full mb-6 flex items-center justify-center gap-3 bg-white border border-slate-200 hover:border-indigo-300 hover:bg-slate-50 text-slate-700 font-bold py-3.5 rounded-xl shadow-sm transition-all active:scale-[0.98] disabled:opacity-70"
        >
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-5 h-5" alt="Google" />
          Sign in with Google
        </button>

        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-100"></div>
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="px-4 bg-white text-slate-400 font-bold uppercase tracking-widest">or user access</span>
          </div>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 ml-1">Username</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="text"
                required
                className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all outline-none text-slate-900 font-medium"
                placeholder="e.g. admin"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 ml-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type={showPassword ? "text" : "password"}
                required
                className="w-full pl-12 pr-12 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all outline-none text-slate-900 font-medium"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-600 transition-colors"
                title={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-indigo-200 transition-all active:scale-[0.98] disabled:opacity-70 flex justify-center items-center gap-2"
          >
            {loading ? (
              <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              'Log In to Dashboard'
            )}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-100 text-center">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
            Faculty Management System v2.5
          </p>
        </div>
      </div>

      {/* Mock Google Account Picker */}
      {showGoogleModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-2">
                <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-5 h-5" alt="G" />
                <span className="font-bold text-slate-700">Choose an account</span>
              </div>
              <button onClick={() => setShowGoogleModal(false)} className="text-slate-400 hover:text-slate-600 p-1">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-2">
              <p className="text-xs text-slate-500 px-4 py-2">to continue to <span className="font-bold text-indigo-600">EduTrack</span></p>
              
              <div className="mt-2 space-y-1">
                {mockGoogleAccounts.map((acc) => (
                  <button
                    key={acc.email}
                    onClick={() => selectGoogleAccount(acc)}
                    className="w-full flex items-center gap-3 p-4 hover:bg-slate-50 transition-colors text-left group"
                  >
                    <img src={acc.pic} className="w-10 h-10 rounded-full border border-slate-200" alt="" />
                    <div className="flex-grow">
                      <p className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{acc.name}</p>
                      <p className="text-xs text-slate-500">{acc.email}</p>
                    </div>
                    <Check size={16} className="text-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                ))}
              </div>

              <button className="w-full flex items-center gap-3 p-4 hover:bg-slate-50 transition-colors text-left text-sm font-medium text-slate-600 border-t border-slate-100 mt-2">
                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center border border-slate-200">
                  <User size={18} className="text-slate-400" />
                </div>
                <span>Use another account</span>
              </button>
            </div>
            
            <div className="p-6 bg-slate-50/80 text-[10px] text-slate-400 leading-relaxed">
              To continue, Google will share your name, email address, language preference and profile picture with EduTrack.
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
