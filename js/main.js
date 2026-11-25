import { buildConfig } from "./config.js";

/* ---------- определение клиники по URL (/parola или /?c=parola) ---------- */
function getClinicSlug() {
  const qs = new URLSearchParams(window.location.search).get("c");
  if (qs && /^[a-z0-9-]+$/i.test(qs)) return qs.toLowerCase();
  const path = window.location.pathname.replace(/^\/+|\/+$/g, "");
  if (path && /^[a-z0-9-]+$/i.test(path)) return path.toLowerCase();
  return "default";
}

async function loadClinicData(slug) {
  try {
    const res = await fetch(`/clinics/${slug}.json`, { cache: "no-cache" });
    if (res.ok) return await res.json();
  } catch (_) {}
  const fallback = await fetch("/clinics/default.json", { cache: "no-cache" });
  return await fallback.json();
}

let C;

/* ---------- helpers ---------- */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];

// безопасное создание элементов (без innerHTML → без XSS)
function h(tag, attrs = {}, ...kids) {
  const el = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (k === "class") el.className = v;
    else if (k === "disabled") el.disabled = Boolean(v);
    else if (k.startsWith("on")) el.addEventListener(k.slice(2), v);
    else if (v !== false && v != null) el.setAttribute(k, v);
  }
  for (const k of kids.flat()) if (k != null) el.append(k.nodeType ? k : String(k));
  return el;
}
const icon = (id) => {
  const ns = "http://www.w3.org/2000/svg";
  const s = document.createElementNS(ns, "svg");
  s.setAttribute("class", "i");
  s.setAttribute("aria-hidden", "true");
  const u = document.createElementNS(ns, "use");
  u.setAttribute("href", "#i-" + id);
  s.append(u);
  return s;
};
const waUrl = (msg) => `https://wa.me/${C.clinic.whatsapp.replace(/\D/g, "")}${msg ? "?text=" + encodeURIComponent(msg) : ""}`;
const fill = (str, o) => str.replace(/\{(\w+)\}/g, (_, k) => o[k] ?? "");
const setMeta = (sel, val) => { const el = $(sel); if (el) el.setAttribute("content", val); };
const loc = (val) => (val && typeof val === "object" && !Array.isArray(val) ? (val[lang] ?? val.tr ?? "") : (val ?? ""));

let lang = localStorage.getItem("lang");
if (!["tr", "en", "ar"].includes(lang)) lang = "tr";
const T = () => C.texts[lang];
let demoDismissed = false;

/* ---------- static (не зависит от языка) ---------- */
function initStatic() {
  if (C.isDemo) {
    document.head.append(h("meta", { name: "robots", content: "noindex, nofollow" }));
    const demoBar = $("#demoBar");
    const demoClose = $("#demoClose");
    if (demoBar) demoBar.hidden = false;
    if (demoClose) {
      demoClose.addEventListener("click", () => {
        demoDismissed = true;
        demoBar.hidden = true;
      });
    }
  }

  $$("[data-c]").forEach((el) => {
    const v = C.clinic[el.dataset.c];
    el.textContent = v ?? "";
    if (!v || /—\s*$/.test(v)) el.hidden = true;
  });
  $$(".js-tel").forEach((a) => (a.href = "tel:" + C.clinic.phone.replace(/\s/g, "")));
  $$(".js-tel-text").forEach((a) => {
    a.textContent = C.clinic.phone;
    a.dir = "ltr";
  });
  $$(".js-ig").forEach((a) => {
    if (C.clinic.instagram) {
      a.href = C.clinic.instagram;
    } else {
      const row = a.closest("p");
      if (row) row.hidden = true;
      else a.hidden = true;
    }
  });
  $$(".js-route").forEach((a) => (a.href = C.clinic.mapsLink));
  $("#map").src = C.clinic.mapsEmbedUrl;
  $("#heroImg").src = C.images.hero;
  if ($("#whyImg")) $("#whyImg").src = C.images.why;
  $("#year").textContent = new Date().getFullYear();

  // JSON-LD: Dentist + FAQPage
  const siteUrl = C.clinic.url || window.location.href;
  const absOg = new URL(C.images.og, window.location.origin).href;
  const days = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
  const dentist = {
    "@context": "https://schema.org",
    "@type": "Dentist",
    name: C.clinic.name,
    image: absOg,
    telephone: C.clinic.phone,
    url: siteUrl,
    sameAs: C.clinic.instagram ? [C.clinic.instagram] : [],
    address: {
      "@type": "PostalAddress",
      streetAddress: C.clinic.address,
      addressLocality: C.clinic.district,
      addressRegion: "İstanbul",
      addressCountry: "TR"
    },
    geo: { "@type": "GeoCoordinates", latitude: C.clinic.coords.lat, longitude: C.clinic.coords.lng },
    openingHoursSpecification: C.hours
      .map((x, i) => x && { "@type": "OpeningHoursSpecification", dayOfWeek: days[i], opens: x[0], closes: x[1] })
      .filter(Boolean)
  };
  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: C.faq.map((f) => ({
      "@type": "Question",
      name: f.tr[0],
      acceptedAnswer: { "@type": "Answer", text: f.tr[1] }
    }))
  };
  [dentist, faqLd].forEach((obj) => {
    const s = document.createElement("script");
    s.type = "application/ld+json";
    s.textContent = JSON.stringify(obj);
    document.head.append(s);
  });
}

