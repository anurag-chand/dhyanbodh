const API_BASE = "https://gita-api.anurag-chand88.workers.dev/v1";

async function fetchDailyVerse() {
  const container = document.getElementById('daily-verse-content');
  if (!container) return;
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
  if (!list) return;
  try {
    const res = await fetch(`${API_BASE}/chapters`);
    const data = await res.json();
    list.innerHTML = data.map(ch => `
      <div class="chapter-item" data-ch="${ch.chapter_number}">
        <h4>Chapter ${ch.chapter_number}</h4>
        <p>${ch.name_translated}</p>
        <small>${ch.verses_count} Verses</small>
      </div>
    `).join('');
    
    // Add click listeners
    const items = list.getElementsByClassName('chapter-item');
    for (const item of items) {
      item.addEventListener('click', () => {
        const chNum = item.getAttribute('data-ch');
        if (chNum) viewChapter(parseInt(chNum));
      });
    }
  } catch (err) {
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

function setupGita() {
  const gitaApp = document.getElementById('gita-app');
  if (!gitaApp) return;

  fetchDailyVerse();
  fetchChapters();

  const backBtn = document.getElementById('gita-back-btn');
  if (backBtn) {
    backBtn.addEventListener('click', () => {
      const list = document.getElementById('gita-chapters-list');
      const view = document.getElementById('gita-verse-view');
      if (list) list.style.display = 'grid';
      if (view) view.style.display = 'none';
    });
  }

  const searchBtn = document.getElementById('gita-search-btn');
  const searchInput = document.getElementById('gita-search-input') as HTMLInputElement;
  const searchResults = document.getElementById('gita-search-results');

  if (searchBtn && searchInput && searchResults) {
    searchBtn.addEventListener('click', async () => {
      const query = searchInput.value;
      if (!query) return;
      
      searchResults.innerHTML = `<div class="loader"></div>`;
      try {
        const res = await fetch(`${API_BASE}/search?query=${encodeURIComponent(query)}`);
        const data = await res.json();
        if (data.results && data.results.length > 0) {
          searchResults.innerHTML = data.results.map((r: any) => `
            <div class="result-item">
              <strong>Ch ${r.chapter} Verse ${r.verse}</strong>
              <p>${r.text.substring(0, 100)}...</p>
            </div>
          `).join('');
        } else {
          searchResults.innerHTML = `<p>No results found.</p>`;
        }
      } catch (err) {
        searchResults.innerHTML = `<p style="color:red">Search failed.</p>`;
      }
    });
  }
}

document.addEventListener("nav", setupGita);
window.addCleanup(() => {
  // Cleanup if needed, but since we use ID-based selection and it's replaced by SPA, 
  // listeners on those elements are automatically garbage collected when elements are removed.
});
