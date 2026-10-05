(function () {
  "use strict";

  var $ = function (sel, ctx) { return (ctx || document).querySelector(sel); };
  var $$ = function (sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); };

  document.documentElement.classList.add("js");

  var yearEl = $("#year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Header scroll state ---------- */
  var header = $("#siteHeader");
  var headerCta = $("#headerCta");
  function onScroll() {
    var scrolled = window.scrollY > 40;
    if (header) header.classList.toggle("scrolled", scrolled);
    if (headerCta) headerCta.style.display = scrolled ? "inline-flex" : "none";
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile nav ---------- */
  var hamburger = $("#hamburgerBtn");
  var mobileNav = $("#mobileNav");
  if (hamburger && mobileNav) {
    hamburger.addEventListener("click", function () {
      var open = mobileNav.classList.toggle("open");
      hamburger.setAttribute("aria-expanded", open ? "true" : "false");
      document.body.style.overflow = open ? "hidden" : "";
    });
    $$("#mobileNav a").forEach(function (a) {
      a.addEventListener("click", function () {
        mobileNav.classList.remove("open");
        hamburger.setAttribute("aria-expanded", "false");
        document.body.style.overflow = "";
      });
    });
  }

  /* ---------- Scroll reveal (IntersectionObserver) ---------- */
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var revealTargets = $$(".reveal, .reveal-stagger, .photo-reveal, [data-thread]");
  if (reduceMotion) {
    revealTargets.forEach(function (el) { el.classList.add("in-view"); });
  } else if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );
    revealTargets.forEach(function (el) { io.observe(el); });
  } else {
    revealTargets.forEach(function (el) { el.classList.add("in-view"); });
  }

  /* ---------- Scroll progress thread ---------- */
  var progressBar = $("#scrollProgress");
  function onProgress() {
    if (!progressBar) return;
    var h = document.documentElement;
    var scrollable = h.scrollHeight - h.clientHeight;
    var ratio = scrollable > 0 ? window.scrollY / scrollable : 0;
    progressBar.style.transform = "scaleX(" + Math.min(1, Math.max(0, ratio)) + ")";
  }
  window.addEventListener("scroll", onProgress, { passive: true });
  onProgress();

  /* ---------- Hero cursor spotlight (desktop only) ---------- */
  var heroBg = $(".hero-bg");
  if (heroBg && !reduceMotion && window.matchMedia("(hover: hover)").matches) {
    var spot = document.createElement("div");
    spot.className = "spotlight";
    heroBg.appendChild(spot);
    var hero = $(".hero");
    hero.addEventListener("mousemove", function (e) {
      var r = hero.getBoundingClientRect();
      var mx = ((e.clientX - r.left) / r.width) * 100;
      var my = ((e.clientY - r.top) / r.height) * 100;
      spot.style.setProperty("--mx", mx + "%");
      spot.style.setProperty("--my", my + "%");
    });
  }

  /* ---------- Magnetic buttons ---------- */
  if (!reduceMotion && window.matchMedia("(hover: hover)").matches) {
    $$(".btn").forEach(function (btn) {
      btn.addEventListener("mousemove", function (e) {
        var r = btn.getBoundingClientRect();
        var x = e.clientX - r.left - r.width / 2;
        var y = e.clientY - r.top - r.height / 2;
        btn.style.transform = "translate(" + x * 0.12 + "px," + y * 0.28 + "px)";
      });
      btn.addEventListener("mouseleave", function () {
        btn.style.transform = "";
      });
    });
  }

  /* ---------- Service card tilt ---------- */
  if (!reduceMotion && window.matchMedia("(hover: hover)").matches) {
    $$(".service-card").forEach(function (card) {
      card.addEventListener("mousemove", function (e) {
        var r = card.getBoundingClientRect();
        var px = (e.clientX - r.left) / r.width - 0.5;
        var py = (e.clientY - r.top) / r.height - 0.5;
        card.style.transform = "perspective(900px) rotateY(" + px * 5 + "deg) rotateX(" + -py * 5 + "deg) translateY(-2px)";
      });
      card.addEventListener("mouseleave", function () {
        card.style.transform = "";
      });
    });
  }

  /* ---------- Count-up on stats ---------- */
  var countEls = $$("[data-count-to]");
  if (countEls.length && "IntersectionObserver" in window) {
    var countIO = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          var el = entry.target;
          countIO.unobserve(el);
          var to = parseInt(el.getAttribute("data-count-to"), 10);
          var suffix = el.getAttribute("data-count-suffix") || "";
          if (reduceMotion) { el.textContent = to + suffix; return; }
          var start = null;
          var duration = 1400;
          function step(ts) {
            if (!start) start = ts;
            var progress = Math.min(1, (ts - start) / duration);
            var eased = 1 - Math.pow(1 - progress, 3);
            el.textContent = Math.round(eased * to) + suffix;
            if (progress < 1) requestAnimationFrame(step);
          }
          requestAnimationFrame(step);
        });
      },
      { threshold: 0.6 }
    );
    countEls.forEach(function (el) { countIO.observe(el); });
  }

  /* ---------- Map: click-to-load (privacy-friendly, no cookie until requested) ---------- */
  var mapBtn = $("#mapLoadBtn");
  var mapFrame = $("#mapFrame");
  function loadMap() {
    if (!mapFrame || mapFrame.dataset.loaded) return;
    var src = mapFrame.getAttribute("data-map-src");
    var iframe = document.createElement("iframe");
    iframe.src = src;
    iframe.loading = "lazy";
    iframe.referrerPolicy = "no-referrer-when-downgrade";
    iframe.title = "Localisation Vision Line Auto sur Google Maps";
    mapFrame.innerHTML = "";
    mapFrame.appendChild(iframe);
    mapFrame.dataset.loaded = "true";
  }
  if (mapBtn) mapBtn.addEventListener("click", loadMap);

  /* ---------- Cookie consent banner ---------- */
  var cookieBanner = $("#cookieBanner");
  var COOKIE_KEY = "vla_cookie_consent";
  if (cookieBanner) {
    try {
      var consent = window.localStorage.getItem(COOKIE_KEY);
    } catch (err) { var consent = null; }
    if (!consent) {
      window.setTimeout(function () { cookieBanner.classList.add("visible"); }, 900);
    }
    var acceptBtn = $("#cookieAccept");
    var declineBtn = $("#cookieDecline");
    function setConsent(value) {
      try { window.localStorage.setItem(COOKIE_KEY, value); } catch (err) {}
      cookieBanner.classList.remove("visible");
    }
    if (acceptBtn) acceptBtn.addEventListener("click", function () { setConsent("accepted"); });
    if (declineBtn) declineBtn.addEventListener("click", function () { setConsent("declined"); });
  }

  /* ---------- Contact form (FormSubmit via fetch, no page reload) ---------- */
  var form = $("#contactForm");
  var status = $("#formStatus");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (status) { status.textContent = "Envoi en cours…"; status.removeAttribute("data-state"); }
      var data = new FormData(form);
      fetch(form.action, {
        method: "POST",
        body: data,
        headers: { Accept: "application/json" }
      })
        .then(function (res) {
          if (res.ok) {
            if (status) {
              status.textContent = "Merci — votre demande a bien été envoyée. Nous vous répondons rapidement.";
              status.setAttribute("data-state", "ok");
            }
            form.reset();
          } else {
            throw new Error("bad response");
          }
        })
        .catch(function () {
          if (status) {
            status.textContent = "Une erreur est survenue. Contactez-nous directement par WhatsApp ou téléphone.";
            status.setAttribute("data-state", "err");
          }
        });
    });
  }
})();
