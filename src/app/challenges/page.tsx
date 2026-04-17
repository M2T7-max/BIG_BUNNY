"use client";
import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Flame, Check, Lock, Zap, Star, Target, Calendar, Award, TrendingUp, ChevronRight } from "lucide-react";
import challengesData from "@/data/daily-challenges.json";
import { useProgress } from "@/lib/hooks/useProgress";

function StreakCalendar({ completedDays, currentDay }: { completedDays: number[]; currentDay: number }) {
  const weeks: number[][] = [];
  for (let i = 0; i < 365; i += 7) {
    weeks.push(Array.from({ length: 7 }, (_, j) => i + j + 1).filter(d => d <= 365));
  }

  return (
    <div className="glass-card p-4">
      <h3 className="text-sm font-mono text-white font-bold flex items-center gap-2 mb-3">
        <Calendar className="w-4 h-4 text-orange-400" />Challenge Calendar
      </h3>
      <div className="flex gap-[2px] overflow-x-auto pb-2">
        {weeks.map((week, wi) => (
          <div key={wi} className="flex flex-col gap-[2px]">
            {week.map((day) => {
              const isDone = completedDays.includes(day);
              const isToday = day === currentDay;
              const isFuture = day > currentDay;
              return (
                <div
                  key={day}
                  className={`w-3 h-3 rounded-sm transition-all ${
                    isToday ? "bg-orange-400 ring-1 ring-orange-400" :
                    isDone ? "bg-cyber-green" :
                    isFuture ? "bg-dark-800" :
                    "bg-dark-700"
                  }`}
                  title={`Day ${day}${isDone ? " ✓" : isToday ? " (Today)" : ""}`}
                />
              );
            })}
          </div>
        ))}
      </div>
      <div className="flex items-center gap-3 mt-2 text-[10px] text-gray-500">
        <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm bg-dark-700 inline-block" />Missed</span>
        <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm bg-cyber-green inline-block" />Done</span>
        <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm bg-orange-400 inline-block" />Today</span>
        <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm bg-dark-800 inline-block" />Upcoming</span>
      </div>
    </div>
  );
}

