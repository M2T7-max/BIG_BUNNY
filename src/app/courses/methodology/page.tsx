"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Compass, ChevronDown, Target, BookOpen, FileSearch, PenTool, MessageSquare, ArrowRight, Check, Clock, Copy } from "lucide-react";
import { useProgress } from "@/lib/hooks/useProgress";

function CopyBtn({ text }: { text: string }) {
  const [c, setC] = useState(false);
  return <button onClick={() => { navigator.clipboard.writeText(text); setC(true); setTimeout(() => setC(false), 2000); }} className="p-1 hover:bg-white/10 rounded">{c ? <Check className="w-3 h-3 text-cyber-green" /> : <Copy className="w-3 h-3 text-gray-500" />}</button>;
}

const phases = [
  { id: "target", title: "1. Target Selection", icon: Target, color: "text-cyber-green", bg: "bg-cyber-green/10", border: "border-cyber-green/20",
    tools: ["Google", "HackerOne", "Bugcrowd", "Intigriti"],
    estimatedTime: "1-2 hours",
    steps: [
      { title: "Choose Bug Bounty Platform", desc: "HackerOne, Bugcrowd, Intigriti, or independent programs", tips: ["Start with programs that have wide scope", "Look for new programs (less competition)", "Read scope carefully - avoid out-of-scope testing"], command: "# Check HackerOne directory\ncurl -s https://hackerone.com/directory/programs | jq '.results[].name'" },
      { title: "Analyze Scope & Rules", desc: "Understand what's in-scope, out-of-scope, and program rules", tips: ["Check for wildcard domains (*.target.com)", "Note excluded vulnerability types", "Understand safe harbor provisions"], command: "# Download scope\ncurl -s 'https://api.hackerone.com/v1/programs/{program}' | jq '.scope'" },
      { title: "Assess Program Maturity", desc: "Evaluate response times, bounty ranges, and program reputation", tips: ["Check average response time on platform", "Review past bounties for pricing insight", "Avoid programs with poor communication"], command: "# Check program stats\n# Look for: avg response time, bounty range, resolved reports" },
    ]
  },
  { id: "recon", title: "2. Recon Pipeline", icon: FileSearch, color: "text-cyber-blue", bg: "bg-cyber-blue/10", border: "border-cyber-blue/20",
    tools: ["Subfinder", "Amass", "Httpx", "Naabu", "Ffuf", "Wappalyzer"],
    estimatedTime: "4-8 hours",
    steps: [
      { title: "Subdomain Enumeration", desc: "Discover all subdomains using multiple data sources", tips: ["Use subfinder, amass, assetfinder in combination", "Check certificate transparency logs (crt.sh)", "Try DNS brute-forcing with commonspeak2 wordlist"], command: "subfinder -d target.com -all -recursive -o subs.txt\namass enum -d target.com -o amass.txt\ncat subs.txt amass.txt | sort -u > all_subs.txt" },
      { title: "Port Scanning & Service ID", desc: "Identify open ports and running services", tips: ["Use naabu for fast port scanning", "Run nmap with version detection on discovered ports", "Check for non-standard ports (8080, 8443, 9090)"], command: "cat all_subs.txt | naabu -silent -o ports.txt\nnmap -sV -sC -p- -iL ports.txt -o nmap_results.txt" },
      { title: "Content Discovery", desc: "Find hidden endpoints, directories, and files", tips: ["Use ffuf with multiple wordlists", "Check robots.txt and sitemap.xml", "Look for backup files (.bak, .old, .swp)"], command: "ffuf -u https://FUZZ.target.com -w wordlist.txt -mc 200\nffuf -u https://target.com/FUZZ -w directories.txt" },
      { title: "Technology Fingerprinting", desc: "Identify tech stack, frameworks, and versions", tips: ["Use Wappalyzer or httpx with tech-detect", "Check HTTP headers for server info", "Analyze JavaScript files for framework clues"], command: "cat all_subs.txt | httpx -tech-detect -status-code -title\nwhatweb target.com" },
    ]
  },
  { id: "discovery", title: "3. Bug Discovery", icon: BookOpen, color: "text-cyber-purple", bg: "bg-cyber-purple/10", border: "border-cyber-purple/20",
    tools: ["Burp Suite", "SQLMap", "XSStrike", "ParamSpider", "Arjun"],
    estimatedTime: "8-20 hours",
    steps: [
      { title: "Parameter Analysis", desc: "Test all input parameters for injection vulnerabilities", tips: ["Use Burp Intruder for parameter fuzzing", "Test both GET and POST parameters", "Check hidden form fields and API parameters"], command: "# ParamSpider for parameter discovery\nparamspider -d target.com\n\n# Arjun for hidden parameters\narjun -u https://target.com/endpoint" },
      { title: "Authentication Testing", desc: "Test login, session, and access control mechanisms", tips: ["Check for default credentials", "Test password reset flow for flaws", "Look for JWT misconfigurations"], command: "# JWT analysis\njwt_tool eyJ...(token) -C -d wordlist.txt\n\n# Brute force\nhydra -l admin -P passwords.txt target.com http-post-form" },
      { title: "Business Logic Testing", desc: "Think about how the application should work, then try to break it", tips: ["Test negative values in quantity/price fields", "Skip steps in multi-step processes", "Test role-based access between user levels"], command: "# No automated tool - manual testing with Burp\n# Intercept and modify requests\n# Change IDs, prices, quantities, roles" },
      { title: "API Testing", desc: "Test API endpoints for security misconfigurations", tips: ["Look for unauthenticated endpoints", "Test for BOLA/IDOR on resource endpoints", "Check rate limiting and input validation"], command: "# API enumeration\nffuf -u https://api.target.com/FUZZ -w api-wordlist.txt\n\n# IDOR testing\ncurl -H 'Auth: token' https://api.target.com/users/1\ncurl -H 'Auth: token' https://api.target.com/users/2" },
    ]
  },
  { id: "poc", title: "4. PoC & Validation", icon: PenTool, color: "text-yellow-400", bg: "bg-yellow-500/10", border: "border-yellow-500/20",
    tools: ["Burp Suite", "curl", "Browser DevTools", "Screen recorder"],
    estimatedTime: "1-3 hours",
    steps: [
      { title: "Confirm Vulnerability", desc: "Verify the bug is real and reproducible", tips: ["Test in an incognito/private browser", "Reproduce on different machines if possible", "Record screen capture of exploitation"], command: "# Verify XSS\ncurl -s 'https://target.com/search?q=<script>alert(1)</script>'\n\n# Verify SQLi\ncurl -s 'https://target.com/api?id=1 OR 1=1'" },
      { title: "Assess Impact", desc: "Determine the real-world impact of the vulnerability", tips: ["Can you access other users' data?", "Can you escalate privileges?", "Can you chain with other bugs for higher impact?"], command: "# Impact assessment checklist:\n# [ ] Data exfiltration possible?\n# [ ] Account takeover possible?\n# [ ] Privilege escalation possible?\n# [ ] Affects all users?" },
      { title: "Create Minimal PoC", desc: "Build the simplest proof of concept that demonstrates the bug", tips: ["Use curl commands when possible", "Include exact URLs and payloads", "Make it reproducible in one step if possible"], command: "# Minimal PoC example\ncurl -X POST https://target.com/api/v1/user \\\n  -H 'Content-Type: application/json' \\\n  -d '{\"id\":\"OTHER_USER_ID\"}' \\\n  -H 'Authorization: Bearer YOUR_TOKEN'" },
    ]
  },
  { id: "report", title: "5. Report Writing", icon: MessageSquare, color: "text-cyber-pink", bg: "bg-pink-500/10", border: "border-pink-500/20",
    tools: ["Markdown editor", "CVSS Calculator", "Screenshot tools"],
    estimatedTime: "1-2 hours",
    steps: [
      { title: "Write Clear Title", desc: "Summarize the vulnerability in one sentence", tips: ["Format: [Vuln Type] in [Feature] allows [Impact]", "Example: Stored XSS in comment field allows session hijacking", "Be specific, not generic"], command: "# Title template:\n# [VulnType] in [Component/Feature] allows [Impact]\n#\n# Good: 'IDOR in /api/users/{id} leaks PII of all users'\n# Bad: 'Security Vulnerability Found'" },
      { title: "Structure the Report", desc: "Follow standard format: Summary → Steps → Impact → Fix", tips: ["Include CVSS score", "Add screenshots at each step", "Suggest remediation"], command: "# Report structure:\n# 1. Title\n# 2. Severity + CVSS\n# 3. Description (2-3 sentences)\n# 4. Steps to Reproduce\n# 5. Impact\n# 6. Proof of Concept\n# 7. Suggested Fix" },
      { title: "Submit & Follow Up", desc: "Submit through the platform and track response", tips: ["Be patient - average response is 7-14 days", "Be professional in all communication", "Provide additional info if requested"], command: "# Post-submission checklist:\n# [ ] Report submitted via platform\n# [ ] Added all PoC evidence\n# [ ] Included severity assessment\n# [ ] Set up notification for responses" },
    ]
  },
  { id: "followup", title: "6. Follow-up", icon: ArrowRight, color: "text-orange-400", bg: "bg-orange-500/10", border: "border-orange-500/20",
    tools: ["Platform notifications", "Note-taking app"],
    estimatedTime: "Ongoing",
    steps: [
      { title: "Respond to Triage", desc: "Answer triage team questions quickly and professionally", tips: ["Provide additional PoC if requested", "Clarify impact with concrete examples", "Don't argue severity in first response"], command: "# Response template:\n# 'Thank you for reviewing. Here is additional info:\n# [Additional PoC/evidence]\n# Please let me know if you need anything else.'" },
      { title: "Retest After Fix", desc: "Verify the fix when notified, check for bypasses", tips: ["Test the exact same steps from your report", "Look for bypass variations", "Report incomplete fixes as new submissions"], command: "# Retest checklist:\n# [ ] Original payload blocked?\n# [ ] Bypass attempts tested?\n# [ ] Fix applied to all instances?\n# [ ] Edge cases checked?" },
      { title: "Learn & Iterate", desc: "Document what worked, improve methodology, move to next target", tips: ["Keep notes on successful techniques", "Update your recon automation", "Share knowledge with community"], command: "# Post-bounty review:\n# 1. What technique worked?\n# 2. What tools were most useful?\n# 3. What would I do differently?\n# 4. Add to personal playbook" },
    ]
  },
];

