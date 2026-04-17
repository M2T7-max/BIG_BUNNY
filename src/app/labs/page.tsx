"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FlaskConical, Search, Filter, CheckCircle2, Circle,
  ExternalLink, Play, Tag, ChevronDown,
  Brain, Eye, Terminal, Sword, Shield, DollarSign,
  Copy, Check, AlertTriangle, BookOpen, Zap, Target
} from "lucide-react";
import { useProgress } from "@/lib/hooks/useProgress";
import labsData from "@/data/labs.json";
import labContent from "@/data/lab-content.json";

const platforms = ["All", "DVWA", "bWAPP", "Juice Shop", "WebGoat", "Metasploitable 2", "VulnHub", "HTB Academy", "TryHackMe", "PortSwigger"];
const difficulties = ["All", "Easy", "Medium", "Hard", "Insane"];
const categories = ["All", "Web", "Network", "Binary", "Crypto", "Forensics"];

const platformColors: Record<string, string> = {
  "DVWA": "bg-red-500/10 text-red-400 border-red-500/20",
  "bWAPP": "bg-orange-500/10 text-orange-400 border-orange-500/20",
  "Juice Shop": "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  "WebGoat": "bg-blue-500/10 text-blue-400 border-blue-500/20",
  "Metasploitable 2": "bg-purple-500/10 text-purple-400 border-purple-500/20",
  "VulnHub": "bg-green-500/10 text-green-400 border-green-500/20",
  "HTB Academy": "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  "TryHackMe": "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
  "PortSwigger": "bg-pink-500/10 text-pink-400 border-pink-500/20",
};

const difficultyBadge: Record<string, string> = {
  "Easy": "badge-easy",
  "Medium": "badge-medium",
  "Hard": "badge-hard",
  "Insane": "badge-insane",
};

type LabContent = {
  what: string;
  why: string;
  detect: string[];
  docker_cmd: string;
  payloads: { label: string; code: string }[];
  fixes: string[];
  bounty: string;
};

type LabData = typeof labsData[0];

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
      className="p-1 rounded hover:bg-white/10 transition-colors"
      title="Copy to clipboard"
    >
      {copied ? <Check className="w-3.5 h-3.5 text-cyber-green" /> : <Copy className="w-3.5 h-3.5 text-gray-500" />}
    </button>
  );
}

function PayloadBlock({ payload }: { payload: { label: string; code: string } }) {
  return (
    <div className="mb-3">
      <div className="flex items-center justify-between mb-1">
        <span className="text-[10px] font-mono text-cyber-green uppercase tracking-wider">{payload.label}</span>
        <CopyButton text={payload.code} />
      </div>
      <pre className="bg-black/50 border border-dark-600/50 rounded p-3 text-[11px] font-mono text-green-300 overflow-x-auto whitespace-pre-wrap leading-relaxed">{payload.code}</pre>
    </div>
  );
}

function SectionHeader({ icon, label, color = "text-cyber-green" }: { icon: React.ReactNode; label: string; color?: string }) {
  return (
    <div className={`flex items-center gap-2 mb-2 ${color}`}>
      {icon}
      <span className="text-[10px] font-mono uppercase tracking-widest font-bold">{label}</span>
    </div>
  );
}

