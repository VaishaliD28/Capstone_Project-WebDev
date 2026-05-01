import React, { useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useStore from '../store/useStore';
import FormPanel from '../components/builder/FormPanel';
import PreviewPanel from '../components/builder/PreviewPanel';
import { Download, Save, ArrowLeft } from 'lucide-react';
import html2pdf from 'html2pdf.js';

const Builder = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentResume, fetchResume, updateResume, loading } = useStore();
  const previewRef = useRef();

  useEffect(() => {
    fetchResume(id);
  }, [id, fetchResume]);

  const handleSave = async () => {
    if (currentResume) {
      await updateResume(id, currentResume);
      alert('Saved successfully!');
    }
  };

  const handleExportPDF = () => {
    const element = previewRef.current;
    if (!element) return;
    
    const opt = {
      margin: 0,
      filename: `${currentResume?.title || 'resume'}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };
    
    html2pdf().set(opt).from(element).save();
  };

  if (loading || !currentResume) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] bg-gray-50 dark:bg-gray-900">
      {/* Builder Toolbar */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 p-4 flex justify-between items-center z-10">
        <div className="flex items-center space-x-4">
          <button 
            onClick={() => navigate('/dashboard')}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full text-gray-600 dark:text-gray-300 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <input 
            type="text" 
            value={currentResume.title || ''} 
            onChange={(e) => useStore.getState().updateCurrentResumeLocal({ title: e.target.value })}
            className="text-lg font-bold bg-transparent border-none focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-2 text-gray-900 dark:text-white"
          />
        </div>
        <div className="flex items-center space-x-3">
          <button 
            onClick={handleSave}
            className="flex items-center space-x-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white rounded-md font-medium transition-colors"
          >
            <Save className="h-4 w-4" />
            <span>Save</span>
          </button>
          <button 
            onClick={handleExportPDF}
            className="flex items-center space-x-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium transition-colors"
          >
            <Download className="h-4 w-4" />
            <span>Download PDF</span>
          </button>
        </div>
      </div>

      {/* Editor Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Form Panel */}
        <div className="w-1/2 lg:w-2/5 xl:w-1/3 overflow-y-auto border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 custom-scrollbar">
          <FormPanel />
        </div>
        
        {/* Right Preview Panel */}
        <div className="w-1/2 lg:w-3/5 xl:w-2/3 overflow-y-auto bg-gray-100 dark:bg-gray-900 p-8 custom-scrollbar">
          <div className="flex justify-center min-h-full">
            <PreviewPanel ref={previewRef} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Builder;
