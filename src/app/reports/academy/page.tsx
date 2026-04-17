"use client";
import { useState } from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { FileText, Copy, Check, Calculator, Award, Star, Download, BookOpen, Shield } from "lucide-react";
import reportTemplates from "@/data/report-templates.json";

const MonacoEditor = dynamic(() => import("@monaco-editor/react"), { ssr: false });

function CopyBtn({ text }: { text: string }) {
  const [c, setC] = useState(false);
  return <button onClick={() => { navigator.clipboard.writeText(text); setC(true); setTimeout(() => setC(false), 2000); }} className="p-1.5 hover:bg-white/10 rounded transition-colors">{c ? <Check className="w-3.5 h-3.5 text-cyber-green" /> : <Copy className="w-3.5 h-3.5 text-gray-500" />}</button>;
}

const hallOfFame = [
  { hunter: "Frans Rosén", company: "Detectify", title: "Uber SSRF → Internal Admin Access", bounty: "$10,000", severity: "Critical", year: 2017, platform: "HackerOne", takeaway: "Always test internal service endpoints through SSRF chains" },
  { hunter: "Sam Curry", company: "Independent", title: "Toyota Financial Services Full Account Takeover", bounty: "$5,000", severity: "Critical", year: 2022, platform: "HackerOne", takeaway: "Check every authentication flow, including password reset" },
  { hunter: "Ron Chan", company: "NCC Group", title: "GitHub Enterprise RCE via SSTI", bounty: "$20,000", severity: "Critical", year: 2020, platform: "GitHub", takeaway: "Template engines are dangerous — always test for SSTI" },
  { hunter: "Orange Tsai", company: "DEVCORE", title: "ProxyLogon - Microsoft Exchange RCE", bounty: "$200,000+", severity: "Critical", year: 2021, platform: "MSRC", takeaway: "Deep dive into authentication proxy chains" },
  { hunter: "Alex Birsan", company: "Independent", title: "Dependency Confusion - Apple, Microsoft, PayPal", bounty: "$130,000+", severity: "Critical", year: 2021, platform: "Multiple", takeaway: "Supply chain attacks through package managers" },
  { hunter: "Corben Leo", company: "Independent", title: "Shopify RCE via ImageMagick", bounty: "$6,300", severity: "Critical", year: 2019, platform: "HackerOne", takeaway: "Image processing libraries are common RCE vectors" },
];

const reportTips = [
  { title: "Start With Impact", desc: "Lead with what an attacker can do, not how you found it", icon: "🎯" },
  { title: "Be Reproducible", desc: "Include exact URLs, payloads, and screenshots for each step", icon: "🔄" },
  { title: "Show Real Impact", desc: "Demonstrate actual data access, not theoretical impact", icon: "💥" },
  { title: "Suggest Fixes", desc: "Propose specific remediation — developers appreciate it", icon: "🔧" },
  { title: "Use CVSS Correctly", desc: "Don't inflate scores. Accurate scoring builds trust", icon: "📊" },
  { title: "Be Professional", desc: "Clear, concise, no drama. Your report is your reputation", icon: "🤝" },
];

