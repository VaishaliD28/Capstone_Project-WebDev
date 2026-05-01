const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.createResume = async (req, res) => {
  try {
    const { title, template, color, font } = req.body;
    const resume = await prisma.resume.create({
      data: {
        title: title || 'Untitled Resume',
        template: template || 'modern',
        color: color || '#3b82f6',
        font: font || 'Inter',
        userId: req.user.id,
      },
    });
    res.json(resume);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error creating resume' });
  }
};

exports.getResumes = async (req, res) => {
  try {
    const resumes = await prisma.resume.findMany({
      where: { userId: req.user.id },
      orderBy: { updatedAt: 'desc' },
    });
    res.json(resumes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error fetching resumes' });
  }
};

exports.getResumeById = async (req, res) => {
  try {
    const resume = await prisma.resume.findUnique({
      where: { id: parseInt(req.params.id) },
      include: {
        experiences: { orderBy: { order: 'asc' } },
        educations: { orderBy: { order: 'asc' } },
        skills: { orderBy: { order: 'asc' } },
        projects: { orderBy: { order: 'asc' } },
      },
    });

    if (!resume) {
      return res.status(404).json({ error: 'Resume not found' });
    }

    if (resume.userId !== req.user.id) {
      return res.status(401).json({ error: 'Not authorized' });
    }

    res.json(resume);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error fetching resume' });
  }
};

exports.updateResume = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title, template, color, font,
      fullName, jobTitle, email, phone, address, summary,
      experiences, educations, skills, projects
    } = req.body;

    const resume = await prisma.resume.findUnique({ where: { id: parseInt(id) } });

    if (!resume || resume.userId !== req.user.id) {
      return res.status(401).json({ error: 'Not authorized' });
    }

    // Update main resume info
    const updatedResume = await prisma.resume.update({
      where: { id: parseInt(id) },
      data: {
        title, template, color, font,
        fullName, jobTitle, email, phone, address, summary,
      },
    });

    // Update nested relations (simplest way is to delete and recreate for a builder)
    if (experiences) {
      await prisma.experience.deleteMany({ where: { resumeId: parseInt(id) } });
      if (experiences.length > 0) {
        await prisma.experience.createMany({
          data: experiences.map(exp => ({ ...exp, resumeId: parseInt(id), id: undefined }))
        });
      }
    }

    if (educations) {
      await prisma.education.deleteMany({ where: { resumeId: parseInt(id) } });
      if (educations.length > 0) {
        await prisma.education.createMany({
          data: educations.map(edu => ({ ...edu, resumeId: parseInt(id), id: undefined }))
        });
      }
    }

    if (skills) {
      await prisma.skill.deleteMany({ where: { resumeId: parseInt(id) } });
      if (skills.length > 0) {
        await prisma.skill.createMany({
          data: skills.map(skill => ({ ...skill, resumeId: parseInt(id), id: undefined }))
        });
      }
    }

    if (projects) {
      await prisma.project.deleteMany({ where: { resumeId: parseInt(id) } });
      if (projects.length > 0) {
        await prisma.project.createMany({
          data: projects.map(proj => ({ ...proj, resumeId: parseInt(id), id: undefined }))
        });
      }
    }

    const finalResume = await prisma.resume.findUnique({
      where: { id: parseInt(id) },
      include: {
        experiences: { orderBy: { order: 'asc' } },
        educations: { orderBy: { order: 'asc' } },
        skills: { orderBy: { order: 'asc' } },
        projects: { orderBy: { order: 'asc' } },
      },
    });

    res.json(finalResume);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error updating resume' });
  }
};

exports.deleteResume = async (req, res) => {
  try {
    const { id } = req.params;
    const resume = await prisma.resume.findUnique({ where: { id: parseInt(id) } });

    if (!resume || resume.userId !== req.user.id) {
      return res.status(401).json({ error: 'Not authorized' });
    }

    await prisma.resume.delete({ where: { id: parseInt(id) } });
    res.json({ message: 'Resume removed' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error deleting resume' });
  }
};
