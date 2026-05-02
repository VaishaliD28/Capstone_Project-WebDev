import React from 'react';

export default function SimpleMinimalTemplate({ formData, sectionOrder, themeColor, skillsStyle = 'text' }) {
  const sections = {
    summary: formData.summary && (
      <div key="summary" className="mt-4 flex">
        <h3 className="w-1/4 uppercase text-xs tracking-wider font-bold text-gray-500 pr-4 text-right pt-1">
          Profile
        </h3>
        <p className="w-3/4 whitespace-pre-wrap text-sm leading-relaxed">{formData.summary}</p>
      </div>
    ),
    experience: formData.experience && (
      <div key="experience" className="mt-4 flex">
        <h3 className="w-1/4 uppercase text-xs tracking-wider font-bold text-gray-500 pr-4 text-right pt-1">
          Experience
        </h3>
        <p className="w-3/4 whitespace-pre-wrap text-sm leading-relaxed">{formData.experience}</p>
      </div>
    ),
    education: formData.education && (
      <div key="education" className="mt-4 flex">
        <h3 className="w-1/4 uppercase text-xs tracking-wider font-bold text-gray-500 pr-4 text-right pt-1">
          Education
        </h3>
        <p className="w-3/4 whitespace-pre-wrap text-sm leading-relaxed">{formData.education}</p>
      </div>
    ),
    skills: formData.skills && (
      <div key="skills" className="mt-4 flex">
        <h3 className="w-1/4 uppercase text-xs tracking-wider font-bold text-gray-500 pr-4 text-right pt-1">
          Skills
        </h3>
        <div className="w-3/4">
          {skillsStyle === 'tags' ? (
            <div className="flex flex-wrap gap-2">
              {formData.skills.split(',').map((s, i) => s.trim() && (
                <span key={i} className="px-2 py-0.5 rounded border text-xs font-semibold" style={{ borderColor: themeColor, color: themeColor }}>
                  {s.trim()}
                </span>
              ))}
            </div>
          ) : skillsStyle === 'bars' ? (
            <div className="grid grid-cols-2 gap-x-6 gap-y-2 pt-1">
              {formData.skills.split(',').map((s, i) => s.trim() && (
                <div key={i}>
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span>{s.trim()}</span>
                  </div>
                  <div className="h-1 w-full bg-gray-200">
                    <div className="h-full" style={{ width: `${(Math.sin(i + s.length) * 20) + 75}%`, backgroundColor: themeColor }} />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="whitespace-pre-wrap text-sm leading-relaxed">{formData.skills}</p>
          )}
        </div>
      </div>
    )
  };

  return (
    <div className="bg-white text-gray-800 h-full p-10 font-mono">
      <div className="flex border-b-2 pb-6 mb-6 items-end" style={{ borderColor: themeColor }}>
        <h1 className="text-3xl font-bold uppercase" style={{ color: themeColor }}>
          {formData.fullName || 'Your Name'}
        </h1>
        <div className="ml-auto text-xs text-right space-y-1 text-gray-500">
          {formData.email && <div>{formData.email}</div>}
          {formData.phone && <div>{formData.phone}</div>}
          {formData.location && <div>{formData.location}</div>}
        </div>
      </div>
      <div className="divide-y divide-gray-100 space-y-4">
        {sectionOrder.map((key, i) => (
          <div key={key} className={i !== 0 ? 'pt-4' : ''}>
            {sections[key]}
          </div>
        ))}
      </div>
    </div>
  );
}
