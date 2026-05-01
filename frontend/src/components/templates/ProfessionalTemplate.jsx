import React from 'react';

const ProfessionalTemplate = ({ data }) => {
  const { color = '#1e40af' } = data; // A dark blue default

  return (
    <div className="p-8 bg-white h-full w-full text-gray-800 font-serif">
      <header className="text-center mb-8">
        <h1 className="text-4xl font-bold uppercase tracking-widest" style={{ color }}>{data.fullName || 'YOUR NAME'}</h1>
        <h2 className="text-lg mt-2 tracking-widest text-gray-600 uppercase">{data.jobTitle || 'JOB TITLE'}</h2>
        
        <div className="flex justify-center items-center gap-3 mt-3 text-xs text-gray-600">
          {data.address && <span>{data.address}</span>}
          {data.address && data.phone && <span>|</span>}
          {data.phone && <span>{data.phone}</span>}
          {data.phone && data.email && <span>|</span>}
          {data.email && <span>{data.email}</span>}
        </div>
      </header>

      {data.summary && (
        <section className="mb-6">
          <h3 className="text-md font-bold uppercase tracking-widest mb-2 border-b-2" style={{ borderColor: color, color }}>Professional Summary</h3>
          <p className="text-sm leading-relaxed">{data.summary}</p>
        </section>
      )}

      {data.experiences?.length > 0 && (
        <section className="mb-6">
          <h3 className="text-md font-bold uppercase tracking-widest mb-4 border-b-2" style={{ borderColor: color, color }}>Professional Experience</h3>
          <div className="space-y-5">
            {data.experiences.map((exp, i) => (
              <div key={i}>
                <div className="flex justify-between items-baseline mb-1">
                  <h4 className="font-bold text-gray-900">{exp.position}</h4>
                  <span className="text-sm font-semibold italic">{exp.startDate} - {exp.endDate || 'Present'}</span>
                </div>
                <h5 className="text-sm italic mb-2 text-gray-700">{exp.company}</h5>
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{exp.description}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {data.educations?.length > 0 && (
        <section className="mb-6">
          <h3 className="text-md font-bold uppercase tracking-widest mb-4 border-b-2" style={{ borderColor: color, color }}>Education</h3>
          <div className="space-y-3">
            {data.educations.map((edu, i) => (
              <div key={i} className="flex justify-between items-baseline">
                <div>
                  <h4 className="font-bold text-gray-900">{edu.degree}</h4>
                  <h5 className="text-sm text-gray-700">{edu.school}</h5>
                </div>
                <span className="text-sm italic">{edu.startDate} - {edu.endDate || 'Present'}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {data.skills?.length > 0 && (
        <section className="mb-6">
          <h3 className="text-md font-bold uppercase tracking-widest mb-4 border-b-2" style={{ borderColor: color, color }}>Core Competencies</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-y-2 gap-x-4">
            {data.skills.map((skill, i) => (
              <div key={i} className="flex items-center text-sm">
                <span className="w-1.5 h-1.5 rounded-full mr-2" style={{ backgroundColor: color }}></span>
                <span className="font-medium">{skill.name}</span>
                {skill.level && <span className="text-xs text-gray-500 ml-1">- {skill.level}</span>}
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default ProfessionalTemplate;