function LabDetailPanel({ content }: { lab?: LabData; content: LabContent }) {
  return (
    <div className="border-t border-dark-600/50 bg-dark-900/50">
      {/* Disclaimer */}
      <div className="px-5 pt-4 pb-2">
        <div className="flex items-start gap-2 p-2.5 bg-yellow-500/5 border border-yellow-500/20 rounded-lg">
          <AlertTriangle className="w-3.5 h-3.5 text-yellow-400 shrink-0 mt-0.5" />
          <p className="text-[10px] font-mono text-yellow-400/80">
            Educational Lab — I have permission and am authorized to test these environments. All labs run locally on Docker. Never test on unauthorized systems.
          </p>
        </div>
      </div>

      <div className="p-5 grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-5">
          {/* What & Why */}
          <div>
            <SectionHeader icon={<Brain className="w-4 h-4" />} label="What & Why" color="text-cyber-blue" />
            <div className="space-y-2">
              <div className="p-3 bg-cyber-blue/5 border border-cyber-blue/10 rounded-lg">
                <p className="text-[11px] text-gray-300 leading-relaxed">
                  <span className="text-cyber-blue font-mono font-bold">WHAT: </span>{content.what}
                </p>
              </div>
              <div className="p-3 bg-yellow-500/5 border border-yellow-500/10 rounded-lg">
                <p className="text-[11px] text-gray-300 leading-relaxed">
                  <span className="text-yellow-400 font-mono font-bold">WHY: </span>{content.why}
                </p>
              </div>
            </div>
          </div>

          {/* Detection */}
          <div>
            <SectionHeader icon={<Eye className="w-4 h-4" />} label="Detection Methods" color="text-cyber-purple" />
            <ul className="space-y-1.5">
              {content.detect.map((d, i) => (
                <li key={i} className="flex items-start gap-2 text-[11px] text-gray-400">
                  <span className="text-cyber-purple font-mono shrink-0">→</span>
                  <span>{d}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Docker Setup */}
          <div>
            <SectionHeader icon={<Terminal className="w-4 h-4" />} label="Docker Setup" color="text-cyber-green" />
            <div className="relative">
              <pre className="bg-black/60 border border-cyber-green/20 rounded p-3 text-[11px] font-mono text-cyber-green overflow-x-auto whitespace-pre-wrap leading-relaxed">{content.docker_cmd}</pre>
              <div className="absolute top-2 right-2">
                <CopyButton text={content.docker_cmd} />
              </div>
            </div>
          </div>

          {/* Mitigation */}
          <div>
            <SectionHeader icon={<Shield className="w-4 h-4" />} label="Fixes & Mitigations" color="text-green-400" />
            <ul className="space-y-1.5">
              {content.fixes.map((fix, i) => (
                <li key={i} className="flex items-start gap-2 text-[11px] text-gray-400">
                  <CheckCircle2 className="w-3 h-3 text-green-500 shrink-0 mt-0.5" />
                  <span>{fix}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Bounty */}
          <div>
            <SectionHeader icon={<DollarSign className="w-4 h-4" />} label="Bug Bounty Tips" color="text-yellow-400" />
            <div className="p-3 bg-yellow-500/5 border border-yellow-500/20 rounded-lg">
              <p className="text-[11px] font-mono text-yellow-300 leading-relaxed">{content.bounty}</p>
            </div>
          </div>
        </div>

        {/* Right Column — Attack Payloads */}
        <div>
          <SectionHeader icon={<Sword className="w-4 h-4" />} label="Attack Payloads & PoC" color="text-red-400" />
          <div>
            {content.payloads.map((payload, i) => (
              <PayloadBlock key={i} payload={payload} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function GenericLabContent({ lab }: { lab: LabData }) {
  return (
    <div className="border-t border-dark-600/50 p-5 bg-dark-900/50">
      <div className="flex items-start gap-2 p-3 bg-yellow-500/5 border border-yellow-500/20 rounded-lg mb-4">
        <AlertTriangle className="w-3.5 h-3.5 text-yellow-400 shrink-0 mt-0.5" />
        <p className="text-[10px] font-mono text-yellow-400/80">
          Educational Lab — I have permission and am authorized to test. All labs run locally on Docker. Never test on unauthorized systems.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2 text-cyber-blue">
            <BookOpen className="w-4 h-4" />
            <span className="text-[10px] font-mono uppercase tracking-widest font-bold">Topics Covered</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {lab.topics.map((t) => (
              <span key={t} className="text-[10px] font-mono px-2 py-1 bg-cyber-blue/10 text-cyber-blue border border-cyber-blue/20 rounded">
                {t}
              </span>
            ))}
          </div>
        </div>
        {lab.docker && (
          <div>
            <div className="flex items-center gap-2 mb-2 text-cyber-green">
              <Terminal className="w-4 h-4" />
              <span className="text-[10px] font-mono uppercase tracking-widest font-bold">Docker Command</span>
            </div>
            <div className="relative">
              <pre className="bg-black/60 border border-cyber-green/20 rounded p-3 text-[11px] font-mono text-cyber-green overflow-x-auto whitespace-pre-wrap">
                {`docker run -d -p ${lab.docker.port}:${lab.docker.port} ${lab.docker.image}`}
              </pre>
              <div className="absolute top-2 right-2">
                <CopyButton text={`docker run -d -p ${lab.docker.port}:${lab.docker.port} ${lab.docker.image}`} />
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="mt-4 p-3 bg-dark-800 rounded-lg border border-dark-600/50">
        <p className="text-[11px] text-gray-400">
          <span className="text-cyber-green font-mono font-bold">→ </span>
          {lab.description} Practice this lab to learn hands-on offensive & defensive techniques.
        </p>
      </div>
    </div>
  );
}

export default function LabsPage() {
  const [search, setSearch] = useState("");
  const [platform, setPlatform] = useState("All");
  const [difficulty, setDifficulty] = useState("All");
  const [category, setCategory] = useState("All");
  const [expanded, setExpanded] = useState<string | null>(null);
  const { progress, toggleLab } = useProgress();

  const filteredLabs = useMemo(() => {
    return labsData.filter((lab) => {
      const matchSearch = !search || lab.name.toLowerCase().includes(search.toLowerCase()) || lab.description.toLowerCase().includes(search.toLowerCase()) || lab.topics.some((t) => t.toLowerCase().includes(search.toLowerCase()));
      const matchPlatform = platform === "All" || lab.platform === platform;
      const matchDifficulty = difficulty === "All" || lab.difficulty === difficulty;
      const matchCategory = category === "All" || lab.category === category;
      return matchSearch && matchPlatform && matchDifficulty && matchCategory;
    });
  }, [search, platform, difficulty, category]);

  const platformStats = useMemo(() => {
    const stats: Record<string, { total: number; completed: number }> = {};
    labsData.forEach((lab) => {
      if (!stats[lab.platform]) stats[lab.platform] = { total: 0, completed: 0 };
      stats[lab.platform].total++;
      if (progress.completedLabs.includes(lab.id)) stats[lab.platform].completed++;
    });
    return stats;
  }, [progress.completedLabs]);

  const contentMap = labContent as Record<string, LabContent>;

  return (
    <div className="max-w-[1600px] mx-auto px-6 py-8 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <FlaskConical className="w-7 h-7 text-cyber-green" />
            Security Labs
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyber-green/20 text-cyber-green border border-cyber-green/30">
              {labsData.length} LABS
            </span>
          </h1>
          <p className="text-gray-500 text-sm mt-1 font-mono">
            Complete A–Z educational labs across {platforms.length - 1} platforms •{" "}
            {progress.completedLabs.length} completed
          </p>
        </div>
        {/* Disclaimer Badge */}
        <div className="flex items-center gap-2 px-3 py-2 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
          <AlertTriangle className="w-3.5 h-3.5 text-yellow-400" />
          <span className="text-[10px] font-mono text-yellow-400">Authorized Training Environment Only</span>
        </div>
      </div>

      {/* Platform Stats */}
      <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-9 gap-3">
        {Object.entries(platformStats).map(([name, stat]) => (
          <button
            key={name}
            onClick={() => setPlatform(platform === name ? "All" : name)}
            className={`glass-card p-3 text-center transition-all duration-300 hover:-translate-y-0.5 ${
              platform === name ? "neon-border-green" : ""
            }`}
          >
            <p className="text-xs text-gray-500 truncate">{name}</p>
            <p className="text-lg font-bold text-white mt-1">
              {stat.completed}<span className="text-gray-600">/{stat.total}</span>
            </p>
            <div className="w-full h-1 bg-dark-700 rounded-full mt-2">
              <div
                className="h-full bg-cyber-green rounded-full transition-all"
                style={{ width: `${stat.total > 0 ? (stat.completed / stat.total) * 100 : 0}%` }}
              />
            </div>
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="glass-card p-4">
        <div className="flex flex-wrap items-center gap-4">
          {/* Search */}
          <div className="relative flex-1 min-w-[250px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search labs, topics, techniques..."
              className="cyber-input pl-10"
            />
          </div>

          {/* Platform Filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
            <select
              value={platform}
              onChange={(e) => setPlatform(e.target.value)}
              className="cyber-input pl-10 pr-8 appearance-none cursor-pointer min-w-[160px]"
            >
              {platforms.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
          </div>

          {/* Difficulty Filter */}
          <div className="flex gap-1">
            {difficulties.map((d) => (
              <button
                key={d}
                onClick={() => setDifficulty(d)}
                className={`px-3 py-1.5 text-xs font-mono rounded transition-all ${
                  difficulty === d
                    ? "bg-cyber-green/20 text-cyber-green border border-cyber-green/30"
                    : "text-gray-500 hover:text-gray-300 border border-transparent"
                }`}
              >
                {d}
              </button>
            ))}
          </div>

          {/* Category Filter */}
          <div className="flex gap-1">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                className={`px-3 py-1.5 text-xs font-mono rounded transition-all ${
                  category === c
                    ? "bg-cyber-blue/20 text-cyber-blue border border-cyber-blue/30"
                    : "text-gray-500 hover:text-gray-300 border border-transparent"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500 font-mono">
          Showing {filteredLabs.length} of {labsData.length} labs
        </p>
        <div className="flex items-center gap-2 text-[10px] font-mono text-gray-600">
          <Zap className="w-3 h-3 text-cyber-green" />
          Click any lab to expand full educational content
        </div>
      </div>

      {/* Lab Cards — Expandable */}
      <div className="space-y-2">
        {filteredLabs.map((lab, i) => {
          const isCompleted = progress.completedLabs.includes(lab.id);
          const isExpanded = expanded === lab.id;
          const hasDetailedContent = lab.id in contentMap;

          return (
            <motion.div
              key={lab.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.min(i * 0.02, 0.4) }}
              className={`glass-card overflow-hidden transition-all duration-300 ${
                isCompleted ? "border-cyber-green/20" : ""
              } ${isExpanded ? "border-cyber-green/30 shadow-lg shadow-cyber-green/5" : ""}`}
            >
              {/* Card Header — Always Visible */}
              <div
                className="p-4 cursor-pointer hover:bg-white/2 transition-colors"
                onClick={() => setExpanded(isExpanded ? null : lab.id)}
              >
                <div className="flex items-start gap-3">
                  {/* Complete Toggle */}
                  <button
                    onClick={(e) => { e.stopPropagation(); toggleLab(lab.id); }}
                    className="shrink-0 mt-0.5"
                    title={isCompleted ? "Mark incomplete" : "Mark complete"}
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="w-5 h-5 text-cyber-green" />
                    ) : (
                      <Circle className="w-5 h-5 text-gray-600 hover:text-gray-400 transition-colors" />
                    )}
                  </button>

                  {/* Lab Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${platformColors[lab.platform] || "bg-gray-500/10 text-gray-400 border-gray-500/20"}`}>
                        {lab.platform}
                      </span>
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${difficultyBadge[lab.difficulty] || ""}`}>
                        {lab.difficulty}
                      </span>
                      <span className="text-[10px] font-mono px-1.5 py-0.5 bg-dark-700 text-gray-500 rounded">
                        {lab.category}
                      </span>
                      {hasDetailedContent && (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyber-green/10 text-cyber-green border border-cyber-green/20">
                          ★ Full Guide
                        </span>
                      )}
                    </div>
                    <h3 className={`font-semibold text-sm ${isExpanded ? "text-cyber-green" : "text-white"} transition-colors`}>
                      {lab.name}
                    </h3>
                    <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{lab.description}</p>
                  </div>

                  {/* Right Actions */}
                  <div className="flex items-center gap-2 shrink-0">
                    {/* Topics */}
                    <div className="hidden md:flex flex-wrap gap-1">
                      {lab.topics.slice(0, 3).map((topic) => (
                        <span key={topic} className="text-[10px] font-mono px-1.5 py-0.5 bg-dark-700 text-gray-500 rounded">
                          {topic}
                        </span>
                      ))}
                    </div>

                    {lab.docker && (
                      <span className="flex items-center gap-1 px-2 py-1 text-[10px] font-mono text-cyber-green bg-cyber-green/10 rounded border border-cyber-green/20">
                        <Play className="w-3 h-3" />
                        Docker
                      </span>
                    )}
                    {lab.url && (
                      <a
                        href={lab.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="flex items-center gap-1 px-2 py-1 text-[10px] font-mono text-cyber-blue bg-cyber-blue/10 rounded border border-cyber-blue/20 hover:bg-cyber-blue/20 transition-colors"
                      >
                        <ExternalLink className="w-3 h-3" />
                        Open
                      </a>
                    )}

                    <ChevronDown
                      className={`w-5 h-5 text-gray-500 transition-transform duration-300 ${
                        isExpanded ? "rotate-180 text-cyber-green" : ""
                      }`}
                    />
                  </div>
                </div>
              </div>

              {/* Expanded Detail Panel */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    {hasDetailedContent ? (
                      <LabDetailPanel lab={lab} content={contentMap[lab.id]} />
                    ) : (
                      <GenericLabContent lab={lab} />
                    )}

                    {/* Mark Complete Footer */}
                    <div className="px-5 pb-4 flex items-center justify-between border-t border-dark-600/30 pt-3">
                      <div className="flex items-center gap-2">
                        <Tag className="w-3.5 h-3.5 text-gray-600" />
                        <span className="text-[10px] text-gray-600 font-mono">{lab.id}</span>
                      </div>
                      <button
                        onClick={() => toggleLab(lab.id)}
                        className={`flex items-center gap-2 px-4 py-2 text-xs font-mono rounded-lg border transition-all ${
                          isCompleted
                            ? "bg-cyber-green/20 text-cyber-green border-cyber-green/30 hover:bg-cyber-green/10"
                            : "bg-dark-700 text-gray-400 border-dark-600 hover:border-cyber-green/30 hover:text-cyber-green"
                        }`}
                      >
                        {isCompleted ? (
                          <><CheckCircle2 className="w-3.5 h-3.5" /> Lab Completed (+25 XP)</>
                        ) : (
                          <><Circle className="w-3.5 h-3.5" /> Mark as Complete</>
                        )}
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>

      {filteredLabs.length === 0 && (
        <div className="text-center py-16">
          <Target className="w-12 h-12 text-gray-700 mx-auto mb-3" />
          <p className="text-gray-500 font-mono">No labs match your filters</p>
        </div>
      )}

      {/* Docker Quick Launch */}
      <div className="glass-card p-6 mt-8">
        <h2 className="text-lg font-bold text-white mb-1 flex items-center gap-2">
          <Play className="w-5 h-5 text-cyber-green" />
          Docker Quick Launch
        </h2>
        <p className="text-xs text-gray-500 font-mono mb-4">Start all lab environments locally — requires Docker Desktop</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {[
            { name: "DVWA", cmd: "docker run -d -p 4280:80 --name dvwa vulnerables/web-dvwa", port: "4280", color: "text-red-400" },
            { name: "bWAPP", cmd: "docker run -d -p 8081:80 --name bwapp raesene/bwapp", port: "8081", color: "text-orange-400" },
            { name: "Juice Shop", cmd: "docker run -d -p 3001:3000 --name juiceshop bkimminich/juice-shop", port: "3001", color: "text-yellow-400" },
            { name: "WebGoat", cmd: "docker run -d -p 8082:8080 --name webgoat webgoat/webgoat", port: "8082", color: "text-blue-400" },
            { name: "Metasploitable 2", cmd: "docker run -d -p 8083:80 --name meta2 tleemcjr/metasploitable2", port: "various", color: "text-purple-400" },
          ].map((lab) => (
            <div key={lab.name} className="p-3 bg-dark-800 rounded-lg border border-dark-600/50">
              <div className="flex items-center justify-between mb-2">
                <span className={`font-mono text-sm font-bold ${lab.color}`}>{lab.name}</span>
                <span className="text-[10px] font-mono text-gray-600">:{lab.port}</span>
              </div>
              <div className="relative">
                <code className="text-[10px] text-cyber-green font-mono block bg-dark-950 p-2 rounded overflow-x-auto pr-8">
                  {lab.cmd}
                </code>
                <div className="absolute top-1 right-1">
                  <CopyButton text={lab.cmd} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
