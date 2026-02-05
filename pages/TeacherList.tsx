
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Search, 
  Plus, 
  MoreHorizontal, 
  Mail, 
  Phone, 
  Trash2, 
  Edit3, 
  Eye,
  X,
  AlertTriangle,
  User,
  GraduationCap
} from 'lucide-react';
import { teacherService } from '../services/mockDb';
import { Teacher } from '../types';

const TeacherList: React.FC = () => {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; teacherId: string; name: string }>({
    isOpen: false,
    teacherId: '',
    name: ''
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetchTeachers();
  }, []);

  const fetchTeachers = async () => {
    setLoading(true);
    const data = await teacherService.getAll();
    setTeachers(data.sort((a, b) => b.createdAt - a.createdAt));
    setLoading(false);
  };

  const filteredTeachers = teachers.filter(t => 
    t.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.subjectSpecialization.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.section?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.schoolName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.schoolArea?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.gradeLevels?.some(g => g.toString().includes(searchTerm))
  );

  const handleDelete = async () => {
    if (deleteModal.teacherId) {
      await teacherService.delete(deleteModal.teacherId);
      setDeleteModal({ isOpen: false, teacherId: '', name: '' });
      fetchTeachers();
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Teacher Registry</h1>
          <p className="text-slate-500 mt-1">Browse and manage all teaching faculty members.</p>
        </div>
        <Link 
          to="/teachers/new"
          className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-3 rounded-xl shadow-sm transition-all active:scale-[0.98]"
        >
          <Plus size={20} />
          <span>Add New Teacher</span>
        </Link>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-4 border-b border-slate-100 bg-slate-50/50">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Search by name, subject, school, grade..."
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 transition-all shadow-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-slate-500 text-[10px] font-bold uppercase tracking-widest">
              <tr>
                <th className="px-6 py-4">Instructor</th>
                <th className="px-6 py-4">Specialization</th>
                <th className="px-6 py-4 text-center">Section</th>
                <th className="px-6 py-4">Grades</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-400">
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-8 h-8 border-2 border-indigo-600/30 border-t-indigo-600 rounded-full animate-spin"></div>
                      <p className="font-medium">Loading records...</p>
                    </div>
                  </td>
                </tr>
              ) : filteredTeachers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-400 italic">
                    {searchTerm ? `No records found matching "${searchTerm}"` : "No teachers registered yet."}
                  </td>
                </tr>
              ) : (
                filteredTeachers.map((teacher) => (
                  <tr key={teacher.id} className="hover:bg-slate-50/80 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-slate-100 overflow-hidden flex items-center justify-center border border-slate-200 shrink-0">
                          {teacher.photoUrl ? (
                            <img src={teacher.photoUrl} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <User size={20} className="text-slate-400" />
                          )}
                        </div>
                        <div className="flex flex-col">
                          <span className="font-bold text-slate-900 leading-tight">{teacher.fullName}</span>
                          <span className="text-[10px] text-slate-500">{teacher.schoolName}</span>
                          <span className="text-[9px] text-slate-400 uppercase font-mono tracking-tighter">{teacher.id}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        <span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 text-[10px] font-bold rounded border border-indigo-100 w-fit">
                          {teacher.subjectSpecialization}
                        </span>
                        {teacher.extraSubjects && teacher.extraSubjects.filter(s => s !== "N/A").length > 0 && (
                          <span className="text-[9px] text-slate-400">
                            +{teacher.extraSubjects.filter(s => s !== "N/A").length} more
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                       <span className="font-bold text-slate-600 text-sm uppercase">{teacher.section || '—'}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1 max-w-[120px]">
                        {teacher.gradeLevels?.slice(0, 3).map(g => (
                          <span key={g} className="text-[9px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-bold">G{g}</span>
                        ))}
                        {teacher.gradeLevels?.length > 3 && (
                          <span className="text-[9px] text-slate-400">...</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => navigate(`/teachers/${teacher.id}`)}
                          className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          onClick={() => navigate(`/teachers/edit/${teacher.id}`)}
                          className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                        >
                          <Edit3 size={16} />
                        </button>
                        <button
                          onClick={() => setDeleteModal({ isOpen: true, teacherId: teacher.id, name: teacher.fullName })}
                          className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                      <div className="group-hover:hidden text-slate-300">
                        <MoreHorizontal size={18} className="inline" />
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteModal.isOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full overflow-hidden">
            <div className="p-6">
              <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-4">
                <AlertTriangle size={24} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Confirm Delete</h3>
              <p className="text-slate-500 text-sm">
                Permanently delete <span className="font-semibold text-slate-700">{deleteModal.name}</span>?
              </p>
            </div>
            <div className="flex p-4 gap-3 bg-slate-50 border-t border-slate-100">
              <button
                onClick={() => setDeleteModal({ ...deleteModal, isOpen: false })}
                className="flex-1 px-4 py-2 bg-white border border-slate-200 text-slate-700 font-bold rounded-lg text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 px-4 py-2 bg-red-600 text-white font-bold rounded-lg text-sm"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherList;
