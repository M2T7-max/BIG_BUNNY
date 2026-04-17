"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  BarChart3, Download, Upload, RotateCcw, Trophy,
  Flame, Target, FlaskConical, GraduationCap,
  TrendingUp, Star, AlertTriangle
} from "lucide-react";
import { useProgress } from "@/lib/hooks/useProgress";
import labsData from "@/data/labs.json";
import coursesData from "@/data/courses.json";
import toast from "react-hot-toast";

const skills = [
  "SQL Injection","XSS","CSRF","SSRF","File Upload","Command Injection","XXE","Deserialization",
  "LFI/RFI","IDOR","JWT Attacks","OAuth","GraphQL","WebSocket","Race Conditions",
  "Prototype Pollution","SSTI","Request Smuggling","CORS","DNS","Nmap","Burp Suite",
  "Metasploit","Privilege Escalation","Active Directory"
];

export default function ProgressPage() {
  const { progress, stats, updateSkill, exportProgress, importProgress, resetProgress } = useProgress();
  const [importText, setImportText] = useState("");

  const platformCompletion = useMemo(() => {
    const platforms: Record<string, { total: number; completed: number }> = {};
    labsData.forEach((lab) => {
      if (!platforms[lab.platform]) platforms[lab.platform] = { total: 0, completed: 0 };
      platforms[lab.platform].total++;
      if (progress.completedLabs.includes(lab.id)) platforms[lab.platform].completed++;
    });
    return platforms;
  }, [progress.completedLabs]);

  const phaseCompletion = useMemo(() => {
    return coursesData.phases.map((phase) => {
      const completed = phase.modules.filter((m) => progress.completedCourses.includes(m.id)).length;
      return { name: phase.name, completed, total: phase.modules.length, pct: phase.modules.length > 0 ? (completed / phase.modules.length) * 100 : 0, color: phase.color };
    });
  }, [progress.completedCourses]);

  const readinessScore = useMemo(() => {
    const labScore = (stats.totalLabs / labsData.length) * 30;
    const courseScore = (stats.totalCourses / coursesData.phases.reduce((a, p) => a + p.modules.length, 0)) * 30;
    const skillScore = (stats.totalSkills / 25) * 25;
    const streakScore = Math.min(stats.streak / 30, 1) * 15;
    return Math.round(labScore + courseScore + skillScore + streakScore);
  }, [stats]);

  const recommendations = useMemo(() => {
    const recs: string[] = [];
    if (stats.totalLabs < 10) recs.push("Complete at least 10 labs to build foundational skills");
    if (stats.totalCourses < 20) recs.push("Work through more course modules for comprehensive knowledge");
    if (stats.totalSkills < 10) recs.push("Rate your skills in the matrix below to track proficiency");
    if (stats.streak < 3) recs.push("Build a learning streak - consistency is key!");
    const weakSkills = skills.filter((s) => (progress.skillLevels[s] || 0) < 2);
    if (weakSkills.length > 0) recs.push(`Focus on weak areas: ${weakSkills.slice(0, 3).join(", ")}`);
    if (recs.length === 0) recs.push("Great progress! Consider trying harder labs and advanced techniques");
    return recs;
  }, [stats, progress.skillLevels]);

  const handleImport = () => {
    if (importProgress(importText)) {
      toast.success("Progress imported successfully!");
      setImportText("");
    } else {
      toast.error("Invalid JSON format");
    }
  };

  const handleReset = () => {
    if (confirm("Are you sure? This will reset ALL progress data.")) {
      resetProgress();
      toast.success("Progress reset");
    }
  };

  return (
    <div className="max-w-[1600px] mx-auto px-6 py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <BarChart3 className="w-7 h-7 text-yellow-400" />
            Progress Tracker
          </h1>
          <p className="text-gray-500 text-sm mt-1 font-mono">
            Track your learning journey and skill development
          </p>
        </div>
        <div className="flex gap-2">
          <button onClick={exportProgress} className="flex items-center gap-2 px-3 py-1.5 text-xs font-mono text-cyber-green bg-cyber-green/10 rounded border border-cyber-green/20 hover:bg-cyber-green/20 transition-colors">
            <Download className="w-3.5 h-3.5" /> Export JSON
          </button>
          <button onClick={handleReset} className="flex items-center gap-2 px-3 py-1.5 text-xs font-mono text-red-400 bg-red-500/10 rounded border border-red-500/20 hover:bg-red-500/20 transition-colors">
            <RotateCcw className="w-3.5 h-3.5" /> Reset
          </button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
        {[
          { label: "Labs Done", value: stats.totalLabs, icon: FlaskConical, color: "text-cyber-green" },
          { label: "Courses Done", value: stats.totalCourses, icon: GraduationCap, color: "text-cyber-blue" },
          { label: "Skills Rated", value: stats.totalSkills, icon: Target, color: "text-cyber-purple" },
          { label: "Total XP", value: stats.totalXp, icon: Trophy, color: "text-yellow-400" },
          { label: "Day Streak", value: stats.streak, icon: Flame, color: "text-orange-400" },
          { label: "Active Days", value: stats.totalActiveDays, icon: TrendingUp, color: "text-cyan-400" },
          { label: "Readiness", value: readinessScore, icon: Star, color: "text-cyber-pink", suffix: "%" },
        ].map((stat, i) => (
          <motion.div key={stat.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="stat-card">
            <stat.icon className={`w-4 h-4 ${stat.color} mb-2`} />
            <p className="text-2xl font-bold font-mono text-white">{stat.value}{stat.suffix || ""}</p>
            <p className="text-[10px] text-gray-500 font-mono uppercase mt-1">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Bug Bounty Readiness Index */}
      <div className="glass-card p-6">
        <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <Star className="w-5 h-5 text-yellow-400" />
          Bug Bounty Readiness Index
        </h2>
        <div className="flex items-center gap-6">
          <div className="relative w-32 h-32">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
              <circle cx="60" cy="60" r="50" fill="none" stroke="#1a2540" strokeWidth="8" />
              <circle cx="60" cy="60" r="50" fill="none" stroke={readinessScore >= 70 ? "#00ff41" : readinessScore >= 40 ? "#f0e030" : "#ff0040"} strokeWidth="8" strokeLinecap="round" strokeDasharray={`${readinessScore * 3.14} 314`} />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-2xl font-bold font-mono text-white">{readinessScore}%</span>
            </div>
          </div>
          <div className="flex-1 space-y-2">
            {[
              { label: "Lab Experience", pct: Math.round((stats.totalLabs / labsData.length) * 100), color: "#00ff41" },
              { label: "Course Knowledge", pct: Math.round((stats.totalCourses / coursesData.phases.reduce((a, p) => a + p.modules.length, 0)) * 100), color: "#00d4ff" },
              { label: "Skill Proficiency", pct: Math.round((stats.totalSkills / 25) * 100), color: "#b829dd" },
              { label: "Consistency", pct: Math.min(Math.round((stats.streak / 30) * 100), 100), color: "#ff2d95" },
            ].map((item) => (
              <div key={item.label}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-400">{item.label}</span>
                  <span className="font-mono text-gray-500">{item.pct}%</span>
                </div>
                <div className="w-full h-1.5 bg-dark-700 rounded-full">
                  <div className="h-full rounded-full transition-all duration-500" style={{ width: `${item.pct}%`, background: item.color }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Lab Completion by Platform */}
      <div className="glass-card p-6">
        <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <FlaskConical className="w-5 h-5 text-cyber-green" />
          Lab Completion by Platform
        </h2>
        <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-9 gap-4">
          {Object.entries(platformCompletion).map(([name, data]) => {
            const pct = data.total > 0 ? (data.completed / data.total) * 100 : 0;
            return (
              <div key={name} className="text-center">
                <div className="relative w-16 h-16 mx-auto mb-2">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 60 60">
                    <circle cx="30" cy="30" r="24" fill="none" stroke="#1a2540" strokeWidth="4" />
                    <circle cx="30" cy="30" r="24" fill="none" stroke="#00ff41" strokeWidth="4" strokeLinecap="round" strokeDasharray={`${pct * 1.508} 150.8`} />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-[10px] font-bold font-mono text-white">{Math.round(pct)}%</span>
                  </div>
                </div>
                <p className="text-[10px] text-gray-500 truncate">{name}</p>
                <p className="text-[10px] text-gray-600 font-mono">{data.completed}/{data.total}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* 25x25 Skills Matrix */}
      <div className="glass-card p-6">
        <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <Target className="w-5 h-5 text-cyber-purple" />
          Skills Matrix (25 Skills)
        </h2>
        <p className="text-xs text-gray-500 mb-4">Click stars to rate your proficiency (1-5) for each skill</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {skills.map((skill) => {
            const level = progress.skillLevels[skill] || 0;
            return (
              <div key={skill} className="flex items-center gap-3 p-2 rounded hover:bg-white/5 transition-colors">
                <span className="text-xs text-gray-300 flex-1 min-w-0 truncate">{skill}</span>
                <div className="flex gap-0.5 shrink-0">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => updateSkill(skill, level === star ? 0 : star)}
                      className={`w-5 h-5 rounded-sm transition-all ${
                        star <= level
                          ? "bg-cyber-green/80 text-dark-950"
                          : "bg-dark-700 text-gray-600"
                      }`}
                    >
                      <span className="text-[10px]">{star}</span>
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Course Progress by Phase */}
      <div className="glass-card p-6">
        <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <GraduationCap className="w-5 h-5 text-cyber-blue" />
          Course Progress by Phase
        </h2>
        <div className="space-y-4">
          {phaseCompletion.map((phase) => (
            <div key={phase.name}>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-300">{phase.name}</span>
                <span className="font-mono text-gray-500 text-xs">{phase.completed}/{phase.total} ({phase.pct.toFixed(0)}%)</span>
              </div>
              <div className="w-full h-2 bg-dark-700 rounded-full">
                <div className="h-full rounded-full transition-all duration-500" style={{ width: `${phase.pct}%`, background: phase.color }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recommendations */}
      <div className="glass-card p-6">
        <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-yellow-400" />
          Recommendations
        </h2>
        <div className="space-y-2">
          {recommendations.map((rec, i) => (
            <div key={i} className="flex items-start gap-3 p-3 rounded bg-dark-800/50 border border-dark-600/30">
              <span className="text-cyber-green text-sm mt-0.5">→</span>
              <p className="text-sm text-gray-300">{rec}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Import Progress */}
      <div className="glass-card p-6">
        <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <Upload className="w-5 h-5 text-cyber-blue" />
          Import Progress
        </h2>
        <textarea
          value={importText}
          onChange={(e) => setImportText(e.target.value)}
          placeholder="Paste exported JSON here..."
          className="cyber-input h-24 resize-none font-mono text-xs"
        />
        <button onClick={handleImport} className="mt-3 cyber-btn text-xs">
          Import
        </button>
      </div>
    </div>
  );
}
