"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import {
  Home, FlaskConical, GraduationCap, Wrench, BarChart3, Skull,
  Search, Terminal, Shield, ChevronDown, Zap, Flame, Compass,
  FileText, BookOpen, Workflow, Target, Trophy,
} from "lucide-react";

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
  dropdown?: { label: string; href: string; icon: React.ElementType; desc: string; isNew?: boolean }[];
}

const navItems: NavItem[] = [
  { label: "Home", href: "/", icon: Home },
  {
    label: "Labs", href: "/labs", icon: FlaskConical,
    dropdown: [
      { label: "All Labs", href: "/labs", icon: FlaskConical, desc: "100+ labs across 9 platforms" },
      { label: "Real Reports", href: "/labs/real-reports", icon: FileText, desc: "15 dissected HackerOne reports", isNew: true },
    ],
  },
  {
    label: "Courses", href: "/courses", icon: GraduationCap,
    dropdown: [
      { label: "All Courses", href: "/courses", icon: GraduationCap, desc: "200+ modules in 4 phases" },
      { label: "Bootcamp", href: "/courses/bootcamp", icon: BookOpen, desc: "25-chapter complete guide", isNew: true },
      { label: "Methodology", href: "/courses/methodology", icon: Compass, desc: "6-phase bug hunting approach", isNew: true },
    ],
  },
  {
    label: "Tools", href: "/tools", icon: Wrench,
    dropdown: [
      { label: "Security Tools", href: "/tools", icon: Wrench, desc: "Editors, commands, cheatsheets" },
      { label: "Hacking Tools", href: "/tools/hacking", icon: Zap, desc: "11 pentest tools + Rubber Ducky" },
      { label: "Automation", href: "/tools/automation", icon: Workflow, desc: "5 recon/attack pipelines", isNew: true },
    ],
  },
  { label: "Challenges", href: "/challenges", icon: Flame },
  {
    label: "Programs", href: "/programs/selector", icon: Target,
  },
  { label: "Reports", href: "/reports/academy", icon: FileText },
  {
    label: "Progress", href: "/progress", icon: BarChart3,
    dropdown: [
      { label: "Progress Tracker", href: "/progress", icon: BarChart3, desc: "Skills matrix & readiness" },
      { label: "Career Tracker", href: "/progress/career", icon: Trophy, desc: "Career roadmap & portfolio", isNew: true },
    ],
  },
  { label: "Red Team", href: "/redteam", icon: Skull },
];