/* ---------- рендер на языке ---------- */
function render() {
  const t = T();
  document.documentElement.lang = lang;
  document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
  document.title = t.metaTitle;
  setMeta('meta[name="description"]', t.metaDesc);
  setMeta('meta[property="og:title"]', t.metaTitle);
  setMeta('meta[property="og:description"]', t.metaDesc);
  setMeta('meta[property="og:locale"]', lang === "ar" ? "ar_AR" : lang === "en" ? "en_US" : "tr_TR");
  $("#map").title = t.mapTitle;

  if (C.isDemo && !demoDismissed && $("#demoText")) {
    $("#demoText").textContent = t.demoNotice;
  }

  $$("[data-lang]").forEach((b) => b.setAttribute("aria-pressed", b.dataset.lang === lang));
  $$("[data-t]").forEach((el) => (el.textContent = t[el.dataset.t] ?? ""));
  $$("[data-nav]").forEach((a) => (a.textContent = t.nav[a.dataset.nav]));
  $$(".js-wa").forEach((a) => (a.href = waUrl()));
  $$(".header .js-tel").forEach((a) => a.setAttribute("aria-label", t.call));

  // alt-тексты
  $("#heroImg").alt = `${C.clinic.shortName} — ${t.heroTitle} ${t.heroTitleAccent}`;
  $(".why__media img").alt = `${t.heroCardTitle} — ${C.clinic.shortName}`;

  $("#chips").replaceChildren(...t.chips.map((c) => h("li", {}, icon("check"), c)));
  if ($("#quizPerks")) {
    $("#quizPerks").replaceChildren(...t.chips.map((c) => h("li", {}, icon("check"), c)));
  }
  $("#stats").replaceChildren(...C.stats.map((s) => h("div", { class: "stat" }, h("b", {}, s.value), h("span", {}, t[s.key]))));
  if ($("#standards") && C.standards) {
    $("#standards").replaceChildren(...C.standards.map((s) => h("span", {}, s)));
  }

  const featured = C.treatments.slice(0, 4);
  const secondary = C.treatments.slice(4);
  if ($("#treatFeatured")) {
    $("#treatFeatured").replaceChildren(...featured.map((tr, idx) => {
      const L = tr[lang];
      return h("article", { class: "treat-feat reveal" },
        h("div", { class: "treat-feat__media" },
          h("img", { src: tr.photo || "/img/g1.webp", alt: L.t, loading: "lazy", decoding: "async" }),
          h("span", { class: "treat-feat__num" }, String(idx + 1).padStart(2, "0"))
        ),
        h("div", { class: "treat-feat__body" },
          h("h3", {}, L.t),
          h("p", {}, L.s),
          h("ul", { class: "treat-feat__points" }, L.d.slice(0, 3).map((step) => h("li", {}, icon("check"), step))),
          h("div", { class: "treat__meta" },
            h("span", {}, icon("clock"), `${t.duration}: ${tr.duration[lang]}`),
            h("span", {}, icon("repeat"), `${t.sessions}: ${tr.sessions}`)),
          h("div", { class: "treat__more" }, t.details, icon("arrow"))
        ),
        h("button", { class: "treat__hit", "aria-label": `${t.details}: ${L.t}`, onclick: () => openTreatment(tr) })
      );
    }));
  }

  $("#treatGrid").replaceChildren(...secondary.map((tr, idx) => {
    const L = tr[lang];
    return h("article", { class: "treat reveal" },
      h("div", { class: "treat__top" },
        h("div", { class: "treat__ic" }, icon(tr.icon)),
        h("span", { class: "treat__num" }, String(idx + 5).padStart(2, "0"))
      ),
      h("h3", {}, L.t),
      h("p", {}, L.s),
      h("div", { class: "treat__meta" },
        h("span", {}, icon("clock"), `${t.duration}: ${tr.duration[lang]}`),
        h("span", {}, icon("repeat"), `${t.sessions}: ${tr.sessions}`)),
      h("div", { class: "treat__more" }, t.details, icon("arrow")),
      h("button", { class: "treat__hit", "aria-label": `${t.details}: ${L.t}`, onclick: () => openTreatment(tr) })
    );
  }));

  renderTech();
  renderReviews();

  const whyIcons = ["shield", "sun", "scan", "calendar", "clock", "pin"];
  $("#whyList").replaceChildren(...t.why.map(([a, b], i) => h("li", { class: "why__item" },
    h("div", { class: "treat__ic" }, icon(whyIcons[i] || "check")),
    h("div", {}, h("b", {}, a), h("p", {}, b))
  )));

  $("#docGrid").dataset.count = String(C.doctors.length);
  $("#docGrid").replaceChildren(...C.doctors.map((d) => {
    const dTitle = loc(d.title);
    const dUni = loc(d.uni);
    const dTags = Array.isArray(d.tags) ? d.tags : (d.tags[lang] ?? d.tags.tr ?? []);
    const fullName = `${dTitle} ${d.name}`.trim();
    return h("article", { class: "doc reveal" },
      h("img", { src: d.photo, alt: fullName, loading: "lazy", decoding: "async", width: 700, height: 875 }),
      h("div", { class: "doc__b" },
        h("span", { class: "doc__title" }, dTitle),
        h("h3", {}, d.name),
        h("p", { class: "doc__uni" }, dUni),
        h("div", { class: "tags" }, dTags.map((x) => h("span", {}, x))),
        h("p", { class: "doc__langs" }, `${t.langs}: ${d.langs.join(" · ")}`),
        h("a", {
          class: "doc__book",
          href: waUrl(fill(t.waDoctor, { d: fullName })),
          target: "_blank",
          rel: "noopener noreferrer"
        }, t.doctorBook, icon("arrow"))
      )
    );
  }));

  $("#timeline").replaceChildren(...t.proc.map(([a, b]) => h("li", { class: "reveal" }, h("h3", {}, a), h("p", {}, b))));

  $("#galGrid").replaceChildren(...C.gallery.map((g, i) => h("button", {
    class: "reveal", type: "button", "aria-label": `${t.galTitle} ${i + 1}: ${g.alt[lang]}`, onclick: () => openLb(i)
  }, h("img", { src: g.src, alt: g.alt[lang], width: g.w, height: g.h, loading: "lazy", decoding: "async" }))));

  $("#faqList").replaceChildren(...C.faq.map((f) => h("details", { class: "reveal" },
    h("summary", {}, f[lang][0]), h("p", {}, f[lang][1]))));

  $("#localAreas").replaceChildren(...t.localAreas.map((a) => h("li", {}, a)));

  $("#footerNav").replaceChildren(...t.nav.map((n, i) => h("a", { href: ["#treatments", "#doctors", "#gallery", "#faq", "#contact"][i] }, n)));
  $("#footerTreatList").replaceChildren(...C.treatments.slice(0, 5).map((tr) =>
    h("li", {}, h("button", { class: "footer__treat", type: "button", onclick: () => openTreatment(tr) }, tr[lang].t))));

  if (lb.open) updateLb();
  renderHours();
  renderQuiz();
  observe();
}

