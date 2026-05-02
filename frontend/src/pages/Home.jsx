// src/pages/Home.jsx
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { 
  FileText, LayoutDashboard, LayoutTemplate, 
  MousePointerClick, Download, Zap, Sparkles 
} from 'lucide-react';

export default function HomePage() {
  const { user } = useAuth();

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  const features = [
    {
      icon: <LayoutTemplate className="w-6 h-6 text-indigo-500" />,
      title: "Beautiful Templates",
      description: "Choose from a variety of professionally designed templates that stand out."
    },
    {
      icon: <MousePointerClick className="w-6 h-6 text-purple-500" />,
      title: "Drag & Drop Editor",
      description: "Easily reorder sections and customize your resume layout with a simple drag."
    },
    {
      icon: <Zap className="w-6 h-6 text-yellow-500" />,
      title: "Real-time Preview",
      description: "See your changes instantly as you type with our side-by-side live preview."
    },
    {
      icon: <Download className="w-6 h-6 text-emerald-500" />,
      title: "Export to PDF",
      description: "Download your pixel-perfect resume as a PDF with a single click."
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 font-sans overflow-x-hidden selection:bg-indigo-500/30">
      
      {/* Decorative background blurs */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-400/20 dark:bg-indigo-600/20 blur-[120px] pointer-events-none" />
      <div className="absolute top-[20%] right-[-10%] w-[40%] h-[40%] rounded-full bg-purple-400/20 dark:bg-purple-600/20 blur-[120px] pointer-events-none" />

      {/* Navbar */}
      <nav className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">
              Resumify
            </span>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-4"
          >
            {user ? (
              <Link 
                to="/dashboard"
                className="flex items-center gap-2 px-5 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-indigo-500 dark:hover:border-indigo-500 rounded-xl font-semibold shadow-sm transition-all text-indigo-600 dark:text-indigo-400 hover:shadow-md"
              >
                <LayoutDashboard className="w-4 h-4" />
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link 
                  to="/login"
                  className="hidden sm:inline-block px-4 py-2 font-semibold text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  Log in
                </Link>
                <Link 
                  to="/signup"
                  className="px-5 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-bold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all"
                >
                  Sign up free
                </Link>
              </>
            )}
          </motion.div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 pt-20 pb-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          
          {/* Hero Content */}
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="max-w-2xl"
          >
            <motion.div variants={fadeIn} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-100 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400 text-sm font-semibold mb-6">
              <Sparkles className="w-4 h-4" />
              <span>The #1 AI-powered resume builder</span>
            </motion.div>
            
            <motion.h1 variants={fadeIn} className="text-5xl lg:text-7xl font-extrabold tracking-tight mb-6 leading-[1.1]">
              Land your dream job with a <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">winning resume</span>
            </motion.h1>
            
            <motion.p variants={fadeIn} className="text-lg sm:text-xl text-slate-600 dark:text-slate-400 mb-8 max-w-lg leading-relaxed">
              Create a professional, beautifully formatted resume in minutes. Choose a template, fill in your details, and export to PDF instantly.
            </motion.p>
            
            <motion.div variants={fadeIn} className="flex flex-col sm:flex-row gap-4">
              <Link 
                to={user ? "/dashboard" : "/signup"}
                className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-2xl font-bold shadow-xl shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:-translate-y-1 transition-all text-center text-lg flex items-center justify-center gap-2"
              >
                Build My Resume
              </Link>
              {!user && (
                <Link 
                  to="/login"
                  className="px-8 py-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-2xl font-bold transition-all text-center text-lg flex items-center justify-center"
                >
                  Log in
                </Link>
              )}
            </motion.div>
          </motion.div>

          {/* Hero Visual */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, rotate: -2 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 0.8, type: "spring" }}
            className="relative lg:h-[600px] flex items-center justify-center"
          >
            {/* Abstract resume representation */}
            <div className="relative w-full max-w-md aspect-[1/1.4] bg-white dark:bg-slate-800 rounded-2xl shadow-2xl shadow-indigo-500/20 border border-slate-100 dark:border-slate-700 p-8 flex flex-col gap-6 transform rotate-2 hover:rotate-0 transition-transform duration-500">
              {/* Header */}
              <div className="flex gap-4 items-center pb-6 border-b border-slate-100 dark:border-slate-700">
                <div className="w-16 h-16 rounded-full bg-slate-200 dark:bg-slate-700 animate-pulse" />
                <div className="space-y-2 flex-1">
                  <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4 animate-pulse" />
                  <div className="h-3 bg-indigo-100 dark:bg-indigo-900/50 rounded w-1/2 animate-pulse" />
                </div>
              </div>
              {/* Body */}
              <div className="space-y-4">
                <div className="h-3 bg-slate-100 dark:bg-slate-700/50 rounded w-1/4 mb-2" />
                <div className="h-2 bg-slate-100 dark:bg-slate-700/50 rounded w-full" />
                <div className="h-2 bg-slate-100 dark:bg-slate-700/50 rounded w-5/6" />
                <div className="h-2 bg-slate-100 dark:bg-slate-700/50 rounded w-full" />
              </div>
              <div className="space-y-4 pt-4">
                <div className="h-3 bg-slate-100 dark:bg-slate-700/50 rounded w-1/3 mb-2" />
                <div className="h-12 bg-slate-50 dark:bg-slate-700/30 rounded w-full border border-slate-100 dark:border-slate-700/50" />
                <div className="h-12 bg-slate-50 dark:bg-slate-700/30 rounded w-full border border-slate-100 dark:border-slate-700/50" />
              </div>
              
              {/* Floating element */}
              <motion.div 
                animate={{ y: [0, -10, 0] }} 
                transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                className="absolute -right-8 -bottom-8 bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700 flex items-center gap-3"
              >
                <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center">
                  <Download className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                  <div className="text-sm font-bold">PDF Ready</div>
                  <div className="text-xs text-slate-500">1 click export</div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 py-24 bg-white dark:bg-slate-800/50 border-y border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Everything you need to create a standout resume</h2>
            <p className="text-lg text-slate-600 dark:text-slate-400">
              Our intuitive builder takes the hassle out of formatting, leaving you free to focus on your content.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-slate-50 dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 hover:shadow-xl hover:-translate-y-1 transition-all"
              >
                <div className="w-12 h-12 rounded-xl bg-white dark:bg-slate-700 shadow-sm flex items-center justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-slate-600 dark:text-slate-400">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 py-12 text-center text-slate-500 dark:text-slate-400">
        <div className="flex items-center justify-center gap-2 mb-4">
          <FileText className="w-5 h-5 text-indigo-500" />
          <span className="font-bold text-slate-900 dark:text-white">Resumify</span>
        </div>
        <p className="mb-2">© {new Date().getFullYear()} Resumify. All rights reserved.</p>
        <p className="text-sm font-medium flex items-center justify-center gap-1">
          Made by Vaishali with <span className="text-red-500 animate-pulse">❤️</span>
        </p>
      </footer>

    </div>
  );
}
