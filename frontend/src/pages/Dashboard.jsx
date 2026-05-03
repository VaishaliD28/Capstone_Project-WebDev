// src/pages/Dashboard.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { resumeAPI } from '../services/api';
import { motion } from 'framer-motion';
import { Plus, FileText, Trash2, Edit3, LogOut, LayoutDashboard, Clock, Sparkles } from 'lucide-react';
import ResumeAnalyzerSidebar from '../components/ResumeAnalyzerSidebar';

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [creating, setCreating] = useState(false);
  const [isAnalyzerOpen, setIsAnalyzerOpen] = useState(false);

  useEffect(() => {
    resumeAPI.list()
      .then(({ resumes }) => setResumes(resumes))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const handleCreate = async () => {
    setCreating(true);
    try {
      const { resume } = await resumeAPI.create('My Resume', 'modern', {});
      navigate(`/builder/${resume.id}`);
    } catch (err) {
      setError(err.message);
      setCreating(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this resume?')) return;
    try {
      await resumeAPI.delete(id);
      setResumes((prev) => prev.filter((r) => r.id !== id));
    } catch (err) {
      alert(err.message);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 text-slate-800 dark:text-slate-100 font-sans transition-colors duration-300">
      {/* Nav */}
      <nav className="sticky top-0 z-50 backdrop-blur-md bg-white/70 dark:bg-slate-900/70 border-b border-indigo-100 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-2"
            >
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
                <LayoutDashboard className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">
                Resumify
              </span>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-4"
            >
              <span className="hidden sm:inline-block text-sm font-medium text-slate-600 dark:text-slate-300">
                👋 {user?.name}
              </span>
              <button 
                onClick={logout} 
                className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 hover:text-indigo-600 transition-all dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-indigo-400 shadow-sm"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Sign out</span>
              </button>
            </motion.div>
          </div>
        </div>
      </nav>

      {/* Main */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4"
        >
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              My Resumes
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1">
              Manage and edit your professional resumes.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <button 
              onClick={() => setIsAnalyzerOpen(true)}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-white dark:bg-slate-800 border border-indigo-200 dark:border-indigo-500/30 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-xl font-semibold shadow-sm transition-all transform hover:-translate-y-0.5"
            >
              <Sparkles className="w-5 h-5" />
              Analyze Resume
            </button>
            <button 
              onClick={handleCreate} 
              disabled={creating} 
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl font-semibold shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 transition-all transform hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
            >
              {creating ? (
                <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}>
                  <Plus className="w-5 h-5" />
                </motion.div>
              ) : (
                <Plus className="w-5 h-5" />
              )}
              {creating ? 'Creating...' : 'New Resume'}
            </button>
          </div>
        </motion.div>

        {error && (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 p-4 rounded-xl mb-8 border border-red-100 dark:border-red-800">
            {error}
          </motion.div>
        )}

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <motion.div 
              animate={{ rotate: 360 }} 
              transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
              className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full mb-4"
            />
            <p className="text-slate-500 dark:text-slate-400 font-medium">Loading your resumes...</p>
          </div>
        ) : resumes.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-24 px-4 text-center bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm rounded-3xl border border-slate-200/50 dark:border-slate-700/50 border-dashed"
          >
            <div className="w-20 h-20 bg-indigo-100 dark:bg-indigo-900/50 rounded-2xl flex items-center justify-center mb-6 rotate-3">
              <FileText className="w-10 h-10 text-indigo-600 dark:text-indigo-400 -rotate-3" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No resumes yet</h3>
            <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-sm">
              Create your first professional resume today and land your dream job.
            </p>
            <button 
              onClick={handleCreate}
              className="px-6 py-3 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 dark:bg-indigo-900/30 dark:text-indigo-400 dark:hover:bg-indigo-900/50 rounded-xl font-semibold transition-colors"
            >
              Get Started
            </button>
          </motion.div>
        ) : (
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {resumes.map((resume) => (
              <motion.div 
                key={resume.id} 
                variants={itemVariants}
                whileHover={{ y: -5 }}
                className="group relative bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-xl hover:shadow-indigo-500/10 transition-all duration-300 flex flex-col h-full"
              >
                <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={() => handleDelete(resume.id)}
                    className="p-2 bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-900/50 rounded-lg transition-colors"
                    title="Delete Resume"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/40 dark:to-purple-900/40 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
                  <FileText className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                </div>
                
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 line-clamp-1">
                  {resume.title}
                </h3>
                
                <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-6">
                  <span className="px-2 py-1 bg-slate-100 dark:bg-slate-700 rounded-md font-medium capitalize">
                    {resume.template}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {new Date(resume.updated_at).toLocaleDateString()}
                  </span>
                </div>
                
                <div className="mt-auto">
                  <button
                    onClick={() => navigate(`/builder/${resume.id}`)}
                    className="w-full flex items-center justify-center gap-2 py-2.5 bg-slate-50 hover:bg-indigo-600 text-slate-700 hover:text-white dark:bg-slate-700/50 dark:hover:bg-indigo-500 dark:text-slate-300 dark:hover:text-white rounded-xl font-semibold transition-all"
                  >
                    <Edit3 className="w-4 h-4" />
                    Edit Resume
                  </button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </main>

      {/* Resume Analyzer Sidebar */}
      <ResumeAnalyzerSidebar 
        isOpen={isAnalyzerOpen} 
        onClose={() => setIsAnalyzerOpen(false)} 
      />
    </div>
  );
}