/* ---------- интерактивный блок технологий ---------- */
let activeTech = 0;
function renderTech() {
  const tabsEl = $("#techTabs"), panelEl = $("#techPanel");
  const list = T().techTabs;
  if (!tabsEl || !panelEl || !list || !list.length) return;
  if (activeTech >= list.length) activeTech = 0;

  tabsEl.replaceChildren(...list.map((item, i) =>
    h("button", {
      class: "tech-tab",
      type: "button",
      role: "tab",
      "aria-selected": String(i === activeTech),
      onclick: () => { activeTech = i; renderTech(); }
    },
      h("div", { class: "tech-tab__head" },
        h("span", { class: "tech-tab__num" }, item.num),
        h("b", {}, item.short)
      ),
      h("small", {}, item.sub)
    )
  ));

  const techPhotos = ["/img/why.webp", "/img/g1.webp", "/img/g8.webp", "/img/g6.webp"];
  const cur = list[activeTech];
  panelEl.replaceChildren(
    h("img", { class: "tech-panel__img", src: techPhotos[activeTech % techPhotos.length], alt: cur.title, loading: "lazy", decoding: "async" }),
    h("div", { class: "tech-panel__body" },
      h("div", {},
        h("span", { class: "tech-panel__badge" }, cur.badge),
        h("h3", {}, cur.title),
        h("p", {}, cur.desc)
      ),
      h("div", { class: "tech-metrics" },
        cur.metrics.map(([val, lbl]) =>
          h("div", { class: "tech-metric" }, h("b", {}, val), h("span", {}, lbl))
        )
      )
    )
  );
}

