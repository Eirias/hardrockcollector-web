/**
 * Site config - set per-page before this script runs:
 *
 *   <script>window.HRC_CONFIG = { appStoreUrl: "...", githubUrl: "..." };</script>
 *   <script src="/config.js"></script>
 *
 * Or via data-attrs on <html>:
 *   <html data-hrc-app-store="..." data-hrc-github="...">
 *
 * Legal links are static (Website/legal/*) - no runtime substitution needed.
 */
(function () {
  var root = document.documentElement;
  var fromData = {
    appStoreUrl: root.dataset.hrcAppStore || "",
    githubUrl: root.dataset.hrcGithub || "",
  };
  var cfg = Object.assign({}, fromData, window.HRC_CONFIG || {});

  document.querySelectorAll("[data-app-store-link]").forEach(function (el) {
    if (cfg.appStoreUrl) {
      el.href = cfg.appStoreUrl;
      el.textContent = el.dataset.appStoreLabel || "Download on the App Store";
      el.removeAttribute("aria-disabled");
      el.setAttribute("rel", "noopener");
    } else {
      el.href = "#";
      el.setAttribute("aria-disabled", "true");
      el.addEventListener("click", function (e) { e.preventDefault(); });
    }
  });

  document.querySelectorAll("[data-github-link]").forEach(function (el) {
    if (cfg.githubUrl) {
      el.href = cfg.githubUrl;
      el.hidden = false;
      el.classList.remove("hidden");
      el.setAttribute("rel", "noopener noreferrer");
    }
  });
})();
