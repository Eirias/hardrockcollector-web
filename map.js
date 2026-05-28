/**
 * Landing-page world map.
 * Uses Leaflet (loaded from CDN in index.html) + Carto Dark Matter tiles.
 * Reads /assets/cafes.json.
 *
 * Pin colors:
 *   open        - gold  (#E8B440)
 *   closed      - red   (#FF3B5C)
 *   coming_soon - blue  (#4FB2FF)
 */
(function () {
  var el = document.getElementById("world-map");
  if (!el || typeof L === "undefined") return;

  var map = L.map(el, {
    center: [25, 10],
    zoom: 2,
    minZoom: 2,
    maxZoom: 12,
    worldCopyJump: true,
    scrollWheelZoom: false, // tap/click first
    zoomControl: true,
  });

  // Re-enable scroll-zoom once the user has interacted with the map
  map.once("focus click", function () { map.scrollWheelZoom.enable(); });

  // Carto Dark Matter - free, no API key, fits the dark theme
  L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
    subdomains: "abcd",
    maxZoom: 19,
  }).addTo(map);

  var STATUS_COLOR = {
    open: "#E8B440",
    closed: "#FF3B5C",
    coming_soon: "#4FB2FF",
  };

  function pinIcon(status) {
    var color = STATUS_COLOR[status] || "#6E6A60";
    var glow = status === "open" ? 'box-shadow:0 0 8px ' + color + 'aa;' : '';
    var html =
      '<span style="' +
      'display:block;width:12px;height:12px;border-radius:50%;' +
      'background:' + color + ';' +
      'border:2px solid #0A0A0C;' +
      glow +
      '"></span>';
    return L.divIcon({
      className: "hrc-pin",
      html: html,
      iconSize: [16, 16],
      iconAnchor: [8, 8],
    });
  }

  function popupHTML(c) {
    var statusLabel = (c.status || "").replace("_", " ");
    var year = c.opened_year ? " · since " + c.opened_year : "";
    return (
      '<strong>' + escapeHtml(c.name) + '</strong><br>' +
      '<span style="color:#B7B1A4">' + escapeHtml([c.city, c.country].filter(Boolean).join(", ")) + '</span><br>' +
      '<span style="color:' + (STATUS_COLOR[c.status] || "#B7B1A4") + ';text-transform:uppercase;font-size:0.72rem;letter-spacing:0.14em">' +
      escapeHtml(statusLabel) + '</span>' +
      '<span style="color:#6E6A60;font-size:0.72rem">' + escapeHtml(year) + '</span>'
    );
  }

  function escapeHtml(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  fetch("/assets/cafes.json")
    .then(function (r) { return r.json(); })
    .then(function (data) {
      var cafes = (data && data.cafes) || [];
      var bounds = [];
      cafes.forEach(function (c) {
        if (typeof c.lat !== "number" || typeof c.lng !== "number") return;
        if (c.lat === 0 && c.lng === 0) return;
        bounds.push([c.lat, c.lng]);
        L.marker([c.lat, c.lng], { icon: pinIcon(c.status), title: c.name })
          .bindPopup(popupHTML(c))
          .addTo(map);
      });
      var countEl = document.getElementById("map-count");
      if (countEl) countEl.textContent = cafes.length;
    })
    .catch(function (err) {
      console.error("Failed to load cafés:", err);
    });
})();
