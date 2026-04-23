const stats = {
  pages: 4,
  degreeHours: 120,
  trackedCourses: 64
};

document.getElementById("home-pages").textContent = String(stats.pages);
document.getElementById("home-hours").textContent = String(stats.degreeHours);
document.getElementById("home-sections").textContent = String(stats.trackedCourses);

const lastUpdatedEl = document.getElementById("home-last-updated");
if (lastUpdatedEl) {
  const now = new Date();
  lastUpdatedEl.textContent = now.toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric"
  });
}
