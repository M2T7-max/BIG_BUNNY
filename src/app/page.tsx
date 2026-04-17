"use client";

import { useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  FlaskConical, GraduationCap, Wrench, Skull,
  Terminal, Zap, Trophy, Flame, Target, Shield, ChevronRight,
  Clock, BookOpen, Code, Server, FileText, Workflow, Compass,
  Award, Rocket
} from "lucide-react";
import { useProgress } from "@/lib/hooks/useProgress";

const quickLinks = [
  { label: "Labs", href: "/labs", icon: FlaskConical, color: "text-cyber-green", bg: "bg-cyber-green/10", border: "border-cyber-green/20", desc: "100+ hands-on labs across 9 platforms" },
  { label: "Bootcamp", href: "/courses/bootcamp", icon: BookOpen, color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20", desc: "25-chapter complete bug bounty guide" },
  { label: "Courses", href: "/courses", icon: GraduationCap, color: "text-cyber-blue", bg: "bg-cyber-blue/10", border: "border-cyber-blue/20", desc: "200+ structured learning modules" },
  { label: "Methodology", href: "/courses/methodology", icon: Compass, color: "text-teal-400", bg: "bg-teal-500/10", border: "border-teal-500/20", desc: "6-phase professional hunting approach" },
  { label: "Tools", href: "/tools", icon: Wrench, color: "text-cyber-purple", bg: "bg-cyber-purple/10", border: "border-cyber-purple/20", desc: "500+ Kali commands & editors" },
  { label: "Automation", href: "/tools/automation", icon: Workflow, color: "text-indigo-400", bg: "bg-indigo-500/10", border: "border-indigo-500/20", desc: "5 pre-built security pipelines" },
  { label: "Challenges", href: "/challenges", icon: Flame, color: "text-orange-400", bg: "bg-orange-500/10", border: "border-orange-500/20", desc: "365 daily security challenges" },
  { label: "Real Reports", href: "/labs/real-reports", icon: FileText, color: "text-cyan-400", bg: "bg-cyan-500/10", border: "border-cyan-500/20", desc: "15 dissected HackerOne reports" },
  { label: "Report Academy", href: "/reports/academy", icon: Award, color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/20", desc: "10 templates + CVSS calculator" },
  { label: "Programs", href: "/programs/selector", icon: Target, color: "text-pink-400", bg: "bg-pink-500/10", border: "border-pink-500/20", desc: "Find your perfect bug bounty program" },
  { label: "Career", href: "/progress/career", icon: Trophy, color: "text-yellow-400", bg: "bg-yellow-500/10", border: "border-yellow-500/20", desc: "Junior → Elite career roadmap" },
  { label: "Red Team", href: "/redteam", icon: Skull, color: "text-cyber-red", bg: "bg-red-500/10", border: "border-red-500/20", desc: "C2 frameworks & advanced ops" },
];

const recentActivities = [
  { text: "Completed DVWA SQL Injection Lab", time: "2h ago", icon: FlaskConical },
  { text: "Finished XSS Module in Phase 2", time: "5h ago", icon: BookOpen },
  { text: "Practiced 15 Nmap commands", time: "1d ago", icon: Terminal },
  { text: "Completed Port Scanner script", time: "1d ago", icon: Code },
  { text: "Launched Juice Shop Docker lab", time: "2d ago", icon: Server },
];

const universityStats = [
  { label: "Labs", value: "100+", desc: "Across 9 platforms" },
  { label: "Modules", value: "200+", desc: "In 4 learning phases" },
  { label: "Commands", value: "500+", desc: "Kali Linux reference" },
  { label: "Challenges", value: "365", desc: "One for every day" },
  { label: "Reports", value: "25+", desc: "Templates & examples" },
  { label: "Pipelines", value: "5", desc: "Automation scripts" },
];

function AnimatedCounter({ value, suffix = "" }: { value: number; suffix?: string }) {
  return (
    <span className="font-mono text-3xl font-bold text-white">
      {value}{suffix}
    </span>
  );
}

function generateHeatmapData() {
  const data: { date: string; count: number }[] = [];
  const today = new Date();
  for (let i = 364; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split("T")[0];
    data.push({
      date: dateStr,
      count: Math.random() > 0.6 ? Math.floor(Math.random() * 5) + 1 : 0,
    });
  }
  return data;
}

function Heatmap() {
  const data = generateHeatmapData();
  const weeks: { date: string; count: number }[][] = [];
  for (let i = 0; i < data.length; i += 7) {
    weeks.push(data.slice(i, i + 7));
  }

  const getColor = (count: number) => {
    if (count === 0) return "bg-dark-700";
    if (count === 1) return "bg-cyber-green/20";
    if (count === 2) return "bg-cyber-green/40";
    if (count === 3) return "bg-cyber-green/60";
    if (count === 4) return "bg-cyber-green/80";
    return "bg-cyber-green";
  };

  return (
    <div className="flex gap-[3px] overflow-x-auto pb-2">
      {weeks.map((week, wi) => (
        <div key={wi} className="flex flex-col gap-[3px]">
          {week.map((day, di) => (
            <div
              key={di}
              className={`heatmap-cell ${getColor(day.count)}`}
              title={`${day.date}: ${day.count} activities`}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

export default function Dashboard() {
  const { stats, updateStreak } = useProgress();

  useEffect(() => {
    updateStreak();
  }, [updateStreak]);

  const statCards = [
    { label: "Labs Completed", value: stats.totalLabs, icon: FlaskConical, color: "text-cyber-green", glowClass: "shadow-neon-green" },
    { label: "Courses Done", value: stats.totalCourses, icon: GraduationCap, color: "text-cyber-blue", glowClass: "shadow-neon-blue" },
    { label: "Commands Learned", value: stats.totalActiveDays * 10, icon: Terminal, color: "text-cyber-purple", glowClass: "shadow-neon-purple" },
    { label: "Skills Mastered", value: stats.totalSkills, icon: Target, color: "text-yellow-400", glowClass: "" },
    { label: "Day Streak", value: stats.streak, icon: Flame, color: "text-orange-400", glowClass: "" },
    { label: "Total XP", value: stats.totalXp, icon: Trophy, color: "text-cyber-pink", glowClass: "" },
  ];

  return (
    <div className="max-w-[1600px] mx-auto px-6 py-8 space-y-8">
      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl border border-dark-600/50 p-8"
        style={{ background: "linear-gradient(135deg, rgba(0,255,65,0.05) 0%, rgba(0,212,255,0.05) 50%, rgba(184,41,221,0.05) 100%)" }}
      >
        <div className="absolute top-0 right-0 w-96 h-96 bg-glow-green opacity-30" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-glow-purple opacity-20" />
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="relative">
              <Shield className="w-12 h-12 text-cyber-green drop-shadow-[0_0_15px_rgba(0,255,65,0.6)]" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-cyber-green rounded-full animate-pulse-glow" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">
                Bug Bounty <span className="gradient-text">University</span>
              </h1>
              <p className="text-gray-400 text-sm font-mono mt-1">
                {`// The complete cybersecurity training platform — v2.0`}
              </p>
            </div>
          </div>
          <p className="text-gray-300 max-w-3xl mt-4 leading-relaxed">
            Master web security from beginner to elite. 100+ labs, 25-chapter bootcamp, 365 daily challenges,
            automation pipelines, real bug report dissection, career tracking, and everything you need to become
            a professional bug bounty hunter.
          </p>
          <div className="flex gap-3 mt-6 flex-wrap">
            <Link href="/courses/bootcamp" className="cyber-btn flex items-center gap-2">
              <Rocket className="w-4 h-4" />
              Start Bootcamp
            </Link>
            <Link href="/labs" className="px-6 py-2.5 border border-cyber-blue/30 bg-cyber-blue/10 text-cyber-blue font-mono text-sm font-semibold uppercase tracking-wider hover:bg-cyber-blue/20 transition-all duration-300 rounded flex items-center gap-2">
              <FlaskConical className="w-4 h-4" />
              Launch Labs
            </Link>
            <Link
              href="/challenges"
              className="px-6 py-2.5 border border-orange-500/30 bg-orange-500/10 text-orange-400 font-mono text-sm font-semibold uppercase tracking-wider hover:bg-orange-500/20 transition-all duration-300 rounded flex items-center gap-2"
            >
              <Flame className="w-4 h-4" />
              Daily Challenge
            </Link>
          </div>
        </div>
      </motion.div>

      {/* University Content Stats */}
      <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
        {universityStats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="glass-card p-4 text-center"
          >
            <p className="text-2xl font-bold gradient-text font-mono">{s.value}</p>
            <p className="text-xs font-bold text-white mt-1">{s.label}</p>
            <p className="text-[10px] text-gray-600 mt-0.5">{s.desc}</p>
          </motion.div>
        ))}
      </div>

      {/* Personal Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {statCards.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="stat-card"
          >
            <div className="flex items-center justify-between mb-3">
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
              <span className="text-[10px] font-mono text-gray-500 uppercase">{stat.label}</span>
            </div>
            <AnimatedCounter value={stat.value} />
          </motion.div>
        ))}
      </div>

      {/* Activity Heatmap */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glass-card p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Flame className="w-5 h-5 text-cyber-green" />
            Activity Heatmap
          </h2>
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <span>Less</span>
            <div className="flex gap-1">
              {["bg-dark-700", "bg-cyber-green/20", "bg-cyber-green/40", "bg-cyber-green/60", "bg-cyber-green/80", "bg-cyber-green"].map((c, i) => (
                <div key={i} className={`w-3 h-3 rounded-sm ${c}`} />
              ))}
            </div>
            <span>More</span>
          </div>
        </div>
        <Heatmap />
      </motion.div>

      {/* Quick Links + Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Quick Links */}
        <div className="lg:col-span-3 space-y-4">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Zap className="w-5 h-5 text-cyber-green" />
            University Sections
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {quickLinks.map((link, i) => (
              <motion.div
                key={link.href}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + i * 0.05 }}
              >
                <Link
                  href={link.href}
                  className={`glass-card p-4 flex items-start gap-3 group hover:-translate-y-1 transition-all duration-300 border ${link.border} h-full`}
                >
                  <div className={`w-9 h-9 rounded-lg ${link.bg} flex items-center justify-center shrink-0`}>
                    <link.icon className={`w-4.5 h-4.5 ${link.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm text-white group-hover:text-cyber-green transition-colors">
                      {link.label}
                    </h3>
                    <p className="text-[10px] text-gray-500 mt-0.5 leading-relaxed">{link.desc}</p>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-gray-600 group-hover:text-cyber-green group-hover:translate-x-1 transition-all shrink-0 mt-1" />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Clock className="w-5 h-5 text-cyber-blue" />
            Recent Activity
          </h2>
          <div className="glass-card p-4 space-y-1">
            {recentActivities.map((activity, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + i * 0.1 }}
                className="flex items-start gap-3 p-3 rounded-lg hover:bg-white/5 transition-colors"
              >
                <activity.icon className="w-4 h-4 text-cyber-green mt-0.5 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-300 truncate">{activity.text}</p>
                  <p className="text-xs text-gray-600 mt-0.5">{activity.time}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Quick Stats Card */}
          <div className="glass-card p-4 border-cyber-green/20">
            <h3 className="text-xs font-mono text-gray-500 uppercase mb-3">Platform Overview</h3>
            <div className="space-y-2">
              {[
                { label: "Platforms", value: "9", color: "text-cyber-green" },
                { label: "Books Integrated", value: "5", color: "text-cyber-blue" },
                { label: "Report Templates", value: "10", color: "text-orange-400" },
                { label: "Career Levels", value: "8", color: "text-yellow-400" },
              ].map((item) => (
                <div key={item.label} className="flex justify-between items-center">
                  <span className="text-xs text-gray-400">{item.label}</span>
                  <span className={`text-sm font-bold font-mono ${item.color}`}>{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