/* ---------- блок отзывов Google (4 карточки в столбик) ---------- */
function renderReviews() {
  const sec = $("#reviews"), heroPill = $("#heroRating");
  const t = T();
  if (!sec) return;
  if (!C.showReviews || !C.reviews || !C.reviews.length) {
    sec.hidden = true;
    if (heroPill) heroPill.hidden = true;
    return;
  }
  sec.hidden = false;
  const ratingText = Number(C.rating).toFixed(1);
  const countText = fill(t.revCountLabel, { n: C.reviewsCount });

  if (heroPill) {
    heroPill.hidden = false;
    $("#heroRatingVal").textContent = ratingText;
    $("#heroRatingCount").textContent = `· ${countText}`;
  }
  $("#revScoreVal").textContent = ratingText;
  $("#revScoreMeta").textContent = countText;

  $("#revList").replaceChildren(...C.reviews.map((r) =>
    h("article", { class: "rev-card reveal" },
      h("div", { class: "rev-card__top" },
        h("div", { class: "rev-author" },
          h("span", { class: "rev-avatar", "aria-hidden": "true" }, r.initials || r.name.slice(0, 2).toUpperCase()),
          h("div", {},
            h("b", {}, r.name),
            h("small", {}, loc(r.date))
          )
        ),
        h("span", { class: "rev-card__stars", "aria-label": "5/5" }, "★★★★★")
      ),
      h("p", {}, loc(r.text))
    )
  ));
}

/* ---------- часы работы / статус ---------- */
function istanbulNow() {
  const p = new Intl.DateTimeFormat("en-GB", { timeZone: "Europe/Istanbul", weekday: "short", hour: "2-digit", minute: "2-digit", hour12: false }).formatToParts(new Date());
  const g = (k) => p.find((x) => x.type === k).value;
  return { day: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(g("weekday")), min: (+g("hour") % 24) * 60 + +g("minute") };
}
const toMin = (s) => { const [a, b] = s.split(":"); return a * 60 + +b; };
function renderHours() {
  const t = T(), now = istanbulNow(), today = C.hours[now.day];
  const open = today && now.min >= toMin(today[0]) && now.min < toMin(today[1]);
  $("#status").classList.toggle("open", !!open);
  $("#statusText").textContent = open ? t.open : t.closed;
  $("#statusHours").textContent = `${t.today}: ${today ? today.join("–") : t.closedDay}`;
  const order = [1, 2, 3, 4, 5, 6, 0];
  $("#hours").replaceChildren(...order.map((i) => h("li", { class: i === now.day ? "today" : "" },
    h("span", {}, t.days[i]), h("span", { class: "hours__time" }, C.hours[i] ? C.hours[i].join("–") : t.closedDay))));
}

/* ---------- модалки ---------- */
const modal = $("#modal");
function openModal(...content) { $("#modalBody").replaceChildren(...content); modal.showModal(); }
function openTreatment(tr) {
  const t = T(), L = tr[lang];
  openModal(
    h("div", { class: "treat__ic" }, icon(tr.icon)),
    h("h2", {}, L.t),
    h("p", {}, L.s),
    h("p", { class: "treat__meta treat__meta--flat" },
      h("span", {}, icon("clock"), `${t.duration}: ${tr.duration[lang]}`),
      h("span", {}, icon("repeat"), `${t.sessions}: ${tr.sessions}`)),
    h("h3", {}, t.steps),
    h("ol", { class: "steps-list" }, L.d.map((x) => h("li", {}, x))),
    h("a", { class: "btn btn--wa", href: waUrl(fill(t.waTreat, { t: L.t })), target: "_blank", rel: "noopener noreferrer" }, icon("wa"), t.wa),
    h("p", { class: "small" }, t.disclaimer)
  );
}
function openKvkk() { const t = T(); openModal(h("h2", {}, t.kvkkTitle), h("p", {}, t.kvkkText)); }
$$("dialog").forEach((d) => {
  d.addEventListener("click", (e) => { if (e.target === d || e.target.closest("[data-close]")) d.close(); });
});
document.addEventListener("click", (e) => { if (e.target.closest("[data-open-kvkk]")) openKvkk(); });

