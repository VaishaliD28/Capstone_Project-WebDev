// src/services/analysisService.js

/**
 * Mocks an AI resume analysis process.
 * In a real application, this would send the file to a backend endpoint
 * which would parse the PDF/DOCX and use an LLM to generate these insights.
 */
export const analyzeResumeMock = async (file) => {
  // Simulate network/processing delay (3 seconds)
  await new Promise((resolve) => setTimeout(resolve, 3000));

  // Mock response data
  return {
    primaryRole: "Frontend Developer",
    matchScore: 85,
    currentSkills: ["React", "JavaScript", "Tailwind CSS", "HTML/CSS"],
    alternativeRoles: [
      {
        role: "Full Stack Developer",
        matchScore: 60,
        missingSkills: ["Node.js", "Express", "MongoDB", "SQL"],
        improvements: [
          "Add backend projects demonstrating API creation.",
          "Include database design experience.",
          "Highlight any experience with authentication (JWT).",
        ],
      },
      {
        role: "UI/UX Designer",
        matchScore: 45,
        missingSkills: ["Figma", "Wireframing", "User Research", "Prototyping"],
        improvements: [
          "Include a portfolio link with design case studies.",
          "Emphasize user-centric design processes in past roles.",
          "Add specific design tools to your skills section.",
        ],
      },
      {
        role: "React Native Developer",
        matchScore: 70,
        missingSkills: ["React Native", "Mobile App Deployment", "Swift/Kotlin basics"],
        improvements: [
          "Showcase cross-platform mobile apps you've built.",
          "Highlight experience with mobile UI constraints.",
          "Mention familiarity with App Store/Play Store guidelines.",
        ],
      }
    ],
  };
};
