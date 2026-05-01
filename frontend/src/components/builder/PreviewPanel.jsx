import React, { forwardRef } from 'react';
import useStore from '../../store/useStore';
import ModernTemplate from '../templates/ModernTemplate';
import MinimalTemplate from '../templates/MinimalTemplate';
import ProfessionalTemplate from '../templates/ProfessionalTemplate';
import CreativeTemplate from '../templates/CreativeTemplate';
import ExecutiveTemplate from '../templates/ExecutiveTemplate';

const PreviewPanel = forwardRef((props, ref) => {
  const { currentResume } = useStore();

  const renderTemplate = () => {
    switch (currentResume?.template) {
      case 'minimal':
        return <MinimalTemplate data={currentResume} />;
      case 'professional':
        return <ProfessionalTemplate data={currentResume} />;
      case 'creative':
        return <CreativeTemplate data={currentResume} />;
      case 'executive':
        return <ExecutiveTemplate data={currentResume} />;
      case 'modern':
      default:
        return <ModernTemplate data={currentResume} />;
    }
  };

  return (
    <div 
      ref={ref} 
      className="resume-page overflow-hidden transform origin-top"
      style={{ fontFamily: currentResume?.font || 'Inter, sans-serif' }}
    >
      {renderTemplate()}
    </div>
  );
});

PreviewPanel.displayName = 'PreviewPanel';
export default PreviewPanel;
