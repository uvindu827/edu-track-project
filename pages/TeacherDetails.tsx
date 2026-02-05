
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Edit3, 
  Trash2, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  BookOpen, 
  GraduationCap,
  Clock,
  User,
  StickyNote,
  Layers,
  Award,
  School as SchoolIcon
} from 'lucide-react';
import { teacherService } from '../services/mockDb';
import { Teacher } from '../types';

const TeacherDetails: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [teacher, setTeacher] = useState<Teacher | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      const fetchTeacher = async () => {
        const data = await teacherService.getById(id);
        if (data) {
          setTeacher(data);
        } else {
          navigate('/teachers');
        }
        setLoading(false);
      };
      fetchTeacher();
    }
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <div className="w-12 h-12 border-4 border-indigo-600/30 border-t-indigo-600 rounded-full animate-spin"></div>
        <p className="mt-4 text-slate-500 font-medium">Loading profile information...</p>
      </div>
    );
  }

  if (!teacher) return null;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <Link to="/teachers" className="inline-flex items-center gap-2 text-slate-500 hover:text-indigo-600 transition-colors font-medium">
          <ArrowLeft size={20} />
          Back to Registry
        </Link>
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(`/teachers/edit/${teacher.id}`)}
            className="flex items-center gap-2 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 px-5 py-2.5 rounded-xl font-bold transition-all shadow-sm border border-indigo-100"
          >
            <Edit3 size={18} />
            Edit Profile
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Sidebar - Profile Card */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden text-center">
            <div className="h-24 bg-indigo-600"></div>
            <div className="px-6 pb-8 -mt-12">
              <div className="inline-flex items-center justify-center w-24 h-24 bg-white rounded-full shadow-lg border-4 border-white mb-4 overflow-hidden">
                {teacher.photoUrl ? (
                  <img src={teacher.photoUrl} alt={teacher.fullName} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                    <User size={48} />
                  </div>
                )}
              </div>
              <h2 className="text-2xl font-bold text-slate-900 leading-tight">{teacher.fullName}</h2>
              <p className="text-indigo-600 font-semibold mt-1">Section: {teacher.section || 'N/A'}</p>
              <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-slate-400 uppercase font-bold tracking-wider">Teacher ID</p>
                  <p className="text-sm font-mono text-slate-700">{teacher.id}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 uppercase font-bold tracking-wider">Member Since</p>
                  <p className="text-sm text-slate-700">{new Date(teacher.hireDate).getFullYear()}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
            <h3 className="text-lg font-bold text-slate-800 mb-5 flex items-center gap-2">
              <Phone size={18} className="text-indigo-600" />
              Contact Details
            </h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Mail className="text-slate-400 mt-1" size={18} />
                <div className="w-full">
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Personal Email</p>
                  <a href={`mailto:${teacher.email}`} className="text-indigo-600 hover:underline break-all block">
                    {teacher.email}
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="text-slate-400 mt-1" size={18} />
                <div className="w-full">
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Mobile Number</p>
                  <p className="text-slate-700 font-medium">{teacher.phoneNumber}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="text-slate-400 mt-1" size={18} />
                <div className="w-full">
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Residential Address</p>
                  <p className="text-slate-700 leading-relaxed text-sm">{teacher.address}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Content - Full Info */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="bg-slate-50 px-8 py-5 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-xl font-bold text-slate-800">Employment Profile</h3>
              <span className="bg-emerald-100 text-emerald-700 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest">Active Member</span>
            </div>
            
            <div className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                {/* Institution Row */}
                <div className="flex items-center gap-4">
                  <div className="bg-blue-50 p-3 rounded-xl text-blue-600 shadow-inner">
                    <SchoolIcon size={24} />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Assigned School</p>
                    <p className="text-lg font-bold text-slate-800">{teacher.schoolName || 'N/A'}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="bg-slate-50 p-3 rounded-xl text-slate-600 shadow-inner">
                    <MapPin size={24} />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">School Area</p>
                    <p className="text-lg font-bold text-slate-800">{teacher.schoolArea || 'N/A'}</p>
                  </div>
                </div>

                {/* Subjects Display */}
                <div className="space-y-4">
                   <div className="flex items-center gap-4">
                    <div className="bg-indigo-50 p-3 rounded-xl text-indigo-600 shadow-inner">
                      <BookOpen size={24} />
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Primary Specialization</p>
                      <p className="text-lg font-bold text-slate-800">{teacher.subjectSpecialization}</p>
                    </div>
                  </div>
                  
                  {teacher.extraSubjects && teacher.extraSubjects.some(s => s !== "N/A") && (
                    <div className="ml-14 pl-4 border-l-2 border-slate-100">
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-2">Additional Subjects</p>
                      <div className="flex flex-wrap gap-2">
                        {teacher.extraSubjects.filter(s => s !== "N/A").map((s, i) => (
                          <span key={i} className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-md font-medium border border-slate-200">
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Grade Display */}
                <div className="flex items-start gap-4">
                  <div className="bg-emerald-50 p-3 rounded-xl text-emerald-600 shadow-inner mt-1">
                    <Layers size={24} />
                  </div>
                  <div className="flex-grow">
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-2">Assigned Grade Levels</p>
                    <div className="flex flex-wrap gap-2">
                      {teacher.gradeLevels && teacher.gradeLevels.length > 0 ? (
                        teacher.gradeLevels.map(grade => (
                          <span key={grade} className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold border border-emerald-200">
                            Grade {grade}
                          </span>
                        ))
                      ) : (
                        <span className="text-slate-400 italic text-sm">No grades assigned</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="bg-orange-50 p-3 rounded-xl text-orange-600 shadow-inner">
                    <Award size={24} />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Assigned Section</p>
                    <p className="text-lg font-bold text-slate-800">{teacher.section || 'N/A'}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="bg-slate-50 p-3 rounded-xl text-slate-600 shadow-inner">
                    <Calendar size={24} />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Hire Date</p>
                    <p className="text-lg font-bold text-slate-800">{new Date(teacher.hireDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-bold text-slate-800 uppercase tracking-widest flex items-center gap-2 mb-4">
                  <StickyNote size={16} className="text-indigo-600" />
                  Administrator Notes
                </h4>
                <div className="bg-slate-50 rounded-xl p-6 border border-slate-100">
                  <p className="text-slate-700 leading-relaxed italic text-sm">
                    {teacher.notes || "No additional administrative notes have been recorded for this profile."}
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end gap-4 p-4">
            <button
               onClick={() => {
                 if (window.confirm('Delete this record permanently? This cannot be undone.')) {
                   teacherService.delete(teacher.id).then(() => navigate('/teachers'));
                 }
               }}
               className="flex items-center gap-2 text-slate-400 hover:text-red-600 font-bold px-4 py-2 transition-colors text-xs uppercase tracking-wider"
            >
              <Trash2 size={16} />
              Remove Record
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherDetails;
