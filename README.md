# 🛡️ Bug Bounty Learning Platform

Personal cybersecurity learning platform for bug bounty hunting. Built with Next.js 14, TypeScript, Tailwind CSS, and shadcn/ui.

## 🚀 Quick Start

### Prerequisites
- **Node.js** 18+ installed
- **Docker** & Docker Compose (for labs)
- **Git** installed

### Installation

```bash
# Clone the repo (or use existing directory)
cd bug

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Docker Labs

```bash
# Start ALL lab environments
docker compose up -d

# Start specific lab
docker compose up -d dvwa
docker compose up -d juice-shop

# Stop all labs
docker compose down

# View logs
docker compose logs -f
```

## 📋 Lab Ports

| Lab | URL | Port |
|-----|-----|------|
| DVWA | http://localhost:4280 | 4280 |
| bWAPP | http://localhost:8081 | 8081 |
| WebGoat | http://localhost:8082 | 8082 |
| Juice Shop | http://localhost:3001 | 3001 |
| Metasploitable 2 | http://localhost:8083 | 8083 |

### Default Credentials

| Lab | Username | Password |
|-----|----------|----------|
| DVWA | admin | password |
| bWAPP | bee | bug |
| WebGoat | (register) | (register) |
| Juice Shop | admin@juice-sh.op | admin123 |
| Metasploitable | msfadmin | msfadmin |

## 📂 Project Structure

```
bug/
├── src/
│   ├── app/
│   │   ├── page.tsx           # Dashboard
│   │   ├── labs/page.tsx      # Labs (100+ entries)
│   │   ├── courses/page.tsx   # Courses (200+ modules)
│   │   ├── tools/page.tsx     # Tools (Editor + Commands)
│   │   ├── progress/page.tsx  # Progress Tracker
│   │   └── redteam/page.tsx   # Red Team Operations
│   ├── components/
│   │   └── layout/
│   │       └── Navbar.tsx     # Navigation bar
│   ├── data/
│   │   ├── labs.json          # 100+ lab entries
│   │   ├── courses.json       # 200+ modules (4 phases)
│   │   ├── kali-commands.json # 500+ commands
│   │   ├── metasploit-modules.json # 100+ modules
│   │   ├── cheatsheets.json   # 8 tool cheatsheets
│   │   ├── redteam.json       # Red team techniques
│   │   └── tools/
│   │       └── python-scripts.json # 15 Python scripts
│   └── lib/
│       ├── utils.ts
│       └── hooks/
│           ├── useLocalStorage.ts
│           ├── useProgress.ts
│           └── useSearch.ts
├── docker-compose.yml         # 5 Docker labs
├── tailwind.config.ts
├── package.json
└── README.md
```

## 🎯 Features

### Pages
1. **Dashboard** - Stats, heatmap, quick links
2. **Labs** - 100+ labs across 9 platforms with filters
3. **Courses** - 200+ modules in 4 phases
4. **Tools** - Python/JS editors, 500+ Kali commands, Metasploit, cheatsheets
5. **Progress** - Skills matrix, readiness index, export/import
6. **Red Team** - C2 frameworks, LOLBins, AV bypass, persistence

### Technical
- 🎨 Dark cyberpunk theme with neon glow effects
- 💾 localStorage for progress persistence
- 🔍 Global search (Ctrl+K)
- 📝 Monaco code editor (Python + JavaScript)
- 🐳 Docker labs with one-command setup
- 📊 Progress export/import as JSON
- ⚡ Framer Motion animations

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI**: Radix UI primitives
- **Editor**: Monaco Editor
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Notifications**: React Hot Toast
- **Labs**: Docker Compose

## 📖 Navigation

```
Home → Labs → Courses → Tools → Progress → Red Team
```

## 🔐 Data Storage

All data is stored locally:
- **JSON files**: Static data for labs, courses, commands
- **localStorage**: User progress, completions, skills, XP
- **No external services**: Everything runs locally

## 📦 Scripts

```bash
npm run dev      # Start development server
npm run build    # Production build
npm run start    # Start production server
npm run lint     # Run ESLint
```

## ⚠️ Disclaimer

This platform is for **educational purposes only**. All security techniques and tools are intended for authorized testing and learning. Unauthorized access to computer systems is illegal.

---

Built with ❤️ for personal cybersecurity learning.
"# BIG_BUNNY" 