/* ---------- lightbox ---------- */
const lb = $("#lightbox");
let lbI = 0;
function updateLb() {
  const item = C.gallery[lbI];
  $("#lbImg").src = item.src;
  $("#lbImg").alt = item.alt[lang];
  $("#lbCount").textContent = `${lbI + 1} / ${C.gallery.length}`;
  $("#lbCap").textContent = item.alt[lang];
}
function openLb(i) { lbI = i; updateLb(); lb.showModal(); }
const lbStep = (d) => { lbI = (lbI + d + C.gallery.length) % C.gallery.length; updateLb(); };
$(".lb__prev").addEventListener("click", () => lbStep(lang === "ar" ? 1 : -1));
$(".lb__next").addEventListener("click", () => lbStep(lang === "ar" ? -1 : 1));
lb.addEventListener("keydown", (e) => {
  if (e.key === "ArrowLeft") lbStep(lang === "ar" ? 1 : -1);
  if (e.key === "ArrowRight") lbStep(lang === "ar" ? -1 : 1);
});
let tx = 0;
lb.addEventListener("touchstart", (e) => (tx = e.touches[0].clientX), { passive: true });
lb.addEventListener("touchend", (e) => {
  const dx = e.changedTouches[0].clientX - tx;
  if (Math.abs(dx) > 50) lbStep((dx < 0 ? 1 : -1) * (lang === "ar" ? -1 : 1));
});

/* ---------- квиз ---------- */
const quiz = { step: 0, a: null, b: null, name: "", tel: "", ok: false, last: null };
const cleanText = (s) => s.replace(/[<>{}\[\]\\]/g, "").replace(/\s+/g, " ").trim().slice(0, 60);
const validTel = (s) => /^(\+?90)?0?5\d{9}$/.test(s.replace(/[\s()-]/g, "")) || /^\+\d{8,15}$/.test(s.replace(/[\s()-]/g, ""));

