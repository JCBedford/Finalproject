/**
 * FrogPath – app.js
 * Loads JSON outputs from the Python analysis and renders:
 *  - Stats banner
 *  - Professor cards (searchable / filterable)
 *  - Professor insight charts (Chart.js)
 *  - Criminal justice class schedule table
 */

// ── Helpers ────────────────────────────────────────────────────────────────

/**
 * Fetch a JSON file relative to the web/ directory.
 * When running locally (file://) the relative path needs to step up one level
 * to reach the outputs/ folder.  On GitHub Pages the outputs/ folder is served
 * at the same domain root.
 */
async function fetchJSON(relativePath) {
  // Try two base paths: same-origin outputs/ (GitHub Pages) then ../outputs/
  const candidates = [
    `../outputs/${relativePath}`,
    `outputs/${relativePath}`,
  ];
  for (const url of candidates) {
    try {
      const res = await fetch(url);
      if (res.ok) return res.json();
    } catch (_) { /* try next */ }
  }
  console.warn(`Could not fetch ${relativePath}`);
  return null;
}

function ratingColor(r) {
  if (r >= 4.5) return "rating-5";
  if (r >= 3.5) return "rating-4";
  if (r >= 2.5) return "rating-3";
  if (r >= 1.5) return "rating-2";
  return "rating-1";
}

// ── Stats Banner ───────────────────────────────────────────────────────────

async function loadStats(rmpData, coverageData) {
  if (!rmpData || !coverageData) return;

  const avgRating = rmpData.reduce((s, p) => s + p.overall_rating, 0) / rmpData.length;
  const avgDiff   = rmpData.reduce((s, p) => s + p.difficulty,       0) / rmpData.length;

  document.getElementById("num-profs").textContent     = coverageData.rated_professors ?? rmpData.length;
  document.getElementById("num-depts").textContent     = coverageData.total_sections ?? coverageData.departments_covered ?? "–";
  document.getElementById("avg-rating").textContent    = avgRating.toFixed(2);
  document.getElementById("avg-difficulty").textContent = avgDiff.toFixed(2);
}

// ── Professor Cards ────────────────────────────────────────────────────────

let allProfessors = [];

function buildProfCard(prof) {
  const card = document.createElement("div");
  card.className = "prof-card";

  const name = prof.professor_name ?? "Unknown";
  const dept = prof.department ?? "";
  const rating = typeof prof.overall_rating === "number" ? prof.overall_rating.toFixed(1) : "–";
  const diff   = typeof prof.difficulty      === "number" ? prof.difficulty.toFixed(1)      : "–";
  const reviews = prof.num_ratings ?? "–";
  const wta    = prof.would_take_again != null ? `${prof.would_take_again}%` : "–";
  const tags   = Array.isArray(prof.courses_taught)
    ? prof.courses_taught
    : (prof.tags ? prof.tags.split("|") : []);

  card.innerHTML = `
    <div class="prof-name">${name}</div>
    <div class="prof-dept">${dept}</div>
    <div class="prof-stats">
      <div class="prof-stat">
        <span class="val ${ratingColor(prof.overall_rating)}">${rating}</span>
        <span class="lbl">Rating</span>
      </div>
      <div class="prof-stat">
        <span class="val">${diff}</span>
        <span class="lbl">Difficulty</span>
      </div>
      <div class="prof-stat">
        <span class="val">${reviews}</span>
        <span class="lbl">Sections</span>
      </div>
      <div class="prof-stat">
        <span class="val">${wta}</span>
        <span class="lbl">Would Retake</span>
      </div>
    </div>
    ${tags.length ? `<div class="prof-tags">${tags.slice(0,4).map(t => `<span class="tag">${t}</span>`).join("")}</div>` : ""}
  `;
  return card;
}

function renderProfessors(list) {
  const grid = document.getElementById("prof-grid");
  grid.innerHTML = "";
  if (!list || list.length === 0) {
    grid.innerHTML = `<p class="no-results">No professors match your search.</p>`;
    return;
  }
  list.forEach(p => grid.appendChild(buildProfCard(p)));
}

