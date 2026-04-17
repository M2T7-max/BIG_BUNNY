"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { BookOpen, Clock, ChevronDown, ChevronRight, Check, Play } from "lucide-react";
import booksData from "@/data/books.json";
import { useProgress } from "@/lib/hooks/useProgress";

export default function BootcampPage() {
  const { progress, toggleCourse } = useProgress();
  const book = booksData.books.find((b) => b.id === "bootcamp")!;
  const [expandedChapter, setExpandedChapter] = useState<string | null>(null);
  const [simulatorOpen, setSimulatorOpen] = useState(false);
  const [simStep, setSimStep] = useState(0);

  const completedCount = book.chapters.filter((ch) => progress.completedCourses.includes(ch.id)).length;
  const totalTime = book.chapters.reduce((acc, ch) => acc + parseInt(ch.duration), 0);

  const simSteps = [
    { title: "1. Choose Target", desc: "Select a bug bounty program from HackerOne or Bugcrowd. Analyze the scope.", action: "Analyzing scope for *.example.com..." },
    { title: "2. Reconnaissance", desc: "Run subfinder, httpx, and gather subdomains. Identify tech stack.", action: "Found 47 subdomains, 23 alive hosts..." },
    { title: "3. Map Attack Surface", desc: "Crawl endpoints, identify parameters, find login/upload/API pages.", action: "Discovered 156 endpoints, 12 forms, 3 APIs..." },
    { title: "4. Test for Bugs", desc: "Test each parameter for XSS, SQLi, SSRF, IDOR. Use payloads from toolkit.", action: "Testing param 'q' for XSS... REFLECTED! Payload: <svg/onload=alert(1)>" },
    { title: "5. Validate & PoC", desc: "Confirm the bug, create minimal PoC, test on clean browser.", action: "XSS confirmed! Cookie exfiltration possible via document.cookie" },
    { title: "6. Write Report", desc: "Document steps, impact, remediation. Submit with CVSS score.", action: "Report submitted! Severity: Medium, CVSS: 6.5" },
  ];

  return (
    <div className="max-w-[1600px] mx-auto px-6 py-8 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <BookOpen className="w-7 h-7 text-cyber-green" />
            Bug Bounty Bootcamp
          </h1>
          <p className="text-gray-500 text-sm mt-1 font-mono">by Vickie Li • 25 chapters • The complete guide to finding and reporting web vulnerabilities</p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-cyber-green">{completedCount}/25</p>
          <p className="text-[10px] text-gray-500 font-mono uppercase">Chapters Done</p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="glass-card p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-400">Progress</span>
          <span className="text-sm text-cyber-green font-mono">{Math.round((completedCount / 25) * 100)}%</span>
        </div>
        <div className="w-full h-3 bg-dark-700 rounded-full overflow-hidden">
          <motion.div className="h-full bg-gradient-to-r from-cyber-green to-cyber-blue rounded-full" initial={{ width: 0 }} animate={{ width: `${(completedCount / 25) * 100}%` }} />
        </div>
        <div className="flex justify-between mt-2 text-[10px] text-gray-600 font-mono">
          <span>⏱ Total: {totalTime} min</span>
          <span>📖 {25 - completedCount} remaining</span>
        </div>
      </div>

      {/* Workflow Simulator */}
      <div className="glass-card p-4 border-cyber-green/20">
        <button onClick={() => setSimulatorOpen(!simulatorOpen)} className="w-full flex items-center justify-between">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Play className="w-5 h-5 text-cyber-green" />
            Bug Hunt Workflow Simulator
          </h2>
          <ChevronDown className={`w-5 h-5 text-gray-500 transition-transform ${simulatorOpen ? "rotate-180" : ""}`} />
        </button>
        {simulatorOpen && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-6 gap-2">
              {simSteps.map((step, i) => (
                <button key={i} onClick={() => setSimStep(i)} className={`p-3 rounded-lg text-left transition-all ${simStep === i ? "bg-cyber-green/10 border border-cyber-green/30" : "bg-dark-700/50 border border-transparent hover:bg-dark-700"}`}>
                  <p className={`text-xs font-mono font-bold ${simStep === i ? "text-cyber-green" : "text-gray-400"}`}>{step.title}</p>
                </button>
              ))}
            </div>
            <div className="mt-4 glass-card p-4 bg-dark-800/50 border-cyber-green/10">
              <p className="text-sm text-gray-300 mb-2">{simSteps[simStep].desc}</p>
              <div className="font-mono text-xs text-cyber-green bg-black/40 p-3 rounded">&gt; {simSteps[simStep].action}</div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Chapters */}
      <div className="space-y-2">
        {book.chapters.map((ch) => {
          const isCompleted = progress.completedCourses.includes(ch.id);
          const isExpanded = expandedChapter === ch.id;
          const diffColor = ch.difficulty === "Easy" ? "text-green-400" : ch.difficulty === "Medium" ? "text-yellow-400" : "text-red-400";
          return (
            <motion.div key={ch.id} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="glass-card overflow-hidden">
              <div className="flex items-center gap-3 p-4 cursor-pointer hover:bg-white/5 transition-colors" onClick={() => setExpandedChapter(isExpanded ? null : ch.id)}>
                <button onClick={(e) => { e.stopPropagation(); toggleCourse(ch.id); }} className={`w-7 h-7 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${isCompleted ? "bg-cyber-green border-cyber-green" : "border-gray-600 hover:border-cyber-green/50"}`}>
                  {isCompleted && <Check className="w-4 h-4 text-black" />}
                </button>
                <span className="text-xs font-mono text-gray-600 w-8 shrink-0">#{ch.num}</span>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-semibold ${isCompleted ? "text-gray-500 line-through" : "text-white"}`}>{ch.title}</p>
                </div>
                <span className={`text-[10px] font-mono ${diffColor}`}>{ch.difficulty}</span>
                <span className="text-[10px] font-mono text-gray-600 flex items-center gap-1"><Clock className="w-3 h-3" />{ch.duration}</span>
                <ChevronRight className={`w-4 h-4 text-gray-600 transition-transform ${isExpanded ? "rotate-90" : ""}`} />
              </div>
              {isExpanded && (
                <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} className="px-4 pb-4 border-t border-dark-600/50 pt-3">
                  <div className="flex flex-wrap gap-1.5">
                    {ch.topics.map((topic) => (
                      <span key={topic} className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyber-green/10 text-cyber-green border border-cyber-green/20">{topic}</span>
                    ))}
                  </div>
                </motion.div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
