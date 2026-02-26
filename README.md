<h1 align="center">madKoding</h1>

<p align="center">
  <strong>Software Engineer — AI Systems, Systems Programming & Full Stack</strong><br/>
  Chile
</p>

<p align="center">
  <a href="https://github.com/madkoding"><img src="https://img.shields.io/github/followers/madkoding?label=Followers&style=flat&color=555" alt="GitHub followers"/></a>
</p>

---

### About

Software engineer focused on **AI systems**, **systems-level programming in Rust**, and **full-stack development**. I design and build end-to-end solutions — from custom Linux distributions and embedded firmware to LLM orchestration engines and real-time web applications.

Currently building the **NEURO ecosystem**: an interconnected platform where [madOS](https://github.com/madkoding/mad-os) provides the AI-integrated OS layer, [Fractal-Mind](https://github.com/madkoding/fractalmind) serves as the cognitive memory engine, [Neuro Agent](https://github.com/madkoding/neuro-agent) orchestrates multi-model AI workflows, and [neuro-ollama](https://github.com/madkoding/neuro-ollama) manages GPU-accelerated local inference.

My work spans the full depth of the stack:

- **AI & Knowledge Systems** — RAG pipelines, LLM orchestration with multi-provider abstraction, vector embeddings, fractal graph-based memory architectures
- **Systems Programming** — Custom OS builds with adaptive hardware detection, kernel tuning, ZRAM compression, Wayland compositing
- **Full Stack** — React/Next.js frontends, Node.js/Express backends, REST APIs with JWT auth, real-time systems with WebSocket
- **Infrastructure & DevOps** — Docker multi-service architectures, GitHub Actions CI/CD, GPU-accelerated containerized inference
- **Embedded & IoT** — ESP32 firmware, VR tracking systems (SlimeVR), nRF52 BLE bootloaders, Android native (Kotlin)

---

### Featured Projects

<table>
<tr>
<td width="50%" valign="top">

#### [madOS](https://github.com/madkoding/mad-os)

<img src="./profile/projects/mados.svg" width="100%" alt="madOS - AI-Orchestrated Arch Linux Distribution"/>

AI-orchestrated Arch Linux distribution for resource-constrained systems (1.9GB+ RAM). Features adaptive GPU rendering (auto-switches between hardware acceleration and software fallback), ZRAM with zstd compression, audio quality auto-detection up to 192kHz/32-bit, USB persistence with dynamic space allocation, and Sway Wayland compositor at ~67MB RAM footprint. Automated ISO builds via GitHub Actions.

`Shell` `Python` `Arch Linux` `Wayland` `GitHub Actions`

</td>
<td width="50%" valign="top">

#### [Fractal-Mind](https://github.com/madkoding/fractalmind)

<img src="./profile/projects/fractalmind.svg" width="100%" alt="Fractal-Mind - AI Cognitive Engine with Evolutionary Memory"/>

AI cognitive engine with evolutionary memory built on RAPTOR-based fractal graph structures and HNSW vector indexing over SurrealDB. Dual-phase architecture: **Vigilia** (wakefulness) for real-time response via graph navigation, **REM** (sleep) for asynchronous learning and memory consolidation. Multi-user namespace isolation, PDF/OCR ingestion, multi-embedding support (Nomic, BGE, CLIP). Full roadmap delivered — 12/12 features complete.

`Rust` `Axum` `SurrealDB` `Tauri` `Vector Embeddings`

</td>
</tr>
<tr>
<td width="50%" valign="top">

#### [Neuro Agent](https://github.com/madkoding/neuro-agent)
[![CI](https://img.shields.io/github/actions/workflow/status/madkoding/neuro-agent/ci.yml?label=CI)](https://github.com/madkoding/neuro-agent/actions)

<img src="./profile/projects/neuro-agent.svg" width="100%" alt="Neuro Agent - AI Programming Assistant with Dual-Model Orchestration"/>

AI programming assistant in Rust with dual-model orchestration — routes tasks between fast local models (Ollama) and heavy compute providers (OpenAI, Anthropic, Groq) through a unified provider abstraction. Features AST-based code review with cyclomatic complexity detection, LRU context caching (10x response improvement), smart error recovery with retry/rollback, and a performance benchmarking framework with regression detection. 219+ tests, 100% pass rate.

`Rust` `Ollama` `Anthropic` `OpenAI` `ratatui`

</td>
<td width="50%" valign="top">

#### [Git Reports](https://github.com/madkoding/git-reports)
[![CI](https://img.shields.io/github/actions/workflow/status/madkoding/git-reports/ci.yml?label=CI)](https://github.com/madkoding/git-reports/actions)

<img src="./profile/projects/git-reports.svg" width="100%" alt="Git Reports - Automated Git Analytics Engine"/>

Automated Git analytics engine in Rust that generates work summaries from repository activity. Analyzes commits, contributors, and activity patterns across time periods with multi-format export. Integrates LLM-powered report generation for natural language summaries. CI/CD with GitHub Actions and 100% passing test coverage.

`Rust` `Git` `LLM` `GitHub Actions` `CI/CD`

</td>
</tr>
<tr>
<td width="50%" valign="top">

#### [MMORPGVT](https://github.com/madkoding/mmorpgvt)

<img src="./profile/projects/mmorpgvt.svg" width="100%" alt="MMORPGVT - Real-time Interactive MMORPG for Twitch"/>

Real-time interactive MMORPG engine for Twitch VTuber streams. Chat-driven mechanics: battles, exploration, virtual economy, and collaborative quests — all triggered from viewer commands. Built with Next.js and Firebase for real-time state sync. Full test suite with Jest, ESLint, Prettier, and automated formatting.

`TypeScript` `Next.js` `Firebase` `Jest` `Twitch API`

</td>
<td width="50%" valign="top">

#### [Docker SlimeVR](https://github.com/madkoding/docker-slimevr-web-server)

<img src="./profile/projects/docker-slimevr.svg" width="100%" alt="Docker SlimeVR - Production-Ready Docker for VR Tracking"/>

Production-ready Docker environment for SlimeVR full-body tracking server with dynamic Web GUI. Auto-downloads server JAR and GUI assets from GitHub releases, serves via Nginx with LAN IP auto-redirect. Exposes tracker (UDP 6969), WebSocket bridge, OSC router, VMC, and VRC ports. Persistent volume management for config and GUI assets.

`Docker` `Nginx` `SlimeVR` `VR` `Networking`

</td>
</tr>
</table>

> See all repositories at [github.com/madkoding?tab=repositories](https://github.com/madkoding?tab=repositories)

---

### Tech Stack

<table>
<tr>
<td valign="top" width="33%">

**Languages**
<br/>
<a href="https://github.com/search?q=user%3Amadkoding+language%3Arust"><img alt="Rust" src="https://img.shields.io/badge/Rust-000000.svg?logo=rust&logoColor=white"></a>
<a href="https://github.com/search?q=user%3Amadkoding+language%3AtypeScript"><img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-007ACC.svg?logo=typescript&logoColor=white"></a>
<a href="https://github.com/search?q=user%3Amadkoding+language%3Apython"><img alt="Python" src="https://img.shields.io/badge/Python-14354C.svg?logo=python&logoColor=white"></a>
<a href="https://github.com/search?q=user%3Amadkoding+language%3Ajavascript"><img alt="JavaScript" src="https://img.shields.io/badge/JavaScript-F7DF1E.svg?logo=javascript&logoColor=black"></a>
<a href="https://github.com/search?q=user%3Amadkoding+language%3Abash"><img alt="Bash" src="https://img.shields.io/badge/Bash-121011.svg?logo=gnu-bash&logoColor=white"></a>
<a href="https://github.com/search?q=user%3Amadkoding+language%3Acsharp"><img alt="C#" src="https://img.shields.io/badge/C%23-239120.svg?logo=csharp&logoColor=white"></a>
<a href="https://github.com/search?q=user%3Amadkoding+language%3Akotlin"><img alt="Kotlin" src="https://img.shields.io/badge/Kotlin-7F52FF.svg?logo=kotlin&logoColor=white"></a>
<a href="https://github.com/search?q=user%3Amadkoding+language%3Asql"><img alt="SQL" src="https://custom-icon-badges.demolab.com/badge/SQL-025E8C.svg?logo=database&logoColor=white"></a>

</td>
<td valign="top" width="33%">

**AI & Infrastructure**
<br/>
<a href="#"><img alt="Ollama" src="https://img.shields.io/badge/Ollama-000000.svg?logo=ollama&logoColor=white"></a>
<a href="#"><img alt="Anthropic" src="https://img.shields.io/badge/Anthropic-191919.svg?logo=anthropic&logoColor=white"></a>
<a href="#"><img alt="OpenAI" src="https://img.shields.io/badge/OpenAI-412991.svg?logo=openai&logoColor=white"></a>
<a href="#"><img alt="Docker" src="https://img.shields.io/badge/Docker-2496ED.svg?logo=docker&logoColor=white"></a>
<a href="#"><img alt="GitHub Actions" src="https://img.shields.io/badge/GitHub%20Actions-2671E5.svg?logo=github%20actions&logoColor=white"></a>
<a href="#"><img alt="Nginx" src="https://img.shields.io/badge/Nginx-009639.svg?logo=nginx&logoColor=white"></a>
<a href="#"><img alt="Linux" src="https://img.shields.io/badge/Linux-FCC624.svg?logo=linux&logoColor=black"></a>
<a href="#"><img alt="Arch Linux" src="https://img.shields.io/badge/Arch%20Linux-1793D1.svg?logo=archlinux&logoColor=white"></a>

</td>
<td valign="top" width="33%">

**Frameworks & Data**
<br/>
<a href="#"><img alt="React" src="https://img.shields.io/badge/React-61DAFB.svg?logo=react&logoColor=black"></a>
<a href="#"><img alt="Next.js" src="https://img.shields.io/badge/Next.js-000000.svg?logo=next.js&logoColor=white"></a>
<a href="#"><img alt="Node.js" src="https://img.shields.io/badge/Node.js-43853D.svg?logo=node.js&logoColor=white"></a>
<a href="#"><img alt="Axum" src="https://img.shields.io/badge/Axum-000000.svg?logo=rust&logoColor=white"></a>
<a href="#"><img alt="SurrealDB" src="https://img.shields.io/badge/SurrealDB-FF00A0.svg?logo=surrealdb&logoColor=white"></a>
<a href="#"><img alt="PostgreSQL" src="https://img.shields.io/badge/PostgreSQL-316192.svg?logo=postgresql&logoColor=white"></a>
<a href="#"><img alt="MongoDB" src="https://img.shields.io/badge/MongoDB-47A248.svg?logo=mongodb&logoColor=white"></a>
<a href="#"><img alt="Firebase" src="https://img.shields.io/badge/Firebase-FFCA28.svg?logo=firebase&logoColor=black"></a>

</td>
</tr>
</table>

---

### Activity

<p align="center">
  <img height="50%" width="auto" src ="./profile/stats.svg">
  <img height="50%" width="auto" src ="./profile/top-langs.svg">
</p>

<p align="center">
  <img src="https://github-readme-streak-stats.herokuapp.com/?user=madkoding&theme=material-palenight&hide_border=true&background=00000000" />
</p>

<p align="center">
  <img src="https://github-profile-summary-cards.vercel.app/api/cards/profile-details?username=madkoding&theme=material_palenight" />
</p>

---

<p align="center">
  <a href="https://x.com/madkoding"><img src="https://img.shields.io/badge/X-000000?style=flat&logo=x&logoColor=white" /></a>&nbsp;
  <a href="https://github.com/madkoding"><img src="https://img.shields.io/badge/GitHub-100000?style=flat&logo=github&logoColor=white" /></a>
</p>

<!-- AUTO-UPDATE-DATE -->
**Última actualización:** 2026-02-25 22:51:26 -03
