---
title: Bhagavad Gita API Deployment Report
date: 2026-05-06
tags:
  - Project
  - API
  - BhagavadGita
  - Cloudflare
---

# Bhagavad Gita API Deployment Report

## 🚀 Deployment Status: SUCCESSFUL
**Live URL:** [https://gita-api.anurag-chand88.workers.dev](https://gita-api.anurag-chand88.workers.dev)
**Platform:** Cloudflare Workers (Python Runtime - Pyodide)
**Architecture:** Native Worker (Zero-Framework)

---

## 🏗️ Architectural Evolution

Initially, we planned for a **FastAPI** deployment. However, during implementation on the Cloudflare Free Tier, we encountered several platform constraints that required a shift in strategy:

1.  **FastAPI Approach (Attempted):**
    -   *Issue:* FastAPI + Pydantic + Starlette dependencies resulted in a 1.7s CPU startup time.
    -   *Constraint:* Cloudflare Free tier has a strict **1.0s (1000ms)** CPU startup limit.
    -   *Result:* Deployment failed with `Worker startup exceeded CPU limit`.

2.  **Native Worker Approach (Final):**
    -   *Solution:* Removed FastAPI entirely. Used the native `on_fetch` entry point.
    -   *Optimization:* Switched from `httpx` to native JavaScript `fetch` via the `js` bridge to achieve **Zero Dependencies**.
    -   *Result:* Startup time reduced to **~666ms**. Deployment package size reduced to **~400KB** (mostly runtime shims).

---

## 🛠️ Tech Stack
- **Language:** Python 3.12 (via Pyodide WASM)
- **Framework:** None (Native `on_fetch`)
- **HTTP Client:** Native `fetch` (via `js` module)
- **Deployment Tool:** `pywrangler` (managed via `uv`)

---

## 📡 API Endpoints

| Method | Endpoint | Purpose |
| :--- | :--- | :--- |
| `GET` | `/v1/chapters` | List all 18 chapters with summaries. |
| `GET` | `/v1/daily` | Get a consistent 'Verse of the Day' (seeded by date). |
| `GET` | `/v1/verse/{ch}/{v}` | Fetch a specific verse with text, translations, and commentary. |
| `GET` | `/v1/llm-ref/{ch}/{v}` | Fetch verse data in a text-dense format optimized for LLM context. |
| `GET` | `/v1/search?query=...` | Search keywords across all translations (Top 20 results). |

---

## 🔧 Maintenance Commands

### Local Development
To run a local development server:
```bash
uvx --from workers-py pywrangler dev
```

### Deployment
To redeploy changes:
```bash
uvx --from workers-py pywrangler deploy
```

---

## 📝 Key Files in Workspace
- `index.py`: The main application logic (Router + Handlers).
- `pyproject.toml`: Dependency configuration (currently empty for speed).
- `wrangler.toml`: Cloudflare Worker configuration.
- `.wranglerignore`: Prevents local `.venv` from being uploaded.

---

## ✅ Final Fixes Applied
- **Devanagari Rendering:** Enabled `ensure_ascii=False` in JSON responses to show raw Sanskrit text.
- **CORS:** Manually implemented headers to allow cross-origin requests from Web/Android apps.
- **Memory Efficiency:** Implemented an in-memory cache for chapter data to reduce network latency.
- **LLM Optimization:** Added specialized endpoint for providing dense context to AI agents.
