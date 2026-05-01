import React from 'react';

const MinimalTemplate = ({ data }) => {
  const { color = '#333333' } = data;

  return (
    <div className="p-10 bg-white h-full w-full text-gray-800">
      <header className="border-b-2 pb-6 mb-6" style={{ borderColor: color }}>
        <h1 className="text-4xl font-light mb-1">{data.fullName || 'Your Name'}</h1>
        <h2 className="text-xl font-medium" style={{ color }}>{data.jobTitle || 'Job Title'}</h2>
        
        <div className="flex flex-wrap gap-4 mt-4 text-sm text-gray-600">
          {data.email && <span>{data.email}</span>}
          {data.phone && <span>• {data.phone}</span>}
          {data.address && <span>• {data.address}</span>}
        </div>
      </header>

      {data.summary && (
        <section className="mb-8">
          <p className="text-sm leading-relaxed text-gray-700">{data.summary}</p>
        </section>
      )}

      {data.experiences?.length > 0 && (
        <section className="mb-8">
          <h3 className="text-lg font-bold mb-4 uppercase tracking-wider text-gray-900 border-b border-gray-200 pb-1">Experience</h3>
          <div className="space-y-6">
            {data.experiences.map((exp, i) => (
              <div key={i}>
                <div className="flex justify-between items-end mb-1">
                  <h4 className="font-bold text-gray-800 text-lg">{exp.position}</h4>
                  <span className="text-sm font-medium" style={{ color }}>{exp.startDate} - {exp.endDate || 'Present'}</span>
                </div>
                <h5 className="text-gray-600 mb-2 font-medium">{exp.company}</h5>
                <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{exp.description}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      <div className="grid grid-cols-2 gap-8">
        {data.educations?.length > 0 && (
          <section>
            <h3 className="text-lg font-bold mb-4 uppercase tracking-wider text-gray-900 border-b border-gray-200 pb-1">Education</h3>
            <div className="space-y-4">
              {data.educations.map((edu, i) => (
                <div key={i}>
                  <h4 className="font-bold text-gray-800">{edu.degree}</h4>
                  <h5 className="text-gray-600 text-sm">{edu.school}</h5>
                  <span className="text-xs text-gray-500">{edu.startDate} - {edu.endDate || 'Present'}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {data.skills?.length > 0 && (
          <section>
            <h3 className="text-lg font-bold mb-4 uppercase tracking-wider text-gray-900 border-b border-gray-200 pb-1">Skills</h3>
            <div className="flex flex-wrap gap-2">
              {data.skills.map((skill, i) => (
                <span key={i} className="px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-800 border border-gray-200">
                  {skill.name} {skill.level && <span className="text-xs text-gray-500 ml-1">({skill.level})</span>}
                </span>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default MinimalTemplate;
