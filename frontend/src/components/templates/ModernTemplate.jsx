import React from 'react';

const ModernTemplate = ({ data }) => {
  const { color = '#3b82f6' } = data;

  return (
    <div className="flex h-full w-full bg-white text-gray-800">
      {/* Left Sidebar */}
      <div className="w-1/3 p-8 text-white h-full" style={{ backgroundColor: color }}>
        <h1 className="text-3xl font-bold mb-2 uppercase tracking-wide">{data.fullName || 'Your Name'}</h1>
        <h2 className="text-xl opacity-90 mb-8 font-medium">{data.jobTitle || 'Job Title'}</h2>

        <div className="mb-8">
          <h3 className="text-lg font-bold border-b border-white/30 pb-2 mb-4 uppercase tracking-wider">Contact</h3>
          <div className="space-y-3 text-sm">
            {data.email && <p>{data.email}</p>}
            {data.phone && <p>{data.phone}</p>}
            {data.address && <p>{data.address}</p>}
          </div>
        </div>

        {data.skills?.length > 0 && (
          <div className="mb-8">
            <h3 className="text-lg font-bold border-b border-white/30 pb-2 mb-4 uppercase tracking-wider">Skills</h3>
            <div className="space-y-2">
              {data.skills.map((skill, i) => (
                <div key={i} className="flex justify-between items-center">
                  <span className="font-medium">{skill.name}</span>
                  <span className="text-xs opacity-80">{skill.level}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Right Content Area */}
      <div className="w-2/3 p-8 h-full bg-white">
        {data.summary && (
          <div className="mb-8">
            <h3 className="text-xl font-bold mb-3 uppercase tracking-wider" style={{ color }}>Profile</h3>
            <p className="text-sm leading-relaxed text-gray-700">{data.summary}</p>
          </div>
        )}

        {data.experiences?.length > 0 && (
          <div className="mb-8">
            <h3 className="text-xl font-bold mb-4 uppercase tracking-wider" style={{ color }}>Experience</h3>
            <div className="space-y-6">
              {data.experiences.map((exp, i) => (
                <div key={i} className="relative pl-4 border-l-2" style={{ borderColor: color }}>
                  <div className="absolute w-3 h-3 rounded-full -left-[7px] top-1" style={{ backgroundColor: color }}></div>
                  <h4 className="font-bold text-gray-800">{exp.position}</h4>
                  <div className="flex justify-between text-sm text-gray-600 mb-2">
                    <span className="font-medium">{exp.company}</span>
                    <span>{exp.startDate} - {exp.endDate || 'Present'}</span>
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">{exp.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {data.educations?.length > 0 && (
          <div className="mb-8">
            <h3 className="text-xl font-bold mb-4 uppercase tracking-wider" style={{ color }}>Education</h3>
            <div className="space-y-4">
              {data.educations.map((edu, i) => (
                <div key={i}>
                  <h4 className="font-bold text-gray-800">{edu.degree}</h4>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span className="font-medium">{edu.school}</span>
                    <span>{edu.startDate} - {edu.endDate || 'Present'}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ModernTemplate;
