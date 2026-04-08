(function markActiveNav() {
  const current = window.location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".site-nav a").forEach((link) => {
    const href = link.getAttribute("href") || "";
    if (href.endsWith(current)) {
      link.classList.add("active");
    }
  });
})();
