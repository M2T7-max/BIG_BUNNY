"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Compass, ChevronRight, ExternalLink, Sparkles, Shield, Globe } from "lucide-react";

const programs = [
  { name: "HackerOne", url: "https://hackerone.com", color: "#494649", focus: ["Web", "API", "Mobile"], avg: "$500-$5K", features: ["Largest platform", "Mediation support", "Private invites"] },
  { name: "Bugcrowd", url: "https://bugcrowd.com", color: "#F26822", focus: ["Web", "IoT", "API"], avg: "$300-$3K", features: ["VRT taxonomy", "University program", "Managed programs"] },
  { name: "Intigriti", url: "https://intigriti.com", color: "#2E2B5F", focus: ["Web", "API", "Cloud"], avg: "$200-$4K", features: ["European programs", "Ethical hacking events", "Good payouts"] },
  { name: "YesWeHack", url: "https://yeswehack.com", color: "#3365E3", focus: ["Web", "Mobile", "IoT"], avg: "$200-$3K", features: ["French programs", "DOJO training", "Growing platform"] },
  { name: "Synack", url: "https://synack.com", color: "#ED1C24", focus: ["Web", "Mobile", "Host"], avg: "$1K-$10K", features: ["Invite only", "Highest payouts", "Red team approach"] },
  { name: "Open Bug Bounty", url: "https://openbugbounty.org", color: "#4CAF50", focus: ["XSS", "CSRF"], avg: "$0 (reputation)", features: ["Free platform", "Responsible disclosure", "Good for beginners"] },
  { name: "Google VRP", url: "https://bughunters.google.com", color: "#4285F4", focus: ["Web", "Android", "Chrome"], avg: "$500-$30K", features: ["High payouts", "Clear scope", "Quick triage"] },
  { name: "Microsoft MSRC", url: "https://msrc.microsoft.com", color: "#00A4EF", focus: ["Windows", "Azure", "Office"], avg: "$500-$100K", features: ["Huge scope", "High bounties", "Quarterly bonuses"] },
  { name: "Apple Security", url: "https://developer.apple.com/security-bounty", color: "#555555", focus: ["iOS", "macOS", "iCloud"], avg: "$5K-$1M", features: ["Highest ceiling", "Hardware + software", "Exclusive"] },
  { name: "Meta", url: "https://facebook.com/whitehat", color: "#1877F2", focus: ["Web", "Mobile", "API"], avg: "$500-$50K", features: ["Multiple products", "Fast response", "Transparent"] },
];

const wizardQuestions = [
  { q: "What's your experience level?", options: ["Beginner (< 6 months)", "Intermediate (6-24 months)", "Advanced (2+ years)"] },
  { q: "What do you enjoy most?", options: ["Web application testing", "Mobile app testing", "API testing", "Infrastructure/Cloud"] },
  { q: "Preferred bounty range?", options: ["Any (learning focused)", "$100-$1K", "$1K-$10K", "$10K+"] },
  { q: "How much time per week?", options: ["< 5 hours", "5-15 hours", "15-30 hours", "Full time (30+)"] },
];