export default function Navbar() {
  const pathname = usePathname();
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") { e.preventDefault(); setSearchOpen((p) => !p); }
      if (e.key === "Escape") { setSearchOpen(false); setOpenDropdown(null); }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) setOpenDropdown(null);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "bg-dark-900/95 backdrop-blur-xl border-b border-dark-600/50 shadow-lg" : "bg-dark-900/80 backdrop-blur-md border-b border-transparent"}`}>
        <div className="max-w-[1800px] mx-auto px-4">
          <div className="flex items-center justify-between h-14">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group shrink-0">
              <div className="relative">
                <Shield className="w-7 h-7 text-cyber-green group-hover:drop-shadow-[0_0_8px_rgba(0,255,65,0.6)] transition-all" />
                <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-cyber-green rounded-full animate-pulse-glow" />
              </div>
              <div className="flex flex-col">
                <span className="font-mono text-base font-bold text-white tracking-wider leading-tight">BUG<span className="text-cyber-green">BOUNTY</span></span>
                <span className="text-[8px] text-gray-500 font-mono tracking-widest -mt-0.5">UNIVERSITY</span>
              </div>
            </Link>

            {/* Navigation */}
            <div className="flex items-center gap-0.5" ref={dropdownRef}>
              {navItems.map((item) => {
                const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
                const Icon = item.icon;
                const hasDropdown = !!item.dropdown;
                const isDropdownOpen = openDropdown === item.label;

                if (hasDropdown) {
                  return (
                    <div key={item.label} className="relative">
                      <button
                        onClick={() => setOpenDropdown(isDropdownOpen ? null : item.label)}
                        className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all group ${isActive ? "text-cyber-green bg-cyber-green/10" : "text-gray-400 hover:text-white hover:bg-white/5"}`}
                      >
                        <Icon className={`w-3.5 h-3.5 ${isActive ? "text-cyber-green" : "group-hover:text-cyber-blue"}`} />
                        <span>{item.label}</span>
                        <ChevronDown className={`w-3 h-3 transition-transform ${isDropdownOpen ? "rotate-180" : ""}`} />
                        {isActive && <div className="absolute bottom-0 left-2 right-2 h-[2px] bg-cyber-green shadow-[0_0_8px_rgba(0,255,65,0.5)]" />}
                      </button>
                      {isDropdownOpen && (
                        <div className="absolute top-full left-0 mt-2 w-60 glass-card border border-dark-600/70 shadow-2xl animate-slide-up z-50">
                          {item.dropdown!.map((sub) => {
                            const SubIcon = sub.icon;
                            const subActive = pathname === sub.href;
                            return (
                              <Link key={sub.href} href={sub.href} onClick={() => setOpenDropdown(null)} className={`flex items-center gap-3 px-3 py-2.5 transition-colors first:rounded-t-lg last:rounded-b-lg ${subActive ? "bg-cyber-green/10 text-cyber-green" : "text-gray-400 hover:bg-white/5 hover:text-white"}`}>
                                <SubIcon className={`w-3.5 h-3.5 ${subActive ? "text-cyber-green" : ""}`} />
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-1.5">
                                    <span className="text-xs font-medium">{sub.label}</span>
                                    {sub.isNew && <span className="text-[7px] font-mono px-1 py-0 rounded bg-red-500/20 text-red-400 border border-red-500/30 animate-pulse leading-relaxed">NEW</span>}
                                  </div>
                                  <p className="text-[9px] text-gray-600 mt-0.5">{sub.desc}</p>
                                </div>
                              </Link>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                }

                return (
                  <Link key={item.href} href={item.href} className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all group ${isActive ? "text-cyber-green bg-cyber-green/10" : "text-gray-400 hover:text-white hover:bg-white/5"}`}>
                    <Icon className={`w-3.5 h-3.5 ${isActive ? "text-cyber-green" : "group-hover:text-cyber-blue"}`} />
                    <span>{item.label}</span>
                    {isActive && <div className="absolute bottom-0 left-2 right-2 h-[2px] bg-cyber-green shadow-[0_0_8px_rgba(0,255,65,0.5)]" />}
                  </Link>
                );
              })}
            </div>

            {/* Search */}
            <div className="flex items-center gap-2 shrink-0">
              <button onClick={() => setSearchOpen(true)} className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-dark-600 bg-dark-800/50 text-gray-500 text-xs hover:border-cyber-green/30 transition-all">
                <Search className="w-3.5 h-3.5" />
                <kbd className="hidden lg:inline px-1 py-0.5 text-[9px] font-mono bg-dark-700 rounded border border-dark-600">⌘K</kbd>
              </button>
              <div className="flex items-center gap-1 px-2 py-1 rounded bg-cyber-green/10 border border-cyber-green/20">
                <Terminal className="w-3 h-3 text-cyber-green" />
                <span className="text-[10px] font-mono text-cyber-green">v2.0</span>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Search Modal */}
      {searchOpen && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[20vh]">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setSearchOpen(false)} />
          <div className="relative w-full max-w-2xl mx-4 animate-slide-up">
            <div className="glass-card border border-dark-600 shadow-2xl">
              <div className="flex items-center gap-3 px-4 py-3 border-b border-dark-600">
                <Search className="w-5 h-5 text-cyber-green" />
                <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search pages, tools, reports..." className="flex-1 bg-transparent text-white placeholder-gray-500 outline-none font-mono text-sm" autoFocus />
                <kbd className="px-2 py-1 text-[10px] font-mono text-gray-500 bg-dark-700 rounded border border-dark-600">ESC</kbd>
              </div>
              <div className="p-4 max-h-[350px] overflow-y-auto">
                {!searchQuery ? (
                  <div className="text-center py-8 text-gray-500"><Terminal className="w-8 h-8 mx-auto mb-2 opacity-50" /><p className="text-sm font-mono">Type to search across all sections...</p></div>
                ) : (
                  <div className="space-y-1">
                    {navItems.flatMap((item) => {
                      const results: { label: string; href: string; icon: React.ElementType; tag?: string }[] = [];
                      if (item.label.toLowerCase().includes(searchQuery.toLowerCase())) results.push({ label: item.label, href: item.href, icon: item.icon, tag: "Page" });
                      item.dropdown?.forEach((sub) => {
                        if (sub.label.toLowerCase().includes(searchQuery.toLowerCase()) || sub.desc.toLowerCase().includes(searchQuery.toLowerCase())) {
                          results.push({ label: sub.label, href: sub.href, icon: sub.icon, tag: sub.isNew ? "NEW" : "Sub-page" });
                        }
                      });
                      return results;
                    }).map((r) => (
                      <Link key={r.href} href={r.href} onClick={() => setSearchOpen(false)} className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-dark-700 transition-colors">
                        <r.icon className="w-4 h-4 text-cyber-green" />
                        <span className="text-sm text-gray-300">{r.label}</span>
                        <span className={`ml-auto text-[10px] font-mono ${r.tag === "NEW" ? "text-red-400" : "text-gray-600"}`}>{r.tag}</span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
