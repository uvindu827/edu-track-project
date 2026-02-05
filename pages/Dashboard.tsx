
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, 
  Users, 
  Search, 
  Calendar, 
  GraduationCap, 
  ArrowRight,
  UserCheck,
  ClipboardList
} from 'lucide-react';
import { teacherService } from '../services/mockDb';
import { Teacher } from '../types';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [totalTeachers, setTotalTeachers] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const teachers = await teacherService.getAll();
      setTotalTeachers(teachers.length);
      setLoading(false);
    };
    fetchData();
  }, []);

  const stats = [
    { label: 'Total Teachers', value: totalTeachers, icon: <Users />, color: 'bg-blue-500' },
    { label: 'Classes Managed', value: '24', icon: <ClipboardList />, color: 'bg-emerald-500' },
    { label: 'Active Status', value: '100%', icon: <UserCheck />, color: 'bg-indigo-500' },
  ];

  const quickActions = [
    { 
      title: 'Add New Teacher', 
      desc: 'Register a new instructor into the system', 
      icon: <Plus />, 
      path: '/teachers/new', 
      color: 'bg-indigo-50 text-indigo-700 border-indigo-200' 
    },
    { 
      title: 'View All Teachers', 
      desc: 'Search, edit, or delete existing records', 
      icon: <Search />, 
      path: '/teachers', 
      color: 'bg-slate-50 text-slate-700 border-slate-200' 
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-slate-900">Administrator Dashboard</h1>
        <p className="text-slate-500 mt-2 text-lg">Manage your school's faculty records efficiently.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center gap-5">
            <div className={`${stat.color} text-white p-4 rounded-lg shadow-inner`}>
              {/* Fix: Cast to React.ReactElement<any> to allow 'size' prop override for Lucide icons */}
              {React.cloneElement(stat.icon as React.ReactElement<any>, { size: 28 })}
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">{stat.label}</p>
              <p className="text-3xl font-bold text-slate-900 mt-1">
                {loading ? '...' : stat.value}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <GraduationCap className="text-indigo-600" />
            Quick Management
          </h2>
          <div className="grid grid-cols-1 gap-4">
            {quickActions.map((action, idx) => (
              <button
                key={idx}
                onClick={() => navigate(action.path)}
                className={`flex items-center justify-between p-6 rounded-xl border-2 text-left transition-all hover:shadow-md active:scale-[0.99] group ${action.color}`}
              >
                <div className="flex items-center gap-5">
                  <div className="p-3 bg-white rounded-lg shadow-sm">
                    {/* Fix: Cast to React.ReactElement<any> to allow 'size' prop override for Lucide icons */}
                    {React.cloneElement(action.icon as React.ReactElement<any>, { size: 24 })}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">{action.title}</h3>
                    <p className="opacity-80 text-sm mt-1">{action.desc}</p>
                  </div>
                </div>
                <ArrowRight className="group-hover:translate-x-1 transition-transform" />
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <Calendar className="text-indigo-600" />
              Recent Activity
            </h2>
            <button 
              onClick={() => navigate('/teachers')}
              className="text-indigo-600 text-sm font-medium hover:underline"
            >
              View All
            </button>
          </div>
          <div className="space-y-4">
            {totalTeachers === 0 ? (
              <div className="text-center py-10">
                <p className="text-slate-400 italic">No recent teacher activities recorded.</p>
              </div>
            ) : (
              <div className="border-l-2 border-indigo-100 ml-3 pl-6 space-y-6">
                <div className="relative">
                  <div className="absolute -left-8 top-1 w-4 h-4 rounded-full bg-indigo-600 border-4 border-white shadow-sm"></div>
                  <p className="text-sm text-slate-500">2 hours ago</p>
                  <p className="text-slate-800 mt-1 font-medium">New teacher record created: <span className="text-indigo-600">Sarah Jenkins</span></p>
                </div>
                <div className="relative">
                  <div className="absolute -left-8 top-1 w-4 h-4 rounded-full bg-slate-300 border-4 border-white shadow-sm"></div>
                  <p className="text-sm text-slate-500">Yesterday</p>
                  <p className="text-slate-800 mt-1 font-medium">Updated contact info for <span className="text-indigo-600">Mark Thompson</span></p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
