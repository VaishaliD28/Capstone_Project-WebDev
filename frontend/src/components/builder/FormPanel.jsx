import React from 'react';
import useStore from '../../store/useStore';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { GripVertical, Plus, Trash2, ChevronDown, ChevronUp } from 'lucide-react';

const InputGroup = ({ label, name, value, onChange, type = 'text', textarea = false }) => (
  <div className="mb-4">
    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{label}</label>
    {textarea ? (
      <textarea
        value={value || ''}
        onChange={(e) => onChange(name, e.target.value)}
        rows={4}
        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
      />
    ) : (
      <input
        type={type}
        value={value || ''}
        onChange={(e) => onChange(name, e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
      />
    )}
  </div>
);

const SectionItem = ({ id, index, title, subtitle, onRemove, children }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  return (
    <Draggable draggableId={id} index={index}>
      {(provided) => (
        <div 
          ref={provided.innerRef}
          {...provided.draggableProps}
          className="mb-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md overflow-hidden"
        >
          <div className="flex items-center p-3 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
            <div {...provided.dragHandleProps} className="mr-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
              <GripVertical className="h-5 w-5" />
            </div>
            <div className="flex-1 cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
              <h4 className="font-medium text-gray-900 dark:text-white">{title || '(Not specified)'}</h4>
              <p className="text-sm text-gray-500 dark:text-gray-400">{subtitle}</p>
            </div>
            <button onClick={() => setIsOpen(!isOpen)} className="p-1 text-gray-500">
              {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </button>
            <button onClick={onRemove} className="p-1 ml-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded">
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
          {isOpen && <div className="p-4 bg-white dark:bg-gray-900">{children}</div>}
        </div>
      )}
    </Draggable>
  );
};

const FormPanel = () => {
  const { currentResume, updateCurrentResumeLocal } = useStore();

  const handleInfoChange = (field, value) => {
    updateCurrentResumeLocal({ [field]: value });
  };

  const handleSettingsChange = (field, value) => {
    updateCurrentResumeLocal({ [field]: value });
  };

  const onDragEnd = (result, type) => {
    if (!result.destination) return;
    const items = Array.from(currentResume[type] || []);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    
    // Update order numbers
    const updatedItems = items.map((item, index) => ({ ...item, order: index }));
    updateCurrentResumeLocal({ [type]: updatedItems });
  };

  const handleItemChange = (type, index, field, value) => {
    const items = [...(currentResume[type] || [])];
    items[index] = { ...items[index], [field]: value };
    updateCurrentResumeLocal({ [type]: items });
  };

  const handleAddItem = (type, defaultItem) => {
    const items = [...(currentResume[type] || [])];
    items.push({ ...defaultItem, id: `new_${Date.now()}`, order: items.length });
    updateCurrentResumeLocal({ [type]: items });
  };

  const handleRemoveItem = (type, index) => {
    const items = [...(currentResume[type] || [])];
    items.splice(index, 1);
    updateCurrentResumeLocal({ [type]: items });
  };

  return (
    <div className="p-6">
      {/* Design Settings */}
      <div className="mb-8 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Design Settings</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Template</label>
            <select 
              value={currentResume.template || 'modern'} 
              onChange={(e) => handleSettingsChange('template', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="modern">Modern</option>
              <option value="minimal">Minimal</option>
              <option value="professional">Professional</option>
              <option value="creative">Creative</option>
              <option value="executive">Executive</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Color Theme</label>
            <input 
              type="color" 
              value={currentResume.color || '#3b82f6'} 
              onChange={(e) => handleSettingsChange('color', e.target.value)}
              className="w-full h-10 px-1 py-1 border border-gray-300 dark:border-gray-600 rounded-md cursor-pointer"
            />
          </div>
        </div>
      </div>

      <div className="space-y-8">
        {/* Personal Details */}
        <section>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 border-b border-gray-200 dark:border-gray-700 pb-2">Personal Details</h3>
          <div className="grid grid-cols-2 gap-x-4">
            <InputGroup label="Full Name" name="fullName" value={currentResume.fullName} onChange={handleInfoChange} />
            <InputGroup label="Job Title" name="jobTitle" value={currentResume.jobTitle} onChange={handleInfoChange} />
            <InputGroup label="Email" name="email" value={currentResume.email} onChange={handleInfoChange} type="email" />
            <InputGroup label="Phone" name="phone" value={currentResume.phone} onChange={handleInfoChange} />
          </div>
          <InputGroup label="Address / Location" name="address" value={currentResume.address} onChange={handleInfoChange} />
          <InputGroup label="Professional Summary" name="summary" value={currentResume.summary} onChange={handleInfoChange} textarea />
        </section>

        {/* Experience */}
        <section>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 border-b border-gray-200 dark:border-gray-700 pb-2">Experience</h3>
          <DragDropContext onDragEnd={(res) => onDragEnd(res, 'experiences')}>
            <Droppable droppableId="experiences">
              {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef}>
                  {(currentResume.experiences || []).map((exp, index) => (
                    <SectionItem 
                      key={exp.id?.toString()} 
                      id={exp.id?.toString()} 
                      index={index} 
                      title={exp.position} 
                      subtitle={exp.company}
                      onRemove={() => handleRemoveItem('experiences', index)}
                    >
                      <div className="grid grid-cols-2 gap-x-4">
                        <InputGroup label="Job Title" name="position" value={exp.position} onChange={(n, v) => handleItemChange('experiences', index, n, v)} />
                        <InputGroup label="Company" name="company" value={exp.company} onChange={(n, v) => handleItemChange('experiences', index, n, v)} />
                        <InputGroup label="Start Date" name="startDate" value={exp.startDate} onChange={(n, v) => handleItemChange('experiences', index, n, v)} />
                        <InputGroup label="End Date" name="endDate" value={exp.endDate} onChange={(n, v) => handleItemChange('experiences', index, n, v)} />
                      </div>
                      <InputGroup label="Description" name="description" value={exp.description} onChange={(n, v) => handleItemChange('experiences', index, n, v)} textarea />
                    </SectionItem>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
          <button 
            onClick={() => handleAddItem('experiences', { position: '', company: '', startDate: '', endDate: '', description: '' })}
            className="mt-2 text-blue-600 dark:text-blue-400 font-medium flex items-center hover:underline"
          >
            <Plus className="h-4 w-4 mr-1" /> Add Experience
          </button>
        </section>

        {/* Education */}
        <section>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 border-b border-gray-200 dark:border-gray-700 pb-2">Education</h3>
          <DragDropContext onDragEnd={(res) => onDragEnd(res, 'educations')}>
            <Droppable droppableId="educations">
              {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef}>
                  {(currentResume.educations || []).map((edu, index) => (
                    <SectionItem 
                      key={edu.id?.toString()} 
                      id={edu.id?.toString()} 
                      index={index} 
                      title={edu.degree} 
                      subtitle={edu.school}
                      onRemove={() => handleRemoveItem('educations', index)}
                    >
                      <div className="grid grid-cols-2 gap-x-4">
                        <InputGroup label="School / University" name="school" value={edu.school} onChange={(n, v) => handleItemChange('educations', index, n, v)} />
                        <InputGroup label="Degree" name="degree" value={edu.degree} onChange={(n, v) => handleItemChange('educations', index, n, v)} />
                        <InputGroup label="Start Date" name="startDate" value={edu.startDate} onChange={(n, v) => handleItemChange('educations', index, n, v)} />
                        <InputGroup label="End Date" name="endDate" value={edu.endDate} onChange={(n, v) => handleItemChange('educations', index, n, v)} />
                      </div>
                    </SectionItem>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
          <button 
            onClick={() => handleAddItem('educations', { school: '', degree: '', startDate: '', endDate: '' })}
            className="mt-2 text-blue-600 dark:text-blue-400 font-medium flex items-center hover:underline"
          >
            <Plus className="h-4 w-4 mr-1" /> Add Education
          </button>
        </section>

        {/* Skills */}
        <section>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 border-b border-gray-200 dark:border-gray-700 pb-2">Skills</h3>
          <DragDropContext onDragEnd={(res) => onDragEnd(res, 'skills')}>
            <Droppable droppableId="skills">
              {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef}>
                  {(currentResume.skills || []).map((skill, index) => (
                    <SectionItem 
                      key={skill.id?.toString()} 
                      id={skill.id?.toString()} 
                      index={index} 
                      title={skill.name} 
                      subtitle={skill.level}
                      onRemove={() => handleRemoveItem('skills', index)}
                    >
                      <div className="grid grid-cols-2 gap-x-4">
                        <InputGroup label="Skill" name="name" value={skill.name} onChange={(n, v) => handleItemChange('skills', index, n, v)} />
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Level</label>
                          <select 
                            value={skill.level || ''} 
                            onChange={(e) => handleItemChange('skills', index, 'level', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                          >
                            <option value="">Select Level</option>
                            <option value="Beginner">Beginner</option>
                            <option value="Intermediate">Intermediate</option>
                            <option value="Expert">Expert</option>
                          </select>
                        </div>
                      </div>
                    </SectionItem>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
          <button 
            onClick={() => handleAddItem('skills', { name: '', level: '' })}
            className="mt-2 text-blue-600 dark:text-blue-400 font-medium flex items-center hover:underline"
          >
            <Plus className="h-4 w-4 mr-1" /> Add Skill
          </button>
        </section>
      </div>
    </div>
  );
};

export default FormPanel;
