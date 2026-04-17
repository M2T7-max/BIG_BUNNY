"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText, DollarSign, AlertTriangle, Copy, Check,
  ChevronDown, Search, Target, BookOpen, Award,
  ArrowRight, Shield, Zap, Terminal, Brain, Eye,
  FlaskConical
} from "lucide-react";
import reportsData from "@/data/real-reports.json";
import { useProgress } from "@/lib/hooks/useProgress";

// Additional learning metadata per report
const reportLearning: Record<string, {
  category: string;
  labEnv: string;
  labCmd: string;
  keyConceptsToLearn: string[];
  toolsNeeded: string[];
  similarBugs: string[];
}> = {
  "rr-01": {
    category: "Infrastructure",
    labEnv: "WebGoat SSRF Module",
    labCmd: "docker run -d -p 8082:8080 webgoat/webgoat",
    keyConceptsToLearn: ["Cloud IMDS (Instance Metadata Service)", "SSRF bypass techniques", "AWS IAM credential abuse", "Webhook URL validation"],
    toolsNeeded: ["Burp Suite", "curl", "Python requests", "SSRFmap tool"],
    similarBugs: ["Gitlab SSRF ($4,500)", "Capital One AWS metadata breach", "DigitalOcean SSRF via webhook"]
  },
  "rr-02": {
    category: "RCE",
    labEnv: "DVWA File Upload + bWAPP",
    labCmd: "docker run -d -p 4280:80 vulnerables/web-dvwa",
    keyConceptsToLearn: ["ExifTool CVE-2021-22204", "DjVu file format", "Metadata command injection", "CI/CD pipeline attacks"],
    toolsNeeded: ["exiftool", "Burp Suite", "curl", "Python"],
    similarBugs: ["Yahoo ImageMagick RCE ($14K)", "Pixar Exif RCE", "Flickr ImageTragick"]
  },
  "rr-03": {
    category: "Authentication",
    labEnv: "Juice Shop OAuth Lab",
    labCmd: "docker run -d -p 3001:3000 bkimminich/juice-shop",
    keyConceptsToLearn: ["OAuth 2.0 flow", "Open redirect chaining", "Token leakage via Referer", "redirect_uri validation"],
    toolsNeeded: ["Burp Suite", "Browser DevTools", "OAuth Inspector (Burp Extension)"],
    similarBugs: ["Microsoft OAuth redirect ($5K)", "Instagram token theft", "Uber OAuth misconfiguration"]
  },
  "rr-04": {
    category: "Recon",
    labEnv: "Local DNS / Subdomain Takeover",
    labCmd: "# subfinder + can-i-take-over-xyz\nnpm install -g subzy",
    keyConceptsToLearn: ["DNS CNAME records", "Subdomain enumeration", "Heroku/GitHub Pages takeover", "DNS reconnaissance"],
    toolsNeeded: ["subfinder", "amass", "subzy", "dig", "nslookup"],
    similarBugs: ["Microsoft subdomain takeover ($13K)", "Yahoo dangling DNS ($2K)", "AWS S3 bucket takeover"]
  },
  "rr-05": {
    category: "XSS",
    labEnv: "DVWA XSS Labs + PortSwigger",
    labCmd: "docker run -d -p 4280:80 vulnerables/web-dvwa",
    keyConceptsToLearn: ["Unicode normalization (NFC/NFKC)", "XSS filter bypass", "Fullwidth character encoding", "Input validation timing"],
    toolsNeeded: ["Burp Suite", "DomDigger", "Unicode normalizer", "XSStrike"],
    similarBugs: ["Google Unicode XSS ($7.5K)", "Apple Unicode bypass", "PayPal XSS via encoding"]
  },
  "rr-06": {
    category: "Injection",
    labEnv: "DVWA SQLi + Juice Shop",
    labCmd: "docker run -d -p 4280:80 vulnerables/web-dvwa",
    keyConceptsToLearn: ["UNION-based SQLi", "Out-of-band SQL", "GitHub Enterprise architecture", "Search parameter injection"],
    toolsNeeded: ["sqlmap", "Burp Suite", "curl", "OWASP ZAP"],
    similarBugs: ["Drupal SA-CORE-2018 ($many)", "WordPress SQLi", "Shopify admin SQLi ($20K)"]
  },
  "rr-07": {
    category: "Authorization",
    labEnv: "Juice Shop IDOR Labs",
    labCmd: "docker run -d -p 3001:3000 bkimminich/juice-shop",
    keyConceptsToLearn: ["IDOR via sequential IDs", "API authorization gaps", "Horizontal privilege escalation", "Object reference enumeration"],
    toolsNeeded: ["Burp Intruder", "Autorize extension", "Python requests"],
    similarBugs: ["Uber IDOR trips ($3K)", "Instagram IDOR posts ($6K)", "HackerOne report IDOR ($2K)"]
  },
  "rr-08": {
    category: "Logic Flaw",
    labEnv: "PortSwigger Race Conditions",
    labCmd: "# PortSwigger online labs (race condition)\n# https://portswigger.net/web-security/race-conditions",
    keyConceptsToLearn: ["Race condition (TOCTOU)", "Single-packet attack technique", "State machine vulnerabilities", "Concurrent request abuse"],
    toolsNeeded: ["Burp Suite Pro (Turbo Intruder)", "curl -Z (parallel)", "Go/Python async requests"],
    similarBugs: ["Starbucks free coffee race ($6K)", "Uber fare discount race ($5K)", "GitHub rate limit bypass"]
  },
  "rr-09": {
    category: "CSRF",
    labEnv: "DVWA CSRF Module",
    labCmd: "docker run -d -p 4280:80 vulnerables/web-dvwa",
    keyConceptsToLearn: ["CSRF token mechanics", "SameSite cookie attribute", "Invitation flow security", "CORS vs CSRF relationship"],
    toolsNeeded: ["Burp Suite CSRF PoC Generator", "Browser (two accounts)", "OWASP CSRFtester"],
    similarBugs: ["GitHub CSRF ($3K)", "Dropbox CSRF ($1.5K)", "PayPal CSRF ($3K)"]
  },
  "rr-10": {
    category: "RCE",
    labEnv: "bWAPP File Upload + ImageMagick",
    labCmd: "docker run -d -p 8081:80 raesene/bwapp",
    keyConceptsToLearn: ["ImageMagick CVE-2016-3714", "Delegate processing weakness", "SVG/MVG polyglot files", "Image processing attack surface"],
    toolsNeeded: ["ImageMagick", "exiftool", "Python Pillow", "Burp Suite"],
    similarBugs: ["GitLab Exiftool RCE ($20K)", "Slack image processing RCE", "Pixar RenderMan vulnerabilities"]
  },
  "rr-11": {
    category: "SSRF",
    labEnv: "WebGoat SSRF + PortSwigger",
    labCmd: "docker run -d -p 8082:8080 webgoat/webgoat",
    keyConceptsToLearn: ["Headless Chrome / PDF rendering SSRF", "Cloud metadata via browser", "HTML injection → SSRF chain", "Service account token abuse"],
    toolsNeeded: ["Burp Suite", "curl", "SSRFmap", "Chrome DevTools"],
    similarBugs: ["Shopify PDF SSRF ($25K)", "Confluence PDF SSRF ($10K)", "Notion SSRF via embed"]
  },
  "rr-12": {
    category: "Authentication",
    labEnv: "Juice Shop JWT + WebGoat JWT",
    labCmd: "docker run -d -p 3001:3000 bkimminich/juice-shop",
    keyConceptsToLearn: ["RS256 vs HS256 algorithm confusion", "JWKS endpoint discovery", "Key confusion attack mechanics", "JWT header claims manipulation"],
    toolsNeeded: ["jwt_tool (Python)", "Burp JWT Editor", "jwt.io", "Python PyJWT library"],
    similarBugs: ["Auth0 JWT bypass ($9K)", "Okta key confusion", "Firebase JWT manipulation"]
  },
  "rr-13": {
    category: "XXE",
    labEnv: "bWAPP XXE Module + WebGoat XXE",
    labCmd: "docker run -d -p 8081:80 raesene/bwapp",
    keyConceptsToLearn: ["XML External Entity mechanics", "OOB XXE via DNS/HTTP", "SVG file structure exploitation", "DTD parameter entities"],
    toolsNeeded: ["Burp Suite", "XXEinjector", "Interactsh / Burp Collaborator", "xmllint"],
    similarBugs: ["Facebook XXE via Word doc ($30K)", "Google XXE via SAML", "Microsoft XXE in Office 365"]
  },
  "rr-14": {
    category: "Authentication",
    labEnv: "DVWA Brute Force Module",
    labCmd: "docker run -d -p 4280:80 vulnerables/web-dvwa",
    keyConceptsToLearn: ["OTP/code entropy analysis", "Rate limiting absence", "Password reset flow security", "Concurrent brute forcing"],
    toolsNeeded: ["Burp Intruder", "Python (concurrent.futures)", "Hydra", "ffuf"],
    similarBugs: ["Instagram 6-digit OTP brute ($30K)", "Facebook 2FA bypass ($20K)", "WhatsApp OTP brute"]
  },
  "rr-15": {
    category: "Authorization",
    labEnv: "Juice Shop IDOR + API Testing",
    labCmd: "docker run -d -p 3001:3000 bkimminich/juice-shop",
    keyConceptsToLearn: ["Resource-level authorization", "API vehicle command structure", "IDOR impact escalation", "OAuth scope vs resource ownership"],
    toolsNeeded: ["Burp Suite", "Autorize extension", "Postman API tester", "curl"],
    similarBugs: ["Peloton user data IDOR ($5K)", "Sonos speaker IDOR", "BMW ConnectedDrive API flaws"]
  }
};

