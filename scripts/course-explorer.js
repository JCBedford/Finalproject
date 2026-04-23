let courses = [];

function levelOf(courseCode) {
  const num = String(courseCode || "").replace(/\D/g, "");
  if (num.length < 5) return "";
  return `${num[0]}0000`;
}

function numberOrNull(value) {
  if (value === null || value === undefined || value === "") return null;
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

function drawRows(rows) {
  const body = document.getElementById("course-table-body");
  body.innerHTML = "";

  if (rows.length === 0) {
    const tr = document.createElement("tr");
    tr.innerHTML = '<td colspan="12" class="muted">No courses match your filters.</td>';
    body.appendChild(tr);
    return;
  }

  rows.forEach((c) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${c.course_code}</td>
      <td>${c.course_name}</td>
      <td>${c.section}</td>
      <td>${c.format}</td>
      <td>${c.schedule}</td>
      <td>${c.enrollment_cap}</td>
      <td>${c.seats_available}</td>
      <td>${c.professor_name}</td>
      <td>${c.rmp_rating ?? "-"}</td>
      <td>${c.rmp_difficulty ?? "-"}</td>
      <td>${c.rmp_would_take_again != null ? `${c.rmp_would_take_again}%` : "-"}</td>
      <td>${c.rmp_has_data ? "Yes" : "No"}</td>
    `;
    body.appendChild(tr);
  });
}

function applyFilters() {
  const q = document.getElementById("course-search").value.trim().toLowerCase();
  const level = document.getElementById("course-level").value;
  const format = document.getElementById("course-format").value;
  const sort = document.getElementById("course-sort").value;

  let rows = courses.filter((c) => {
    const inQuery = !q || [c.course_code, c.course_name, c.professor_name].join(" ").toLowerCase().includes(q);
    const inLevel = !level || levelOf(c.course_code) === level;
    const inFormat = !format || c.format === format;
    return inQuery && inLevel && inFormat;
  });

  rows.sort((a, b) => {
    const aRating = numberOrNull(a.rmp_rating);
    const bRating = numberOrNull(b.rmp_rating);
    const aDiff = numberOrNull(a.rmp_difficulty);
    const bDiff = numberOrNull(b.rmp_difficulty);

    if (sort === "rating-desc") return (bRating ?? -1) - (aRating ?? -1);
    if (sort === "rating-asc") return (aRating ?? 999) - (bRating ?? 999);
    if (sort === "difficulty-desc") return (bDiff ?? -1) - (aDiff ?? -1);
    return (aDiff ?? 999) - (bDiff ?? 999);
  });

  drawRows(rows);
}

async function initCourseExplorer() {
  const res = await fetch("../data/courses.json");
  courses = await res.json();
  drawRows(courses);

  ["course-search", "course-level", "course-format", "course-sort"].forEach((id) => {
    document.getElementById(id).addEventListener("input", applyFilters);
    document.getElementById(id).addEventListener("change", applyFilters);
  });
}

document.addEventListener("DOMContentLoaded", initCourseExplorer);
