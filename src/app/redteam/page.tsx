"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Skull, Shield, Eye, Lock, ArrowUpRight, Network, Target,
  ChevronRight, Server, Terminal, Copy, Check
} from "lucide-react";
import redteamData from "@/data/redteam.json";

const sectionTabs = [
  { id: "c2", label: "C2 Frameworks", icon: Server },
  { id: "lolbins", label: "Living off Land", icon: Terminal },
  { id: "av-bypass", label: "AV/EDR Bypass", icon: Shield },
  { id: "persistence", label: "Persistence", icon: Lock },
  { id: "privesc", label: "Privilege Escalation", icon: ArrowUpRight },
  { id: "lateral", label: "Lateral Movement", icon: Network },
];

function CopyBtn({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button onClick={() => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000); }} className="p-1 hover:bg-white/10 rounded transition-colors">
      {copied ? <Check className="w-3 h-3 text-cyber-green" /> : <Copy className="w-3 h-3 text-gray-500" />}
    </button>
  );
}

function C2Section() {
  const data = redteamData.sections.find((s) => s.id === "c2")!;
  return (
    <div className="space-y-6">
      <p className="text-sm text-gray-400">{data.description}</p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {data.items.map((item, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="glass-card p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-white text-sm">{item.name}</h3>
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${"type" in item && item.type === "Open Source" ? "bg-green-500/10 text-green-400 border-green-500/20" : "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"}`}>
                {"type" in item ? item.type : "Tool"}
              </span>
            </div>
            <p className="text-xs text-gray-400 mb-3">{item.description}</p>
            {"features" in item && (
              <div className="flex flex-wrap gap-1 mb-3">
                {(item.features as string[]).slice(0, 4).map((f) => (
                  <span key={f} className="text-[10px] font-mono px-1.5 py-0.5 bg-dark-700 text-gray-400 rounded">{f}</span>
                ))}
              </div>
            )}
            {"setup" in item && (
              <div className="bg-dark-800 rounded p-2 relative">
                <pre className="text-[10px] text-cyber-green font-mono overflow-x-auto whitespace-pre-wrap">{item.setup as string}</pre>
                <div className="absolute top-1 right-1"><CopyBtn text={item.setup as string} /></div>
              </div>
            )}
            {"difficulty" in item && (
              <div className="mt-3 pt-3 border-t border-dark-600/30 flex justify-between items-center">
                <span className="text-[10px] text-gray-600">Difficulty</span>
                <span className={`text-[10px] font-mono ${item.difficulty === "Hard" ? "text-red-400" : "text-yellow-400"}`}>{item.difficulty as string}</span>
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function LOLBinsSection() {
  const data = redteamData.sections.find((s) => s.id === "lolbins")!;
  const [expanded, setExpanded] = useState<string | null>(null);
  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-400">{data.description}</p>
      <div className="space-y-2">
        {data.items.map((item, i) => (
          <div key={i} className="glass-card overflow-hidden">
            <button onClick={() => setExpanded(expanded === item.name ? null : item.name)} className="w-full flex items-center gap-3 p-4 hover:bg-white/5 transition-colors text-left">
              <Terminal className="w-4 h-4 text-red-400 shrink-0" />
              <div className="flex-1">
                <p className="text-sm text-white font-medium">{item.name}</p>
                {"binary" in item && <p className="text-[10px] text-gray-600 font-mono">{item.binary as string}</p>}
              </div>
              {"mitre" in item && <span className="text-[10px] font-mono text-red-400/60 bg-red-500/10 px-2 py-0.5 rounded">{item.mitre as string}</span>}
              <ChevronRight className={`w-4 h-4 text-gray-600 transition-transform ${expanded === item.name ? "rotate-90" : ""}`} />
            </button>
            {expanded === item.name && (
              <div className="px-4 pb-4 border-t border-dark-600/30">
                <p className="text-xs text-gray-400 mt-3 mb-2">{item.description}</p>
                {"techniques" in item && (
                  <div className="space-y-1">
                    {(item.techniques as string[]).map((t, ti) => (
                      <div key={ti} className="flex items-center justify-between p-2 bg-dark-800 rounded">
                        <code className="text-[11px] font-mono text-cyber-green break-all">{t}</code>
                        <CopyBtn text={t} />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function GenericSection({ sectionId }: { sectionId: string }) {
  const data = redteamData.sections.find((s) => s.id === sectionId)!;
  const [expanded, setExpanded] = useState<string | null>(null);
  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-400">{data.description}</p>
      <div className="space-y-3">
        {data.items.map((item, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }} className="glass-card overflow-hidden">
            <button onClick={() => setExpanded(expanded === item.name ? null : item.name)} className="w-full flex items-center gap-3 p-4 hover:bg-white/5 transition-colors text-left">
              <Eye className="w-4 h-4 text-cyber-purple shrink-0" />
              <div className="flex-1">
                <p className="text-sm text-white font-medium">{item.name}</p>
                <p className="text-[10px] text-gray-500 mt-0.5">{item.description}</p>
              </div>
              {"mitre" in item && <span className="text-[10px] font-mono text-purple-400/60 bg-purple-500/10 px-2 py-0.5 rounded">{item.mitre as string}</span>}
              {"os" in item && <span className="text-[10px] font-mono text-gray-500 bg-dark-700 px-2 py-0.5 rounded">{item.os as string}</span>}
              {"difficulty" in item && <span className={`text-[10px] font-mono px-2 py-0.5 rounded ${item.difficulty === "Hard" ? "text-red-400 bg-red-500/10" : "text-yellow-400 bg-yellow-500/10"}`}>{item.difficulty as string}</span>}
              <ChevronRight className={`w-4 h-4 text-gray-600 transition-transform ${expanded === item.name ? "rotate-90" : ""}`} />
            </button>
            {expanded === item.name && (
              <div className="px-4 pb-4 border-t border-dark-600/30 space-y-3">
                {"techniques" in item && (
                  <div>
                    <h4 className="text-xs font-mono text-gray-500 mb-2 mt-3">Techniques</h4>
                    <div className="space-y-1">
                      {(item.techniques as string[]).map((t, ti) => (
                        <div key={ti} className="flex items-center justify-between p-2 bg-dark-800 rounded">
                          <code className="text-[11px] font-mono text-cyber-green break-all flex-1">{t}</code>
                          <CopyBtn text={t} />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {"tools" in item && (
                  <div>
                    <h4 className="text-xs font-mono text-gray-500 mb-1">Tools</h4>
                    <div className="flex flex-wrap gap-1">
                      {(item.tools as string[]).map((tool) => (
                        <span key={tool} className="text-[10px] font-mono px-2 py-0.5 bg-dark-700 text-gray-400 rounded">{tool}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default function RedTeamPage() {
  const [activeTab, setActiveTab] = useState("c2");

  return (
    <div className="max-w-[1600px] mx-auto px-6 py-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-3">
          <Skull className="w-7 h-7 text-red-500" />
          Red Team Operations
        </h1>
        <p className="text-gray-500 text-sm mt-1 font-mono">
          Advanced adversary techniques — C2, evasion, persistence, and lateral movement
        </p>
      </div>

      {/* Warning Banner */}
      <div className="glass-card p-4 border-red-500/20 bg-red-500/5">
        <div className="flex items-center gap-3">
          <Shield className="w-5 h-5 text-red-400 shrink-0" />
          <div>
            <p className="text-sm text-red-400 font-semibold">⚠️ Educational Purpose Only</p>
            <p className="text-xs text-gray-400 mt-0.5">
              These techniques are for authorized security testing and learning only. Unauthorized use is illegal and unethical.
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-1 border-b border-dark-600/50 pb-0">
        {sectionTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-all border-b-2 -mb-[1px] ${
              activeTab === tab.id
                ? "text-red-400 border-red-400 bg-red-500/5"
                : "text-gray-500 hover:text-gray-300 border-transparent"
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        {activeTab === "c2" && <C2Section />}
        {activeTab === "lolbins" && <LOLBinsSection />}
        {activeTab === "av-bypass" && <GenericSection sectionId="av-bypass" />}
        {activeTab === "persistence" && <GenericSection sectionId="persistence" />}
        {activeTab === "privesc" && <GenericSection sectionId="privesc" />}
        {activeTab === "lateral" && <GenericSection sectionId="lateral" />}
      </motion.div>

      {/* Red Team Roadmap */}
      <div className="glass-card p-6 mt-8">
        <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <Target className="w-5 h-5 text-red-400" />
          Red Team Roadmap (Phase 5)
        </h2>
        <div className="flex flex-wrap items-center gap-3">
          {["Recon & OSINT", "Initial Access", "C2 Setup", "Persistence", "Privilege Escalation", "Lateral Movement", "Data Exfiltration", "Report"].map((step, i) => (
            <div key={step} className="flex items-center gap-2">
              <div className={`px-3 py-1.5 rounded text-xs font-mono border ${
                i < 3 ? "bg-red-500/10 text-red-400 border-red-500/20" : "bg-dark-700 text-gray-500 border-dark-600"
              }`}>
                {step}
              </div>
              {i < 7 && <ChevronRight className="w-4 h-4 text-gray-600" />}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
