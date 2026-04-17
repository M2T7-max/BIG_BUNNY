"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  GraduationCap, Search, CheckCircle2, Circle, Clock,
  ChevronDown, ChevronRight, BookOpen, Target, Zap
} from "lucide-react";
import { useProgress } from "@/lib/hooks/useProgress";
import coursesData from "@/data/courses.json";

const difficultyBadge: Record<string, string> = {
  Easy: "badge-easy",
  Medium: "badge-medium",
  Hard: "badge-hard",
};

export default function CoursesPage() {
  const [search, setSearch] = useState("");
  const [activePhase, setActivePhase] = useState<string | null>(null);
  const [expandedModule, setExpandedModule] = useState<string | null>(null);
  const { progress, toggleCourse } = useProgress();

  const phases = coursesData.phases;
  const totalModules = phases.reduce((acc, p) => acc + p.modules.length, 0);

  const filteredPhases = useMemo(() => {
    if (!search.trim()) return phases;
    return phases.map((phase) => ({
      ...phase,
      modules: phase.modules.filter(
        (m) =>
          m.title.toLowerCase().includes(search.toLowerCase()) ||
          m.description.toLowerCase().includes(search.toLowerCase()) ||
          m.topics.some((t) => t.toLowerCase().includes(search.toLowerCase()))
      ),
    })).filter((p) => p.modules.length > 0);
  }, [search, phases]);

  const phaseStats = phases.map((phase) => {
    const completed = phase.modules.filter((m) =>
      progress.completedCourses.includes(m.id)
    ).length;
    return { id: phase.id, completed, total: phase.modules.length, pct: phase.modules.length > 0 ? (completed / phase.modules.length) * 100 : 0 };
  });

  return (
    <div className="max-w-[1600px] mx-auto px-6 py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <GraduationCap className="w-7 h-7 text-cyber-blue" />
            Learning Courses
          </h1>
          <p className="text-gray-500 text-sm mt-1 font-mono">
            {totalModules} modules across 4 phases •{" "}
            {progress.completedCourses.length} completed
          </p>
        </div>
      </div>

      {/* Phase Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {phases.map((phase, i) => {
          const stat = phaseStats[i];
          return (
            <motion.button
              key={phase.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              onClick={() => setActivePhase(activePhase === phase.id ? null : phase.id)}
              className={`glass-card p-5 text-left transition-all duration-300 hover:-translate-y-0.5 ${
                activePhase === phase.id ? "neon-border-green" : ""
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-mono px-2 py-0.5 rounded" style={{ color: phase.color, background: `${phase.color}15`, border: `1px solid ${phase.color}30` }}>
                  Phase {i + 1}
                </span>
                <span className="text-xs font-mono text-gray-500">
                  {stat.completed}/{stat.total}
                </span>
              </div>
              <h3 className="text-sm font-semibold text-white mb-1 truncate">
                {phase.name.replace(`Phase ${i + 1}: `, "")}
              </h3>
              <p className="text-xs text-gray-500 line-clamp-2 mb-3">{phase.description}</p>
              <div className="w-full h-1.5 bg-dark-700 rounded-full">
                <div className="h-full rounded-full transition-all duration-500" style={{ width: `${stat.pct}%`, background: phase.color }} />
              </div>
              <p className="text-xs text-gray-600 mt-2 font-mono">{stat.pct.toFixed(0)}% complete</p>
            </motion.button>
          );
        })}
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search modules, topics, techniques..."
          className="cyber-input pl-10"
        />
      </div>

      {/* Phases */}
      <div className="space-y-6">
        {filteredPhases.map((phase) => {
          const isOpen = activePhase === null || activePhase === phase.id;
          if (!isOpen && !search) return null;
          const stat = phaseStats.find((s) => s.id === phase.id)!;

          return (
            <motion.div
              key={phase.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="glass-card overflow-hidden"
            >
              {/* Phase Header */}
              <button
                onClick={() => setActivePhase(activePhase === phase.id ? null : phase.id)}
                className="w-full flex items-center justify-between p-5 hover:bg-white/5 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${phase.color}15` }}>
                    <BookOpen className="w-4 h-4" style={{ color: phase.color }} />
                  </div>
                  <div className="text-left">
                    <h2 className="text-base font-semibold text-white">{phase.name}</h2>
                    <p className="text-xs text-gray-500">{phase.modules.length} modules • {stat.completed} completed</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-24 h-1.5 bg-dark-700 rounded-full">
                    <div className="h-full rounded-full" style={{ width: `${stat.pct}%`, background: phase.color }} />
                  </div>
                  <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${isOpen ? "rotate-180" : ""}`} />
                </div>
              </button>

              {/* Modules */}
              {isOpen && (
                <div className="border-t border-dark-600/50">
                  {phase.modules.map((module) => {
                    const isCompleted = progress.completedCourses.includes(module.id);
                    const isExpanded = expandedModule === module.id;
                    return (
                      <div
                        key={module.id}
                        className={`border-b border-dark-600/30 last:border-0 ${isCompleted ? "bg-cyber-green/5" : ""}`}
                      >
                        <div className="flex items-center gap-3 px-5 py-3 hover:bg-white/5 transition-colors">
                          {/* Completion Toggle */}
                          <button onClick={() => toggleCourse(module.id)} className="shrink-0">
                            {isCompleted ? (
                              <CheckCircle2 className="w-5 h-5 text-cyber-green" />
                            ) : (
                              <Circle className="w-5 h-5 text-gray-600 hover:text-gray-400" />
                            )}
                          </button>

                          {/* Module Info */}
                          <button
                            onClick={() => setExpandedModule(isExpanded ? null : module.id)}
                            className="flex-1 text-left flex items-center gap-3"
                          >
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="text-sm text-white font-medium">{module.title}</span>
                                <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded border ${difficultyBadge[module.difficulty] || ""}`}>
                                  {module.difficulty}
                                </span>
                              </div>
                              <p className="text-xs text-gray-500 mt-0.5 truncate">{module.description}</p>
                            </div>
                            <div className="flex items-center gap-3 shrink-0">
                              <span className="text-xs text-gray-600 flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {module.duration}
                              </span>
                              <ChevronRight className={`w-4 h-4 text-gray-600 transition-transform ${isExpanded ? "rotate-90" : ""}`} />
                            </div>
                          </button>
                        </div>

                        {/* Expanded Details */}
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            className="px-5 pb-4 ml-8"
                          >
                            <div className="p-4 bg-dark-800/50 rounded-lg border border-dark-600/30 space-y-3">
                              <p className="text-sm text-gray-300">{module.description}</p>
                              <div>
                                <span className="text-xs text-gray-500 font-mono">Topics:</span>
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {module.topics.map((topic) => (
                                    <span key={topic} className="text-[10px] font-mono px-2 py-0.5 bg-dark-700 text-gray-400 rounded">
                                      {topic}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Roadmap Summary */}
      <div className="glass-card p-6">
        <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <Target className="w-5 h-5 text-cyber-purple" />
          Learning Roadmap
        </h2>
        <div className="flex items-center gap-4">
          {phases.map((phase, i) => (
            <div key={phase.id} className="flex items-center gap-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ background: phase.color }}>
                  {i + 1}
                </div>
                <span className="text-xs text-gray-400 font-mono hidden md:block">
                  {phase.name.replace(`Phase ${i + 1}: `, "")}
                </span>
              </div>
              {i < phases.length - 1 && (
                <div className="w-12 h-0.5 bg-dark-600" />
              )}
            </div>
          ))}
          <Zap className="w-5 h-5 text-cyber-green ml-2" />
        </div>
      </div>
    </div>
  );
}
