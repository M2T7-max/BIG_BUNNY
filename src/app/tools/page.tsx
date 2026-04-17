"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import {
  Wrench, Code, Terminal, Search, Copy, Check,
  Play, ChevronRight, BookOpen, Crosshair, Server, FileCode
} from "lucide-react";
import kaliData from "@/data/kali-commands.json";
import pythonScripts from "@/data/tools/python-scripts.json";
import metasploitData from "@/data/metasploit-modules.json";
import cheatsheetsData from "@/data/cheatsheets.json";

const MonacoEditor = dynamic(() => import("@monaco-editor/react"), { ssr: false });

const tabs = [
  { id: "python", label: "Python Editor", icon: Code },
  { id: "js", label: "JS Console", icon: FileCode },
  { id: "kali", label: "Kali Commands", icon: Terminal },
  { id: "metasploit", label: "Metasploit", icon: Crosshair },
  { id: "cheatsheets", label: "Cheatsheets", icon: BookOpen },
];

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button onClick={handleCopy} className="p-1 hover:bg-white/10 rounded transition-colors" title="Copy">
      {copied ? <Check className="w-3.5 h-3.5 text-cyber-green" /> : <Copy className="w-3.5 h-3.5 text-gray-500" />}
    </button>
  );
}

// Python Editor Tab
function PythonEditor() {
  const [selectedScript, setSelectedScript] = useState(pythonScripts[0]);
  const [code, setCode] = useState(pythonScripts[0].code);
  const [output, setOutput] = useState("# Click 'Run' to execute (simulated output)\n# In a real environment, connect to a Python backend");

  const runCode = () => {
    setOutput(`[*] Executing: ${selectedScript.name}\n[*] Script loaded successfully\n\n# Note: This is a code editor for reference and learning.\n# To actually execute, copy this script and run locally:\n#   python3 script.py\n\n[+] Script ready for execution\n[*] Output would appear here in a real environment`);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 h-[600px]">
      {/* Script Library */}
      <div className="lg:col-span-1 glass-card overflow-y-auto">
        <div className="p-3 border-b border-dark-600/50">
          <h3 className="text-xs font-mono text-gray-400 uppercase">Script Library</h3>
        </div>
        <div className="p-2 space-y-1">
          {pythonScripts.map((script) => (
            <button
              key={script.id}
              onClick={() => { setSelectedScript(script); setCode(script.code); }}
              className={`w-full text-left p-2 rounded text-xs transition-colors ${
                selectedScript.id === script.id
                  ? "bg-cyber-green/10 text-cyber-green border border-cyber-green/20"
                  : "text-gray-400 hover:bg-white/5"
              }`}
            >
              <div className="font-mono font-medium truncate">{script.name}</div>
              <div className="text-[10px] text-gray-600 mt-0.5">{script.category}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Editor + Output */}
      <div className="lg:col-span-3 flex flex-col gap-3">
        {/* Toolbar */}
        <div className="flex items-center justify-between px-3 py-2 glass-card">
          <div className="flex items-center gap-2">
            <Code className="w-4 h-4 text-cyber-green" />
            <span className="text-sm font-mono text-white">{selectedScript.name}</span>
            <span className="text-[10px] text-gray-500 font-mono px-2 py-0.5 bg-dark-700 rounded">{selectedScript.difficulty}</span>
          </div>
          <div className="flex items-center gap-2">
            <CopyButton text={code} />
            <button onClick={runCode} className="flex items-center gap-1 px-3 py-1 text-xs font-mono bg-cyber-green/20 text-cyber-green rounded border border-cyber-green/30 hover:bg-cyber-green/30 transition-colors">
              <Play className="w-3 h-3" /> Run
            </button>
          </div>
        </div>

        {/* Editor */}
        <div className="flex-1 rounded-lg overflow-hidden border border-dark-600/50">
          <MonacoEditor
            height="100%"
            language="python"
            theme="vs-dark"
            value={code}
            onChange={(v) => setCode(v || "")}
            options={{
              fontSize: 13,
              fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
              minimap: { enabled: false },
              padding: { top: 12 },
              scrollBeyondLastLine: false,
              wordWrap: "on",
              lineNumbers: "on",
              renderLineHighlight: "gutter",
              automaticLayout: true,
            }}
          />
        </div>

        {/* Output */}
        <div className="h-32 terminal-window">
          <div className="terminal-header">
            <div className="terminal-dot bg-red-500" />
            <div className="terminal-dot bg-yellow-500" />
            <div className="terminal-dot bg-green-500" />
            <span className="text-xs text-gray-500 ml-2 font-mono">Output</span>
          </div>
          <pre className="p-3 text-xs text-cyber-green font-mono overflow-auto h-full">{output}</pre>
        </div>
      </div>
    </div>
  );
}

// JavaScript Console Tab
function JSConsole() {
  const [code, setCode] = useState(`// DOM XSS Payload Generator\n// Test various XSS attack vectors\n\nconst payloads = [\n  '<script>alert(document.domain)</script>',\n  '<img src=x onerror=alert(1)>',\n  '<svg/onload=alert(1)>',\n  '"><script>alert(1)</script>',\n  "'-alert(1)-'",\n  '<details open ontoggle=alert(1)>',\n  '{{constructor.constructor("alert(1)")()}}',\n];\n\nconsole.log('[*] XSS Payloads:');\npayloads.forEach((p, i) => {\n  console.log(\`  [\${i+1}] \${p}\`);\n});\n\nconsole.log(\`\\n[*] Total: \${payloads.length} payloads\`);`);
  const [output, setOutput] = useState("// JavaScript console output appears here");

  const runJS = () => {
    try {
      const logs: string[] = [];
      const fakeConsole = {
        log: (...args: unknown[]) => logs.push(args.map(String).join(" ")),
        error: (...args: unknown[]) => logs.push(`[ERROR] ${args.map(String).join(" ")}`),
        warn: (...args: unknown[]) => logs.push(`[WARN] ${args.map(String).join(" ")}`),
      };
      const fn = new Function("console", code);
      fn(fakeConsole);
      setOutput(logs.join("\n") || "// No output");
    } catch (err) {
      setOutput(`[ERROR] ${err}`);
    }
  };

  return (
    <div className="flex flex-col gap-3 h-[600px]">
      <div className="flex items-center justify-between px-3 py-2 glass-card">
        <div className="flex items-center gap-2">
          <FileCode className="w-4 h-4 text-yellow-400" />
          <span className="text-sm font-mono text-white">JavaScript Console</span>
        </div>
        <div className="flex items-center gap-2">
          <CopyButton text={code} />
          <button onClick={runJS} className="flex items-center gap-1 px-3 py-1 text-xs font-mono bg-yellow-500/20 text-yellow-400 rounded border border-yellow-500/30 hover:bg-yellow-500/30 transition-colors">
            <Play className="w-3 h-3" /> Run
          </button>
        </div>
      </div>
      <div className="flex-1 rounded-lg overflow-hidden border border-dark-600/50">
        <MonacoEditor
          height="100%"
          language="javascript"
          theme="vs-dark"
          value={code}
          onChange={(v) => setCode(v || "")}
          options={{
            fontSize: 13,
            fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
            minimap: { enabled: false },
            padding: { top: 12 },
            scrollBeyondLastLine: false,
            wordWrap: "on",
            automaticLayout: true,
          }}
        />
      </div>
      <div className="h-40 terminal-window">
        <div className="terminal-header">
          <div className="terminal-dot bg-red-500" />
          <div className="terminal-dot bg-yellow-500" />
          <div className="terminal-dot bg-green-500" />
          <span className="text-xs text-gray-500 ml-2 font-mono">Console Output</span>
        </div>
        <pre className="p-3 text-xs text-yellow-400 font-mono overflow-auto h-full">{output}</pre>
      </div>
    </div>
  );
}

// Kali Commands Tab
function KaliCommands() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("All");

  const allCategories = ["All", ...kaliData.categories.map((c) => c.name)];

  const filteredCategories = useMemo(() => {
    return kaliData.categories
      .filter((cat) => activeCategory === "All" || cat.name === activeCategory)
      .map((cat) => ({
        ...cat,
        commands: cat.commands.filter(
          (cmd) =>
            !search ||
            cmd.cmd.toLowerCase().includes(search.toLowerCase()) ||
            cmd.desc.toLowerCase().includes(search.toLowerCase())
        ),
      }))
      .filter((cat) => cat.commands.length > 0);
  }, [search, activeCategory]);

  const totalShown = filteredCategories.reduce((acc, cat) => acc + cat.commands.length, 0);

  return (
    <div className="space-y-4">
      {/* Search + Category Filter */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[250px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search 500+ Kali commands..."
            className="cyber-input pl-10"
          />
        </div>
        <div className="flex flex-wrap gap-1">
          {allCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-2 py-1 text-[10px] font-mono rounded transition-all ${
                activeCategory === cat
                  ? "bg-cyber-green/20 text-cyber-green border border-cyber-green/30"
                  : "text-gray-500 hover:text-gray-300 border border-transparent"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <p className="text-xs text-gray-500 font-mono">{totalShown} commands</p>

      {/* Commands */}
      <div className="space-y-6 max-h-[600px] overflow-y-auto pr-2">
        {filteredCategories.map((cat) => (
          <div key={cat.name}>
            <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2 sticky top-0 bg-dark-950 py-2 z-10">
              <span>{cat.icon}</span> {cat.name}
              <span className="text-xs text-gray-600 font-normal">({cat.commands.length})</span>
            </h3>
            <div className="space-y-1">
              {cat.commands.map((cmd, i) => (
                <div key={i} className="flex items-start gap-3 p-2 rounded hover:bg-white/5 transition-colors group">
                  <code className="flex-1 text-xs font-mono text-cyber-green break-all">{cmd.cmd}</code>
                  <p className="text-xs text-gray-500 flex-1 min-w-0">{cmd.desc}</p>
                  <CopyButton text={cmd.cmd} />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Metasploit Tab
function MetasploitModules() {
  const [search, setSearch] = useState("");
  const [activeType, setActiveType] = useState("All");

  const types = ["All", ...metasploitData.categories.map((c) => c.name)];

  const filtered = useMemo(() => {
    return metasploitData.categories
      .filter((cat) => activeType === "All" || cat.name === activeType)
      .map((cat) => ({
        ...cat,
        modules: cat.modules.filter((m) =>
          !search ||
          m.name.toLowerCase().includes(search.toLowerCase()) ||
          m.desc.toLowerCase().includes(search.toLowerCase()) ||
          (m.path && m.path.toLowerCase().includes(search.toLowerCase()))
        ),
      }))
      .filter((cat) => cat.modules.length > 0);
  }, [search, activeType]);

  const [expandedModule, setExpandedModule] = useState<string | null>(null);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[250px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search Metasploit modules..." className="cyber-input pl-10" />
        </div>
        <div className="flex flex-wrap gap-1">
          {types.map((t) => (
            <button key={t} onClick={() => setActiveType(t)} className={`px-2 py-1 text-[10px] font-mono rounded transition-all ${activeType === t ? "bg-red-500/20 text-red-400 border border-red-500/30" : "text-gray-500 hover:text-gray-300 border border-transparent"}`}>
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-6 max-h-[600px] overflow-y-auto pr-2">
        {filtered.map((cat) => (
          <div key={cat.name}>
            <h3 className="text-sm font-bold text-white mb-3 sticky top-0 bg-dark-950 py-2 z-10">
              {cat.name} <span className="text-xs text-gray-600 font-normal">({cat.modules.length})</span>
            </h3>
            <div className="space-y-2">
              {cat.modules.map((mod, i) => (
                <div key={i} className="glass-card overflow-hidden">
                  <button
                    onClick={() => setExpandedModule(expandedModule === `${cat.name}-${i}` ? null : `${cat.name}-${i}`)}
                    className="w-full flex items-center gap-3 p-3 hover:bg-white/5 transition-colors text-left"
                  >
                    <Server className="w-4 h-4 text-red-400 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-white font-medium">{mod.name}</p>
                      {mod.path && <p className="text-[10px] text-gray-600 font-mono truncate">{mod.path}</p>}
                    </div>
                    <ChevronRight className={`w-4 h-4 text-gray-600 transition-transform ${expandedModule === `${cat.name}-${i}` ? "rotate-90" : ""}`} />
                  </button>
                  {expandedModule === `${cat.name}-${i}` && (
                    <div className="px-3 pb-3 border-t border-dark-600/30">
                      <p className="text-xs text-gray-400 mt-2 mb-2">{mod.desc}</p>
                      <div className="bg-dark-800 rounded p-3 relative">
                        <pre className="text-xs text-cyber-green font-mono whitespace-pre-wrap">{mod.usage}</pre>
                        <div className="absolute top-2 right-2">
                          <CopyButton text={mod.usage} />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Cheatsheets Tab
function Cheatsheets() {
  const [activeTool, setActiveTool] = useState(cheatsheetsData[0].tool);

  const sheet = cheatsheetsData.find((c) => c.tool === activeTool) || cheatsheetsData[0];

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {cheatsheetsData.map((cs) => (
          <button
            key={cs.tool}
            onClick={() => setActiveTool(cs.tool)}
            className={`px-3 py-1.5 text-xs font-mono rounded transition-all flex items-center gap-1 ${
              activeTool === cs.tool
                ? "bg-cyber-purple/20 text-cyber-purple border border-cyber-purple/30"
                : "text-gray-500 hover:text-gray-300 border border-dark-600"
            }`}
          >
            <span>{cs.icon}</span> {cs.tool}
          </button>
        ))}
      </div>

      <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
        {sheet.sections.map((section, si) => (
          <div key={si} className="glass-card p-4">
            <h3 className="text-sm font-bold text-white mb-3">{section.title}</h3>
            <div className="space-y-1">
              {section.commands.map((cmd, ci) => (
                <div key={ci} className="flex items-center justify-between p-1.5 rounded hover:bg-white/5 transition-colors group">
                  <code className="text-xs font-mono text-cyber-green">{cmd}</code>
                  <CopyButton text={cmd.split(" (")[0]} />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ToolsPage() {
  const [activeTab, setActiveTab] = useState("python");

  return (
    <div className="max-w-[1600px] mx-auto px-6 py-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-3">
          <Wrench className="w-7 h-7 text-cyber-purple" />
          Security Tools
        </h1>
        <p className="text-gray-500 text-sm mt-1 font-mono">
          Code editors, 500+ Kali commands, Metasploit modules, and cheatsheets
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-dark-600/50 pb-0">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-all border-b-2 -mb-[1px] ${
              activeTab === tab.id
                ? "text-cyber-green border-cyber-green bg-cyber-green/5"
                : "text-gray-500 hover:text-gray-300 border-transparent"
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        {activeTab === "python" && <PythonEditor />}
        {activeTab === "js" && <JSConsole />}
        {activeTab === "kali" && <KaliCommands />}
        {activeTab === "metasploit" && <MetasploitModules />}
        {activeTab === "cheatsheets" && <Cheatsheets />}
      </motion.div>
    </div>
  );
}