function StreakCounter({ streak, maxStreak }: { streak: number; maxStreak: number }) {
  return (
    <div className="glass-card p-5 border-orange-500/20" style={{ background: "linear-gradient(135deg, rgba(255,107,53,0.05) 0%, rgba(255,45,149,0.03) 100%)" }}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-mono text-gray-500 uppercase">Current Streak</p>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-4xl font-bold font-mono text-orange-400">{streak}</span>
            <span className="text-sm text-gray-500">days</span>
          </div>
          <div className="flex gap-1 mt-2">
            {[...Array(7)].map((_, i) => (
              <div key={i} className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${i < streak % 7 ? "bg-orange-400/20 text-orange-400 border border-orange-400/30" : "bg-dark-700 text-gray-600"}`}>
                {i < streak % 7 ? "🔥" : "·"}
              </div>
            ))}
          </div>
        </div>
        <div className="text-center">
          <div className="text-5xl mb-1">🔥</div>
          <p className="text-[10px] text-gray-600 font-mono">Best: {maxStreak}</p>
        </div>
      </div>
    </div>
  );
}

export default function ChallengesPage() {
  const { progress, toggleCourse } = useProgress();
  const [filter, setFilter] = useState("all");
  const [showCount, setShowCount] = useState(50);

  const today = new Date();
  const startOfYear = new Date(today.getFullYear(), 0, 1);
  const dayOfYear = Math.floor((today.getTime() - startOfYear.getTime()) / 86400000) + 1;
  const todayChallenge = challengesData.find((c) => c.day === dayOfYear) || challengesData[0];

  const categories = Array.from(new Set(challengesData.map((c) => c.category)));
  const completedChallenges = challengesData.filter((c) => progress.completedCourses.includes(c.id));
  const completedDays = completedChallenges.map(c => c.day);
  
  // Calculate streak
  const streak = useMemo(() => {
    let count = 0;
    for (let d = dayOfYear; d >= 1; d--) {
      const ch = challengesData.find(c => c.day === d);
      if (ch && progress.completedCourses.includes(ch.id)) {
        count++;
      } else if (d < dayOfYear) {
        break;
      }
    }
    return count;
  }, [dayOfYear, progress.completedCourses]);

  // Max streak
  const maxStreak = useMemo(() => {
    let max = 0, current = 0;
    for (let d = 1; d <= dayOfYear; d++) {
      const ch = challengesData.find(c => c.day === d);
      if (ch && progress.completedCourses.includes(ch.id)) {
        current++;
        max = Math.max(max, current);
      } else {
        current = 0;
      }
    }
    return max;
  }, [dayOfYear, progress.completedCourses]);

  // Category stats
  const categoryStats = useMemo(() => {
    const stats: Record<string, { total: number; done: number }> = {};
    challengesData.forEach(c => {
      if (!stats[c.category]) stats[c.category] = { total: 0, done: 0 };
      stats[c.category].total++;
      if (progress.completedCourses.includes(c.id)) stats[c.category].done++;
    });
    return stats;
  }, [progress.completedCourses]);

  const filtered = useMemo(() => {
    let list = [...challengesData];
    if (filter === "completed") list = list.filter((c) => progress.completedCourses.includes(c.id));
    else if (filter === "today") list = [todayChallenge];
    else if (filter === "week") {
      const weekStart = dayOfYear - (dayOfYear % 7);
      list = list.filter(c => c.day > weekStart && c.day <= weekStart + 7);
    }
    else if (filter !== "all") list = list.filter((c) => c.category === filter);
    return list.slice(0, showCount);
  }, [filter, progress.completedCourses, todayChallenge, showCount, dayOfYear]);

  const totalXp = completedChallenges.reduce((a, c) => a + c.xp, 0);
  const diffColor = (d: string) => d === "Easy" ? "text-green-400 bg-green-500/10 border-green-500/20" : d === "Medium" ? "text-yellow-400 bg-yellow-500/10 border-yellow-500/20" : "text-red-400 bg-red-500/10 border-red-500/20";

  return (
    <div className="max-w-[1600px] mx-auto px-6 py-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-3"><Flame className="w-7 h-7 text-orange-400" />Daily Challenges<span className="text-[10px] font-mono px-2 py-0.5 rounded bg-orange-500/20 text-orange-400 border border-orange-500/30">365 CHALLENGES</span></h1>
        <p className="text-gray-500 text-sm mt-1 font-mono">One challenge per day • Build consistency • Earn XP • Track streaks</p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {[
          { label: "Completed", value: completedChallenges.length, total: "/365", icon: Check, color: "text-cyber-green" },
          { label: "Streak", value: streak, total: " days", icon: Flame, color: "text-orange-400" },
          { label: "Total XP", value: totalXp, total: "", icon: Zap, color: "text-cyber-purple" },
          { label: "Completion", value: Math.round((completedChallenges.length / 365) * 100), total: "%", icon: TrendingUp, color: "text-cyber-blue" },
          { label: "Day", value: dayOfYear, total: "/365", icon: Target, color: "text-yellow-400" },
        ].map((s) => (
          <div key={s.label} className="stat-card">
            <div className="flex items-center justify-between mb-2"><s.icon className={`w-5 h-5 ${s.color}`} /><span className="text-[10px] font-mono text-gray-500 uppercase">{s.label}</span></div>
            <p className="text-2xl font-bold text-white font-mono">{s.value}<span className="text-sm text-gray-600">{s.total}</span></p>
          </div>
        ))}
      </div>

      {/* Streak + Calendar */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-4">
        <StreakCounter streak={streak} maxStreak={maxStreak} />
        <StreakCalendar completedDays={completedDays} currentDay={dayOfYear} />
      </div>

      {/* Today's Challenge (Hero) */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6 border-orange-500/20" style={{ background: "linear-gradient(135deg, rgba(255,107,53,0.05) 0%, rgba(255,45,149,0.05) 100%)" }}>
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Star className="w-5 h-5 text-orange-400" />
              <span className="text-xs font-mono text-orange-400 uppercase font-bold">Today&apos;s Challenge — Day {dayOfYear}</span>
            </div>
            <h2 className="text-lg font-bold text-white">{todayChallenge.title}</h2>
            <p className="text-sm text-gray-400 mt-1">{todayChallenge.description}</p>
            <div className="flex gap-2 mt-3">
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${diffColor(todayChallenge.difficulty)}`}>{todayChallenge.difficulty}</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyber-purple/10 text-cyber-purple border border-cyber-purple/20">{todayChallenge.xp} XP</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyber-blue/10 text-cyber-blue border border-cyber-blue/20">{todayChallenge.category}</span>
            </div>
          </div>
          <button onClick={() => toggleCourse(todayChallenge.id)} className={`px-4 py-2 rounded-lg font-mono text-sm font-bold transition-all ${progress.completedCourses.includes(todayChallenge.id) ? "bg-cyber-green text-black" : "bg-orange-500/20 text-orange-400 border border-orange-500/30 hover:bg-orange-500/30"}`}>
            {progress.completedCourses.includes(todayChallenge.id) ? "✓ Done" : "Complete"}
          </button>
        </div>
        <div className="mt-4 p-3 bg-black/30 rounded-lg">
          <p className="text-xs text-gray-500 font-mono">📋 Task: {todayChallenge.task}</p>
          <p className="text-xs text-gray-600 font-mono mt-1">💡 Hint: {todayChallenge.hint}</p>
        </div>
      </motion.div>

      {/* Category Progress */}
      <div className="glass-card p-4">
        <h3 className="text-sm font-mono text-white font-bold mb-3 flex items-center gap-2">
          <Award className="w-4 h-4 text-cyber-purple" />Category Progress
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {Object.entries(categoryStats).slice(0, 12).map(([cat, stat]) => (
            <button key={cat} onClick={() => setFilter(filter === cat ? "all" : cat)} className={`p-2 rounded-lg text-left transition-all ${filter === cat ? "bg-orange-500/10 border border-orange-500/30" : "bg-dark-800/50 hover:bg-dark-800"}`}>
              <p className="text-[10px] font-mono text-gray-400 truncate">{cat}</p>
              <p className="text-sm font-bold text-white font-mono">{stat.done}<span className="text-gray-600">/{stat.total}</span></p>
              <div className="w-full h-1 bg-dark-700 rounded-full mt-1">
                <div className="h-full bg-cyber-green rounded-full" style={{ width: `${(stat.done / stat.total) * 100}%` }} />
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {["all", "today", "week", "completed", ...categories.slice(0, 8)].map((f) => (
          <button key={f} onClick={() => setFilter(f)} className={`px-3 py-1 text-xs font-mono rounded-lg transition-colors ${filter === f ? "bg-orange-500/20 text-orange-400 border border-orange-500/30" : "text-gray-500 hover:text-gray-300 border border-transparent"}`}>
            {f === "all" ? "All" : f === "today" ? "Today" : f === "week" ? "This Week" : f === "completed" ? `Done (${completedChallenges.length})` : f}
          </button>
        ))}
      </div>

      {/* Challenge List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        {filtered.map((ch) => {
          const isDone = progress.completedCourses.includes(ch.id);
          const isToday = ch.day === dayOfYear;
          const isLocked = ch.day > dayOfYear;
          return (
            <motion.div key={ch.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={`glass-card p-3 flex items-center gap-3 ${isToday ? "border-orange-500/30" : ""} ${isLocked ? "opacity-50" : ""}`}>
              <button disabled={isLocked} onClick={() => !isLocked && toggleCourse(ch.id)} className={`w-7 h-7 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${isDone ? "bg-cyber-green border-cyber-green" : isLocked ? "border-gray-700" : "border-gray-600 hover:border-orange-400"}`}>
                {isDone ? <Check className="w-4 h-4 text-black" /> : isLocked ? <Lock className="w-3 h-3 text-gray-700" /> : null}
              </button>
              <span className="text-[10px] font-mono text-gray-600 w-10 shrink-0">D{ch.day}</span>
              <div className="flex-1 min-w-0">
                <p className={`text-xs font-mono font-semibold ${isDone ? "text-gray-500 line-through" : "text-white"}`}>{ch.title}</p>
                <p className="text-[10px] text-gray-600">{ch.category}</p>
              </div>
              <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded border ${diffColor(ch.difficulty)}`}>{ch.difficulty}</span>
              <span className="text-[10px] font-mono text-gray-600">{ch.xp}xp</span>
            </motion.div>
          );
        })}
      </div>

      {/* Load More */}
      {filtered.length >= showCount && (
        <button onClick={() => setShowCount(s => s + 50)} className="w-full py-3 glass-card text-sm font-mono text-gray-400 hover:text-white hover:bg-white/5 transition-all flex items-center justify-center gap-2">
          Load More Challenges <ChevronRight className="w-4 h-4 rotate-90" />
        </button>
      )}
    </div>
  );
}