function CVSSCalculator() {
  const [version, setVersion] = useState<"v31" | "v40">("v31");
  // CVSS v3.1
  const [av, setAv] = useState(0.85); const [ac, setAc] = useState(0.77); const [pr, setPr] = useState(0.85); const [ui, setUi] = useState(0.85);
  const [ci, setCi] = useState(0.56); const [ii, setIi] = useState(0.56); const [ai, setAi] = useState(0.56);
  const iss = 1 - ((1 - ci) * (1 - ii) * (1 - ai));
  const impact = iss <= 0 ? 0 : 6.42 * iss;
  const exploitability = 8.22 * av * ac * pr * ui;
  const base31 = iss <= 0 ? 0 : Math.min(Math.ceil((impact + exploitability) * 10) / 10, 10);

  // CVSS v4.0 (simplified estimation based on v3.1 inputs)
  const base40 = Math.min(Math.round((base31 * 0.95 + (av > 0.7 ? 0.3 : 0)) * 10) / 10, 10);

  const base = version === "v31" ? base31 : base40;
  const severity = base >= 9.0 ? "Critical" : base >= 7.0 ? "High" : base >= 4.0 ? "Medium" : base > 0 ? "Low" : "None";
  const sevColor = base >= 9.0 ? "text-red-400" : base >= 7.0 ? "text-orange-400" : base >= 4.0 ? "text-yellow-400" : "text-green-400";
  const sevBg = base >= 9.0 ? "bg-red-500/10 border-red-500/30" : base >= 7.0 ? "bg-orange-500/10 border-orange-500/30" : base >= 4.0 ? "bg-yellow-500/10 border-yellow-500/30" : "bg-green-500/10 border-green-500/30";

  const vectorString = version === "v31"
    ? `CVSS:3.1/AV:${av >= 0.85 ? "N" : av >= 0.62 ? "A" : av >= 0.55 ? "L" : "P"}/AC:${ac >= 0.77 ? "L" : "H"}/PR:${pr >= 0.85 ? "N" : pr >= 0.62 ? "L" : "H"}/UI:${ui >= 0.85 ? "N" : "R"}/S:U/C:${ci >= 0.56 ? "H" : ci >= 0.22 ? "L" : "N"}/I:${ii >= 0.56 ? "H" : ii >= 0.22 ? "L" : "N"}/A:${ai >= 0.56 ? "H" : ai >= 0.22 ? "L" : "N"}`
    : `CVSS:4.0/AV:${av >= 0.85 ? "N" : av >= 0.62 ? "A" : av >= 0.55 ? "L" : "P"}/AC:${ac >= 0.77 ? "L" : "H"}/AT:N/PR:${pr >= 0.85 ? "N" : pr >= 0.62 ? "L" : "H"}/UI:${ui >= 0.85 ? "N" : "R"}/VC:${ci >= 0.56 ? "H" : ci >= 0.22 ? "L" : "N"}/VI:${ii >= 0.56 ? "H" : ii >= 0.22 ? "L" : "N"}/VA:${ai >= 0.56 ? "H" : ai >= 0.22 ? "L" : "N"}/SC:N/SI:N/SA:N`;

  return (
    <div className="glass-card p-5 border-cyber-blue/20">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-mono text-white font-bold flex items-center gap-2"><Calculator className="w-4 h-4 text-cyber-blue" />CVSS Calculator</h3>
        <div className="flex gap-1">
          <button onClick={() => setVersion("v31")} className={`px-3 py-1 text-[10px] font-mono rounded transition-colors ${version === "v31" ? "bg-cyber-blue/20 text-cyber-blue border border-cyber-blue/30" : "text-gray-500 hover:text-gray-300"}`}>v3.1</button>
          <button onClick={() => setVersion("v40")} className={`px-3 py-1 text-[10px] font-mono rounded transition-colors ${version === "v40" ? "bg-cyber-purple/20 text-cyber-purple border border-cyber-purple/30" : "text-gray-500 hover:text-gray-300"}`}>v4.0</button>
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div><label className="text-[10px] text-gray-500 font-mono">Attack Vector</label><select value={av} onChange={(e) => setAv(+e.target.value)} className="cyber-input text-xs mt-1"><option value={0.85}>Network</option><option value={0.62}>Adjacent</option><option value={0.55}>Local</option><option value={0.20}>Physical</option></select></div>
        <div><label className="text-[10px] text-gray-500 font-mono">Attack Complexity</label><select value={ac} onChange={(e) => setAc(+e.target.value)} className="cyber-input text-xs mt-1"><option value={0.77}>Low</option><option value={0.44}>High</option></select></div>
        <div><label className="text-[10px] text-gray-500 font-mono">Privileges Required</label><select value={pr} onChange={(e) => setPr(+e.target.value)} className="cyber-input text-xs mt-1"><option value={0.85}>None</option><option value={0.62}>Low</option><option value={0.27}>High</option></select></div>
        <div><label className="text-[10px] text-gray-500 font-mono">User Interaction</label><select value={ui} onChange={(e) => setUi(+e.target.value)} className="cyber-input text-xs mt-1"><option value={0.85}>None</option><option value={0.62}>Required</option></select></div>
        <div><label className="text-[10px] text-gray-500 font-mono">Confidentiality</label><select value={ci} onChange={(e) => setCi(+e.target.value)} className="cyber-input text-xs mt-1"><option value={0.56}>High</option><option value={0.22}>Low</option><option value={0}>None</option></select></div>
        <div><label className="text-[10px] text-gray-500 font-mono">Integrity</label><select value={ii} onChange={(e) => setIi(+e.target.value)} className="cyber-input text-xs mt-1"><option value={0.56}>High</option><option value={0.22}>Low</option><option value={0}>None</option></select></div>
        <div><label className="text-[10px] text-gray-500 font-mono">Availability</label><select value={ai} onChange={(e) => setAi(+e.target.value)} className="cyber-input text-xs mt-1"><option value={0.56}>High</option><option value={0.22}>Low</option><option value={0}>None</option></select></div>
        <div className="flex flex-col justify-end"><div className={`text-center p-2 rounded-lg border ${sevBg}`}><p className={`text-2xl font-bold font-mono ${sevColor}`}>{base.toFixed(1)}</p><p className={`text-[10px] font-mono ${sevColor}`}>{severity}</p></div></div>
      </div>
      {/* Vector String */}
      <div className="mt-3 flex items-center gap-2 p-2 bg-black/30 rounded-lg">
        <code className="text-[10px] font-mono text-cyber-blue flex-1 break-all">{vectorString}</code>
        <CopyBtn text={vectorString} />
      </div>
    </div>
  );
}