function CopyBtn({ text }: { text: string }) {
  const [c, setC] = useState(false);
  return (
    <button
      onClick={() => { navigator.clipboard.writeText(text); setC(true); setTimeout(() => setC(false), 2000); }}
      className="p-1 hover:bg-white/10 rounded"
    >
      {c ? <Check className="w-3 h-3 text-cyber-green" /> : <Copy className="w-3 h-3 text-gray-500" />}
    </button>
  );
}

function ReplicateChallenge({ report }: { report: typeof reportsData[0] }) {
  const [step, setStep] = useState(0);
  const [completed, setCompleted] = useState(false);
  const meta = reportLearning[report.id];

  const challenges = [
    {
      title: "Understand the Vulnerability",
      desc: `Read the summary and identify what type of vulnerability (${report.vuln_type}) was found. What is the root cause?`,
      action: "I understand the vulnerability ✓"
    },
    {
      title: "Study the Attack Flow",
      desc: "Read each reproduction step carefully. Identify exactly where the security boundary was crossed in the application logic.",
      action: "I can trace the attack path ✓"
    },
    {
      title: "Analyze the PoC",
      desc: "Examine the proof of concept code. Why does this payload work? What makes it effective against the target system?",
      action: "I understand the PoC ✓"
    },
    {
      title: "Set Up Lab Environment",
      desc: meta ? `Start the local lab: ${meta.labEnv}. Use the Docker command to set up your practice environment.` : "Set up a local vulnerable environment to practice.",
      action: "Lab environment ready ✓"
    },
    {
      title: "Practice in Safe Lab",
      desc: meta ? `Practice finding ${report.vuln_type} using: ${meta.toolsNeeded.join(", ")}. Follow the attack methodology on your LOCAL lab only.` : `Practice finding ${report.vuln_type} on local lab environments.`,
      action: "Challenge Complete! 🎉"
    },
  ];

  return (
    <div className="mt-4 p-4 bg-dark-800/50 rounded-lg border border-cyber-purple/20">
      <h4 className="text-xs font-mono text-cyber-purple mb-3 uppercase flex items-center gap-2">
        <Target className="w-3 h-3" />Replicate This Bug — Interactive Challenge
      </h4>

      {/* Lab Environment */}
      {meta && (
        <div className="mb-4 p-3 bg-dark-900 rounded border border-dark-600/50">
          <div className="flex items-center gap-2 mb-2">
            <Terminal className="w-3 h-3 text-cyber-green" />
            <span className="text-[10px] font-mono text-cyber-green uppercase">Practice Environment</span>
          </div>
          <div className="relative">
            <pre className="text-[10px] font-mono text-gray-300 overflow-x-auto whitespace-pre-wrap pr-8">{meta.labCmd}</pre>
            <div className="absolute top-0 right-0">
              <CopyBtn text={meta.labCmd} />
            </div>
          </div>
        </div>
      )}

      {/* Challenge Steps */}
      <div className="space-y-2">
        {challenges.map((ch, i) => (
          <div key={i} className={`flex items-start gap-3 p-2.5 rounded-lg transition-all ${
            i === step ? "bg-cyber-purple/5 border border-cyber-purple/20"
              : i < step ? "opacity-60"
              : "opacity-30"
          }`}>
            <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-[10px] font-mono ${
              i < step ? "bg-cyber-green text-black"
                : i === step ? "bg-cyber-purple/20 text-cyber-purple border border-cyber-purple/30"
                : "bg-dark-700 text-gray-600"
            }`}>
              {i < step ? "✓" : i + 1}
            </div>
            <div className="flex-1">
              <p className={`text-xs font-bold ${i <= step ? "text-white" : "text-gray-600"}`}>{ch.title}</p>
              {i === step && <p className="text-[10px] text-gray-400 mt-1 leading-relaxed">{ch.desc}</p>}
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

      {/* Completion */}
      {completed && (
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-3 p-3 bg-cyber-green/10 rounded-lg border border-cyber-green/30 flex items-center gap-2"
        >
          <Award className="w-4 h-4 text-cyber-green" />
          <span className="text-xs font-mono text-cyber-green">Challenge complete! You&apos;ve studied this real-world bug. Now practice it on your local lab — never on unauthorized systems.</span>
        </motion.div>
      )}

      {/* Progress Bar */}
      <div className="mt-3 w-full h-1 bg-dark-700 rounded-full">
        <div
          className="h-full bg-cyber-purple rounded-full transition-all"
          style={{ width: `${((completed ? challenges.length : step) / challenges.length) * 100}%` }}
        />
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

  const sevColor = (s: string) =>
    s === "Critical" ? "text-red-400 bg-red-500/10 border-red-500/20"
      : s === "High" ? "text-orange-400 bg-orange-500/10 border-orange-500/20"
      : "text-yellow-400 bg-yellow-500/10 border-yellow-500/20";

  const totalBounty = reportsData.reduce((a, r) => a + Number(r.bounty.replace(/[^0-9]/g, "")), 0);
  const avgCvss = (reportsData.reduce((a, r) => a + r.cvss, 0) / reportsData.length).toFixed(1);
  const studiedReports = reportsData.filter(r => progress.completedCourses.includes(`report-${r.id}`)).length;

  return (
    <div className="max-w-[1600px] mx-auto px-6 py-8 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <FileText className="w-7 h-7 text-cyber-blue" />
            Real Bug Reports
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyber-blue/20 text-cyber-blue border border-cyber-blue/30">15 REPORTS</span>
          </h1>
          <p className="text-gray-500 text-sm mt-1 font-mono">
            Dissected real HackerOne & Bugcrowd disclosures • Learn from actual bounties • Practice in local labs
          </p>
        </div>
        <div className="flex items-center gap-2 px-3 py-2 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
          <AlertTriangle className="w-3.5 h-3.5 text-yellow-400" />
          <span className="text-[10px] font-mono text-yellow-400">
            Authorized Testing Only — Practice on local Docker labs
          </span>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search reports, targets..." className="cyber-input pl-10" />
        </div>
        <select value={filter} onChange={(e) => setFilter(e.target.value)} className="cyber-input w-auto">
          <option value="all">All Types</option>
          {types.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
      </div>

      {/* Stats Banner */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="glass-card p-4 border-cyber-green/20">
          <div className="flex items-center gap-2 mb-1">
            <DollarSign className="w-4 h-4 text-cyber-green" />
            <span className="text-[10px] text-gray-500 font-mono uppercase">Total Bounties</span>
          </div>
          <p className="text-2xl font-bold text-cyber-green font-mono">${totalBounty.toLocaleString()}</p>
        </div>
        <div className="glass-card p-4">
          <div className="flex items-center gap-2 mb-1">
            <AlertTriangle className="w-4 h-4 text-red-400" />
            <span className="text-[10px] text-gray-500 font-mono uppercase">Avg CVSS</span>
          </div>
          <p className="text-2xl font-bold text-red-400 font-mono">{avgCvss}</p>
        </div>
        <div className="glass-card p-4">
          <div className="flex items-center gap-2 mb-1">
            <BookOpen className="w-4 h-4 text-cyber-blue" />
            <span className="text-[10px] text-gray-500 font-mono uppercase">Reports Studied</span>
          </div>
          <p className="text-2xl font-bold text-white font-mono">{studiedReports}<span className="text-sm text-gray-600">/15</span></p>
        </div>
        <div className="glass-card p-4">
          <div className="flex items-center gap-2 mb-1">
            <Target className="w-4 h-4 text-cyber-purple" />
            <span className="text-[10px] text-gray-500 font-mono uppercase">Vuln Types</span>
          </div>
          <p className="text-2xl font-bold text-white font-mono">{types.length}</p>
        </div>
      </div>

      {/* Reports */}
      <div className="space-y-3">
        {filtered.map((report) => {
          const isOpen = expanded === report.id;
          const isStudied = progress.completedCourses.includes(`report-${report.id}`);
          const meta = reportLearning[report.id];

          return (
            <motion.div
              key={report.id}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className={`glass-card overflow-hidden ${isStudied ? "border-cyber-green/20" : ""}`}
            >
              {/* Report Header */}
              <div
                className="p-4 cursor-pointer hover:bg-white/2 transition-colors"
                onClick={() => setExpanded(isOpen ? null : report.id)}
              >
                <div className="flex items-start gap-3">
                  <button
                    onClick={(e) => { e.stopPropagation(); toggleCourse(`report-${report.id}`); }}
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 transition-all ${
                      isStudied ? "bg-cyber-green border-cyber-green" : "border-gray-600 hover:border-cyber-green/50"
                    }`}
                  >
                    {isStudied && <Check className="w-3 h-3 text-black" />}
                  </button>
                  <div className="flex-1">
                    <h3 className={`text-sm font-bold ${isStudied ? "text-gray-400" : "text-white"}`}>{report.title}</h3>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${sevColor(report.severity)}`}>
                        {report.severity} • CVSS {report.cvss}
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyber-green/10 text-cyber-green border border-cyber-green/20">
                        {report.bounty}
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-dark-700 text-gray-400">
                        {report.vuln_type}
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyber-purple/10 text-cyber-purple border border-cyber-purple/20">
                        {report.platform}
                      </span>
                      {meta && (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyber-blue/10 text-cyber-blue border border-cyber-blue/20">
                          {meta.category}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-cyber-green font-bold font-mono">{report.bounty}</p>
                    <p className="text-[10px] text-gray-600">{report.target}</p>
                  </div>
                  <ChevronDown className={`w-5 h-5 text-gray-500 transition-transform shrink-0 ${isOpen ? "rotate-180" : ""}`} />
                </div>
              </div>

              {/* Expanded Content */}
              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden border-t border-dark-600/50"
                  >
                    <div className="p-4 space-y-5">
                      {/* Disclaimer */}
                      <div className="flex items-start gap-2 p-2.5 bg-yellow-500/5 border border-yellow-500/20 rounded-lg">
                        <AlertTriangle className="w-3.5 h-3.5 text-yellow-400 shrink-0 mt-0.5" />
                        <p className="text-[10px] font-mono text-yellow-400/80">
                          I have permission and am authorized to perform this pentest. This is an educational dissection of a publicly disclosed bug report. Practice ONLY on authorized local lab environments.
                        </p>
                      </div>

                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Left — Report Details */}
                        <div className="space-y-4">
                          {/* Summary */}
                          <div>
                            <div className="flex items-center gap-2 mb-2 text-cyber-blue">
                              <Brain className="w-4 h-4" />
                              <span className="text-[10px] font-mono uppercase tracking-wider font-bold">Vulnerability Summary</span>
                            </div>
                            <p className="text-sm text-gray-300 leading-relaxed">{report.summary}</p>
                          </div>

                          {/* Steps to Reproduce */}
                          <div>
                            <div className="flex items-center gap-2 mb-2 text-cyber-purple">
                              <Eye className="w-4 h-4" />
                              <span className="text-[10px] font-mono uppercase tracking-wider font-bold">Steps to Reproduce</span>
                            </div>
                            <ol className="space-y-1.5">
                              {report.steps.map((s, i) => (
                                <li key={i} className="text-xs text-gray-400 flex gap-2">
                                  <span className="text-cyber-green shrink-0 font-mono font-bold">{i + 1}.</span>
                                  <span>{s}</span>
                                </li>
                              ))}
                            </ol>
                          </div>

                          {/* Impact */}
                          <div>
                            <div className="flex items-center gap-2 mb-2 text-red-400">
                              <Zap className="w-4 h-4" />
                              <span className="text-[10px] font-mono uppercase tracking-wider font-bold">Impact</span>
                            </div>
                            <p className="text-sm text-red-400/80">{report.impact}</p>
                          </div>

                          {/* Takeaway */}
                          <div className="p-3 bg-yellow-500/5 border border-yellow-500/20 rounded-lg">
                            <div className="flex items-center gap-1 mb-1 text-yellow-400">
                              <AlertTriangle className="w-3.5 h-3.5" />
                              <span className="text-[10px] font-mono uppercase font-bold">Key Takeaway</span>
                            </div>
                            <p className="text-sm text-gray-300">{report.takeaway}</p>
                          </div>
                        </div>

                        {/* Right — PoC + Learning */}
                        <div className="space-y-4">
                          {/* PoC Code */}
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2 text-cyber-green">
                                <Terminal className="w-4 h-4" />
                                <span className="text-[10px] font-mono uppercase tracking-wider font-bold">PoC Code</span>
                              </div>
                              <CopyBtn text={report.poc_code} />
                            </div>
                            <pre className="bg-black/50 border border-cyber-green/20 p-3 rounded text-[11px] font-mono text-cyber-green overflow-x-auto whitespace-pre-wrap leading-relaxed">
                              {report.poc_code}
                            </pre>
                          </div>

                          {/* Tools & Learning */}
                          {meta && (
                            <>
                              <div>
                                <div className="flex items-center gap-2 mb-2 text-cyber-blue">
                                  <FlaskConical className="w-4 h-4" />
                                  <span className="text-[10px] font-mono uppercase tracking-wider font-bold">Tools Required</span>
                                </div>
                                <div className="flex flex-wrap gap-1.5">
                                  {meta.toolsNeeded.map((tool) => (
                                    <span key={tool} className="text-[10px] font-mono px-2 py-1 bg-cyber-blue/10 text-cyber-blue border border-cyber-blue/20 rounded">
                                      {tool}
                                    </span>
                                  ))}
                                </div>
                              </div>

                              <div>
                                <div className="flex items-center gap-2 mb-2 text-cyber-purple">
                                  <BookOpen className="w-4 h-4" />
                                  <span className="text-[10px] font-mono uppercase tracking-wider font-bold">Key Concepts to Learn</span>
                                </div>
                                <ul className="space-y-1">
                                  {meta.keyConceptsToLearn.map((concept) => (
                                    <li key={concept} className="flex items-center gap-2 text-[11px] text-gray-400">
                                      <span className="text-cyber-purple">→</span>
                                      {concept}
                                    </li>
                                  ))}
                                </ul>
                              </div>

                              <div>
                                <div className="flex items-center gap-2 mb-2 text-green-400">
                                  <Shield className="w-4 h-4" />
                                  <span className="text-[10px] font-mono uppercase tracking-wider font-bold">Similar Real Bugs</span>
                                </div>
                                <ul className="space-y-1">
                                  {meta.similarBugs.map((bug) => (
                                    <li key={bug} className="flex items-center gap-2 text-[11px] text-gray-500">
                                      <span className="text-green-500">•</span>
                                      {bug}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Replicate Challenge */}
                      <button
                        onClick={() => setShowChallenge(showChallenge === report.id ? null : report.id)}
                        className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-cyber-purple/10 border border-cyber-purple/20 rounded-lg hover:bg-cyber-purple/20 transition-all text-sm font-mono text-cyber-purple"
                      >
                        <Target className="w-4 h-4" />
                        {showChallenge === report.id ? "Hide Challenge" : "🎯 Replicate This Bug — Interactive Practice Challenge"}
                        <ArrowRight className={`w-4 h-4 transition-transform ${showChallenge === report.id ? "rotate-90" : ""}`} />
                      </button>
                      {showChallenge === report.id && <ReplicateChallenge report={report} />}

                      {/* Mark Studied */}
                      <div className="flex justify-end border-t border-dark-600/30 pt-3">
                        <button
                          onClick={() => toggleCourse(`report-${report.id}`)}
                          className={`flex items-center gap-2 px-4 py-2 text-xs font-mono rounded-lg border transition-all ${
                            isStudied
                              ? "bg-cyber-green/20 text-cyber-green border-cyber-green/30"
                              : "bg-dark-700 text-gray-400 border-dark-600 hover:border-cyber-green/30 hover:text-cyber-green"
                          }`}
                        >
                          {isStudied ? <><Check className="w-3.5 h-3.5" /> Studied (+15 XP)</> : <><BookOpen className="w-3.5 h-3.5" /> Mark as Studied</>}
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
