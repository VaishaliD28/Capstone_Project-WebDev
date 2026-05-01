import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useStore from '../store/useStore';
import { Plus, Edit2, Trash2, FileText, Settings, LayoutDashboard, User } from 'lucide-react';
import { motion } from 'framer-motion';

const SidebarItem = ({ icon: Icon, label, active }) => (
  <button className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${active ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-medium' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'}`}>
    <Icon className="h-5 w-5" />
    <span>{label}</span>
  </button>
);

const Dashboard = () => {
  const { resumes, fetchResumes, createResume, deleteResume, user } = useStore();
  const [isCreating, setIsCreating] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchResumes();
  }, [fetchResumes]);

  const handleCreate = async () => {
    setIsCreating(true);
    try {
      const newResume = await createResume({ title: 'New Resume' });
      navigate(`/builder/${newResume.id}`);
    } catch (err) {
      console.error(err);
    } finally {
      setIsCreating(false);
    }
  };

  const handleDelete = async (id, e) => {
    e.preventDefault();
    if (window.confirm('Are you sure you want to delete this resume?')) {
      await deleteResume(id);
    }
  };

  return (
    <div className="flex h-[calc(100vh-4rem)] max-w-7xl mx-auto">
      {/* Sidebar */}
      <div className="w-64 border-r border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm p-6 hidden md:block">
        <div className="flex items-center space-x-3 mb-10">
          <div className="h-10 w-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white truncate max-w-[150px]">{user?.name}</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">Pro Plan</p>
          </div>
        </div>

        <nav className="space-y-2">
          <SidebarItem icon={LayoutDashboard} label="Dashboard" active={true} />
          <SidebarItem icon={FileText} label="Templates" active={false} />
          <SidebarItem icon={User} label="Profile" active={false} />
          <SidebarItem icon={Settings} label="Settings" active={false} />
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 px-4 sm:px-8 py-8 overflow-y-auto">
        <div className="flex justify-between items-center mb-8 bg-white/70 dark:bg-gray-800/70 backdrop-blur-md p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Resumes</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">Manage and create professional resumes</p>
          </div>
          <button
            onClick={handleCreate}
            disabled={isCreating}
            className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg shadow-md font-medium transition-all disabled:opacity-50 transform hover:-translate-y-0.5"
          >
            <Plus className="h-5 w-5" />
            <span>{isCreating ? 'Creating...' : 'Create New'}</span>
          </button>
        </div>

        {resumes.length === 0 ? (
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-16 text-center">
            <div className="bg-blue-50 dark:bg-blue-900/20 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
              <FileText className="h-10 w-10 text-blue-500" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">No resumes yet</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-sm mx-auto">Create your first professional resume using one of our 5 premium templates to get started.</p>
            <button
              onClick={handleCreate}
              className="text-white bg-gray-900 dark:bg-gray-700 hover:bg-gray-800 dark:hover:bg-gray-600 px-6 py-2.5 rounded-lg font-medium transition-colors"
            >
              Start Building
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {resumes.map((resume, index) => (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                key={resume.id}
              >
                <Link 
                  to={`/builder/${resume.id}`}
                  className="block group bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl shadow-sm hover:shadow-xl border border-gray-100 dark:border-gray-700 transition-all overflow-hidden h-full flex flex-col relative"
                >
                  <div className="bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 aspect-[1/1.2] w-full p-4 flex items-center justify-center border-b border-gray-100 dark:border-gray-600 relative overflow-hidden">
                    <FileText className="h-16 w-16 text-gray-300 dark:text-gray-500 group-hover:scale-110 transition-transform duration-300 drop-shadow-md" />
                    <div className="absolute inset-0 bg-blue-600/0 group-hover:bg-blue-600/5 transition-colors" />
                    <div className="absolute top-3 right-3 bg-white dark:bg-gray-800 px-2 py-1 rounded text-xs font-semibold text-gray-600 dark:text-gray-300 shadow-sm capitalize border border-gray-100 dark:border-gray-700">
                      {resume.template}
                    </div>
                  </div>
                  <div className="p-5 flex-grow flex flex-col justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white truncate">{resume.title}</h3>
                      <p className="text-xs text-gray-400 dark:text-gray-500 mt-1 flex items-center">
                        Last updated: {new Date(resume.updatedAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex justify-between items-center mt-5 pt-4 border-t border-gray-100 dark:border-gray-700">
                      <span className="text-blue-600 dark:text-blue-400 text-sm font-semibold flex items-center group-hover:underline">
                        <Edit2 className="h-4 w-4 mr-1.5" /> Edit Resume
                      </span>
                      <button 
                        onClick={(e) => handleDelete(resume.id, e)}
                        className="text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 p-2 rounded-md transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