export default function MethodologyPage() {
  const [expanded, setExpanded] = useState<string | null>("target");
  const { progress, toggleCourse } = useProgress();

  const totalSteps = phases.reduce((a, p) => a + p.steps.length, 0);
  const completedSteps = phases.reduce((a, p) => a + p.steps.filter(s => progress.completedCourses.includes(`meth-${p.id}-${s.title}`)).length, 0);

  return (
    <div className="max-w-[1600px] mx-auto px-6 py-8 space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3"><Compass className="w-7 h-7 text-cyber-blue" />Bug Bounty Methodology</h1>
          <p className="text-gray-500 text-sm mt-1 font-mono">6-phase structured approach to finding and reporting vulnerabilities</p>
        </div>
        <div className="glass-card p-3 text-center">
          <p className="text-2xl font-bold text-cyber-green font-mono">{completedSteps}<span className="text-sm text-gray-600">/{totalSteps}</span></p>
          <p className="text-[10px] text-gray-500 font-mono uppercase">Steps Done</p>
        </div>
      </div>

      {/* Phase Overview */}
      <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
        {phases.map((phase, i) => {
          const Icon = phase.icon;
          const done = phase.steps.filter(s => progress.completedCourses.includes(`meth-${phase.id}-${s.title}`)).length;
          const isActive = expanded === phase.id;
          return (
            <button key={phase.id} onClick={() => setExpanded(isActive ? null : phase.id)} className={`glass-card p-3 text-center transition-all hover:-translate-y-0.5 ${isActive ? "border-cyber-blue/30" : ""}`}>
              <Icon className={`w-5 h-5 mx-auto mb-1 ${phase.color}`} />
              <p className="text-[10px] font-mono text-gray-400">Phase {i + 1}</p>
              <p className="text-xs font-bold text-white font-mono">{done}/{phase.steps.length}</p>
              <div className="w-full h-1 bg-dark-700 rounded-full mt-2">
                <div className="h-full bg-cyber-green rounded-full" style={{ width: `${(done / phase.steps.length) * 100}%` }} />
              </div>
            </button>
          );
        })}
      </div>

      {/* Phase Cards */}
      <div className="space-y-3">
        {phases.map((phase, pi) => {
          const isOpen = expanded === phase.id;
          const Icon = phase.icon;
          return (
            <motion.div key={phase.id} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: pi * 0.05 }} className="glass-card overflow-hidden">
              <button onClick={() => setExpanded(isOpen ? null : phase.id)} className={`w-full flex items-center gap-4 p-5 text-left transition-colors hover:bg-white/5 ${isOpen ? "border-b border-dark-600/50" : ""}`}>
                <div className={`w-10 h-10 rounded-xl ${phase.bg} flex items-center justify-center border ${phase.border}`}><Icon className={`w-5 h-5 ${phase.color}`} /></div>
                <div className="flex-1">
                  <p className="text-base font-bold text-white">{phase.title}</p>
                  <div className="flex items-center gap-3 mt-0.5">
                    <span className="text-xs text-gray-500">{phase.steps.length} steps</span>
                    <span className="text-[10px] text-gray-600 flex items-center gap-1"><Clock className="w-3 h-3" />{phase.estimatedTime}</span>
                  </div>
                </div>
                {/* Tools */}
                <div className="hidden md:flex gap-1">
                  {phase.tools.slice(0, 3).map(t => (
                    <span key={t} className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-dark-700 text-gray-500">{t}</span>
                  ))}
                  {phase.tools.length > 3 && <span className="text-[9px] text-gray-600">+{phase.tools.length - 3}</span>}
                </div>
                <ChevronDown className={`w-5 h-5 text-gray-500 transition-transform ${isOpen ? "rotate-180" : ""}`} />
              </button>
              {isOpen && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-5 space-y-4">
                  {phase.steps.map((step, si) => {
                    const stepId = `meth-${phase.id}-${step.title}`;
                    const isDone = progress.completedCourses.includes(stepId);
                    return (
                      <div key={si} className="flex gap-4">
                        <div className="flex flex-col items-center">
                          <button
                            onClick={() => toggleCourse(stepId)}
                            className={`w-8 h-8 rounded-full flex items-center justify-center border-2 text-xs font-mono transition-all ${isDone ? "bg-cyber-green border-cyber-green text-black" : `${phase.bg} ${phase.border} ${phase.color} hover:opacity-80`}`}
                          >
                            {isDone ? <Check className="w-4 h-4" /> : si + 1}
                          </button>
                          {si < phase.steps.length - 1 && <div className="w-px h-full bg-dark-600 my-1" />}
                        </div>
                        <div className="flex-1 pb-4">
                          <div className="flex items-center gap-2">
                            <h4 className={`text-sm font-bold ${isDone ? "text-gray-500 line-through" : "text-white"}`}>{step.title}</h4>
                            {isDone && <span className="text-[8px] font-mono text-cyber-green bg-cyber-green/10 px-1.5 py-0.5 rounded">✓ Done</span>}
                          </div>
                          <p className="text-xs text-gray-400 mt-1">{step.desc}</p>
                          <div className="mt-2 space-y-1">
                            {step.tips.map((tip, ti) => (
                              <div key={ti} className="flex items-start gap-2 text-[11px] text-gray-500"><span className={phase.color}>•</span><span>{tip}</span></div>
                            ))}
                          </div>
                          {/* Command reference */}
                          {step.command && (
                            <div className="mt-3 bg-black/30 rounded-lg p-3 relative">
                              <div className="absolute top-2 right-2"><CopyBtn text={step.command} /></div>
                              <pre className="text-[10px] font-mono text-cyber-green whitespace-pre-wrap pr-8">{step.command}</pre>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </motion.div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