function applyFilters() {
  const query    = document.getElementById("search-input").value.toLowerCase();
  const deptVal  = document.getElementById("dept-filter").value;
  const sortVal  = document.getElementById("sort-select").value;

  let filtered = allProfessors.filter(p => {
    const matchQuery = !query ||
      (p.professor_name ?? "").toLowerCase().includes(query) ||
      (p.tags ?? "").toLowerCase().includes(query) ||
      (Array.isArray(p.courses_taught) && p.courses_taught.some(course => course.toLowerCase().includes(query)));
    const matchDept = !deptVal || (Array.isArray(p.courses_taught) && p.courses_taught.includes(deptVal));
    return matchQuery && matchDept;
  });

  filtered.sort((a, b) => {
    switch (sortVal) {
      case "rating-desc":     return b.overall_rating - a.overall_rating;
      case "rating-asc":      return a.overall_rating - b.overall_rating;
      case "difficulty-asc":  return a.difficulty      - b.difficulty;
      case "difficulty-desc": return b.difficulty      - a.difficulty;
      case "sections-desc":   return (b.num_ratings ?? 0) - (a.num_ratings ?? 0);
      default:                return 0;
    }
  });

  renderProfessors(filtered);
}

async function loadProfessors() {
  const data = await fetchJSON("rmp_clean.json");
  if (!data) { document.getElementById("prof-grid").innerHTML = `<p class="no-results">Could not load professor data.</p>`; return; }

  allProfessors = data;

  // Populate course dropdown
  const depts = [...new Set(data.flatMap(p => Array.isArray(p.courses_taught) ? p.courses_taught : []))].sort();
  const select = document.getElementById("dept-filter");
  select.innerHTML = `<option value="">All Courses</option>`;
  depts.forEach(d => {
    const opt = document.createElement("option");
    opt.value = d; opt.textContent = d;
    select.appendChild(opt);
  });

  renderProfessors(allProfessors);

  document.getElementById("search-input").addEventListener("input", applyFilters);
  document.getElementById("dept-filter").addEventListener("change", applyFilters);
  document.getElementById("sort-select").addEventListener("change", applyFilters);
}

// ── Charts ─────────────────────────────────────────────────────────────────

async function loadCharts(rmpData) {
  if (!rmpData || rmpData.length === 0) return;

  const rated = rmpData.filter(p => typeof p.overall_rating === "number");
  const difficult = rmpData.filter(p => typeof p.difficulty === "number");

  const topRated = [...rated].sort((a, b) => b.overall_rating - a.overall_rating).slice(0, 10);
  const easiest = [...difficult].sort((a, b) => a.difficulty - b.difficulty).slice(0, 10);

  new Chart(document.getElementById("chart-ratings"), {
    type: "bar",
    data: {
      labels: topRated.map(d => d.professor_name),
      datasets: [{
        label: "Rating",
        data: topRated.map(d => d.overall_rating),
        backgroundColor: "#4e2a84",
        borderRadius: 4,
      }],
    },
    options: {
      indexAxis: "y",
      responsive: true,
      scales: {
        x: { min: 0, max: 5, title: { display: true, text: "Rating (1–5)" } },
      },
      plugins: { legend: { display: false } },
    },
  });

  new Chart(document.getElementById("chart-difficulty"), {
    type: "bar",
    data: {
      labels: easiest.map(d => d.professor_name),
      datasets: [{
        label: "Difficulty",
        data: easiest.map(d => d.difficulty),
        backgroundColor: "#a3c4f3",
        borderRadius: 4,
      }],
    },
    options: {
      indexAxis: "y",
      responsive: true,
      scales: {
        x: { min: 0, max: 5, title: { display: true, text: "Difficulty (1–5)" } },
      },
      plugins: { legend: { display: false } },
    },
  });
}

// ── Course Table ───────────────────────────────────────────────────────────

let allCourses = [];

