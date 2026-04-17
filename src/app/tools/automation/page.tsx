"use client";
import { useState, useCallback } from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { Workflow, Play, Copy, Check, Download, ChevronRight, RotateCcw, Terminal, Code, ArrowRight } from "lucide-react";
import automationData from "@/data/automation-templates.json";

const MonacoEditor = dynamic(() => import("@monaco-editor/react"), { ssr: false });

function CopyBtn({ text }: { text: string }) {
  const [c, setC] = useState(false);
  return <button onClick={() => { navigator.clipboard.writeText(text); setC(true); setTimeout(() => setC(false), 2000); }} className="p-1.5 hover:bg-white/10 rounded transition-colors">{c ? <Check className="w-3.5 h-3.5 text-cyber-green" /> : <Copy className="w-3.5 h-3.5 text-gray-500" />}</button>;
}

const stepIcons: Record<string, string> = {
  "Subfinder": "🔍", "Httpx": "🌐", "Nuclei": "⚡", "Nmap": "📡", "Ffuf": "🔎",
  "Amass": "🗺️", "Waybackurls": "📚", "Gau": "🔗", "Gospider": "🕷️",
  "Katana": "⛩️", "SQLMap": "💉", "XSStrike": "💥", "ParamSpider": "🎯",
  "Report": "📄", "Filter": "🔀", "Dedupe": "🧹",
};

function getStepIcon(step: string) {
  const key = Object.keys(stepIcons).find(k => step.toLowerCase().includes(k.toLowerCase()));
  return key ? stepIcons[key] : "⚙️";
}

