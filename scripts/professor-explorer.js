let professors = [];

function cardClassByRating(rating) {
  if (rating == null) return "rating-none";
  if (rating >= 4.0) return "rating-high";
  if (rating >= 3.0) return "rating-mid";
  return "rating-low";
}

function renderProfessorCards(list) {
  const root = document.getElementById("professor-cards");
  root.innerHTML = "";

  if (list.length === 0) {
    root.innerHTML = '<p class="muted">No professors match your search.</p>';
    return;
  }

  list.forEach((p) => {
    const card = document.createElement("article");
    card.className = `prof-card ${cardClassByRating(p.rmp_rating)}`;

    const ratingText = p.rmp_has_data ? p.rmp_rating : "No data available";
    const diffText = p.rmp_has_data ? p.rmp_difficulty : "-";
    const retakeText = p.rmp_has_data && p.rmp_would_take_again != null ? `${p.rmp_would_take_again}%` : "-";

    card.innerHTML = `
      <h3>${p.professor_name}</h3>
      <p><strong>RMP Rating:</strong> ${ratingText}</p>
      <p><strong>Difficulty:</strong> ${diffText}</p>
      <p><strong>Would Take Again:</strong> ${retakeText}</p>
      <p class="muted"><strong>Sections:</strong> ${p.section_count}</p>
    `;

    root.appendChild(card);
  });
}

function sortAndFilter() {
  const q = document.getElementById("prof-search").value.trim().toLowerCase();
  const sort = document.getElementById("prof-sort").value;

  let rows = professors.filter((p) => !q || p.professor_name.toLowerCase().includes(q));

  rows.sort((a, b) => {
    const ar = a.rmp_rating ?? -1;
    const br = b.rmp_rating ?? -1;
    const ad = a.rmp_difficulty ?? 999;
    const bd = b.rmp_difficulty ?? 999;

    if (sort === "difficulty-asc") return ad - bd;
    return br - ar;
  });

  renderProfessorCards(rows);
}

async function initProfessorExplorer() {
  const res = await fetch("../data/professors.json");
  professors = await res.json();

  renderProfessorCards(professors);

  document.getElementById("prof-search").addEventListener("input", sortAndFilter);
  document.getElementById("prof-sort").addEventListener("change", sortAndFilter);
}

document.addEventListener("DOMContentLoaded", initProfessorExplorer);
