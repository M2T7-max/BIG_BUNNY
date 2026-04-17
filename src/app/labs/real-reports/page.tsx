"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { FileText, DollarSign, AlertTriangle, Copy, Check, ChevronDown, Search, Target, BookOpen, Award, ArrowRight } from "lucide-react";
import reportsData from "@/data/real-reports.json";
import { useProgress } from "@/lib/hooks/useProgress";

function CopyBtn({ text }: { text: string }) {
  const [c, setC] = useState(false);
  return <button onClick={() => { navigator.clipboard.writeText(text); setC(true); setTimeout(() => setC(false), 2000); }} className="p-1 hover:bg-white/10 rounded">{c ? <Check className="w-3 h-3 text-cyber-green" /> : <Copy className="w-3 h-3 text-gray-500" />}</button>;
}

function ReplicateChallenge({ report }: { report: typeof reportsData[0] }) {
  const [step, setStep] = useState(0);
  const [completed, setCompleted] = useState(false);

  const challenges = [
    { title: "Understand the Vulnerability", desc: `Read the summary and understand what type of vulnerability (${report.vuln_type}) was found and its root cause.`, action: "I understand the vulnerability type" },
    { title: "Analyze the Steps", desc: "Study each step in the reproduction flow. Can you identify where the security boundary was crossed?", action: "I can identify the attack vector" },
    { title: "Study the PoC", desc: "Examine the proof of concept code. What makes this payload effective against the target?", action: "I understand the PoC" },
    { title: "Plan Your Replication", desc: "How would you test for this same vulnerability on a different target? What tools would you use?", action: "I have a testing plan" },
    { title: "Complete the Challenge", desc: `Practice finding ${report.vuln_type} on local lab environments (DVWA, WebGoat, etc.) using similar techniques.`, action: "Challenge Complete! 🎉" },
  ];

  return (
    <div className="mt-4 p-4 bg-dark-800/50 rounded-lg border border-cyber-purple/20">
      <h4 className="text-xs font-mono text-cyber-purple mb-3 uppercase flex items-center gap-2">
        <Target className="w-3 h-3" />Replicate This Bug Challenge
      </h4>
      <div className="space-y-2">
        {challenges.map((ch, i) => (
          <div key={i} className={`flex items-start gap-3 p-2 rounded-lg transition-all ${i === step ? "bg-cyber-purple/5 border border-cyber-purple/20" : i < step ? "opacity-60" : "opacity-40"}`}>
            <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-[10px] font-mono ${i < step ? "bg-cyber-green text-black" : i === step ? "bg-cyber-purple/20 text-cyber-purple border border-cyber-purple/30" : "bg-dark-700 text-gray-600"}`}>
              {i < step ? "✓" : i + 1}
            </div>
            <div className="flex-1">
              <p className={`text-xs font-bold ${i <= step ? "text-white" : "text-gray-600"}`}>{ch.title}</p>
              {i === step && <p className="text-[10px] text-gray-400 mt-1">{ch.desc}</p>}
            </div>
            {i === step && !completed && (
              <button
                onClick={() => {
                  if (step < challenges.length - 1) setStep(step + 1);
                  else setCompleted(true);
                }}
                className="px-3 py-1 text-[10px] font-mono bg-cyber-purple/20 text-cyber-purple rounded border border-cyber-purple/30 hover:bg-cyber-purple/30 transition-colors shrink-0"
              >
                {ch.action}
              </button>
            )}
          </div>
        ))}
      </div>
      {completed && (
        <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="mt-3 p-3 bg-cyber-green/10 rounded-lg border border-cyber-green/30 flex items-center gap-2">
          <Award className="w-4 h-4 text-cyber-green" />
          <span className="text-xs font-mono text-cyber-green">Challenge completed! You&apos;ve analyzed this vulnerability. Now practice on a lab!</span>
        </motion.div>
      )}
      <div className="mt-2 w-full h-1 bg-dark-700 rounded-full">
        <div className="h-full bg-cyber-purple rounded-full transition-all" style={{ width: `${((completed ? challenges.length : step) / challenges.length) * 100}%` }} />
      </div>
    </div>
  );
}

export default function RealReportsPage() {
  const [expanded, setExpanded] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [showChallenge, setShowChallenge] = useState<string | null>(null);
  const { progress, toggleCourse } = useProgress();

  const types = Array.from(new Set(reportsData.map((r) => r.vuln_type)));
  const filtered = reportsData.filter((r) => {
    if (filter !== "all" && r.vuln_type !== filter) return false;
    if (search && !r.title.toLowerCase().includes(search.toLowerCase()) && !r.target.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const sevColor = (s: string) => s === "Critical" ? "text-red-400 bg-red-500/10 border-red-500/20" : s === "High" ? "text-orange-400 bg-orange-500/10 border-orange-500/20" : "text-yellow-400 bg-yellow-500/10 border-yellow-500/20";

  const totalBounty = reportsData.reduce((a, r) => a + Number(r.bounty.replace(/[^0-9]/g, "")), 0);
  const avgCvss = (reportsData.reduce((a, r) => a + r.cvss, 0) / reportsData.length).toFixed(1);
  const studiedReports = reportsData.filter(r => progress.completedCourses.includes(`report-${r.id}`)).length;

  return (
    <div className="max-w-[1600px] mx-auto px-6 py-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-3"><FileText className="w-7 h-7 text-cyber-blue" />Real Bug Reports<span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyber-blue/20 text-cyber-blue border border-cyber-blue/30">15 REPORTS</span></h1>
        <p className="text-gray-500 text-sm mt-1 font-mono">Dissected real-world HackerOne & Bugcrowd disclosures • Learn from actual bounties • Replicate challenges</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" /><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search reports..." className="cyber-input pl-10" /></div>
        <select value={filter} onChange={(e) => setFilter(e.target.value)} className="cyber-input w-auto"><option value="all">All Types</option>{types.map((t) => <option key={t} value={t}>{t}</option>)}</select>
      </div>

      {/* Stats Banner */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="glass-card p-4 border-cyber-green/20">
          <div className="flex items-center gap-2 mb-1"><DollarSign className="w-4 h-4 text-cyber-green" /><span className="text-[10px] text-gray-500 font-mono uppercase">Total Bounties</span></div>
          <p className="text-2xl font-bold text-cyber-green font-mono">${totalBounty.toLocaleString()}</p>
        </div>
        <div className="glass-card p-4">
          <div className="flex items-center gap-2 mb-1"><AlertTriangle className="w-4 h-4 text-red-400" /><span className="text-[10px] text-gray-500 font-mono uppercase">Avg CVSS</span></div>
          <p className="text-2xl font-bold text-red-400 font-mono">{avgCvss}</p>
        </div>
        <div className="glass-card p-4">
          <div className="flex items-center gap-2 mb-1"><BookOpen className="w-4 h-4 text-cyber-blue" /><span className="text-[10px] text-gray-500 font-mono uppercase">Reports Studied</span></div>
          <p className="text-2xl font-bold text-white font-mono">{studiedReports}<span className="text-sm text-gray-600">/15</span></p>
        </div>
        <div className="glass-card p-4">
          <div className="flex items-center gap-2 mb-1"><Target className="w-4 h-4 text-cyber-purple" /><span className="text-[10px] text-gray-500 font-mono uppercase">Vuln Types</span></div>
          <p className="text-2xl font-bold text-white font-mono">{types.length}</p>
        </div>
      </div>

      {/* Reports */}
      <div className="space-y-3">
        {filtered.map((report) => {
          const isOpen = expanded === report.id;
          const isStudied = progress.completedCourses.includes(`report-${report.id}`);
          return (
            <motion.div key={report.id} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className={`glass-card overflow-hidden ${isStudied ? "border-cyber-green/20" : ""}`}>
              <div className="p-4 cursor-pointer hover:bg-white/5 transition-colors" onClick={() => setExpanded(isOpen ? null : report.id)}>
                <div className="flex items-start gap-3">
                  <button
                    onClick={(e) => { e.stopPropagation(); toggleCourse(`report-${report.id}`); }}
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 transition-all ${isStudied ? "bg-cyber-green border-cyber-green" : "border-gray-600 hover:border-cyber-green/50"}`}
                  >
                    {isStudied && <Check className="w-3 h-3 text-black" />}
                  </button>
                  <div className="flex-1">
                    <h3 className={`text-sm font-bold ${isStudied ? "text-gray-400" : "text-white"}`}>{report.title}</h3>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${sevColor(report.severity)}`}>{report.severity} • CVSS {report.cvss}</span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyber-green/10 text-cyber-green border border-cyber-green/20">{report.bounty}</span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-dark-700 text-gray-400">{report.vuln_type}</span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyber-purple/10 text-cyber-purple border border-cyber-purple/20">{report.platform}</span>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-cyber-green font-bold font-mono">{report.bounty}</p>
                    <p className="text-[10px] text-gray-600">{report.target}</p>
                  </div>
                  <ChevronDown className={`w-5 h-5 text-gray-500 transition-transform shrink-0 ${isOpen ? "rotate-180" : ""}`} />
                </div>
              </div>
              {isOpen && (
                <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} className="border-t border-dark-600/50">
                  <div className="p-4 space-y-4">
                    <div><h4 className="text-xs font-mono text-gray-500 mb-1 uppercase">Summary</h4><p className="text-sm text-gray-300">{report.summary}</p></div>
                    <div><h4 className="text-xs font-mono text-gray-500 mb-2 uppercase">Steps to Reproduce</h4><ol className="space-y-1">{report.steps.map((s, i) => <li key={i} className="text-xs text-gray-400 flex gap-2"><span className="text-cyber-green shrink-0">{i + 1}.</span>{s}</li>)}</ol></div>
                    <div><h4 className="text-xs font-mono text-gray-500 mb-1 uppercase flex items-center gap-2">PoC Code <CopyBtn text={report.poc_code} /></h4><pre className="bg-black/40 p-3 rounded text-[11px] font-mono text-cyber-green overflow-x-auto whitespace-pre-wrap">{report.poc_code}</pre></div>
                    <div><h4 className="text-xs font-mono text-gray-500 mb-1 uppercase">Impact</h4><p className="text-sm text-red-400">{report.impact}</p></div>
                    <div className="glass-card p-3 bg-yellow-500/5 border-yellow-500/20"><h4 className="text-xs font-mono text-yellow-400 mb-1 flex items-center gap-1"><AlertTriangle className="w-3 h-3" />Key Takeaway</h4><p className="text-sm text-gray-300">{report.takeaway}</p></div>
                    
                    {/* Replicate Challenge Toggle */}
                    <button
                      onClick={() => setShowChallenge(showChallenge === report.id ? null : report.id)}
                      className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-cyber-purple/10 border border-cyber-purple/20 rounded-lg hover:bg-cyber-purple/20 transition-all text-sm font-mono text-cyber-purple"
                    >
                      <Target className="w-4 h-4" />
                      {showChallenge === report.id ? "Hide Challenge" : "🎯 Replicate This Bug — Interactive Challenge"}
                      <ArrowRight className={`w-4 h-4 transition-transform ${showChallenge === report.id ? "rotate-90" : ""}`} />
                    </button>
                    {showChallenge === report.id && <ReplicateChallenge report={report} />}
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
