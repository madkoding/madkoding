
```aura width=860 height=220
<div style={{
  width: '100%', height: '100%', background: '#08080c',
  display: 'flex', alignItems: 'center', fontFamily: 'Inter',
  position: 'relative', overflow: 'hidden', borderRadius: 16,
  border: '1px solid rgba(110,80,220,0.18)'
}}>

  <style>{`
      @keyframes float-slow {
        0%, 100% { transform: translateX(0px); opacity: 0.8; }
        50% { transform: translateX(350px); opacity: 1.2; }
      }
      @keyframes float-medium {
        0%, 100% { transform: translateX(0px); opacity: 0.7; }
        50% { transform: translateX(-250px); opacity: 1.1; }
      }
      @keyframes float-fast {
        0%, 100% { transform: translateX(0px); opacity: 0.9; }
        50% { transform: translateX(200px); opacity: 0.6; }
      }
      @keyframes float-diagonal {
        0%, 100% { transform: translateX(0px); opacity: 0.75; }
        50% { transform: translateX(300px); opacity: 1.0; }
      }
      @keyframes float-wave {
        0%, 100% { transform: translateX(0px); opacity: 0.65; }
        33% { transform: translateX(-160px); opacity: 0.9; }
        66% { transform: translateX(80px); opacity: 1.0; }
      }
      @keyframes float-pulse {
        0%, 100% { transform: scale(1); opacity: 0.8; }
        50% { transform: scale(1.3); opacity: 0.4; }
      }
      #glow-1 { animation: float-slow 8s ease-in-out infinite; }
      #glow-2 { animation: float-medium 12s ease-in-out infinite; }
      #glow-3 { animation: float-fast 9s ease-in-out infinite; }
      #glow-4 { animation: float-slow 11s ease-in-out infinite reverse; }
      #glow-5 { animation: float-medium 14s ease-in-out infinite reverse; }
      #glow-6 { animation: float-diagonal 10s ease-in-out infinite; }
      #glow-7 { animation: float-wave 13s ease-in-out infinite; }
      #glow-8 { animation: float-pulse 7s ease-in-out infinite; }
    `}</style>

  <svg width="860" height="220" style={{ position: 'absolute', top: 0, left: 0 }}>
    <defs>
      <radialGradient id="g1" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="rgba(110,20,210,0.72)" />
        <stop offset="40%" stopColor="rgba(90,15,180,0.35)" />
        <stop offset="70%" stopColor="rgba(90,15,180,0)" />
      </radialGradient>
      <radialGradient id="g2" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="rgba(40,60,255,0.6)" />
        <stop offset="45%" stopColor="rgba(30,50,200,0.25)" />
        <stop offset="70%" stopColor="rgba(30,50,200,0)" />
      </radialGradient>
      <radialGradient id="g3" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="rgba(0,130,255,0.45)" />
        <stop offset="50%" stopColor="rgba(0,100,220,0.18)" />
        <stop offset="70%" stopColor="rgba(0,100,220,0)" />
      </radialGradient>
      <radialGradient id="g4" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="rgba(0,190,230,0.32)" />
        <stop offset="70%" stopColor="rgba(0,190,230,0)" />
      </radialGradient>
      <radialGradient id="g5" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="rgba(90,30,200,0.38)" />
        <stop offset="70%" stopColor="rgba(90,30,200,0)" />
      </radialGradient>
      <radialGradient id="g6" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="rgba(160,30,255,0.55)" />
        <stop offset="45%" stopColor="rgba(130,20,220,0.22)" />
        <stop offset="70%" stopColor="rgba(130,20,220,0)" />
      </radialGradient>
      <radialGradient id="g7" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="rgba(20,60,255,0.42)" />
        <stop offset="50%" stopColor="rgba(10,40,200,0.16)" />
        <stop offset="70%" stopColor="rgba(10,40,200,0)" />
      </radialGradient>
      <radialGradient id="g8" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="rgba(0,170,255,0.40)" />
        <stop offset="50%" stopColor="rgba(0,130,220,0.15)" />
        <stop offset="70%" stopColor="rgba(0,130,220,0)" />
      </radialGradient>
    </defs>

    <ellipse id="glow-1" cx="180" cy="230" rx="260" ry="190" fill="url(#g1)" />
    <ellipse id="glow-2" cx="300" cy="240" rx="220" ry="160" fill="url(#g2)" />
    <ellipse id="glow-3" cx="420" cy="240" rx="180" ry="140" fill="url(#g3)" />
    <ellipse id="glow-4" cx="550" cy="250" rx="150" ry="120" fill="url(#g4)" />
    <ellipse id="glow-5" cx="750" cy="250" rx="130" ry="110" fill="url(#g5)" />
    <ellipse id="glow-6" cx="300" cy="240" rx="180" ry="140" fill="url(#g6)" />
    <ellipse id="glow-7" cx="490" cy="230" rx="220" ry="170" fill="url(#g7)" />
    <ellipse id="glow-8" cx="590" cy="250" rx="150" ry="130" fill="url(#g8)" />
  </svg>

  <div style={{
    position: 'absolute', left: 40, top: 40, width: 120, height: 120,
    borderRadius: 60, background: 'linear-gradient(135deg, #6622ee, #0088ff)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  }}>
    <img src={github?.user?.avatarUrl ?? 'https://github.com/madkoding.png'} width={112} height={112} style={{ borderRadius: 56 }} />
  </div>

  <div style={{ display:'flex', flexDirection:'column', marginLeft:185, gap:10, zIndex: 10, paddingRight: 24 }}>
    <div style={{ display:'flex', fontSize:40, fontWeight:800, color:'#ffffff', letterSpacing:'-1px', lineHeight:1 }}>
      {github?.user?.name || github?.user?.login || 'madkoding'}
    </div>
    <div style={{ display:'flex', fontSize:15, color:'rgba(200,190,255,0.85)', fontWeight:400, letterSpacing:'0.2px' }}>
      Senior Software Engineer — AI Systems &amp; Infrastructure · Chile
    </div>
    <div style={{ display:'flex', gap:20, marginTop:4 }}>
      <div style={{ display:'flex', alignItems:'center', gap:5 }}>
        <div style={{ width:8, height:8, borderRadius:4, background:'#7c3aed' }} />
        <span style={{ fontSize:12, color:'rgba(180,165,255,0.75)', fontWeight:600 }}>
          {github?.user?.followers ?? '0'} followers
        </span>
      </div>
      <div style={{ display:'flex', alignItems:'center', gap:5 }}>
        <div style={{ width:8, height:8, borderRadius:4, background:'#0088ff' }} />
        <span style={{ fontSize:12, color:'rgba(180,165,255,0.75)', fontWeight:600 }}>
          {github?.user?.publicRepos ?? '0'} repositories
        </span>
      </div>
    </div>
    <div style={{ display:'flex', gap:8, marginTop:4, flexWrap: 'wrap' }}>
      {((github && github.languages && github.languages.length > 0)
        ? github.languages.slice(0, 5).map(function(l) { return l.name; })
        : ['Rust', 'TypeScript', 'Python', 'Swift', 'C']
      ).map(function(tag, i) {
        return (
          <div key={tag + '-' + i} style={{
            display:'flex', padding:'3px 11px', borderRadius:20,
            background:'rgba(80,40,220,0.18)', border:'1px solid rgba(100,70,240,0.32)',
            color:'rgba(205,195,255,0.85)', fontSize:11, fontWeight:600,
          }}>{tag}</div>
        );
      })}
    </div>
  </div>
</div>
```

