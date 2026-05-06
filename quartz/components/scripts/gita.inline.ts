const API_BASE = "https://gita-api.anurag-chand88.workers.dev/v1";

async function fetchDailyVerse() {
  const container = document.getElementById('daily-verse-content');
  if (!container) return;
  try {
    const res = await fetch(`${API_BASE}/daily`);
    if (!res.ok) throw new Error("Failed to fetch daily verse");
    const data = await res.json();
    container.innerHTML = `
      <div class="verse-text">${data.text || ''}</div>
      <div class="translation"><strong>Translation:</strong> ${data.translation || ''}</div>
      <div class="commentary"><strong>Verse:</strong> Chapter ${data.chapter || ''}, Verse ${data.verse || ''}</div>
    `;
  } catch (err) {
    console.error("Gita API Error (Daily):", err);
    container.innerHTML = `<p style="color:red">Failed to load daily verse.</p>`;
  }
}

async function fetchChapters() {
  const list = document.getElementById('gita-chapters-list');
  if (!list) return;
  try {
    const res = await fetch(`${API_BASE}/chapters`);
    if (!res.ok) throw new Error("Failed to fetch chapters");
    const data = await res.json();
    list.innerHTML = data.map((ch: any) => `
      <div class="chapter-item" data-ch="${ch.chapter_number}">
        <h4>Chapter ${ch.chapter_number}</h4>
        <p>${ch.name_translated || ''}</p>
        <small>${ch.verses_count || 0} Verses</small>
      </div>
    `).join('');
    
    // Add click listeners
    const items = list.getElementsByClassName('chapter-item');
    for (let i = 0; i < items.length; i++) {
      const item = items[i] as HTMLElement;
      item.addEventListener('click', () => {
        const chNum = item.getAttribute('data-ch');
        if (chNum) viewChapter(parseInt(chNum));
      });
    }
  } catch (err) {
    console.error("Gita API Error (Chapters):", err);
    list.innerHTML = `<p style="color:red">Failed to load chapters.</p>`;
  }
}

async function viewChapter(chNum: number) {
  const list = document.getElementById('gita-chapters-list');
  const view = document.getElementById('gita-verse-view');
  const content = document.getElementById('gita-verse-content');
  
  if (!list || !view || !content) return;

  list.style.display = 'none';
  view.style.display = 'block';
  content.innerHTML = `<div class="loader"></div>`;

  try {
    const res = await fetch(`${API_BASE}/verse/${chNum}/1`);
    if (!res.ok) throw new Error("Failed to fetch verse");
    const data = await res.json();
    content.innerHTML = `
      <h3>Chapter ${chNum}: ${data.title || ''}</h3>
      <div class="verse-text">${data.text || ''}</div>
      <div class="translation">${data.translation || ''}</div>
      <p><em>(Showing Verse 1 of Chapter ${chNum})</em></p>
    `;
  } catch (err) {
    console.error("Gita API Error (Verse):", err);
    content.innerHTML = `<p style="color:red">Failed to load verse.</p>`;
  }
}

function setupGita() {
  const gitaApp = document.getElementById('gita-app');
  if (!gitaApp) return;

  // Initialize data
  fetchDailyVerse();
  fetchChapters();

  // Setup Back Button
  const backBtn = document.getElementById('gita-back-btn');
  if (backBtn) {
    backBtn.onclick = (e) => {
      e.preventDefault();
      const list = document.getElementById('gita-chapters-list');
      const view = document.getElementById('gita-verse-view');
      if (list) list.style.display = 'grid';
      if (view) view.style.display = 'none';
    };
  }

  // Setup Search
  const searchBtn = document.getElementById('gita-search-btn');
  const searchInput = document.getElementById('gita-search-input') as HTMLInputElement;
  const searchResults = document.getElementById('gita-search-results');

  if (searchBtn && searchInput && searchResults) {
    searchBtn.onclick = async (e) => {
      e.preventDefault();
      const query = searchInput.value.trim();
      if (!query) return;
      
      searchResults.innerHTML = `<div class="loader"></div>`;
      try {
        const res = await fetch(`${API_BASE}/search?query=${encodeURIComponent(query)}`);
        if (!res.ok) throw new Error("Search failed");
        const data = await res.json();
        if (data.results && data.results.length > 0) {
          searchResults.innerHTML = data.results.map((r: any) => `
            <div class="result-item">
              <strong>Ch ${r.chapter} Verse ${r.verse}</strong>
              <p>${(r.text || '').substring(0, 100)}...</p>
            </div>
          `).join('');
        } else {
          searchResults.innerHTML = `<p>No results found.</p>`;
        }
      } catch (err) {
        console.error("Gita API Error (Search):", err);
        searchResults.innerHTML = `<p style="color:red">Search failed.</p>`;
      }
    };
  }
}

// Support for Quartz SPA
document.addEventListener("nav", setupGita);

// Initial call for the very first load
if (document.readyState === "complete" || document.readyState === "interactive") {
  setupGita();
} else {
  document.addEventListener("DOMContentLoaded", setupGita);
}
