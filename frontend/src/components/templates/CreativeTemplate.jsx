import React from 'react';

const CreativeTemplate = ({ data }) => {
  const { color = '#ec4899' } = data; // Default pink/rose accent

  return (
    <div className="flex flex-col h-full w-full bg-gray-50 text-gray-800">
      {/* Header */}
      <header className="p-10 text-white" style={{ backgroundColor: color }}>
        <h1 className="text-5xl font-black tracking-tighter mb-2">{data.fullName || 'YOUR NAME'}</h1>
        <h2 className="text-2xl font-light opacity-90">{data.jobTitle || 'Job Title'}</h2>
      </header>

      {/* Main Content Split */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Column */}
        <div className="w-1/3 p-8 bg-white border-r border-gray-200">
          <div className="mb-8">
            <h3 className="text-lg font-bold mb-4 uppercase tracking-widest text-gray-400">Contact</h3>
            <div className="space-y-3 text-sm font-medium">
              {data.email && <p>{data.email}</p>}
              {data.phone && <p>{data.phone}</p>}
              {data.address && <p>{data.address}</p>}
            </div>
          </div>

          {data.skills?.length > 0 && (
            <div className="mb-8">
              <h3 className="text-lg font-bold mb-4 uppercase tracking-widest text-gray-400">Expertise</h3>
              <div className="space-y-4">
                {data.skills.map((skill, i) => (
                  <div key={i}>
                    <div className="flex justify-between text-sm font-bold mb-1">
                      <span>{skill.name}</span>
                      <span className="text-xs opacity-60">{skill.level}</span>
                    </div>
                    {/* Visual skill bar */}
                    <div className="w-full bg-gray-200 h-1.5 rounded-full overflow-hidden">
                      <div 
                        className="h-full" 
                        style={{ 
                          backgroundColor: color, 
                          width: skill.level === 'Expert' ? '100%' : skill.level === 'Intermediate' ? '70%' : '40%' 
                        }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column */}
        <div className="w-2/3 p-8">
          {data.summary && (
            <div className="mb-8 relative">
              <div className="absolute -left-4 top-0 w-1 h-full" style={{ backgroundColor: color }}></div>
              <p className="text-lg leading-relaxed text-gray-600 italic">"{data.summary}"</p>
            </div>
          )}

          {data.experiences?.length > 0 && (
            <div className="mb-8">
              <h3 className="text-2xl font-bold mb-6 text-gray-900">Experience</h3>
              <div className="space-y-6">
                {data.experiences.map((exp, i) => (
                  <div key={i} className="group">
                    <div className="flex justify-between items-baseline mb-2">
                      <h4 className="text-xl font-bold text-gray-900 group-hover:text-opacity-80 transition-colors" style={{ color: color }}>{exp.position}</h4>
                      <span className="text-sm font-bold text-gray-500 bg-gray-200 px-2 py-1 rounded">{exp.startDate} — {exp.endDate || 'Present'}</span>
                    </div>
                    <h5 className="text-md font-semibold text-gray-700 mb-3">{exp.company}</h5>
                    <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">{exp.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {data.educations?.length > 0 && (
            <div className="mb-8">
              <h3 className="text-2xl font-bold mb-6 text-gray-900">Education</h3>
              <div className="grid grid-cols-2 gap-4">
                {data.educations.map((edu, i) => (
                  <div key={i} className="p-4 bg-white border border-gray-100 shadow-sm rounded-lg">
                    <h4 className="font-bold text-gray-900 mb-1">{edu.degree}</h4>
                    <h5 className="text-sm text-gray-600 mb-2">{edu.school}</h5>
                    <span className="text-xs font-medium text-gray-400">{edu.startDate} — {edu.endDate || 'Present'}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreativeTemplate;