function renderQuiz() {
  const t = T(), body = $("#quizBody");
  $("#progress").style.width = `${(quiz.step / 3) * 100}%`;
  const nav = (nextLabel, onNext, optsCfg = {}) => {
    const { showNext = true, disabled = false } = optsCfg;
    return h("div", { class: "quiz__nav" },
      quiz.step > 0 && quiz.step < 3
        ? h("button", { class: "btn btn--ghost", type: "button", onclick: () => { quiz.step--; renderQuiz(); } }, t.back)
        : h("span"),
      showNext
        ? h("button", { class: quiz.step === 2 ? "btn btn--wa" : "btn btn--primary", type: "button", disabled, onclick: onNext }, nextLabel)
        : null
    );
  };
  const opts = (list, key) => h("div", { class: "opts" }, list.map((o, idx) =>
    h("button", {
      class: "opt",
      type: "button",
      "aria-pressed": quiz[key] === idx,
      onclick: () => { quiz[key] = idx; quiz.step++; renderQuiz(); }
    }, o)));

  if (quiz.step === 0) {
    body.replaceChildren(
      h("h3", {}, t.q1),
      opts(t.q1o, "a"),
      quiz.a !== null ? nav(t.next, () => { quiz.step = 1; renderQuiz(); }) : ""
    );
  } else if (quiz.step === 1) {
    body.replaceChildren(
      h("h3", {}, t.q2),
      opts(t.q2o, "b"),
      nav(t.next, () => { if (quiz.b !== null) { quiz.step = 2; renderQuiz(); } }, { disabled: quiz.b === null })
    );
  } else if (quiz.step === 2) {
    const err = h("p", { class: "err", role: "alert" });
    const name = h("input", { type: "text", placeholder: t.name, "aria-label": t.name, maxlength: 60, autocomplete: "name", value: quiz.name, oninput: (e) => (quiz.name = e.target.value) });
    const tel = h("input", { type: "tel", dir: "ltr", placeholder: t.tel, "aria-label": t.tel, maxlength: 20, autocomplete: "tel", inputmode: "tel", value: quiz.tel, oninput: (e) => (quiz.tel = e.target.value) });
    const ck = h("input", { type: "checkbox", id: "kvkk", onchange: (e) => (quiz.ok = e.target.checked) });
    ck.checked = quiz.ok;
    const [pre, post] = t.kvkk.split("{link}");
    body.replaceChildren(h("h3", {}, t.q3),
      h("div", { class: "field" }, name),
      h("div", { class: "field" }, tel),
      h("label", { class: "check", for: "kvkk" }, ck, h("span", {}, pre, h("button", { type: "button", class: "link", "data-open-kvkk": "" }, t.kvkkLink), post)),
      err,
      nav(t.send, () => {
        const n = cleanText(quiz.name);
        if (n.length < 2) return (err.textContent = t.errName, name.focus());
        if (!validTel(quiz.tel)) return (err.textContent = t.errTel, tel.focus());
        if (!quiz.ok) return (err.textContent = t.errKvkk);
        const aText = quiz.a !== null ? t.q1o[quiz.a] : "";
        const bText = quiz.b !== null ? t.q2o[quiz.b] : "";
        quiz.last = waUrl(fill(t.waQuiz, { n, a: aText, b: bText, p: quiz.tel.replace(/[^\d+\s]/g, "").trim() }));
        quiz.step = 3;
        renderQuiz();
        window.open(quiz.last, "_blank", "noopener,noreferrer");
      }));
  } else {
    body.replaceChildren(h("div", { class: "done" },
      h("div", { class: "done__ic" }, icon("check")),
      h("h3", {}, t.thanks),
      h("p", {}, t.thanksSub),
      h("a", { class: "btn btn--wa", href: quiz.last, target: "_blank", rel: "noopener noreferrer" }, icon("wa"), t.send)));
    $("#progress").style.width = "100%";
  }
}

/* ---------- UI: header, menu, bar, reveal, scrollspy ---------- */
const header = $("#header"), bar = $("#bar"), burger = $("#burger"), nav = $("#nav"), readProg = $("#readProgress");
const onScroll = () => {
  header.classList.toggle("scrolled", scrollY > 10);
  bar.classList.toggle("show", scrollY > innerHeight * 0.55);
  if (readProg) {
    const max = Math.max(1, document.documentElement.scrollHeight - innerHeight);
    readProg.style.width = `${Math.min(100, (scrollY / max) * 100)}%`;
  }
};
addEventListener("scroll", onScroll, { passive: true });
burger.addEventListener("click", () => {
  const o = nav.classList.toggle("open");
  burger.setAttribute("aria-expanded", o);
  document.body.style.overflow = o ? "hidden" : "";
});
nav.addEventListener("click", (e) => {
  if (e.target.tagName === "A") {
    nav.classList.remove("open");
    burger.setAttribute("aria-expanded", false);
    document.body.style.overflow = "";
  }
});
$$("[data-lang]").forEach((b) => b.addEventListener("click", () => {
  lang = b.dataset.lang;
  localStorage.setItem("lang", lang);
  render();
  onScroll();
}));

let io;
function observe() {
  if (!("IntersectionObserver" in window) || matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return $$(".reveal").forEach((e) => e.classList.add("in"));
  }
  io ??= new IntersectionObserver((es) => es.forEach((e) => {
    if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
  }), { threshold: 0.12 });
  $$(".reveal:not(.in)").forEach((e) => io.observe(e));
}

const spy = new IntersectionObserver((entries) => {
  entries.forEach((e) => {
    if (!e.isIntersecting) return;
    const i = ["treatments", "doctors", "gallery", "faq", "contact"].indexOf(e.target.id);
    $$("[data-nav]").forEach((a) => a.setAttribute("aria-current", +a.dataset.nav === i ? "true" : "false"));
  });
}, { rootMargin: "-45% 0px -50% 0px" });

/* ---------- старт ---------- */
(async () => {
  const slug = getClinicSlug();
  const data = await loadClinicData(slug);
  C = buildConfig(data);
  initStatic();
  render();
  onScroll();
  ["treatments", "doctors", "gallery", "faq", "contact"].forEach((id) => {
    const s = document.getElementById(id);
    if (s) spy.observe(s);
  });
  setInterval(renderHours, 60000);
})();