export default function ProgramSelectorPage() {
  const [wizardStep, setWizardStep] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [showResults, setShowResults] = useState(false);

  const selectAnswer = (answer: string) => {
    const newAnswers = [...answers, answer];
    setAnswers(newAnswers);
    if (wizardStep < wizardQuestions.length - 1) setWizardStep(wizardStep + 1);
    else setShowResults(true);
  };

  const getRecommendations = () => {
    if (answers[0]?.includes("Beginner")) return programs.filter((p) => ["Open Bug Bounty", "HackerOne", "Bugcrowd", "Intigriti"].includes(p.name));
    if (answers[2]?.includes("$10K")) return programs.filter((p) => ["Apple Security", "Microsoft MSRC", "Google VRP", "Meta", "Synack"].includes(p.name));
    return programs.slice(0, 6);
  };

  const reset = () => { setWizardStep(0); setAnswers([]); setShowResults(false); };

  return (
    <div className="max-w-[1600px] mx-auto px-6 py-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-3"><Compass className="w-7 h-7 text-cyber-pink" />Program Selector<span className="text-[10px] font-mono px-2 py-0.5 rounded bg-pink-500/20 text-cyber-pink border border-pink-500/30">WIZARD</span></h1>
        <p className="text-gray-500 text-sm mt-1 font-mono">Find the perfect bug bounty programs for your skills and interests</p>
      </div>

      {/* Wizard */}
      {!showResults ? (
        <motion.div key={wizardStep} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="glass-card p-8 border-cyber-pink/20 max-w-2xl mx-auto">
          <div className="flex items-center gap-2 mb-6">
            {wizardQuestions.map((_, i) => (<div key={i} className={`h-1.5 flex-1 rounded-full ${i <= wizardStep ? "bg-cyber-pink" : "bg-dark-700"}`} />))}
          </div>
          <p className="text-xs text-gray-500 font-mono mb-2">Question {wizardStep + 1}/{wizardQuestions.length}</p>
          <h2 className="text-lg font-bold text-white mb-6">{wizardQuestions[wizardStep].q}</h2>
          <div className="space-y-3">
            {wizardQuestions[wizardStep].options.map((opt) => (
              <button key={opt} onClick={() => selectAnswer(opt)} className="w-full p-4 text-left glass-card hover:bg-cyber-pink/5 hover:border-cyber-pink/30 transition-all flex items-center justify-between group">
                <span className="text-sm text-gray-300 group-hover:text-white">{opt}</span>
                <ChevronRight className="w-4 h-4 text-gray-600 group-hover:text-cyber-pink" />
              </button>
            ))}
          </div>
        </motion.div>
      ) : (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          <div className="glass-card p-6 border-cyber-green/20 flex items-center justify-between">
            <div><h2 className="text-lg font-bold text-white flex items-center gap-2"><Sparkles className="w-5 h-5 text-cyber-green" />Your Recommendations</h2><p className="text-xs text-gray-500 mt-1">Based on your answers, we recommend these programs</p></div>
            <button onClick={reset} className="px-4 py-2 text-xs font-mono text-gray-400 border border-dark-600 rounded hover:border-cyber-pink/50 transition-colors">Retake Quiz</button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {getRecommendations().map((prog, i) => (
              <motion.div key={prog.name} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="glass-card p-5 hover:-translate-y-1 transition-all group">
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${prog.color}20` }}><Globe className="w-5 h-5" style={{ color: prog.color }} /></div>
                  <a href={prog.url} target="_blank" className="p-1.5 hover:bg-white/10 rounded"><ExternalLink className="w-4 h-4 text-gray-500 group-hover:text-cyber-blue" /></a>
                </div>
                <h3 className="text-base font-bold text-white mb-1">{prog.name}</h3>
                <p className="text-xs text-cyber-green font-mono mb-3">{prog.avg}</p>
                <div className="flex flex-wrap gap-1 mb-3">{prog.focus.map((f) => <span key={f} className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-dark-700 text-gray-400">{f}</span>)}</div>
                <div className="space-y-1">{prog.features.map((f) => <div key={f} className="text-[11px] text-gray-500 flex items-center gap-1.5"><span className="text-cyber-green text-[8px]">●</span>{f}</div>)}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* All Programs */}
      <div>
        <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2"><Shield className="w-5 h-5 text-cyber-blue" />All Platforms</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {programs.map((prog) => (
            <div key={prog.name} className="glass-card p-4 flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: `${prog.color}20` }}><Globe className="w-5 h-5" style={{ color: prog.color }} /></div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-white">{prog.name}</p>
                <p className="text-[10px] text-gray-500">{prog.focus.join(" • ")}</p>
              </div>
              <p className="text-xs font-mono text-cyber-green shrink-0">{prog.avg}</p>
              <a href={prog.url} target="_blank" className="p-1.5 hover:bg-white/10 rounded shrink-0"><ExternalLink className="w-4 h-4 text-gray-500" /></a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