function renderCourses(list) {
  const tbody = document.getElementById("course-tbody");
  tbody.innerHTML = "";
  if (!list || list.length === 0) {
    tbody.innerHTML = `<tr><td colspan="11" class="loading">No classes match your search.</td></tr>`;
    return;
  }
  list.forEach(c => {
    const tr = document.createElement("tr");
    const statusOpen = (c.status ?? "").toLowerCase() === "open";
    const enrollment = [c.seats_available, c.enrollment_cap].filter(v => v !== null && v !== undefined && v !== "").join(" / ");
    tr.innerHTML = `
      <td><strong>${c.course_code ?? c.course_number ?? ""}</strong></td>
      <td>${c.section ?? ""}</td>
      <td>${c.course_name ?? c.course_title ?? ""}</td>
      <td>${c.format ?? ""}</td>
      <td>${c.schedule ?? c.semester_offered ?? ""}</td>
      <td class="${statusOpen ? "badge-yes" : "badge-no"}">${c.status ?? ""}</td>
      <td>${enrollment}</td>
      <td>${c.professor_name ?? ""}</td>
      <td>${typeof c.rmp_rating === "number" ? c.rmp_rating.toFixed(1) : (c.overall_rating ?? "")}</td>
      <td>${typeof c.rmp_difficulty === "number" ? c.rmp_difficulty.toFixed(1) : ""}</td>
      <td>${typeof c.rmp_would_take_again === "number" ? `${c.rmp_would_take_again}%` : ""}</td>
    `;
    tbody.appendChild(tr);
  });
}

function applyCourseFilters() {
  const query      = document.getElementById("course-search").value.toLowerCase();
  const deptVal    = document.getElementById("course-dept-filter").value;
  const semVal     = document.getElementById("semester-filter").value;

  const filtered = allCourses.filter(c => {
    const matchQuery = !query ||
      (c.course_code ?? c.course_number ?? "").toLowerCase().includes(query) ||
      (c.course_name  ?? c.course_title  ?? "").toLowerCase().includes(query) ||
      (c.professor_name ?? "").toLowerCase().includes(query) ||
      (c.schedule ?? c.semester_offered ?? "").toLowerCase().includes(query);
    const matchFormat = !deptVal || c.format === deptVal;
    const matchStatus  = !semVal  || c.status === semVal;
    return matchQuery && matchFormat && matchStatus;
  });

  renderCourses(filtered);
}

async function loadCourses() {
  let data = await fetchJSON("course_catalog.json");

  if (!data) {
    document.getElementById("course-tbody").innerHTML =
      `<tr><td colspan="11" class="loading">Could not load class data.</td></tr>`;
    return;
  }

  allCourses = data;

  // Populate format/status dropdowns
  const select = document.getElementById("course-dept-filter");
  select.innerHTML = `<option value="">All Formats</option>`;
  [...new Set(data.map(c => c.format).filter(Boolean))].sort().forEach(d => {
    const opt = document.createElement("option");
    opt.value = d;
    opt.textContent = d;
    select.appendChild(opt);
  });

  const statusSelect = document.getElementById("semester-filter");
  statusSelect.innerHTML = `<option value="">Any Status</option>`;
  [...new Set(data.map(c => c.status).filter(Boolean))].sort().forEach(status => {
    const opt = document.createElement("option");
    opt.value = status;
    opt.textContent = status;
    statusSelect.appendChild(opt);
  });

  renderCourses(allCourses);

  document.getElementById("course-search").addEventListener("input", applyCourseFilters);
  document.getElementById("course-dept-filter").addEventListener("change", applyCourseFilters);
  document.getElementById("semester-filter").addEventListener("change", applyCourseFilters);
}

/** CSV parser that handles RFC 4180 quoted fields (commas inside quotes). */
function parseCSV(text) {
  const lines = text.trim().split("\n");
  const headers = splitCSVRow(lines[0]);
  return lines.slice(1).map(line => {
    const vals = splitCSVRow(line);
    const obj = {};
    headers.forEach((h, i) => { obj[h] = vals[i] ?? ""; });
    return obj;
  });
}

/** Split a single CSV row respecting double-quoted fields. */
function splitCSVRow(row) {
  const fields = [];
  let current = "";
  let inQuotes = false;
  for (let i = 0; i < row.length; i++) {
    const ch = row[i];
    if (ch === '"') {
      if (inQuotes && row[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (ch === "," && !inQuotes) {
      fields.push(current.trim());
      current = "";
    } else {
      current += ch;
    }
  }
  fields.push(current.trim());
  return fields;
}

// ── Boot ────────────────────────────────────────────────────────────────────

async function init() {
  const [rmpData, coverageData] = await Promise.all([
    fetchJSON("rmp_clean.json"),
    fetchJSON("rated_vs_unrated.json"),
  ]);

  await Promise.all([
    loadStats(rmpData, coverageData),
    loadProfessors(),
    loadCharts(rmpData),
    loadCourses(),
  ]);
}

document.addEventListener("DOMContentLoaded", init);
