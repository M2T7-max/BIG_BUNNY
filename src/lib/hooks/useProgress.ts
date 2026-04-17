"use client";

import { useCallback, useMemo } from "react";
import { useLocalStorage } from "./useLocalStorage";

export interface ProgressData {
  completedLabs: string[];
  completedCourses: string[];
  skillLevels: Record<string, number>;
  xp: number;
  streak: number;
  lastActiveDate: string;
  activityDates: Record<string, number>;
  bookmarks: string[];
  notes: Record<string, string>;
}

const defaultProgress: ProgressData = {
  completedLabs: [],
  completedCourses: [],
  skillLevels: {},
  xp: 0,
  streak: 0,
  lastActiveDate: "",
  activityDates: {},
  bookmarks: [],
  notes: {},
};

export function useProgress() {
  const [progress, setProgress] = useLocalStorage<ProgressData>("bb-progress", defaultProgress);

  const toggleLab = useCallback((labId: string) => {
    setProgress((prev) => {
      const completed = prev.completedLabs.includes(labId)
        ? prev.completedLabs.filter((id) => id !== labId)
        : [...prev.completedLabs, labId];
      const today = new Date().toISOString().split("T")[0];
      const xpChange = prev.completedLabs.includes(labId) ? -25 : 25;
      return {
        ...prev,
        completedLabs: completed,
        xp: Math.max(0, prev.xp + xpChange),
        lastActiveDate: today,
        activityDates: {
          ...prev.activityDates,
          [today]: (prev.activityDates[today] || 0) + 1,
        },
      };
    });
  }, [setProgress]);

  const toggleCourse = useCallback((courseId: string) => {
    setProgress((prev) => {
      const completed = prev.completedCourses.includes(courseId)
        ? prev.completedCourses.filter((id) => id !== courseId)
        : [...prev.completedCourses, courseId];
      const today = new Date().toISOString().split("T")[0];
      const xpChange = prev.completedCourses.includes(courseId) ? -15 : 15;
      return {
        ...prev,
        completedCourses: completed,
        xp: Math.max(0, prev.xp + xpChange),
        lastActiveDate: today,
        activityDates: {
          ...prev.activityDates,
          [today]: (prev.activityDates[today] || 0) + 1,
        },
      };
    });
  }, [setProgress]);

  const updateSkill = useCallback((skill: string, level: number) => {
    setProgress((prev) => ({
      ...prev,
      skillLevels: { ...prev.skillLevels, [skill]: Math.min(5, Math.max(0, level)) },
    }));
  }, [setProgress]);

  const addBookmark = useCallback((id: string) => {
    setProgress((prev) => ({
      ...prev,
      bookmarks: prev.bookmarks.includes(id)
        ? prev.bookmarks.filter((b) => b !== id)
        : [...prev.bookmarks, id],
    }));
  }, [setProgress]);

  const updateStreak = useCallback(() => {
    const today = new Date().toISOString().split("T")[0];
    setProgress((prev) => {
      if (prev.lastActiveDate === today) return prev;
      const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];
      const newStreak = prev.lastActiveDate === yesterday ? prev.streak + 1 : 1;
      return { ...prev, streak: newStreak, lastActiveDate: today };
    });
  }, [setProgress]);

  const exportProgress = useCallback(() => {
    const dataStr = JSON.stringify(progress, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `bugbounty-progress-${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [progress]);

  const importProgress = useCallback((jsonString: string) => {
    try {
      const data = JSON.parse(jsonString) as ProgressData;
      setProgress(data);
      return true;
    } catch {
      return false;
    }
  }, [setProgress]);

  const resetProgress = useCallback(() => {
    setProgress(defaultProgress);
  }, [setProgress]);

  const stats = useMemo(() => ({
    totalLabs: progress.completedLabs.length,
    totalCourses: progress.completedCourses.length,
    totalXp: progress.xp,
    streak: progress.streak,
    totalSkills: Object.keys(progress.skillLevels).length,
    avgSkillLevel: Object.values(progress.skillLevels).length > 0
      ? Object.values(progress.skillLevels).reduce((a, b) => a + b, 0) / Object.values(progress.skillLevels).length
      : 0,
    totalActiveDays: Object.keys(progress.activityDates).length,
  }), [progress]);

  return {
    progress,
    stats,
    toggleLab,
    toggleCourse,
    updateSkill,
    addBookmark,
    updateStreak,
    exportProgress,
    importProgress,
    resetProgress,
  };
}
