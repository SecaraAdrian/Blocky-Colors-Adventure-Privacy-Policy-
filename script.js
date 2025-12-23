(() => {
  const $ = (q, root = document) => root.querySelector(q);
  const $$ = (q, root = document) => Array.from(root.querySelectorAll(q));

  const tabs = $$(".tab");
  const docs = $$(".doc");
  const toc = $("#toc");
  const searchInput = $("#searchInput");
  const clearSearch = $("#clearSearch");
  const backToTop = $("#backToTop");
  const toggleTheme = $("#toggleTheme");
  const copyLinkBtn = $("#copyLinkBtn");
  const printBtn = $("#printBtn");

  // Year
  $$(".year").forEach((y) => (y.textContent = new Date().getFullYear()));

  /* ================= THEME ================= */
  const THEME_KEY = "pp_theme";
  const saved = localStorage.getItem(THEME_KEY);
  if (saved === "light") {
    document.documentElement.setAttribute("data-theme", "light");
  }

  toggleTheme.addEventListener("click", () => {
    const isLight =
      document.documentElement.getAttribute("data-theme") === "light";
    if (isLight) {
      document.documentElement.removeAttribute("data-theme");
      localStorage.setItem(THEME_KEY, "dark");
    } else {
      document.documentElement.setAttribute("data-theme", "light");
      localStorage.setItem(THEME_KEY, "light");
    }
  });

  /* ================= LANGUAGE ================= */
  function setLang(lang) {
    tabs.forEach((t) => {
      const active = t.dataset.lang === lang;
      t.classList.toggle("is-active", active);
    });

    docs.forEach((d) =>
      d.classList.toggle("is-active", d.dataset.lang === lang)
    );

    buildToc(lang);
    clearSearchFn();
  }

  tabs.forEach((t) =>
    t.addEventListener("click", () => setLang(t.dataset.lang))
  );

  /* ================= TOC ================= */
  function buildToc(lang) {
    const doc = docs.find((d) => d.dataset.lang === lang);
    if (!doc || !toc) return;

    toc.innerHTML = "";
    $$("[data-toc]", doc).forEach((h) => {
      const a = document.createElement("a");
      a.textContent = h.getAttribute("data-toc");
      a.href = "#";
      a.addEventListener("click", (e) => {
        e.preventDefault();
        h.scrollIntoView({ behavior: "smooth", block: "start" });
      });
      toc.appendChild(a);
    });
  }

  /* ================= SEARCH ================= */
  function clearSearchFn() {
    searchInput.value = "";
    applySearch("");
  }

  function applySearch(q) {
    const lang = $(".tab.is-active")?.dataset.lang;
    const doc = docs.find((d) => d.dataset.lang === lang);
    if (!doc) return;

    const query = q.trim().toLowerCase();
    $$(".card", doc).forEach((card) => {
      const match = !query || card.innerText.toLowerCase().includes(query);
      card.style.display = match ? "" : "none";
    });
  }

  searchInput.addEventListener("input", () =>
    applySearch(searchInput.value)
  );
  clearSearch.addEventListener("click", clearSearchFn);

  /* ================= BACK TO TOP ================= */
  window.addEventListener("scroll", () => {
    backToTop.classList.toggle("show", window.scrollY > 600);
  });

  backToTop.addEventListener("click", () =>
    window.scrollTo({ top: 0, behavior: "smooth" })
  );

  /* ================= COPY LINK ================= */
  copyLinkBtn.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(location.href);
      copyLinkBtn.textContent = "Copied!";
      setTimeout(() => (copyLinkBtn.textContent = "Copy link"), 1200);
    } catch {
      alert("Copy failed");
    }
  });

  /* ================= PRINT ================= */
  printBtn.addEventListener("click", () => window.print());

  /* ================= INIT ================= */
  const browserLang = navigator.language?.toLowerCase() || "en";
  setLang(browserLang.startsWith("ro") ? "ro" : "en");
})();
