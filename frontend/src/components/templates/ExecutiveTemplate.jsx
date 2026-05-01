import React from 'react';

const ExecutiveTemplate = ({ data }) => {
  const { color = '#0f172a' } = data; // Default slate-900

  return (
    <div className="p-10 bg-white h-full w-full text-gray-900 font-sans">
      <div className="border-b-4 pb-4 mb-6" style={{ borderColor: color }}>
        <h1 className="text-5xl font-extrabold uppercase tracking-tight text-gray-900">{data.fullName || 'YOUR NAME'}</h1>
        <h2 className="text-2xl font-bold mt-2" style={{ color }}>{data.jobTitle || 'Executive Title'}</h2>
        
        <div className="flex flex-wrap gap-x-6 gap-y-2 mt-4 text-sm font-medium text-gray-700">
          {data.email && <span className="flex items-center">✉ {data.email}</span>}
          {data.phone && <span className="flex items-center">☎ {data.phone}</span>}
          {data.address && <span className="flex items-center">⚲ {data.address}</span>}
        </div>
      </div>

      {data.summary && (
        <section className="mb-8">
          <h3 className="text-lg font-bold uppercase tracking-wider mb-2" style={{ color }}>Executive Summary</h3>
          <p className="text-sm leading-relaxed text-gray-800 font-medium">{data.summary}</p>
        </section>
      )}

      {data.experiences?.length > 0 && (
        <section className="mb-8">
          <h3 className="text-lg font-bold uppercase tracking-wider mb-4 border-b border-gray-300 pb-1" style={{ color }}>Professional Experience</h3>
          <div className="space-y-6">
            {data.experiences.map((exp, i) => (
              <div key={i}>
                <div className="flex justify-between items-baseline">
                  <h4 className="font-bold text-gray-900 text-lg">{exp.company}</h4>
                  <span className="text-sm font-bold text-gray-600">{exp.startDate} - {exp.endDate || 'Present'}</span>
                </div>
                <h5 className="font-semibold text-md mb-2 italic text-gray-800">{exp.position}</h5>
                <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{exp.description}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      <div className="grid grid-cols-2 gap-8">
        {data.educations?.length > 0 && (
          <section>
            <h3 className="text-lg font-bold uppercase tracking-wider mb-4 border-b border-gray-300 pb-1" style={{ color }}>Education</h3>
            <div className="space-y-4">
              {data.educations.map((edu, i) => (
                <div key={i}>
                  <h4 className="font-bold text-gray-900">{edu.degree}</h4>
                  <h5 className="font-medium text-gray-800">{edu.school}</h5>
                  <span className="text-sm text-gray-600">{edu.startDate} - {edu.endDate || 'Present'}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {data.skills?.length > 0 && (
          <section>
            <h3 className="text-lg font-bold uppercase tracking-wider mb-4 border-b border-gray-300 pb-1" style={{ color }}>Core Competencies</h3>
            <ul className="list-disc list-inside text-sm font-medium text-gray-800 space-y-1">
              {data.skills.map((skill, i) => (
                <li key={i}>
                  {skill.name} {skill.level && <span className="text-gray-500 font-normal">({skill.level})</span>}
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </div>
  );
};

export default ExecutiveTemplate;
