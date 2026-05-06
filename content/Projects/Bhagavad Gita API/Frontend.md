---
title: Bhagavad Gita API Frontend
date: 2026-05-06
tags:
  - Project
  - Frontend
  - BhagavadGita
  - Interactive
---

Welcome to the interactive frontend for the **Bhagavad Gita API**. Explore the wisdom of the Gita directly from this page.

<div id="gita-app" class="gita-container">
  <div class="gita-card" id="daily-verse-card">
    <h3 class="gita-header">ॐ Verse of the Day</h3>
    <div id="daily-verse-content" class="gita-content">
      <div class="loader"></div>
    </div>
  </div>

  <div class="gita-card">
    <h3 class="gita-header">🔍 Search the Gita</h3>
    <div class="search-box">
      <input type="text" id="gita-search-input" placeholder="Enter keywords (e.g., Yoga, Karma, Krishna)...">
      <button id="gita-search-btn">Search</button>
    </div>
    <div id="gita-search-results" class="gita-results"></div>
  </div>

  <div class="gita-card" id="browser-card">
    <h3 class="gita-header">📖 Explore Chapters</h3>
    <div id="gita-chapters-list" class="gita-grid">
      <div class="loader"></div>
    </div>
    <div id="gita-verse-view" style="display:none;">
       <button id="gita-back-btn" class="back-btn">← Back to Chapters</button>
       <div id="gita-verse-content"></div>
    </div>
  </div>
</div>

<style>
.gita-container {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  margin-top: 2rem;
  font-family: var(--bodyFont);
}

.gita-card {
  background: var(--lightgray);
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 4px 6px rgba(0,0,0,0.05);
  border: 1px solid var(--gray);
}

.gita-header {
  margin-top: 0 !important;
  border-bottom: 2px solid var(--tertiary);
  padding-bottom: 0.5rem;
  color: var(--secondary);
}

.gita-content {
  margin-top: 1rem;
}

.search-box {
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
}

.search-box input {
  flex-grow: 1;
  padding: 0.5rem;
  border: 1px solid var(--gray);
  border-radius: 4px;
  background: var(--light);
  color: var(--dark);
}

.search-box button {
  padding: 0.5rem 1rem;
  background: var(--secondary);
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: opacity 0.2s;
}

.search-box button:hover {
  opacity: 0.8;
}

.gita-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
}

.chapter-item {
  padding: 1rem;
  background: var(--light);
  border: 1px solid var(--gray);
  border-radius: 6px;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}

.chapter-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
  border-color: var(--tertiary);
}

.chapter-item h4 {
  margin: 0;
  color: var(--secondary);
}

.chapter-item p {
  margin: 0.5rem 0 0;
  font-size: 0.9rem;
  color: var(--darkgray);
}

.back-btn {
  margin-bottom: 1rem;
  padding: 0.4rem 0.8rem;
  background: var(--gray);
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.verse-text {
  font-size: 1.2rem;
  font-weight: 600;
  color: var(--secondary);
  text-align: center;
  margin: 1.5rem 0;
  line-height: 1.6;
}

.translation {
  font-style: italic;
  color: var(--darkgray);
  margin-bottom: 1rem;
}

.commentary {
  border-top: 1px solid var(--gray);
  padding-top: 1rem;
  font-size: 0.95rem;
}

.loader {
  border: 4px solid var(--gray);
  border-top: 4px solid var(--secondary);
  border-radius: 50%;
  width: 30px;
  height: 30px;
  animation: spin 1s linear infinite;
  margin: 1rem auto;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.gita-results {
  margin-top: 1rem;
  max-height: 300px;
  overflow-y: auto;
}

.result-item {
  padding: 0.5rem;
  border-bottom: 1px solid var(--gray);
}
</style>

<script>
const API_BASE = "https://gita-api.anurag-chand88.workers.dev/v1";

async function fetchDailyVerse() {
  const container = document.getElementById('daily-verse-content');
  try {
    const res = await fetch(`${API_BASE}/daily`);
    const data = await res.json();
    container.innerHTML = `
      <div class="verse-text">${data.text}</div>
      <div class="translation"><strong>Translation:</strong> ${data.translation}</div>
      <div class="commentary"><strong>Verse:</strong> Chapter ${data.chapter}, Verse ${data.verse}</div>
    `;
  } catch (err) {
    container.innerHTML = `<p style="color:red">Failed to load daily verse.</p>`;
  }
}

async function fetchChapters() {
  const list = document.getElementById('gita-chapters-list');
  try {
    const res = await fetch(`${API_BASE}/chapters`);
    const data = await res.json();
    list.innerHTML = data.map(ch => `
      <div class="chapter-item" onclick="viewChapter(${ch.chapter_number})">
        <h4>Chapter ${ch.chapter_number}</h4>
        <p>${ch.name_translated}</p>
        <small>${ch.verses_count} Verses</small>
      </div>
    `).join('');
  } catch (err) {
    list.innerHTML = `<p style="color:red">Failed to load chapters.</p>`;
  }
}

async function viewChapter(chNum) {
  const list = document.getElementById('gita-chapters-list');
  const view = document.getElementById('gita-verse-view');
  const content = document.getElementById('gita-verse-content');
  
  list.style.display = 'none';
  view.style.display = 'block';
  content.innerHTML = `<div class="loader"></div>`;

  try {
    // For simplicity, let's just fetch the first verse of the chapter
    const res = await fetch(`${API_BASE}/verse/${chNum}/1`);
    const data = await res.json();
    content.innerHTML = `
      <h3>Chapter ${chNum}: ${data.title || ''}</h3>
      <div class="verse-text">${data.text}</div>
      <div class="translation">${data.translation}</div>
      <p><em>(Showing Verse 1 of Chapter ${chNum})</em></p>
    `;
  } catch (err) {
    content.innerHTML = `<p style="color:red">Failed to load verse.</p>`;
  }
}

document.getElementById('gita-back-btn').addEventListener('click', () => {
  document.getElementById('gita-chapters-list').style.display = 'grid';
  document.getElementById('gita-verse-view').style.display = 'none';
});

document.getElementById('gita-search-btn').addEventListener('click', async () => {
  const query = document.getElementById('gita-search-input').value;
  const results = document.getElementById('gita-search-results');
  if (!query) return;
  
  results.innerHTML = `<div class="loader"></div>`;
  try {
    const res = await fetch(`${API_BASE}/search?query=${encodeURIComponent(query)}`);
    const data = await res.json();
    if (data.results && data.results.length > 0) {
      results.innerHTML = data.results.map(r => `
        <div class="result-item">
          <strong>Ch ${r.chapter} Verse ${r.verse}</strong>
          <p>${r.text.substring(0, 100)}...</p>
        </div>
      `).join('');
    } else {
      results.innerHTML = `<p>No results found.</p>`;
    }
  } catch (err) {
    results.innerHTML = `<p style="color:red">Search failed.</p>`;
  }
});

// Initialize
fetchDailyVerse();
fetchChapters();
</script>
