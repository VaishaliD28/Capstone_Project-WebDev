// src/components/ResumeAnalyzerSidebar.jsx
import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, UploadCloud, FileText, Loader2, Target, 
  Briefcase, AlertCircle, CheckCircle2, ChevronDown, ChevronUp 
} from 'lucide-react';
import { analyzeResumeMock } from '../services/analysisService';

export default function ResumeAnalyzerSidebar({ isOpen, onClose }) {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState('idle'); // idle | analyzing | results
  const [results, setResults] = useState(null);
  const [expandedRole, setExpandedRole] = useState(null);
  const fileInputRef = useRef(null);

  // Reset state when sidebar closes
  React.useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        setFile(null);
        setStatus('idle');
        setResults(null);
        setExpandedRole(null);
      }, 300); // wait for exit animation
    }
  }, [isOpen]);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleAnalyze = async () => {
    if (!file) return;
    setStatus('analyzing');
    try {
      const data = await analyzeResumeMock(file);
      setResults(data);
      setStatus('results');
    } catch (error) {
      console.error("Analysis failed:", error);
      setStatus('idle');
      // In a real app, handle error state here
    }
  };

  const toggleRoleDetails = (roleName) => {
    setExpandedRole(expandedRole === roleName ? null : roleName);
  };

  // Animation variants
  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  };

  const sidebarVariants = {
    hidden: { x: '100%' },
    visible: { 
      x: 0,
      transition: { type: 'spring', damping: 25, stiffness: 200 }
    },
    exit: { 
      x: '100%',
      transition: { type: 'tween', duration: 0.3 }
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50"
          />

          {/* Sidebar */}
          <motion.div
            variants={sidebarVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed top-0 right-0 h-full w-full max-w-md bg-white dark:bg-slate-900 shadow-2xl z-50 flex flex-col border-l border-slate-200 dark:border-slate-800"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
                  <Target className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white">AI Career Guide</h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Analyze your resume</p>
                </div>
              </div>
              <button 
                onClick={onClose}
                className="p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-300 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 scrollbar-hide">
              
              {/* State: Upload */}
              {status === 'idle' && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="text-center">
                    <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-100 mb-2">
                      Upload your resume
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Our AI will analyze your skills and recommend the best job roles for you.
                    </p>
                  </div>

                  <div 
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                    className="mt-6 relative border-2 border-dashed border-indigo-200 dark:border-indigo-900/50 rounded-3xl p-10 flex flex-col items-center justify-center bg-indigo-50/50 dark:bg-indigo-900/10 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors cursor-pointer group"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <input 
                      type="file" 
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      accept=".pdf,.doc,.docx"
                      className="hidden"
                    />
                    
                    {file ? (
                      <div className="flex flex-col items-center text-center">
                        <div className="w-16 h-16 bg-white dark:bg-slate-800 rounded-2xl shadow-sm flex items-center justify-center mb-4">
                          <FileText className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
                        </div>
                        <p className="font-medium text-slate-800 dark:text-slate-200 truncate w-48">{file.name}</p>
                        <p className="text-xs text-slate-500 mt-1">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                      </div>
                    ) : (
                      <>
                        <div className="w-16 h-16 bg-white dark:bg-slate-800 rounded-2xl shadow-sm flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                          <UploadCloud className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
                        </div>
                        <p className="font-medium text-slate-800 dark:text-slate-200">Click or drag file to upload</p>
                        <p className="text-xs text-slate-500 mt-1">PDF, DOCX up to 5MB</p>
                      </>
                    )}
                  </div>

                  <button
                    onClick={handleAnalyze}
                    disabled={!file}
                    className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-2xl font-semibold shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 transition-all transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none mt-6"
                  >
                    Analyze Resume
                  </button>
                </div>
              )}

              {/* State: Analyzing */}
              {status === 'analyzing' && (
                <div className="h-full flex flex-col items-center justify-center space-y-6 animate-in fade-in duration-500">
                  <div className="relative w-24 h-24">
                    <div className="absolute inset-0 bg-indigo-200 dark:bg-indigo-900/50 rounded-full animate-ping opacity-75"></div>
                    <div className="relative bg-white dark:bg-slate-800 w-full h-full rounded-full shadow-xl flex items-center justify-center z-10 border border-slate-100 dark:border-slate-700">
                      <Loader2 className="w-10 h-10 text-indigo-600 dark:text-indigo-400 animate-spin" />
                    </div>
                  </div>
                  <div className="text-center">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">Scanning Context...</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 max-w-[250px]">
                      Our AI is evaluating your experience, skills, and extracting key highlights.
                    </p>
                  </div>
                </div>
              )}

              {/* State: Results */}
              {status === 'results' && results && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  
                  {/* Primary Match */}
                  <div className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-3xl p-6 text-white shadow-xl shadow-indigo-500/20">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <p className="text-indigo-100 text-sm font-medium mb-1">Best Fit Role</p>
                        <h3 className="text-2xl font-bold">{results.primaryRole}</h3>
                      </div>
                      <div className="flex flex-col items-end">
                        <span className="text-3xl font-extrabold">{results.matchScore}%</span>
                        <span className="text-indigo-200 text-xs">Match Score</span>
                      </div>
                    </div>
                    
                    <div className="mt-4 pt-4 border-t border-white/20">
                      <p className="text-sm font-medium mb-3 flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                        Top Matched Skills
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {results.currentSkills.map((skill, i) => (
                          <span key={i} className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-lg text-xs font-medium">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Alternative Roles */}
                  <div>
                    <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider mb-4 flex items-center gap-2">
                      <Briefcase className="w-4 h-4" />
                      Explore Other Roles
                    </h4>
                    
                    <div className="space-y-4">
                      {results.alternativeRoles.map((role, idx) => (
                        <div 
                          key={idx} 
                          className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden transition-all duration-300 hover:border-indigo-300 dark:hover:border-indigo-500/50 shadow-sm"
                        >
                          <button 
                            onClick={() => toggleRoleDetails(role.role)}
                            className="w-full p-5 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/50"
                          >
                            <div className="flex items-center gap-4">
                              <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-sm ${
                                role.matchScore > 65 ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' :
                                role.matchScore > 50 ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' :
                                'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400'
                              }`}>
                                {role.matchScore}%
                              </div>
                              <div className="text-left">
                                <h5 className="font-semibold text-slate-900 dark:text-white">{role.role}</h5>
                                <p className="text-xs text-slate-500 dark:text-slate-400">Click to see skill gaps</p>
                              </div>
                            </div>
                            {expandedRole === role.role ? (
                              <ChevronUp className="w-5 h-5 text-slate-400" />
                            ) : (
                              <ChevronDown className="w-5 h-5 text-slate-400" />
                            )}
                          </button>

                          <AnimatePresence>
                            {expandedRole === role.role && (
                              <motion.div 
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="border-t border-slate-100 dark:border-slate-700"
                              >
                                <div className="p-5 space-y-5">
                                  
                                  {/* Missing Skills */}
                                  <div>
                                    <h6 className="text-sm font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2 mb-3">
                                      <AlertCircle className="w-4 h-4 text-rose-500" />
                                      Missing Core Skills
                                    </h6>
                                    <div className="flex flex-wrap gap-2">
                                      {role.missingSkills.map((skill, i) => (
                                        <span key={i} className="px-3 py-1 bg-rose-50 text-rose-600 dark:bg-rose-900/20 dark:text-rose-400 border border-rose-100 dark:border-rose-800/50 rounded-lg text-xs font-medium">
                                          {skill}
                                        </span>
                                      ))}
                                    </div>
                                  </div>

                                  {/* Improvements */}
                                  <div>
                                    <h6 className="text-sm font-semibold text-slate-800 dark:text-slate-200 mb-3">
                                      Suggested Improvements
                                    </h6>
                                    <ul className="space-y-2">
                                      {role.improvements.map((imp, i) => (
                                        <li key={i} className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-400">
                                          <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 shrink-0" />
                                          {imp}
                                        </li>
                                      ))}
                                    </ul>
                                  </div>

                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setStatus('idle');
                      setFile(null);
                      setResults(null);
                    }}
                    className="w-full py-3 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl font-medium transition-colors mt-6"
                  >
                    Analyze Another Resume
                  </button>

                </div>
              )}

            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
