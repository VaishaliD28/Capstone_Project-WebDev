// src/components/ATSScore.jsx
import React, { useMemo } from 'react';
import { Target, CheckCircle2, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ATSScore({ formData }) {
  const scoreData = useMemo(() => {
    let score = 0;
    const tips = [];
    
    // Contact Info Check (20 points max)
    if (formData.email) score += 10;
    else tips.push({ msg: 'Add your email address', done: false });
    
    if (formData.phone) score += 10;
    else tips.push({ msg: 'Add your phone number', done: false });

    if (formData.email && formData.phone) tips.push({ msg: 'Contact info is complete', done: true });
    
    // Summary Check (20 points max)
    const summaryLen = (formData.summary || '').length;
    if (summaryLen > 50 && summaryLen < 500) {
      score += 20;
      tips.push({ msg: 'Summary length is optimal', done: true });
    } else if (summaryLen > 0) {
      score += 10;
      tips.push({ msg: 'Make summary 50-500 characters', done: false });
    } else {
      tips.push({ msg: 'Add a professional summary', done: false });
    }
    
    // Action Verbs in Experience (40 points max)
    const strongVerbs = ['managed', 'led', 'developed', 'created', 'increased', 'optimized', 'spearheaded', 'orchestrated', 'architected', 'achieved', 'delivered'];
    const expText = (formData.experience || '').toLowerCase();
    
    let verbCount = 0;
    strongVerbs.forEach(verb => {
      if (expText.includes(verb)) verbCount++;
    });
    
    if (verbCount >= 4) {
      score += 40;
      tips.push({ msg: 'Great use of action verbs in experience', done: true });
    } else if (verbCount > 0) {
      score += 20;
      tips.push({ msg: 'Add more action verbs (e.g., managed, led, increased)', done: false });
    } else {
      tips.push({ msg: 'Use action verbs in experience bullet points', done: false });
    }
    
    // Skills (20 points max)
    const skillsLen = (formData.skills || '').split(',').filter(s => s.trim().length > 0).length;
    if (skillsLen >= 5) {
      score += 20;
      tips.push({ msg: 'Good number of skills listed', done: true });
    } else if (skillsLen > 0) {
      score += 10;
      tips.push({ msg: 'Add at least 5 skills', done: false });
    } else {
      tips.push({ msg: 'Add some core skills', done: false });
    }
    
    return { score, tips };
  }, [formData]);

  // Determine color based on score
  const scoreColor = scoreData.score >= 80 ? 'text-emerald-500' : scoreData.score >= 50 ? 'text-yellow-500' : 'text-red-500';
  const strokeColor = scoreData.score >= 80 ? '#10b981' : scoreData.score >= 50 ? '#eab308' : '#ef4444';

  const circumference = 2 * Math.PI * 24;
  const strokeDashoffset = circumference - (scoreData.score / 100) * circumference;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 mb-6 shadow-sm">
      <div className="flex items-center gap-4 mb-4">
        {/* Circular Progress */}
        <div className="relative w-16 h-16 flex items-center justify-center">
          <svg className="w-16 h-16 transform -rotate-90">
            <circle
              cx="32" cy="32" r="24"
              className="stroke-gray-100 dark:stroke-gray-700"
              strokeWidth="6" fill="none"
            />
            <motion.circle
              cx="32" cy="32" r="24"
              stroke={strokeColor}
              strokeWidth="6" fill="none"
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset }}
              transition={{ duration: 1, ease: "easeOut" }}
              strokeLinecap="round"
            />
          </svg>
          <div className={`absolute inset-0 flex items-center justify-center font-bold text-lg ${scoreColor}`}>
            {scoreData.score}
          </div>
        </div>
        
        <div>
          <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-1.5">
            <Target className="w-4 h-4 text-indigo-500" />
            Resume Score
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {scoreData.score >= 80 ? "Looking great! ATS-ready." : "Needs a bit more work."}
          </p>
        </div>
      </div>

      <div className="space-y-2.5">
        {scoreData.tips.map((tip, idx) => (
          <div key={idx} className="flex items-start gap-2 text-sm">
            {tip.done ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-4 h-4 text-yellow-500 shrink-0 mt-0.5" />
            )}
            <span className={tip.done ? "text-gray-500 dark:text-gray-400" : "text-gray-700 dark:text-gray-200 font-medium"}>
              {tip.msg}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
