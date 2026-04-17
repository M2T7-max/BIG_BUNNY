"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  FlaskConical, Search, Filter, CheckCircle2, Circle,
  ExternalLink, Play, Monitor, Tag, ChevronDown
} from "lucide-react";
import { useProgress } from "@/lib/hooks/useProgress";
import labsData from "@/data/labs.json";

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

export default function LabsPage() {
  const [search, setSearch] = useState("");
  const [platform, setPlatform] = useState("All");
  const [difficulty, setDifficulty] = useState("All");
  const [category, setCategory] = useState("All");
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

  return (
    <div className="max-w-[1600px] mx-auto px-6 py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <FlaskConical className="w-7 h-7 text-cyber-green" />
            Security Labs
          </h1>
          <p className="text-gray-500 text-sm mt-1 font-mono">
            {labsData.length} labs across {platforms.length - 1} platforms •{" "}
            {progress.completedLabs.length} completed
          </p>
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
      <p className="text-sm text-gray-500 font-mono">
        Showing {filteredLabs.length} of {labsData.length} labs
      </p>

      {/* Lab Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredLabs.map((lab, i) => {
          const isCompleted = progress.completedLabs.includes(lab.id);
          return (
            <motion.div
              key={lab.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.min(i * 0.03, 0.5) }}
              className={`glass-card p-5 group hover:-translate-y-0.5 transition-all duration-300 ${
                isCompleted ? "border-cyber-green/20" : ""
              }`}
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${platformColors[lab.platform] || "bg-gray-500/10 text-gray-400 border-gray-500/20"}`}>
                      {lab.platform}
                    </span>
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${difficultyBadge[lab.difficulty] || ""}`}>
                      {lab.difficulty}
                    </span>
                  </div>
                  <h3 className="font-semibold text-white text-sm group-hover:text-cyber-green transition-colors">
                    {lab.name}
                  </h3>
                </div>
                <button
                  onClick={() => toggleLab(lab.id)}
                  className="shrink-0 mt-1"
                >
                  {isCompleted ? (
                    <CheckCircle2 className="w-5 h-5 text-cyber-green" />
                  ) : (
                    <Circle className="w-5 h-5 text-gray-600 hover:text-gray-400" />
                  )}
                </button>
              </div>

              {/* Description */}
              <p className="text-xs text-gray-400 mb-3 line-clamp-2">
                {lab.description}
              </p>

              {/* Topics */}
              <div className="flex flex-wrap gap-1 mb-3">
                {lab.topics.slice(0, 4).map((topic) => (
                  <span key={topic} className="text-[10px] font-mono px-1.5 py-0.5 bg-dark-700 text-gray-400 rounded">
                    {topic}
                  </span>
                ))}
                {lab.topics.length > 4 && (
                  <span className="text-[10px] font-mono px-1.5 py-0.5 text-gray-600">
                    +{lab.topics.length - 4}
                  </span>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-3 border-t border-dark-600/50">
                <div className="flex items-center gap-2">
                  <Tag className="w-3 h-3 text-gray-600" />
                  <span className="text-[10px] text-gray-600 font-mono">{lab.category}</span>
                </div>
                <div className="flex gap-2">
                  {lab.docker && (
                    <button className="flex items-center gap-1 px-2 py-1 text-[10px] font-mono text-cyber-green bg-cyber-green/10 rounded border border-cyber-green/20 hover:bg-cyber-green/20 transition-colors">
                      <Play className="w-3 h-3" />
                      Docker
                    </button>
                  )}
                  {lab.url && (
                    <a
                      href={lab.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 px-2 py-1 text-[10px] font-mono text-cyber-blue bg-cyber-blue/10 rounded border border-cyber-blue/20 hover:bg-cyber-blue/20 transition-colors"
                    >
                      <ExternalLink className="w-3 h-3" />
                      Open
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {filteredLabs.length === 0 && (
        <div className="text-center py-16">
          <Monitor className="w-12 h-12 text-gray-700 mx-auto mb-3" />
          <p className="text-gray-500 font-mono">No labs match your filters</p>
        </div>
      )}

      {/* Docker Quick Launch */}
      <div className="glass-card p-6 mt-8">
        <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <Play className="w-5 h-5 text-cyber-green" />
          Docker Quick Launch
        </h2>
        <p className="text-sm text-gray-400 mb-4">Start local lab environments with Docker:</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {[
            { name: "DVWA", cmd: "docker run -d -p 4280:80 vulnerables/web-dvwa", port: "4280" },
            { name: "bWAPP", cmd: "docker run -d -p 8081:80 raesene/bwapp", port: "8081" },
            { name: "Juice Shop", cmd: "docker run -d -p 3001:3000 bkimminich/juice-shop", port: "3001" },
            { name: "WebGoat", cmd: "docker run -d -p 8082:8080 webgoat/webgoat", port: "8082" },
            { name: "Metasploitable 2", cmd: "docker run -d -p 8083:80 tleemcjr/metasploitable2", port: "various" },
          ].map((lab) => (
            <div key={lab.name} className="p-3 bg-dark-800 rounded-lg border border-dark-600/50">
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-sm text-white">{lab.name}</span>
                <span className="text-[10px] font-mono text-gray-600">:{lab.port}</span>
              </div>
              <code className="text-[11px] text-cyber-green font-mono block bg-dark-950 p-2 rounded overflow-x-auto">
                {lab.cmd}
              </code>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
