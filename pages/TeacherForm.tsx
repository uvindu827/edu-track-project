
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft, Save, XCircle, Info, CheckCircle2, Camera, Image as ImageIcon, ExternalLink, Globe, BookOpen, Layers, Edit2, School as SchoolIcon, MapPin } from 'lucide-react';
import { teacherService } from '../services/mockDb';
import { SUBJECTS, GRADES, Teacher } from '../types';

const TeacherForm: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [formData, setFormData] = useState<Omit<Teacher, 'id' | 'createdAt'>>({
    fullName: '',
    phoneNumber: '+94 ',
    email: '',
    subjectSpecialization: SUBJECTS[1], 
    extraSubjects: ['N/A', 'N/A', 'N/A'],
    gradeLevels: [],
    section: '',
    schoolName: '',
    schoolArea: '',
    hireDate: new Date().toISOString().split('T')[0],
    address: '',
    notes: '',
    photoUrl: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (isEdit && id) {
      const loadTeacher = async () => {
        const teacher = await teacherService.getById(id);
        if (teacher) {
          const { id: _, createdAt: __, ...data } = teacher;
          setFormData({ 
            ...data, 
            photoUrl: data.photoUrl || '',
            extraSubjects: data.extraSubjects || ['N/A', 'N/A', 'N/A'],
            gradeLevels: data.gradeLevels || [],
            section: data.section || '',
            schoolName: data.schoolName || '',
            schoolArea: data.schoolArea || ''
          });
        } else {
          navigate('/teachers');
        }
      };
      loadTeacher();
    }
  }, [isEdit, id, navigate]);

  const convertDriveUrl = (url: string) => {
    if (!url) return '';
    const driveIdMatch = url.match(/[-\w]{25,}/);
    if (url.includes('drive.google.com') && driveIdMatch) {
      const fileId = driveIdMatch[0];
      return `https://lh3.googleusercontent.com/d/${fileId}`;
    }
    return url;
  };

  const handlePhotoUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawUrl = e.target.value;
    const converted = convertDriveUrl(rawUrl);
    setFormData({ ...formData, photoUrl: converted });
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value;
    if (!val.startsWith('+94')) {
      val = '+94 ' + val.replace(/^\+?9?4? ?/, '');
    }
    setFormData({ ...formData, phoneNumber: val });
  };

  const handleGradeToggle = (grade: number) => {
    setFormData(prev => ({
      ...prev,
      gradeLevels: prev.gradeLevels.includes(grade)
        ? prev.gradeLevels.filter(g => g !== grade)
        : [...prev.gradeLevels, grade].sort((a, b) => a - b)
    }));
  };

  const handleExtraSubjectChange = (index: number, value: string) => {
    const newExtras = [...formData.extraSubjects];
    newExtras[index] = value;
    setFormData({ ...formData, extraSubjects: newExtras });
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.fullName.trim()) newErrors.fullName = 'Full Name is required';
    if (!formData.phoneNumber.trim() || formData.phoneNumber === '+94 ') newErrors.phoneNumber = 'Phone Number is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Personal Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email format is invalid';
    }
    if (!formData.address.trim()) newErrors.address = 'Home Address is required';
    if (formData.gradeLevels.length === 0) newErrors.gradeLevels = 'At least one Grade Level must be selected';
    if (!formData.section.trim()) newErrors.section = 'Section is required';
    if (!formData.schoolName.trim()) newErrors.schoolName = 'School Name is required';
    if (!formData.schoolArea.trim()) newErrors.schoolArea = 'School Area is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      if (isEdit && id) {
        await teacherService.update(id, formData);
      } else {
        await teacherService.add(formData);
      }
      setSuccess(true);
      setTimeout(() => navigate('/teachers'), 1500);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const clearForm = () => {
    if (window.confirm('Are you sure you want to clear the form?')) {
      setFormData({
        fullName: '',
        phoneNumber: '+94 ',
        email: '',
        subjectSpecialization: SUBJECTS[1],
        extraSubjects: ['N/A', 'N/A', 'N/A'],
        gradeLevels: [],
        section: '',
        schoolName: '',
        schoolArea: '',
        hireDate: new Date().toISOString().split('T')[0],
        address: '',
        notes: '',
        photoUrl: '',
      });
      setErrors({});
    }
  };

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center py-20 animate-in fade-in duration-500">
        <div className="bg-emerald-100 text-emerald-600 p-6 rounded-full mb-6">
          <CheckCircle2 size={64} />
        </div>
        <h2 className="text-3xl font-bold text-slate-900">Success!</h2>
        <p className="text-slate-500 mt-2">The record has been {isEdit ? 'updated' : 'saved'} successfully.</p>
        <p className="text-indigo-600 mt-4 font-medium">Redirecting to registry...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8 flex items-center justify-between">
        <Link to="/teachers" className="inline-flex items-center gap-2 text-slate-500 hover:text-indigo-600 transition-colors font-medium">
          <ArrowLeft size={20} />
          Back to List
        </Link>
        <h1 className="text-2xl font-bold text-slate-900">{isEdit ? 'Edit Teacher Profile' : 'Register New Teacher'}</h1>
      </div>

      <div className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
        <div className="p-6 md:p-10">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Photo Section */}
            <div className="flex flex-col md:flex-row gap-8 items-start mb-8 p-6 bg-slate-50 rounded-2xl border border-slate-100">
              <div className="shrink-0 mx-auto md:mx-0">
                <div className="w-32 h-32 bg-white rounded-2xl border-2 border-dashed border-slate-200 flex items-center justify-center overflow-hidden relative group shadow-sm">
                  {formData.photoUrl ? (
                    <img src={formData.photoUrl} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <ImageIcon className="text-slate-300" size={40} />
                  )}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Camera className="text-white" size={24} />
                  </div>
                </div>
              </div>
              <div className="flex-grow w-full">
                <label className="block text-sm font-semibold text-slate-700 mb-2">Profile Photo (Google Drive Link)</label>
                <input
                  type="text"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all shadow-sm"
                  placeholder="Paste shared Drive link here..."
                  value={formData.photoUrl}
                  onChange={handlePhotoUrlChange}
                />
                <div className="mt-3 flex gap-3 text-xs text-slate-500 items-start">
                  <ExternalLink size={14} className="shrink-0 mt-0.5" />
                  <p>Paste your Google Drive sharing link. We'll automatically convert it for display.</p>
                </div>
              </div>
            </div>

            {/* Contact Details */}
            <div>
              <div className="flex items-center gap-2 mb-6 border-b border-slate-100 pb-2">
                <Info size={18} className="text-indigo-600" />
                <h2 className="text-lg font-bold text-slate-800 uppercase tracking-wide">Personal Information</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Full Name <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    className={`w-full px-4 py-3 rounded-xl border ${errors.fullName ? 'border-red-300 bg-red-50' : 'border-slate-200'} focus:ring-2 focus:ring-indigo-500 outline-none transition-all`}
                    placeholder="e.g. Mr. Sunil Perera"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  />
                  {errors.fullName && <p className="mt-1 text-xs text-red-500 font-medium">{errors.fullName}</p>}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Personal Email <span className="text-red-500">*</span></label>
                  <input
                    type="email"
                    className={`w-full px-4 py-3 rounded-xl border ${errors.email ? 'border-red-300 bg-red-50' : 'border-slate-200'} focus:ring-2 focus:ring-indigo-500 outline-none transition-all`}
                    placeholder="name@personal-email.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                  {errors.email && <p className="mt-1 text-xs text-red-500 font-medium">{errors.email}</p>}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Phone Number (LK) <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5 text-slate-400 pointer-events-none border-r pr-2 h-6 border-slate-200">
                      <Globe size={14} />
                    </div>
                    <input
                      type="tel"
                      className={`w-full pl-14 pr-4 py-3 rounded-xl border ${errors.phoneNumber ? 'border-red-300 bg-red-50' : 'border-slate-200'} focus:ring-2 focus:ring-indigo-500 outline-none transition-all`}
                      placeholder="+94 77 123 4567"
                      value={formData.phoneNumber}
                      onChange={handlePhoneChange}
                    />
                  </div>
                  {errors.phoneNumber && <p className="mt-1 text-xs text-red-500 font-medium">{errors.phoneNumber}</p>}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Hire Date</label>
                  <input
                    type="date"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                    value={formData.hireDate}
                    onChange={(e) => setFormData({ ...formData, hireDate: e.target.value })}
                  />
                </div>
              </div>
            </div>

            {/* School & Academic Assignment */}
            <div className="p-6 bg-slate-50/50 rounded-2xl border border-slate-100">
              <div className="flex items-center gap-2 mb-6 border-b border-slate-100 pb-2">
                <BookOpen size={18} className="text-indigo-600" />
                <h2 className="text-lg font-bold text-slate-800 uppercase tracking-wide">Institution & Assignment</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                    <SchoolIcon size={16} />
                    School Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    className={`w-full px-4 py-3 rounded-xl border ${errors.schoolName ? 'border-red-300 bg-red-50' : 'border-slate-200'} focus:ring-2 focus:ring-indigo-500 outline-none transition-all shadow-sm`}
                    placeholder="e.g. Royal College"
                    value={formData.schoolName}
                    onChange={(e) => setFormData({ ...formData, schoolName: e.target.value })}
                  />
                  {errors.schoolName && <p className="mt-1 text-xs text-red-500 font-medium">{errors.schoolName}</p>}
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                    <MapPin size={16} />
                    School Area / Location <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    className={`w-full px-4 py-3 rounded-xl border ${errors.schoolArea ? 'border-red-300 bg-red-50' : 'border-slate-200'} focus:ring-2 focus:ring-indigo-500 outline-none transition-all shadow-sm`}
                    placeholder="e.g. Colombo 07"
                    value={formData.schoolArea}
                    onChange={(e) => setFormData({ ...formData, schoolArea: e.target.value })}
                  />
                  {errors.schoolArea && <p className="mt-1 text-xs text-red-500 font-medium">{errors.schoolArea}</p>}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Section <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    className={`w-full px-4 py-3 rounded-xl border ${errors.section ? 'border-red-300 bg-red-50' : 'border-slate-200'} focus:ring-2 focus:ring-indigo-500 outline-none transition-all shadow-sm`}
                    placeholder="e.g. Primary, Secondary, A, B"
                    value={formData.section}
                    onChange={(e) => setFormData({ ...formData, section: e.target.value })}
                  />
                  {errors.section && <p className="mt-1 text-xs text-red-500 font-medium">{errors.section}</p>}
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Primary Subject</label>
                  <select
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all appearance-none bg-no-repeat bg-[right_1rem_center] bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22none%22%20viewBox%3D%220%200%2020%2020%22%3E%3Cpath%20stroke%3D%22%236b7280%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20stroke-width%3D%221.5%22%20d%3D%22m6%208%204%204%204-4%22%2F%3E%3C%2Fsvg%3E')]"
                    value={formData.subjectSpecialization}
                    onChange={(e) => setFormData({ ...formData, subjectSpecialization: e.target.value })}
                  >
                    {SUBJECTS.filter(s => s !== "N/A").map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>

              {/* Extra Subjects */}
              <div className="mb-8">
                <label className="block text-sm font-semibold text-slate-700 mb-3">Additional Subjects (Slots 1-2 Dropdown, Slot 3 Custom)</label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Slot 1: Dropdown */}
                  <div>
                    <select
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-sm appearance-none bg-no-repeat bg-[right_1rem_center] bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22none%22%20viewBox%3D%220%200%2020%2020%22%3E%3Cpath%20stroke%3D%22%236b7280%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20stroke-width%3D%221.5%22%20d%3D%22m6%208%204%204%204-4%22%2F%3E%3C%2Fsvg%3E')]"
                      value={formData.extraSubjects[0]}
                      onChange={(e) => handleExtraSubjectChange(0, e.target.value)}
                    >
                      {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                    <p className="text-[10px] text-slate-400 mt-1 uppercase font-bold text-center">Subject slot 1</p>
                  </div>

                  {/* Slot 2: Dropdown */}
                  <div>
                    <select
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-sm appearance-none bg-no-repeat bg-[right_1rem_center] bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22none%22%20viewBox%3D%220%200%2020%2020%22%3E%3Cpath%20stroke%3D%22%236b7280%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20stroke-width%3D%221.5%22%20d%3D%22m6%208%204%204%204-4%22%2F%3E%3C%2Fsvg%3E')]"
                      value={formData.extraSubjects[1]}
                      onChange={(e) => handleExtraSubjectChange(1, e.target.value)}
                    >
                      {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                    <p className="text-[10px] text-slate-400 mt-1 uppercase font-bold text-center">Subject slot 2</p>
                  </div>

                  {/* Slot 3: Custom Input */}
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                      <Edit2 size={14} />
                    </div>
                    <input
                      type="text"
                      className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-sm shadow-sm"
                      placeholder="Type custom subject..."
                      value={formData.extraSubjects[2] === 'N/A' ? '' : formData.extraSubjects[2]}
                      onChange={(e) => handleExtraSubjectChange(2, e.target.value || 'N/A')}
                    />
                    <p className="text-[10px] text-slate-400 mt-1 uppercase font-bold text-center">Subject slot 3 (Custom)</p>
                  </div>
                </div>
              </div>

              {/* Multiple Grades */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="block text-sm font-semibold text-slate-700 flex items-center gap-2">
                    <Layers size={16} />
                    Grade Levels <span className="text-red-500">*</span>
                  </label>
                  <span className="text-[10px] text-slate-400">Select all that apply</span>
                </div>
                <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-12 gap-2">
                  {GRADES.map(grade => (
                    <button
                      key={grade}
                      type="button"
                      onClick={() => handleGradeToggle(grade)}
                      className={`py-2 text-center rounded-lg border text-sm font-bold transition-all shadow-sm ${
                        formData.gradeLevels.includes(grade)
                          ? 'bg-indigo-600 border-indigo-600 text-white'
                          : 'bg-white border-slate-200 text-slate-600 hover:border-indigo-300'
                      }`}
                    >
                      {grade}
                    </button>
                  ))}
                </div>
                {errors.gradeLevels && <p className="mt-2 text-xs text-red-500 font-medium">{errors.gradeLevels}</p>}
              </div>
            </div>

            {/* Additional Details */}
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Residential Home Address <span className="text-red-500">*</span></label>
                <textarea
                  className={`w-full px-4 py-3 rounded-xl border ${errors.address ? 'border-red-300 bg-red-50' : 'border-slate-200'} focus:ring-2 focus:ring-indigo-500 outline-none transition-all resize-none shadow-sm`}
                  rows={3}
                  placeholder="Street No, Area, City"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                />
                {errors.address && <p className="mt-1 text-xs text-red-500 font-medium">{errors.address}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Administrative & Training Notes</label>
                <textarea
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all resize-none shadow-sm"
                  rows={4}
                  placeholder="Experience, special training, awards, etc."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4 pt-4 border-t border-slate-100">
              <button
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-10 py-4 rounded-xl shadow-lg transition-all active:scale-[0.98] disabled:opacity-70"
              >
                {loading ? (
                  <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <>
                    <Save size={20} />
                    {isEdit ? 'Update Profile' : 'Register Teacher'}
                  </>
                )}
              </button>
              
              {!isEdit && (
                <button
                  type="button"
                  onClick={clearForm}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-8 py-4 rounded-xl transition-all active:scale-[0.98]"
                >
                  <XCircle size={20} />
                  Clear
                </button>
              )}

              <button
                type="button"
                onClick={() => navigate('/teachers')}
                className="w-full sm:w-auto ml-0 sm:ml-auto flex items-center justify-center gap-2 text-slate-500 hover:text-slate-800 font-semibold px-4 py-2 transition-all"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TeacherForm;
