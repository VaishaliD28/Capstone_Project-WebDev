import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { resumeAPI } from '../services/api';
import { useTheme } from '../context/ThemeContext';
import { Reorder } from 'framer-motion';
import { useReactToPrint } from 'react-to-print';
import { Printer, Save, ArrowLeft, GripVertical, Moon, Sun } from 'lucide-react';

import SimpleModernTemplate from '../components/templates/SimpleModernTemplate';
import SimpleClassicTemplate from '../components/templates/SimpleClassicTemplate';
import SimpleMinimalTemplate from '../components/templates/SimpleMinimalTemplate';

const TEMPLATES = ['modern', 'classic', 'minimal'];
const SECTION_LABELS = {
  summary: 'Professional Summary',
  experience: 'Work Experience',
  education: 'Education',
  skills: 'Skills',
};

export default function BuilderPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [saveMsg, setSaveMsg] = useState('');

  // Form state
  const [title, setTitle] = useState('');
  const [template, setTemplate] = useState('modern');
  const [themeColor, setThemeColor] = useState('#6366f1');
  const [sectionOrder, setSectionOrder] = useState(['summary', 'experience', 'education', 'skills']);
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    location: '',
    summary: '',
    experience: '',
    education: '',
    skills: '',
  });

  // Export to PDF
  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    contentRef: componentRef,
    documentTitle: title || 'Resume',
  });

  // Load resume
  useEffect(() => {
    resumeAPI.get(id)
      .then(({ resume }) => {
        setResume(resume);
        setTitle(resume.title);
        setTemplate(resume.template);
        if (resume.data.themeColor) setThemeColor(resume.data.themeColor);
        if (resume.data.sectionOrder) setSectionOrder(resume.data.sectionOrder);
        setFormData({ ...formData, ...resume.data });
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  const handleSave = async () => {
    setSaving(true);
    setError('');
    setSaveMsg('');
    try {
      const dataToSave = { ...formData, themeColor, sectionOrder };
      await resumeAPI.update(id, { title, template, data: dataToSave });
      setSaveMsg('✅ Saved!');
      setTimeout(() => setSaveMsg(''), 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleField = (key) => (e) =>
    setFormData((prev) => ({ ...prev, [key]: e.target.value }));

  if (loading) return <div className="flex h-screen items-center justify-center dark:bg-gray-900 dark:text-white">Loading resume…</div>;
  if (error && !resume) return (
    <div className="flex flex-col h-screen items-center justify-center dark:bg-gray-900 dark:text-white">
      <p className="text-red-500 mb-4">{error}</p>
      <button onClick={() => navigate('/dashboard')} className="px-4 py-2 border rounded hover:bg-gray-100 dark:hover:bg-gray-800">Back to Dashboard</button>
    </div>
  );

  const TemplateComponent = 
    template === 'classic' ? SimpleClassicTemplate :
    template === 'minimal' ? SimpleMinimalTemplate : 
    SimpleModernTemplate;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-gray-900 transition-colors">
      {/* Top bar */}
      <div className="flex items-center gap-3 px-6 py-3 bg-white dark:bg-gray-800 shadow-sm border-b dark:border-gray-700 transition-colors">
        <button onClick={() => navigate('/dashboard')} className="p-2 border rounded-md hover:bg-gray-50 dark:border-gray-600 dark:text-white dark:hover:bg-gray-700">
          <ArrowLeft size={18} />
        </button>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="flex-1 px-3 py-2 border rounded-md font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white transition-colors"
          placeholder="Resume title"
        />
        <div className="flex items-center gap-3">
          <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 transition-colors">
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          
          <button onClick={handlePrint} className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 transition-colors">
            <Printer size={16} /> Export PDF
          </button>
          
          <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-md font-bold hover:bg-indigo-700 disabled:opacity-50 transition-colors">
            <Save size={16} /> {saving ? 'Saving…' : 'Save'}
          </button>
          {saveMsg && <span className="text-green-600 text-sm">{saveMsg}</span>}
          {error && <span className="text-red-500 text-sm">{error}</span>}
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Left: Form */}
        <div className="w-[400px] p-6 overflow-y-auto bg-white dark:bg-gray-800 border-r dark:border-gray-700 transition-colors">
          <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-3">Template & Theme</h3>
          
          <div className="mb-4">
            <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-200">Select Template</label>
            <div className="flex gap-2 flex-wrap mb-4">
              {TEMPLATES.map((t) => (
                <button
                  key={t}
                  onClick={() => setTemplate(t)}
                  className={`px-3 py-1.5 border rounded-md text-sm capitalize transition-colors ${
                    template === t 
                      ? 'bg-indigo-600 text-white border-indigo-600' 
                      : 'bg-transparent text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
            
            <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-200">Accent Color</label>
            <div className="flex items-center gap-3">
              <input 
                type="color" 
                value={themeColor} 
                onChange={(e) => setThemeColor(e.target.value)}
                className="w-10 h-10 rounded cursor-pointer border-0 p-0"
              />
              <span className="text-sm font-mono text-gray-500 dark:text-gray-400">{themeColor}</span>
            </div>
          </div>

          <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-3 mt-8">Personal Info</h3>
          <div className="space-y-4">
            {[
              ['fullName', 'Full Name', 'text'],
              ['email', 'Email', 'email'],
              ['phone', 'Phone', 'tel'],
              ['location', 'Location', 'text'],
            ].map(([key, label, type]) => (
              <label key={key} className="block text-sm font-semibold text-gray-700 dark:text-gray-200">
                {label}
                <input
                  type={type}
                  value={formData[key]}
                  onChange={handleField(key)}
                  className="mt-1 block w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white transition-colors"
                />
              </label>
            ))}
          </div>

          <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-3 mt-8">Drag to Reorder Sections</h3>
          <Reorder.Group axis="y" values={sectionOrder} onReorder={setSectionOrder} className="space-y-4">
            {sectionOrder.map((key) => (
              <Reorder.Item key={key} value={key} className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg border border-gray-200 dark:border-gray-600 transition-colors">
                <div className="flex items-center mb-2 text-gray-700 dark:text-gray-200 cursor-grab active:cursor-grabbing">
                  <GripVertical size={16} className="mr-2 text-gray-400" />
                  <span className="font-semibold text-sm">{SECTION_LABELS[key]}</span>
                </div>
                <textarea
                  value={formData[key]}
                  onChange={handleField(key)}
                  rows={4}
                  className="block w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white transition-colors resize-y"
                  placeholder={`Enter your ${SECTION_LABELS[key].toLowerCase()} here...`}
                />
              </Reorder.Item>
            ))}
          </Reorder.Group>
        </div>

        {/* Right: Live Preview */}
        <div className="flex-1 p-8 overflow-y-auto bg-gray-100 dark:bg-gray-900 transition-colors flex justify-center">
          <div className="shadow-xl" style={{ width: '210mm', minHeight: '297mm' }}>
            {/* The Print ref is attached to this inner container so we can style the print independently if needed */}
            <div ref={componentRef} className="h-full bg-white print:m-0 print:shadow-none" style={{ width: '210mm', minHeight: '297mm' }}>
               <TemplateComponent 
                 formData={formData} 
                 sectionOrder={sectionOrder} 
                 themeColor={themeColor} 
               />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