<p align="center">
  <a href="https://user-badge.committers.top/chile/madkoding"><img src="https://user-badge.committers.top/chile/madkoding.svg" alt="committers.top badge"/></a>
  <a href="https://github.com/madkoding"><img src="https://img.shields.io/github/followers/madkoding?label=Followers&style=flat&color=555" alt="GitHub followers"/></a>
  <a href="https://github.com/madkoding?tab=stars"><img src="https://img.shields.io/github/stars/madkoding?direction=desc&sort=total&label=Total%20Stars&style=flat&color=555" alt="Total stars"/></a>
  <a href="https://www.madtrackers.com"><img src="https://img.shields.io/badge/madtrackers.com-000000?style=flat&color=555" alt="Website"/></a>
</p>

<p align="center">
  <a href="https://x.com/madkoding"><img src="https://img.shields.io/badge/X-000000?style=flat&logo=x&logoColor=white" /></a>
  <a href="https://www.youtube.com/@madkoding"><img src="https://img.shields.io/badge/YouTube-FF0000?style=flat&logo=youtube&logoColor=white" /></a>
  <a href="https://twitch.tv/madkoding"><img src="https://img.shields.io/badge/Twitch-9146FF?style=flat&logo=twitch&logoColor=white" /></a>
  <a href="https://discord.gg/madkoding"><img src="https://img.shields.io/badge/Discord-5865F2?style=flat&logo=discord&logoColor=white" /></a>