export default function ReportAcademyPage() {
  const [activeTemplate, setActiveTemplate] = useState(reportTemplates[0].id);
  const [editorContent, setEditorContent] = useState(reportTemplates[0].template);
  const [activeTab, setActiveTab] = useState<"templates" | "halloffame" | "tips">("templates");
  const tmpl = reportTemplates.find((t) => t.id === activeTemplate) || reportTemplates[0];

  const loadTemplate = (id: string) => {
    const t = reportTemplates.find((t) => t.id === id);
    if (t) { setActiveTemplate(id); setEditorContent(t.template); }
  };

  const exportTemplate = () => {
    const blob = new Blob([editorContent], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${tmpl.name.replace(/\s+/g, "_").toLowerCase()}_report.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-[1600px] mx-auto px-6 py-8 space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3"><FileText className="w-7 h-7 text-orange-400" />Report Academy<span className="text-[10px] font-mono px-2 py-0.5 rounded bg-orange-500/20 text-orange-400 border border-orange-500/30">10 TEMPLATES</span></h1>
          <p className="text-gray-500 text-sm mt-1 font-mono">Professional bug bounty report templates • CVSS v3.1/v4.0 calculator • Hall of Fame examples</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-dark-600/50">
        {[
          { id: "templates" as const, label: "Report Templates", icon: FileText, count: 10 },
          { id: "halloffame" as const, label: "Hall of Fame", icon: Award, count: hallOfFame.length },
          { id: "tips" as const, label: "Writing Tips", icon: BookOpen, count: reportTips.length },
        ].map((tab) => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-all border-b-2 -mb-[1px] ${activeTab === tab.id ? "text-orange-400 border-orange-400 bg-orange-500/5" : "text-gray-500 hover:text-gray-300 border-transparent"}`}>
            <tab.icon className="w-4 h-4" />{tab.label}
            <span className="text-[10px] bg-dark-700 px-1.5 py-0.5 rounded font-mono">{tab.count}</span>
          </button>
        ))}
      </div>

      {activeTab === "templates" && (
        <>
          <CVSSCalculator />

          <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-4">
            {/* Template List */}
            <div className="glass-card p-3 space-y-1.5 lg:max-h-[620px] overflow-y-auto">
              <h3 className="text-xs font-mono text-gray-500 uppercase px-2 mb-2">Templates</h3>
              {reportTemplates.map((t) => (
                <button key={t.id} onClick={() => loadTemplate(t.id)} className={`w-full flex items-center gap-3 p-2.5 rounded-lg text-left transition-all ${activeTemplate === t.id ? "bg-white/10 border border-white/10" : "hover:bg-white/5 border border-transparent"}`}>
                  <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: t.color }} />
                  <div className="flex-1 min-w-0">
                    <p className={`text-xs font-mono font-semibold truncate ${activeTemplate === t.id ? "text-white" : "text-gray-400"}`}>{t.name}</p>
                    <p className="text-[10px] text-gray-600">{t.severity} • CVSS {t.cvss}</p>
                  </div>
                </button>
              ))}
            </div>

            {/* Editor */}
            <div className="space-y-3">
              <div className="flex items-center justify-between glass-card p-3">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: tmpl.color }} />
                  <span className="text-sm font-mono text-white font-bold">{tmpl.name}</span>
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${tmpl.severity === "Critical" ? "bg-red-500/10 text-red-400 border-red-500/20" : tmpl.severity === "High" ? "bg-orange-500/10 text-orange-400 border-orange-500/20" : "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"}`}>{tmpl.severity}</span>
                </div>
                <div className="flex gap-2">
                  <CopyBtn text={editorContent} />
                  <button onClick={exportTemplate} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono bg-orange-500/20 text-orange-400 rounded border border-orange-500/30 hover:bg-orange-500/30 transition-colors">
                    <Download className="w-3.5 h-3.5" />Export .md
                  </button>
                </div>
              </div>
              <div className="h-[520px] rounded-lg overflow-hidden border border-dark-600/50">
                <MonacoEditor height="100%" language="markdown" theme="vs-dark" value={editorContent} onChange={(v) => setEditorContent(v || "")} options={{ fontSize: 13, fontFamily: "'JetBrains Mono', monospace", minimap: { enabled: false }, padding: { top: 12 }, scrollBeyondLastLine: false, wordWrap: "on", automaticLayout: true }} />
              </div>
            </div>
          </div>
        </>
      )}

      {activeTab === "halloffame" && (
        <div className="space-y-4">
          <div className="glass-card p-4 border-yellow-500/20 flex items-center gap-3" style={{ background: "linear-gradient(135deg, rgba(255,215,0,0.05) 0%, rgba(255,107,0,0.05) 100%)" }}>
            <Award className="w-8 h-8 text-yellow-400" />
            <div>
              <h2 className="text-lg font-bold text-white">Hall of Fame Reports</h2>
              <p className="text-xs text-gray-400">Learn from the most impactful bug bounty reports in history</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {hallOfFame.map((entry, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="glass-card p-5 hover:-translate-y-0.5 transition-all group">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-sm font-bold text-white group-hover:text-yellow-400 transition-colors">{entry.title}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-red-500/10 text-red-400 border border-red-500/20">{entry.severity}</span>
                      <span className="text-[10px] font-mono text-gray-500">{entry.platform} • {entry.year}</span>
                    </div>
                  </div>
                  <span className="text-lg font-bold font-mono text-cyber-green">{entry.bounty}</span>
                </div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-6 h-6 rounded-full bg-cyber-purple/20 flex items-center justify-center text-[10px]">👤</div>
                  <div>
                    <span className="text-xs text-white font-medium">{entry.hunter}</span>
                    <span className="text-[10px] text-gray-500 ml-1">({entry.company})</span>
                  </div>
                </div>
                <div className="p-3 bg-dark-800/50 rounded-lg border border-dark-600/30">
                  <div className="flex items-start gap-2">
                    <Star className="w-3 h-3 text-yellow-400 shrink-0 mt-0.5" />
                    <p className="text-xs text-gray-400">{entry.takeaway}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {activeTab === "tips" && (
        <div className="space-y-4">
          <div className="glass-card p-4 border-cyber-blue/20">
            <h2 className="text-lg font-bold text-white flex items-center gap-2 mb-2"><Shield className="w-5 h-5 text-cyber-blue" />Report Writing Best Practices</h2>
            <p className="text-sm text-gray-400">A well-written report is the difference between a duplicate and a bounty. These tips will help you communicate vulnerabilities clearly and get paid faster.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {reportTips.map((tip, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="glass-card p-5 hover:-translate-y-0.5 transition-all">
                <div className="text-3xl mb-3">{tip.icon}</div>
                <h3 className="text-sm font-bold text-white mb-1">{tip.title}</h3>
                <p className="text-xs text-gray-400 leading-relaxed">{tip.desc}</p>
              </motion.div>
            ))}
          </div>

          {/* Report Structure Guide */}
          <div className="glass-card p-6">
            <h3 className="text-sm font-mono text-white font-bold mb-4">📋 Ideal Report Structure</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { num: 1, title: "Title", desc: "[Vuln Type] in [Feature] leads to [Impact]", example: "Stored XSS in user bio allows session hijacking" },
                { num: 2, title: "Summary", desc: "2-3 sentences explaining the vulnerability", example: "A stored XSS vulnerability exists in the user profile bio field..." },
                { num: 3, title: "Steps to Reproduce", desc: "Exact steps anyone can follow", example: "1. Log in as user\n2. Navigate to /profile\n3. Enter payload: <script>..." },
                { num: 4, title: "Impact", desc: "What an attacker can achieve", example: "An attacker can steal session tokens and fully compromise any user account" },
                { num: 5, title: "Proof of Concept", desc: "Screenshots, video, or minimal code", example: "curl -X POST https://target.com/api/bio -d 'bio=<script>...'" },
                { num: 6, title: "Remediation", desc: "Specific fix recommendations", example: "Sanitize user input using DOMPurify before rendering in HTML context" },
              ].map((section) => (
                <div key={section.num} className="flex gap-3 p-3 rounded-lg bg-dark-800/50 border border-dark-600/30">
                  <div className="w-7 h-7 rounded-full bg-orange-500/20 flex items-center justify-center text-xs font-mono text-orange-400 shrink-0">{section.num}</div>
                  <div>
                    <h4 className="text-xs font-bold text-white">{section.title}</h4>
                    <p className="text-[10px] text-gray-400 mt-0.5">{section.desc}</p>
                    <code className="text-[10px] font-mono text-cyber-green mt-1 block">{section.example}</code>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
