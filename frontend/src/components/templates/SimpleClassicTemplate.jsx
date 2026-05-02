import React from 'react';

export default function SimpleClassicTemplate({ formData, sectionOrder, themeColor, skillsStyle = 'text' }) {
  const sections = {
    summary: formData.summary && (
      <div key="summary" className="mt-6">
        <h3 className="uppercase text-md font-bold mb-2 text-center" style={{ color: themeColor }}>
          Professional Summary
        </h3>
        <p className="whitespace-pre-wrap text-sm leading-relaxed">{formData.summary}</p>
      </div>
    ),
    experience: formData.experience && (
      <div key="experience" className="mt-6">
        <h3 className="uppercase text-md font-bold mb-2 text-center" style={{ color: themeColor }}>
          Work Experience
        </h3>
        <p className="whitespace-pre-wrap text-sm leading-relaxed">{formData.experience}</p>
      </div>
    ),
    education: formData.education && (
      <div key="education" className="mt-6">
        <h3 className="uppercase text-md font-bold mb-2 text-center" style={{ color: themeColor }}>
          Education
        </h3>
        <p className="whitespace-pre-wrap text-sm leading-relaxed">{formData.education}</p>
      </div>
    ),
    skills: formData.skills && (
      <div key="skills" className="mt-6">
        <h3 className="uppercase text-md font-bold mb-3 text-center" style={{ color: themeColor }}>
          Skills
        </h3>
        {skillsStyle === 'tags' ? (
          <div className="flex flex-wrap gap-2 justify-center">
            {formData.skills.split(',').map((s, i) => s.trim() && (
              <span key={i} className="px-3 py-1 rounded-sm text-xs font-semibold text-white" style={{ backgroundColor: themeColor }}>
                {s.trim()}
              </span>
            ))}
          </div>
        ) : skillsStyle === 'bars' ? (
          <div className="grid grid-cols-2 gap-x-8 gap-y-3 mt-4">
            {formData.skills.split(',').map((s, i) => s.trim() && (
              <div key={i}>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span>{s.trim()}</span>
                </div>
                <div className="h-1.5 w-full bg-gray-200 overflow-hidden">
                  <div className="h-full" style={{ width: `${(Math.sin(i + s.length) * 20) + 75}%`, backgroundColor: themeColor }} />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="whitespace-pre-wrap text-sm leading-relaxed text-center">{formData.skills}</p>
        )}
      </div>
    )
  };

  return (
    <div className="bg-[#fffdf8] text-gray-900 h-full p-10 font-serif border-4 border-double m-2" style={{ borderColor: themeColor }}>
      <div className="text-center mb-8 border-b-2 pb-6" style={{ borderColor: themeColor }}>
        <h1 className="text-4xl font-bold mb-2 text-gray-900">
          {formData.fullName || 'Your Name'}
        </h1>
        <div className="flex justify-center gap-4 text-sm text-gray-700 font-sans uppercase tracking-widest flex-wrap mt-4">
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