</p>

---

### About

Senior software engineer specializing in **AI systems**, **systems programming**, and **distributed infrastructure**. I architect and deliver production-grade solutions spanning the entire stack — from kernel-level optimizations and embedded firmware to large language model orchestration engines and real-time web platforms.

Currently leading the **NEURO ecosystem**: a cohesive platform where [madOS](https://github.com/madkoding/mad-os) delivers AI-integrated OS infrastructure, [Fractal-Mind](https://github.com/madkoding/fractalmind) provides cognitive memory architectures, [Neuro Agent](https://github.com/madkoding/neuro-agent) orchestrates multi-model AI workflows, and [neuro-ollama](https://github.com/madkoding/neuro-ollama) enables GPU-accelerated local inference.

**Core Competencies:**

- **AI & Knowledge Engineering** — Multi-provider LLM orchestration, RAG pipelines, vector indexing (HNSW), fractal graph embeddings, cognitive memory systems
- **Systems Programming** — Custom Linux distributions, kernel tuning, hardware abstraction layers, Wayland compositing, memory optimization (ZRAM/zstd)
- **Backend & APIs** — High-performance Rust services (Axum), distributed architectures, REST/GraphQL APIs, real-time WebSocket systems
- **Infrastructure & DevOps** — Docker multi-service deployments, GitHub Actions CI/CD, GPU-accelerated containerization, automated ISO builds
- **Embedded & Firmware** — ESP32 IoT systems, VR/AR tracking (SlimeVR), nRF52 BLE bootloaders, Android native development

---

### Featured Projects

<table>
<tr>
<td width="50%" valign="top">

#### [madOS](https://github.com/madkoding/mad-os)
[![CI/CD](https://img.shields.io/github/actions/workflow/status/madkoding/mad-os/ci-cd.yml?label=CI/CD)](https://github.com/madkoding/mad-os/actions)
[![ISO Release](https://img.shields.io/github/actions/workflow/status/madkoding/mad-os/iso-release.yml?label=ISO%20Release)](https://github.com/madkoding/mad-os/actions)

<img src="./profile/projects/mados.svg" width="100%" alt="madOS - AI-Orchestrated Arch Linux Distribution"/>

AI-orchestrated Arch Linux distribution optimized for resource-constrained environments (1.9GB+ RAM). Delivers adaptive GPU rendering with hardware acceleration fallback, ZRAM compression (zstd), high-fidelity audio support (192kHz/32-bit), and Sway Wayland compositor at ~67MB RAM. Fully automated ISO generation via GitHub Actions.

`Shell` `Python` `Arch Linux` `Wayland` `GitHub Actions`

</td>
<td width="50%" valign="top">

#### [Fractal-Mind](https://github.com/madkoding/fractalmind)
[![CI](https://img.shields.io/github/actions/workflow/status/madkoding/fractalmind/ci.yml?label=CI)](https://github.com/madkoding/fractalmind/actions)

<img src="./profile/projects/fractalmind.svg" width="100%" alt="Fractal-Mind - AI Cognitive Engine with Evolutionary Memory"/>

Production cognitive engine implementing RAPTOR-based fractal graphs with HNSW vector indexing over SurrealDB. Dual-phase architecture: **Vigilia** (real-time graph traversal) and **REM** (asynchronous consolidation). Features multi-user namespace isolation, multi-format ingestion (PDF/OCR), and multi-embedding support (Nomic, BGE, CLIP). Complete delivery — 12/12 roadmap features shipped.

`Rust` `Axum` `SurrealDB` `Tauri` `Vector Embeddings`

</td>
</tr>
<tr>
<td width="50%" valign="top">

#### [Neuro Agent](https://github.com/madkoding/neuro-agent)
[![CI](https://img.shields.io/github/actions/workflow/status/madkoding/neuro-agent/ci.yml?label=CI)](https://github.com/madkoding/neuro-agent/actions)

<img src="./profile/projects/neuro-agent.svg" width="100%" alt="Neuro Agent - AI Programming Assistant with Dual-Model Orchestration"/>

Enterprise-grade AI programming assistant in Rust with intelligent multi-provider routing (Ollama, OpenAI, Anthropic, Groq). Implements AST-based code review with cyclomatic complexity analysis, LRU context caching (10× latency reduction), automatic error recovery with rollback, and comprehensive benchmarking suite with regression detection. 219+ tests, 100% pass rate.

`Rust` `Ollama` `Anthropic` `OpenAI` `ratatui`

</td>
<td width="50%" valign="top">

#### [Git Reports](https://github.com/madkoding/git-reports)
[![CI](https://img.shields.io/github/actions/workflow/status/madkoding/git-reports/ci.yml?label=CI)](https://github.com/madkoding/git-reports/actions)

<img src="./profile/projects/git-reports.svg" width="100%" alt="Git Reports - Automated Git Analytics Engine"/>

Automated Git intelligence engine in Rust that synthesizes work summaries from repository activity. Processes commits, contributor patterns, and temporal trends with configurable time windows and multi-format export. LLM-powered natural language generation for executive summaries. Full CI/CD pipeline with comprehensive test coverage.

`Rust` `Git` `LLM` `GitHub Actions` `CI/CD`

</td>
</tr>
<tr>
<td width="50%" valign="top">

#### [Tachikoma](https://github.com/madkoding/tachikoma)

<img src="./profile/projects/tachikoma-v2.svg" width="100%" alt="Tachikoma - AI Ecosystem with GraphRAG Memory"/>

Tachikoma: Modular AI ecosystem combining GraphRAG memory, intelligent agents, and automatic model selection. Features SurrealDB for graph+vector storage with 11 relation types, multi-model routing (ministral-3b to qwen2.5-coder:14b), built-in tools (web search, command execution), and complete UI stack (React chat + admin dashboard + Z-Brain CLI).

`Rust` `Axum` `GraphRAG` `SurrealDB` `AI Agents`

</td>
<td width="50%" valign="top">

#### [ESP32 Android Auto WiFi](https://github.com/madkoding/esp32-android-auto-wifi)

<img src="./profile/projects/esp32-android-auto-v2.svg" width="100%" alt="ESP32 Android Auto WiFi - IoT Bridge"/>

IoT bridge for automatic WiFi connection on Android Auto using ESP32 microcontroller. Handles remote control and WiFi management as a hardware bridge between Android devices and vehicle infotainment systems. Demonstrates embedded systems expertise with resource-constrained hardware.

`C` `ESP32` `IoT` `Embedded` `WiFi`

</td>
</tr>
</table>

> See all repositories at [github.com/madkoding?tab=repositories](https://github.com/madkoding?tab=repositories)

---

### Tech Stack

```aura width=860 height=280
<div style={{
  width: '100%', height: '100%', background: '#08080c',
  display: 'flex', flexDirection: 'column', fontFamily: 'Inter',
  padding: '28px 32px', borderRadius: 16, gap: 22,
  border: '1px solid rgba(110,80,220,0.15)', boxSizing: 'border-box',
}}>

  <style>{`
    @keyframes badge-in {
      from { opacity: 0; transform: translateY(6px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    .badge { animation: badge-in 0.4s ease-out both; }
  `}</style>

  {[
    {
      label: 'Languages',
      color: '#7c3aed',
      items: ['Rust', 'TypeScript', 'Swift', 'Python', 'Kotlin', 'C', 'C++'],
    },
    {
      label: 'AI & Infrastructure',
      color: '#0ea5e9',
      items: ['Ollama', 'Anthropic', 'OpenAI', 'Groq', 'Docker', 'GitHub Actions', 'Linux', 'Arch Linux'],
    },
    {
      label: 'Frameworks & Data',
      color: '#10b981',
      items: ['Axum', 'Tauri', 'React', 'Next.js', 'SurrealDB', 'PostgreSQL', 'MongoDB'],
    },
  ].map(function(group, gi) {
    return (
      <div key={group.label} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 10, height: 10, borderRadius: 5, background: group.color }} />
          <span style={{ fontSize: 11, fontWeight: 700, color: group.color, letterSpacing: '0.8px', textTransform: 'uppercase' }}>
            {group.label}
          </span>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
          {group.items.map(function(item, i) {
            return (
              <div key={item} className="badge" style={{
                animationDelay: (gi * 100 + i * 40) + 'ms',
                display: 'flex', padding: '4px 12px', borderRadius: 20,
                background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                color: 'rgba(220,215,255,0.82)', fontSize: 12, fontWeight: 600,
              }}>{item}</div>
            );
          })}
        </div>
      </div>
    );
  })}
</div>
```

---

### Activity

<p align="center">
  <img src="https://github-profile-summary-cards.vercel.app/api/cards/profile-details?username=madkoding&theme=material_palenight&hide_border=true" />
</p>

<p align="center">
  <img src="https://github-profile-summary-cards.vercel.app/api/cards/repos-per-language?username=madkoding&theme=material_palenight&hide_border=true" />
  <img src="https://github-profile-summary-cards.vercel.app/api/cards/languages?username=madkoding&theme=material_palenight&hide_border=true" />
</p>

<p align="center">
  <img src="https://github-profile-summary-cards.vercel.app/api/cards/stats?username=madkoding&theme=material_palenight&hide_border=true" />
  <img src="https://github-profile-summary-cards.vercel.app/api/cards/productive-time?username=madkoding&theme=material_palenight&hide_border=true&utcOffset=-4" />
</p>

<p align="center">
  <img src="https://github-readme-streak-stats.herokuapp.com/?user=madkoding&theme=material-palenight&hide_border=true&background=00000000&fire=FF7979&currStreakLabel=FF7979" alt="Streak stats" />
</p>

---

```aura width=860 height=60
<div style={{
  width: '100%', height: '100%',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  fontFamily: 'Inter', gap: 24,
  background: 'transparent',
}}>
  {[
    { label: 'X / Twitter', url: 'https://x.com/madkoding' },
    { label: 'YouTube', url: 'https://www.youtube.com/@madkoding' },
    { label: 'Twitch', url: 'https://twitch.tv/madkoding' },
    { label: 'Discord', url: 'https://discord.gg/madkoding' },
  ].map(function(link) {
    return (
      <span key={link.label} style={{
        fontSize: 13, fontWeight: 600,
        color: 'rgba(180,165,255,0.7)',
        letterSpacing: '0.3px',
      }}>{link.label}</span>
    );
  })}
</div>
```
