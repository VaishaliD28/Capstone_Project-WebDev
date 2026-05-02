import React from 'react';

export default function SimpleModernTemplate({ formData, sectionOrder, themeColor }) {
  const sections = {
    summary: formData.summary && (
      <div key="summary" className="mt-6">
        <h3 className="uppercase text-sm tracking-wider font-bold mb-2 pb-1 border-b-2" style={{ color: themeColor, borderColor: themeColor }}>
          Professional Summary
        </h3>
        <p className="whitespace-pre-wrap text-sm leading-relaxed">{formData.summary}</p>
      </div>
    ),
    experience: formData.experience && (
      <div key="experience" className="mt-6">
        <h3 className="uppercase text-sm tracking-wider font-bold mb-2 pb-1 border-b-2" style={{ color: themeColor, borderColor: themeColor }}>
          Work Experience
        </h3>
        <p className="whitespace-pre-wrap text-sm leading-relaxed">{formData.experience}</p>
      </div>
    ),
    education: formData.education && (
      <div key="education" className="mt-6">
        <h3 className="uppercase text-sm tracking-wider font-bold mb-2 pb-1 border-b-2" style={{ color: themeColor, borderColor: themeColor }}>
          Education
        </h3>
        <p className="whitespace-pre-wrap text-sm leading-relaxed">{formData.education}</p>
      </div>
    ),
    skills: formData.skills && (
      <div key="skills" className="mt-6">
        <h3 className="uppercase text-sm tracking-wider font-bold mb-2 pb-1 border-b-2" style={{ color: themeColor, borderColor: themeColor }}>
          Skills
        </h3>
        <p className="whitespace-pre-wrap text-sm leading-relaxed">{formData.skills}</p>
      </div>
    )
  };

  return (
    <div className="bg-white text-gray-900 h-full p-8 font-sans">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-extrabold mb-2" style={{ color: themeColor }}>
          {formData.fullName || 'Your Name'}
        </h1>
        <div className="flex justify-center gap-4 text-sm text-gray-600 flex-wrap">
          {formData.email && <span>{formData.email}</span>}
          {formData.phone && <span>{formData.phone}</span>}
          {formData.location && <span>{formData.location}</span>}
        </div>
      </div>
      <div>
        {sectionOrder.map(key => sections[key])}
      </div>
    </div>
  );
}