export default function AutomationPage() {
  const [activePipeline, setActivePipeline] = useState(automationData[0].id);
  const [lang, setLang] = useState<"bash" | "python">("bash");
  const [output, setOutput] = useState("# Select a pipeline and click 'Run Demo' to simulate\n# Or edit the script and export");
  const [running, setRunning] = useState(false);
  const [activeStep, setActiveStep] = useState(-1);


  const pipeline = automationData.find((p) => p.id === activePipeline) || automationData[0];
  const code = lang === "bash" ? pipeline.bash : pipeline.python;
  const [editedCode, setEditedCode] = useState(code);

  const switchPipeline = useCallback((id: string) => {
    setActivePipeline(id);
    const p = automationData.find((p) => p.id === id) || automationData[0];
    setEditedCode(lang === "bash" ? p.bash : p.python);
    setOutput("# Pipeline loaded. Click 'Run Demo' to simulate.");
    setActiveStep(-1);
    setRunning(false);
  }, [lang]);

  const switchLang = useCallback((newLang: "bash" | "python") => {
    setLang(newLang);
    setEditedCode(newLang === "bash" ? pipeline.bash : pipeline.python);
  }, [pipeline]);

  const runDemo = useCallback(async () => {
    setRunning(true);
    setOutput("");
    const lines: string[] = [];
    
    lines.push(`╔══════════════════════════════════════════════╗`);
    lines.push(`║  🚀 ${pipeline.name}`);
    lines.push(`║  Language: ${lang.toUpperCase()} | Steps: ${pipeline.steps.length}`);
    lines.push(`║  Started: ${new Date().toLocaleTimeString()}`);
    lines.push(`╚══════════════════════════════════════════════╝`);
    lines.push("");
    setOutput(lines.join("\n"));

    for (let i = 0; i < pipeline.steps.length; i++) {
      setActiveStep(i);
      await new Promise(resolve => setTimeout(resolve, 800));
      lines.push(`[${i + 1}/${pipeline.steps.length}] ${getStepIcon(pipeline.steps[i])} ${pipeline.steps[i]}`);
      lines.push(`  ├─ Initializing...`);
      lines.push(`  ├─ Processing targets...`);
      lines.push(`  └─ ✅ Completed (${(Math.random() * 3 + 0.5).toFixed(1)}s)`);
      lines.push("");
      setOutput(lines.join("\n"));
    }

    lines.push(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
    lines.push(`✅ Pipeline complete! ${pipeline.steps.length}/${pipeline.steps.length} steps finished.`);
    lines.push(`⏱  Total time: ${(Math.random() * 10 + 5).toFixed(1)}s (simulated)`);
    lines.push(`📊 Results saved to: ./output/${pipeline.id}_results.txt`);
    lines.push("");
    lines.push(`💡 To run for real, export the script and execute:`);
    lines.push(`   ${lang === "bash" ? `chmod +x ${pipeline.id}.sh && ./${pipeline.id}.sh` : `python3 ${pipeline.id}.py`}`);
    setOutput(lines.join("\n"));
    setActiveStep(-1);
    setRunning(false);
  }, [pipeline, lang]);

  const exportScript = useCallback(() => {
    const blob = new Blob([editedCode], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${pipeline.id}.${lang === "bash" ? "sh" : "py"}`;
    a.click();
    URL.revokeObjectURL(url);
  }, [editedCode, pipeline, lang]);

  return (
    <div className="max-w-[1600px] mx-auto px-6 py-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-3"><Workflow className="w-7 h-7 text-cyber-purple" />Automation Builder<span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyber-purple/20 text-cyber-purple border border-cyber-purple/30">5 PIPELINES</span></h1>
        <p className="text-gray-500 text-sm mt-1 font-mono">Pre-built security automation pipelines • Visual step builder • Export as bash or Python</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-4">
        {/* Pipeline Selector */}
        <div className="glass-card p-3 space-y-2">
          <h3 className="text-xs font-mono text-gray-500 uppercase px-2 mb-1">Pipelines</h3>
          {automationData.map((p) => (
            <button key={p.id} onClick={() => switchPipeline(p.id)} className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-all ${activePipeline === p.id ? "bg-cyber-purple/10 border border-cyber-purple/30" : "hover:bg-white/5 border border-transparent"}`}>
              <span className="text-xl">{p.icon}</span>
              <div className="flex-1 min-w-0">
                <p className={`text-xs font-mono font-bold truncate ${activePipeline === p.id ? "text-cyber-purple" : "text-gray-400"}`}>{p.name}</p>
                <p className="text-[10px] text-gray-600 truncate">{p.steps.length} steps • {p.steps.slice(0, 3).join(" → ")}</p>
              </div>
              {activePipeline === p.id && <ChevronRight className="w-3 h-3 text-cyber-purple" />}
            </button>
          ))}

          {/* Quick Stats */}
          <div className="border-t border-dark-600/50 pt-3 mt-3 px-2 space-y-2">
            <h3 className="text-xs font-mono text-gray-500 uppercase">Quick Info</h3>
            <div className="text-[10px] text-gray-500 space-y-1">
              <p>✅ All scripts are safe to run</p>
              <p>✅ Requires: subfinder, httpx, nuclei</p>
              <p>✅ Export & customize before running</p>
              <p>✅ Works on Kali Linux & macOS</p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="space-y-4">
          {/* Pipeline Visual Flow */}
          <div className="glass-card p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-mono text-white font-bold flex items-center gap-2">
                <span className="text-xl">{pipeline.icon}</span>{pipeline.name}
              </h3>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono text-gray-500">{pipeline.steps.length} steps</span>
                {running && <span className="text-[10px] font-mono text-cyber-green animate-pulse">● Running...</span>}
              </div>
            </div>
            <p className="text-xs text-gray-400 mb-4">{pipeline.description}</p>
            
            {/* Visual Pipeline */}
            <div className="flex flex-wrap items-center gap-2">
              {pipeline.steps.map((step, i) => (
                <div key={i} className="flex items-center gap-2">
                  <motion.div
                    animate={activeStep === i ? { scale: [1, 1.05, 1], borderColor: ["rgba(184,41,221,0.3)", "rgba(0,255,65,0.8)", "rgba(184,41,221,0.3)"] } : {}}
                    transition={{ duration: 0.8, repeat: activeStep === i ? Infinity : 0 }}
                    className={`px-3 py-2 rounded-lg text-[10px] font-mono flex items-center gap-1.5 border transition-all ${
                      activeStep === i
                        ? "bg-cyber-green/20 border-cyber-green/50 text-cyber-green shadow-neon-green"
                        : activeStep > i || (activeStep === -1 && !running)
                        ? "bg-cyber-purple/10 border-cyber-purple/20 text-cyber-purple"
                        : "bg-dark-700/50 border-dark-600 text-gray-500"
                    }`}
                  >
                    <span className="text-sm">{getStepIcon(step)}</span>
                    {step}
                    {activeStep > i && <Check className="w-3 h-3 text-cyber-green ml-1" />}
                  </motion.div>
                  {i < pipeline.steps.length - 1 && <ArrowRight className={`w-4 h-4 ${activeStep >= i ? "text-cyber-green" : "text-gray-600"}`} />}
                </div>
              ))}
            </div>
          </div>

          {/* Toolbar */}
          <div className="flex items-center justify-between glass-card p-3">
            <div className="flex gap-2">
              <button onClick={() => switchLang("bash")} className={`px-3 py-1.5 text-xs font-mono rounded transition-colors flex items-center gap-1.5 ${lang === "bash" ? "bg-cyber-green/20 text-cyber-green border border-cyber-green/30" : "text-gray-500 hover:text-gray-300"}`}>
                <Terminal className="w-3 h-3" />Bash
              </button>
              <button onClick={() => switchLang("python")} className={`px-3 py-1.5 text-xs font-mono rounded transition-colors flex items-center gap-1.5 ${lang === "python" ? "bg-cyber-blue/20 text-cyber-blue border border-cyber-blue/30" : "text-gray-500 hover:text-gray-300"}`}>
                <Code className="w-3 h-3" />Python
              </button>
            </div>
            <div className="flex gap-2">
              <CopyBtn text={editedCode} />
              <button onClick={exportScript} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono bg-cyber-purple/20 text-cyber-purple rounded border border-cyber-purple/30 hover:bg-cyber-purple/30 transition-colors">
                <Download className="w-3.5 h-3.5" />Export
              </button>
              <button onClick={runDemo} disabled={running} className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono rounded border transition-colors ${running ? "bg-yellow-500/20 text-yellow-400 border-yellow-500/30" : "bg-cyber-green/20 text-cyber-green border-cyber-green/30 hover:bg-cyber-green/30"}`}>
                {running ? <><RotateCcw className="w-3.5 h-3.5 animate-spin" />Running...</> : <><Play className="w-3.5 h-3.5" />Run Demo</>}
              </button>
            </div>
          </div>

          {/* Editor + Output */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 h-[480px]">
            <div className="rounded-lg overflow-hidden border border-dark-600/50">
              <MonacoEditor height="100%" language={lang === "bash" ? "shell" : "python"} theme="vs-dark" value={editedCode} onChange={(v) => setEditedCode(v || "")} options={{ fontSize: 12, fontFamily: "'JetBrains Mono', monospace", minimap: { enabled: false }, padding: { top: 8 }, scrollBeyondLastLine: false, wordWrap: "on", automaticLayout: true, readOnly: false }} />
            </div>
            <div className="terminal-window h-full flex flex-col">
              <div className="terminal-header shrink-0">
                <div className="terminal-dot bg-red-500" /><div className="terminal-dot bg-yellow-500" /><div className="terminal-dot bg-green-500" />
                <span className="text-xs text-gray-500 ml-2 font-mono">Output</span>
                {running && <span className="text-xs text-cyber-green ml-auto font-mono animate-pulse">● Live</span>}
              </div>
              <pre className="p-3 text-xs text-cyber-green font-mono overflow-auto flex-1 whitespace-pre-wrap">{output}</pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
