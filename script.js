/* =========================================================================
   BIRTHDAY WEBSITE — SCRIPT
   Vanilla JS, no dependencies. Organized as:
   1. CONFIG            — everything you'll want to personalize lives here
   2. INIT / DOM CACHE
   3. AMBIENT BACKGROUND — stars, floating hearts, cursor glow
   4. PASSWORD GATE
   5. COUNTDOWN
   6. HERO TYPING EFFECT
   7. MUSIC TOGGLE
   8. SCROLL REVEAL (IntersectionObserver)
   9. ENVELOPE + LETTER
   10. GALLERY + LIGHTBOX
   11. TIMELINE (data-driven)
   12. GIFT BOX
   13. QUOTES (data-driven)
   14. CONFETTI (canvas)
   15. FIREWORKS (canvas)
   16. FINAL QUESTION (evading NO button) + CELEBRATION
   ========================================================================= */

/* =========================================================================
   1. CONFIG — edit everything here, nothing else needs to change
   ========================================================================= */
const CONFIG = {
  passcode: "23",              // numeric passcode typed on the lock-screen keypad — e.g. "23" for the day of her birthday. Any length works, dots adjust automatically.
  herName: "Mahi",              // shown in the hero + celebration
  yourName: "karan",                 // shown in the footer

  heroTypingLines: [
    "One more year of you being wonderful.",
    "Today is all about celebrating YOU.",
    "I'm so glad you were born ❤️"
  ],

  // 12–15 short paragraphs, revealed one at a time inside the letter
  letter: [
    "I've rewritten this letter about a dozen times, because nothing I write feels like enough — but here goes anyway.",
    "Happy birthday, Mahi. Today the whole world gets to celebrate the person I feel lucky to call my friend.",
    "I don't think you fully understand how much easier you make everything feel. Bad days shrink when I tell you about them.",
    "I still remember small, ordinary hangouts with you more clearly than most big events without you. That has to mean something.",
    "You have this way of making people feel like the most interesting person in the room, without even trying. I notice it every time.",
    "Thank you for the version of yourself you show me when no one else is around — the tired one, the silly one, the honest one. I appreciate all of them.",
    "I love how loudly you laugh at your own jokes before you even finish telling them.",
    "You remember tiny details about people you barely met, and somehow make everyone feel seen. Not many people do that.",
    "This year hasn't been perfect, but every hard part of it was easier because you were somewhere nearby.",
    "I hope today you feel exactly how appreciated you are, because you are — by more people than you probably realize.",
    "You deserve a birthday as good as you make other people's ordinary days feel.",
    "I'm genuinely grateful for a friend like you, and I hope we're still causing chaos together for many birthdays to come.",
    "So — happy birthday. Go be exactly the kind of chaotic, wonderful person you always are today.",
    "Cheers to you, always."
  ],

  timeline: [
    { emoji: "❤️", title: "Your Smile", text: "It shows up before you even realize you're happy, and somehow it's contagious every single time." },
    { emoji: "🌸", title: "Your Eyes", text: "And can I just say — your eyes are beautiful, they genuinely light up any room you walk into." },
    { emoji: "✨", title: "Your Personality", text: "mardana aurat?, a little chaotic, endlessly curious — there's genuinely no one else like you." },
    { emoji: "😂", title: "Your Laugh", text: "Loud, real, and the best sound in any room you're in. I will never get tired of causing it." },
    { emoji: "🌍", title: "Everything About You", text: "Even the small, unremarkable things — you make them feel worth remembering." }
  ],

  quotes: [
    "You're the favorite part of every plan I make.",
    "Good friends are rare. The kind who make ordinary days better are rarer.",
    "Every year knowing you has been better than the one before it, and I don't expect that to change.",
    "Some friendships feel like an accident that turned out to be the best thing that happened to you. This is one of those.",
    "You make the group chat, the plans, and the bad days all a little more bearable.",
    "If today is only about one thing, let it be this: you are so deeply appreciated."
  ],

  giftMessage: "You still want a gift? Come on, I'm already in your life, girly.",
  
  // GALLERY — this is the ONLY place you need to edit to change photos.
  // For each photo, just set "image" to your file's name (put the image
  // file in the same folder as index.html) and write a "caption".
  // Leave "image" empty ("") to keep the placeholder gradient + emoji.
  gallery: [
    { image: "1.jpeg", emoji: "🥰", caption: "I really like this one", gradient: "linear-gradient(135deg,#f6a8c6,#dcc9f5)" },
    { image: "2.jpeg", emoji: "🌅", caption: "Fall for this one", gradient: "linear-gradient(135deg,#dcc9f5,#c3a4e8)" },
    { image: "3.jpeg", emoji: "🎂", caption: "Baddie?", gradient: "linear-gradient(135deg,#e8b8a4,#f6a8c6)" },
    { image: "4.jpeg", emoji: "🍜", caption: "Slayyed", gradient: "linear-gradient(135deg,#ffc4dc,#e8b8a4)" },
    { image: "9.jpeg", emoji: "📸", caption: "cutie", gradient: "linear-gradient(135deg,#c3a4e8,#9b6fd1)" },
    { image: "6.jpeg", emoji: "🚗", caption: "animal", gradient: "linear-gradient(135deg,#f6a8c6,#e8b8a4)" }
    // add more objects here for more photos — the grid handles any number
  ]
};

/* =========================================================================
   2. INIT / DOM CACHE
   ========================================================================= */
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => Array.from(document.querySelectorAll(sel));

document.addEventListener("DOMContentLoaded", () => {
  applyConfigText();
  initStars();
  initFloatingHearts();
  initCursorGlow();
  initGate();
  initTyping();
  initMusic();
  initScrollReveal();
  initEnvelope();
  initGallery();
  initTimeline();
  initGift();
  initQuotes();
  initFinalQuestion();
  initFxCanvas();
  initCakeCandle();
});

function applyConfigText(){
  $$("[data-name]").forEach(el => el.textContent = CONFIG.herName);
  $$("[data-your-name]").forEach(el => el.textContent = CONFIG.yourName);
}

/* =========================================================================
   3. AMBIENT BACKGROUND
   ========================================================================= */

// --- tiny twinkling stars on a lightweight canvas ---
function initStars(){
  const canvas = $("#stars-canvas");
  const ctx = canvas.getContext("2d");
  let stars = [];

  function resize(){
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const count = Math.floor((canvas.width * canvas.height) / 14000);
    stars = Array.from({ length: count }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.4 + 0.3,
      phase: Math.random() * Math.PI * 2,
      speed: Math.random() * 0.02 + 0.008
    }));
  }

  function draw(t){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    stars.forEach(s => {
      const twinkle = (Math.sin(t * s.speed + s.phase) + 1) / 2;
      ctx.globalAlpha = 0.25 + twinkle * 0.55;
      ctx.fillStyle = "#fff6fb";
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fill();
    });
    requestAnimationFrame(draw);
  }

  window.addEventListener("resize", resize);
  resize();
  requestAnimationFrame(draw);
}

// --- floating hearts drifting up from the bottom of the screen ---
function initFloatingHearts(){
  const field = $("#hearts-field");
  const glyphs = ["❤️", "💕", "💗", "💖"];

  function spawnHeart(){
    const heart = document.createElement("span");
    heart.className = "floating-heart";
    heart.textContent = glyphs[Math.floor(Math.random() * glyphs.length)];
    const size = Math.random() * 16 + 12;
    const left = Math.random() * 100;
    const duration = Math.random() * 10 + 10;
    const drift = (Math.random() - 0.5) * 120;

    heart.style.left = `${left}vw`;
    heart.style.fontSize = `${size}px`;
    heart.style.setProperty("--drift", `${drift}px`);
    heart.style.animationDuration = `${duration}s`;

    field.appendChild(heart);
    setTimeout(() => heart.remove(), duration * 1000 + 500);
  }

  for (let i = 0; i < 6; i++) setTimeout(spawnHeart, i * 800);
  setInterval(spawnHeart, 1800);
}

// --- soft glow that follows the cursor / finger ---
function initCursorGlow(){
  const glow = $("#cursorGlow");
  let x = window.innerWidth / 2, y = window.innerHeight / 2;
  let curX = x, curY = y;

  window.addEventListener("pointermove", (e) => { x = e.clientX; y = e.clientY; });

  function loop(){
    curX += (x - curX) * 0.12;
    curY += (y - curY) * 0.12;
    glow.style.transform = `translate(${curX}px, ${curY}px) translate(-50%, -50%)`;
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);
}

/* =========================================================================
   4. PASSCODE LOCK SCREEN (iPhone-style)
   ========================================================================= */
function initGate(){
  const dotsWrap = $("#passcodeDots");
  const lockMid = $("#lockMid");
  const error = $("#lockError");
  const lockIcon = $("#lockIcon");
  const deleteKey = $("#keyDelete");
  const keys = $$(".key[data-key]");
  const passcode = String(CONFIG.passcode);

  let entered = "";
  let locked = false; // true while an error animation / unlock transition is playing

  // build the passcode dots to match the configured passcode length
  dotsWrap.innerHTML = passcode.split("").map(() => '<span class="dot"></span>').join("");
  const dots = $$("#passcodeDots .dot");

  function updateDots(){
    dots.forEach((dot, i) => dot.classList.toggle("filled", i < entered.length));
  }

  function pressFeedback(keyEl){
    if (!keyEl) return;
    keyEl.classList.add("pressed");
    setTimeout(() => keyEl.classList.remove("pressed"), 140);
  }

  function showError(){
    locked = true;
    lockMid.classList.remove("shake");
    void lockMid.offsetWidth; // restart animation
    lockMid.classList.add("shake", "error-glow");
    error.classList.add("show");
    setTimeout(() => {
      lockMid.classList.remove("shake", "error-glow");
      entered = "";
      updateDots();
      locked = false;
    }, 550);
  }

  function tryUnlock(){
    if (entered === passcode) {
      locked = true;
      lockIcon.classList.add("unlocked");
      error.classList.remove("show");
      setTimeout(unlockSite, 350);
    } else {
      showError();
    }
  }

  function addDigit(digit){
    if (locked || entered.length >= passcode.length) return;
    entered += digit;
    error.classList.remove("show");
    updateDots();
    if (entered.length === passcode.length) {
      setTimeout(tryUnlock, 150);
    }
  }

  function removeDigit(){
    if (locked || entered.length === 0) return;
    entered = entered.slice(0, -1);
    updateDots();
  }

  keys.forEach((keyEl) => {
    keyEl.addEventListener("click", () => {
      pressFeedback(keyEl);
      addDigit(keyEl.dataset.key);
    });
  });

  deleteKey.addEventListener("click", () => {
    pressFeedback(deleteKey);
    removeDigit();
  });

  // also accept a physical keyboard, so it's easy to test on desktop
  document.addEventListener("keydown", (e) => {
    if ($("#gate").classList.contains("hidden")) return;
    if (e.key >= "0" && e.key <= "9") {
      addDigit(e.key);
    } else if (e.key === "Backspace") {
      removeDigit();
    }
  });
}

function unlockSite(){
  const gate = $("#gate");
  gate.classList.add("fade-out");
  setTimeout(() => {
    gate.classList.add("hidden");
    startCountdown();
  }, 700);
}

/* =========================================================================
   5. COUNTDOWN
   ========================================================================= */
function startCountdown(){
  const screen = $("#countdown");
  const number = $("#countdownNumber");
  const caption = $("#countdownCaption");
  screen.classList.remove("hidden");

  const steps = ["3", "2", "1", "❤️"];
  let i = 0;

  function tick(){
    number.textContent = steps[i];
    number.style.animation = "none";
    void number.offsetWidth;
    number.style.animation = "countPop 0.9s cubic-bezier(.16,1,.3,1)";
    caption.textContent = i < 3 ? "get ready..." : "Surprise!";
    i++;
    if (i < steps.length) {
      setTimeout(tick, 900);
    } else {
      setTimeout(() => {
        screen.classList.add("fade-out");
        setTimeout(() => {
          screen.classList.add("hidden");
          revealSite();
        }, 700);
      }, 900);
    }
  }
  tick();
}

function revealSite(){
  const site = $("#site");
  site.classList.remove("hidden");
  document.documentElement.style.overflow = "auto";
  document.body.style.overflow = "auto";
  // give the browser a frame before checking reveal-on-scroll elements
  requestAnimationFrame(() => window.dispatchEvent(new Event("scroll")));
}

/* lock scrolling until the site is revealed (both <html> and <body> —
   locking only one still leaves the page scrollable on some browsers) */
document.documentElement.style.overflow = "hidden";
window.addEventListener("DOMContentLoaded", () => { document.body.style.overflow = "hidden"; });

/* =========================================================================
   6. HERO TYPING EFFECT
   ========================================================================= */
function initTyping(){
  const el = $("#typingText");
  if (!el) return;
  const lines = CONFIG.heroTypingLines;
  let lineIndex = 0, charIndex = 0, deleting = false;

  function tick(){
    const current = lines[lineIndex];
    if (!deleting) {
      charIndex++;
      el.textContent = current.slice(0, charIndex);
      if (charIndex === current.length) {
        deleting = false;
        setTimeout(() => { deleting = true; tick(); }, 1800);
        return;
      }
    } else {
      charIndex--;
      el.textContent = current.slice(0, charIndex);
      if (charIndex === 0) {
        deleting = false;
        lineIndex = (lineIndex + 1) % lines.length;
      }
    }
    setTimeout(tick, deleting ? 28 : 45);
  }
  tick();
}

/* scroll-down button in the hero */
$("#scrollDownBtn")?.addEventListener("click", () => {
  $("#envelopeSection")?.scrollIntoView({ behavior: "smooth", block: "start" });
});

/* =========================================================================
   7. MUSIC TOGGLE
   ========================================================================= */
function initMusic(){
  const btn = $("#musicToggle");
  const audio = $("#bgMusic");
  const playIcon = $("#musicIconPlay");
  const pauseIcon = $("#musicIconPause");
  let playing = false;

  btn.addEventListener("click", () => {
    if (!playing) {
      audio.play().catch(() => { /* file not provided — fails silently */ });
      playIcon.classList.add("hidden");
      pauseIcon.classList.remove("hidden");
      btn.setAttribute("aria-label", "Pause music");
    } else {
      audio.pause();
      playIcon.classList.remove("hidden");
      pauseIcon.classList.add("hidden");
      btn.setAttribute("aria-label", "Play music");
    }
    playing = !playing;
  });
}

/* =========================================================================
   8. SCROLL REVEAL
   ========================================================================= */
function initScrollReveal(){
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add("in-view");
    });
  }, { threshold: 0.18 });

  // observe elements already in the DOM, plus a MutationObserver catches
  // anything injected later by the data-driven builders below
  function observeAll(){
    $$(".reveal, .photo-card, .timeline-item, .quote-card").forEach(el => observer.observe(el));
  }
  observeAll();

  const mo = new MutationObserver(() => observeAll());
  mo.observe($("#site"), { childList: true, subtree: true });
}

/* =========================================================================
   9. ENVELOPE + LETTER
   ========================================================================= */
function initEnvelope(){
  const envelope = $("#envelope");
  const hint = $("#envelopeHint");
  let opened = false;

  envelope.addEventListener("click", () => {
    if (opened) return;
    opened = true;
    envelope.classList.add("opened");
    hint.classList.add("hidden");

    burstHearts(envelope);
    fireConfetti();

    setTimeout(() => {
      $("#letterSection").classList.remove("hidden");
      $("#letterSection").scrollIntoView({ behavior: "smooth", block: "start" });
      buildLetter();
    }, 850);
  });
}

function buildLetter(){
  const container = $("#letterBody");
  container.innerHTML = "";
  CONFIG.letter.forEach((text, i) => {
    const p = document.createElement("p");
    p.textContent = text;
    container.appendChild(p);
    setTimeout(() => p.classList.add("shown"), 220 * i);
  });
}

/* small heart-burst used when the envelope opens */
function burstHearts(originEl){
  const rect = originEl.getBoundingClientRect();
  const originX = rect.left + rect.width / 2;
  const originY = rect.top + rect.height / 2;
  const field = $("#hearts-field");

  for (let i = 0; i < 18; i++) {
    const heart = document.createElement("span");
    heart.textContent = "❤️";
    heart.style.position = "fixed";
    heart.style.left = `${originX}px`;
    heart.style.top = `${originY}px`;
    heart.style.fontSize = `${Math.random() * 14 + 14}px`;
    heart.style.zIndex = 46;
    heart.style.pointerEvents = "none";
    heart.style.transition = "transform 1s cubic-bezier(.16,1,.3,1), opacity 1s";
    document.body.appendChild(heart);

    const angle = Math.random() * Math.PI * 2;
    const dist = Math.random() * 160 + 80;
    requestAnimationFrame(() => {
      heart.style.transform = `translate(${Math.cos(angle) * dist}px, ${Math.sin(angle) * dist - 60}px) rotate(${(Math.random() - 0.5) * 180}deg)`;
      heart.style.opacity = "0";
    });
    setTimeout(() => heart.remove(), 1100);
  }
}

/* =========================================================================
   10. GALLERY + LIGHTBOX
   ========================================================================= */
function initGallery(){
  const grid = $("#galleryGrid");
  grid.innerHTML = "";

  CONFIG.gallery.forEach((photo) => {
    const card = document.createElement("div");
    card.className = "photo-card";
    const fill = photo.image
      ? `<img src="${photo.image}" alt="${photo.caption}" class="photo-img">`
      : `<div class="photo-fill">${photo.emoji}</div>`;
    if (!photo.image) card.style.background = photo.gradient;
    card.innerHTML = `
      ${fill}
      <div class="photo-glow"></div>
      <div class="photo-caption">${photo.caption}</div>
    `;
    card.addEventListener("click", () => openLightbox(photo));
    grid.appendChild(card);
  });
}

function openLightbox(photo){
  const lightbox = $("#lightbox");
  const media = $("#lightboxMedia");
  const caption = $("#lightboxCaption");

  if (photo.image) {
    media.style.background = `url('${photo.image}') center/cover no-repeat`;
    media.textContent = "";
  } else {
    media.style.background = photo.gradient;
    media.textContent = photo.emoji;
  }
  caption.textContent = photo.caption;
  lightbox.classList.add("open");
}

$("#lightboxClose")?.addEventListener("click", () => $("#lightbox").classList.remove("open"));
$("#lightbox")?.addEventListener("click", (e) => {
  if (e.target.id === "lightbox") $("#lightbox").classList.remove("open");
});

/* =========================================================================
   11. TIMELINE
   ========================================================================= */
function initTimeline(){
  const container = $("#timeline");
  container.innerHTML = "";
  CONFIG.timeline.forEach(item => {
    const el = document.createElement("div");
    el.className = "timeline-item";
    el.setAttribute("data-emoji", item.emoji);
    el.innerHTML = `<h3>${item.title}</h3><p>${item.text}</p>`;
    container.appendChild(el);
  });
}

/* =========================================================================
   12. GIFT BOX
   ========================================================================= */
function initGift(){
  const box = $("#giftBox");
  const message = $("#giftMessage");
  const text = $("#giftMessageText");
  text.textContent = CONFIG.giftMessage;
  let opened = false;

  box.addEventListener("click", () => {
    if (opened) return;
    opened = true;
    box.classList.add("opened");
    fireConfetti();
    message.classList.remove("hidden");
    setTimeout(() => message.classList.add("show"), 50);
  });
}

/* =========================================================================
   13. QUOTES
   ========================================================================= */
function initQuotes(){
  const grid = $("#quotesGrid");
  grid.innerHTML = "";
  CONFIG.quotes.forEach(q => {
    const card = document.createElement("div");
    card.className = "quote-card glass-card";
    card.innerHTML = `<span class="quote-mark">&ldquo;</span><p>${q}</p>`;
    grid.appendChild(card);
  });
}

/* =========================================================================
   14 + 15. CONFETTI & FIREWORKS — share one canvas + animation loop
   ========================================================================= */
let fxCtx, fxCanvas, particles = [];

function initFxCanvas(){
  fxCanvas = $("#fx-canvas");
  fxCtx = fxCanvas.getContext("2d");

  function resize(){
    fxCanvas.width = window.innerWidth;
    fxCanvas.height = window.innerHeight;
  }
  window.addEventListener("resize", resize);
  resize();
  requestAnimationFrame(fxLoop);
}

function fxLoop(){
  fxCtx.clearRect(0, 0, fxCanvas.width, fxCanvas.height);
  particles.forEach(p => {
    p.vy += p.gravity ?? 0.05;
    p.x += p.vx;
    p.y += p.vy;
    p.life -= 1;
    p.alpha = Math.max(p.life / p.maxLife, 0);

    fxCtx.globalAlpha = p.alpha;
    fxCtx.fillStyle = p.color;

    if (p.shape === "circle") {
      fxCtx.beginPath();
      fxCtx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      fxCtx.fill();
    } else {
      fxCtx.save();
      fxCtx.translate(p.x, p.y);
      fxCtx.rotate((p.rotation += p.spin));
      fxCtx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.5);
      fxCtx.restore();
    }
  });
  particles = particles.filter(p => p.life > 0 && p.y < fxCanvas.height + 40);
  fxCtx.globalAlpha = 1;
  requestAnimationFrame(fxLoop);
}

/* --- confetti: rains rectangles from the top --- */
function fireConfetti(count = 90){
  const colors = ["#f6a8c6", "#dcc9f5", "#e8b8a4", "#9b6fd1", "#fff5f8"];
  for (let i = 0; i < count; i++) {
    particles.push({
      x: Math.random() * fxCanvas.width,
      y: -20 - Math.random() * 200,
      vx: (Math.random() - 0.5) * 3,
      vy: Math.random() * 2 + 2,
      gravity: 0.04,
      size: Math.random() * 8 + 5,
      color: colors[Math.floor(Math.random() * colors.length)],
      shape: "rect",
      rotation: Math.random() * Math.PI,
      spin: (Math.random() - 0.5) * 0.3,
      life: 220,
      maxLife: 220
    });
  }
}

/* --- fireworks: bursts of circular particles from a point --- */
function fireFirework(x, y){
  const colors = ["#f6a8c6", "#dcc9f5", "#e8b8a4", "#9b6fd1", "#d1477a", "#fff5f8"];
  const color = colors[Math.floor(Math.random() * colors.length)];
  const count = 46;
  for (let i = 0; i < count; i++) {
    const angle = (Math.PI * 2 * i) / count;
    const speed = Math.random() * 4 + 2;
    particles.push({
      x, y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      gravity: 0.03,
      size: Math.random() * 2.5 + 1.5,
      color,
      shape: "circle",
      life: 70,
      maxLife: 70
    });
  }
}

function fireworksShow(bursts = 6){
  for (let i = 0; i < bursts; i++) {
    setTimeout(() => {
      const x = Math.random() * fxCanvas.width * 0.7 + fxCanvas.width * 0.15;
      const y = Math.random() * fxCanvas.height * 0.4 + fxCanvas.height * 0.12;
      fireFirework(x, y);
    }, i * 380);
  }
}

/* =========================================================================
   16. FINAL QUESTION + CELEBRATION
   ========================================================================= */
function initFinalQuestion(){
  const yesBtn = $("#yesBtn");
  const noBtn = $("#noBtn");
  const container = $(".final-buttons");
  const hint = $("#finalHint");
  const nudges = [
    "it's okay, take your time...",
    "the NO button seems a little shy...",
    "come on, you know the answer 👀",
    "it's just going to keep running..."
  ];
  let nudgeIndex = 0;

  let evading = false;      // cooldown so rapid mouse movement can't spam-retrigger
  let anchorX = null, anchorY = null; // center of the invisible arena — set once, from the button's original spot

  function evadeNo(){
    if (evading) return;
    evading = true;

    const btnRect = noBtn.getBoundingClientRect();

    if (anchorX === null) {
      anchorX = btnRect.left + btnRect.width / 2;
      anchorY = btnRect.top + btnRect.height / 2;
    }

    // if this is the first move, switch from static layout to fixed
    // positioning anchored at its current on-screen spot
    if (!noBtn.classList.contains("evading")) {
      noBtn.style.left = `${btnRect.left}px`;
      noBtn.style.top = `${btnRect.top}px`;
      noBtn.classList.add("evading");
      void noBtn.offsetWidth;
    }

    // bounds are recalculated from LIVE window size every time — never
    // trusts a stale cached value, so it can't drift outside the viewport
    const halfW = Math.min(160, window.innerWidth / 2 - 20);
    const halfH = Math.min(100, window.innerHeight / 2 - 20);
    const margin = 10;

    let minX = Math.max(anchorX - halfW, margin);
    let maxX = Math.min(anchorX + halfW - btnRect.width, window.innerWidth - btnRect.width - margin);
    let minY = Math.max(anchorY - halfH, margin);
    let maxY = Math.min(anchorY + halfH - btnRect.height, window.innerHeight - btnRect.height - margin);

    // safety net: if the arena math ever inverts (tiny screens, edge cases),
    // collapse to a single valid clamped point instead of producing garbage
    if (minX > maxX) minX = maxX = Math.min(Math.max(anchorX - btnRect.width / 2, margin), window.innerWidth - btnRect.width - margin);
    if (minY > maxY) minY = maxY = Math.min(Math.max(anchorY - btnRect.height / 2, margin), window.innerHeight - btnRect.height - margin);

    const newX = minX + Math.random() * (maxX - minX);
    const newY = minY + Math.random() * (maxY - minY);

    requestAnimationFrame(() => {
      noBtn.style.left = `${newX}px`;
      noBtn.style.top = `${newY}px`;
    });

    // red alert — flashes the whole screen, plus a ring around the button
    noBtn.classList.remove("danger");
    void noBtn.offsetWidth;
    noBtn.classList.add("danger");

    const overlay = $("#dangerOverlay");
    if (overlay) {
      overlay.classList.remove("flash");
      void overlay.offsetWidth;
      overlay.classList.add("flash");
    }

    nudgeIndex = (nudgeIndex + 1) % nudges.length;
    hint.textContent = nudges[nudgeIndex];

    setTimeout(() => { evading = false; }, 350);
  }

  // desktop: move away as the cursor gets close — mouseenter only, so the
  // transition actually has time to play instead of teleporting every frame
  noBtn.addEventListener("mouseenter", () => evadeNo());
  // mobile: move away right before a tap can land
  noBtn.addEventListener("touchstart", (e) => { e.preventDefault(); evadeNo(); }, { passive: false });
  noBtn.addEventListener("click", (e) => { e.preventDefault(); evadeNo(); });

  yesBtn.addEventListener("click", () => {
    celebrate();
  });
}

function celebrate(){
  const finalSection = $("#finalSection");
  const celebration = $("#celebrationSection");

  fireConfetti(160);
  fireworksShow(8);
  burstHearts(document.getElementById("yesBtn"));

  setTimeout(() => {
    celebration.classList.remove("hidden");
    celebration.scrollIntoView({ behavior: "smooth", block: "start" });
    $("#cakeSection")?.classList.remove("hidden");
  }, 500);

  // keep celebrating gently for a few seconds
  let waves = 0;
  const interval = setInterval(() => {
    fireConfetti(40);
    fireFirework(Math.random() * window.innerWidth, Math.random() * window.innerHeight * 0.5 + 60);
    waves++;
    if (waves > 4) clearInterval(interval);
  }, 900);
}
/* =========================================================================
   17. CAKE + CANDLE — click/tap the flame to blow it out fast
   ========================================================================= */
function initCakeCandle(){
  const cake = $("#cakeCandle");
  const flame = $("#flame");
  const hint = $("#cakeHint");
  if (!cake || !flame) return;
  let blown = false;

  function blowOut(){
    if (blown) return;
    blown = true;
    cake.classList.add("blown");
    spawnSmoke();
    if (hint) hint.textContent = "Happy Birthday 🎉 — wish made.";
    fireConfetti(60);
    setTimeout(presentBite, 1000); // let the bitePop animation finish first
  }

  function spawnSmoke(){
    for (let i = 0; i < 5; i++) {
      const puff = document.createElement("div");
      puff.className = "smoke";
      puff.style.setProperty("--smoke-x", `${(Math.random() - 0.5) * 40}px`);
      puff.style.animationDelay = `${i * 60}ms`;
      cake.querySelector(".candle").appendChild(puff);
      setTimeout(() => puff.remove(), 1200 + i * 60);
    }
  }

  const candle = cake.querySelector(".candle");
  flame.addEventListener("click", blowOut);
  flame.addEventListener("touchstart", (e) => { e.preventDefault(); blowOut(); }, { passive: false });
  candle?.addEventListener("click", blowOut);
  candle?.addEventListener("touchstart", (e) => { e.preventDefault(); blowOut(); }, { passive: false });

  /* --- bite: tap the cake itself — each tap eats one real bite out of it,
     by growing a black circle (#biteHole) inside the SVG <mask> --- */
  const biteHole = cake.querySelector("#biteHole");
  const cakeSvg = cake.querySelector(".cake-svg");
  let eatenStage = 0;
  // radius of the bite circle after each tap — grows until it swallows the whole cake
  const stageRadii = [35, 62, 95, 135, 190];
  const maxStage = stageRadii.length;
  const yumWords = ["Yum! 😋", "Mmm! 😍", "So good! 🤤", "Tasty! 😋", "Yummy! 😍"];

  function enableEating(){
    cake.classList.add("eatable");
    if (hint) hint.textContent = "Tap the cake to take a bite 🍰";
    cakeSvg.addEventListener("click", eatBite);
    cakeSvg.addEventListener("touchstart", (e) => { e.preventDefault(); eatBite(e); }, { passive: false });
  }

  function eatBite(e){
    if (!biteHole || eatenStage >= maxStage) return;
    eatenStage++;
    biteHole.setAttribute("r", String(stageRadii[eatenStage - 1]));

    const point = (e && e.touches && e.touches[0]) ? e.touches[0] : e;
    const rect = cakeSvg.getBoundingClientRect();
    const cx = point && point.clientX ? point.clientX : rect.left + rect.width * 0.7;
    const cy = point && point.clientY ? point.clientY : rect.top + rect.height * 0.4;
    spawnCrumbs(cx, cy);
    spawnYum(cx, cy);

    if (eatenStage < maxStage) {
      const left = maxStage - eatenStage;
      if (hint) hint.textContent = `${left} bite${left > 1 ? "s" : ""} left — keep going 😋`;
    } else {
      if (hint) hint.textContent = "All gone — yum! 😋";
      cake.classList.remove("eatable");
      cake.classList.add("finished");
      fireConfetti(24);
    }
  }

  function spawnYum(cx, cy){
    const yum = document.createElement("div");
    yum.className = "yum-text";
    yum.textContent = yumWords[Math.floor(Math.random() * yumWords.length)];
    yum.style.left = `${cx + (Math.random() - 0.5) * 30}px`;
    yum.style.top = `${cy}px`;
    document.body.appendChild(yum);
    setTimeout(() => yum.remove(), 1000);
  }

  function spawnCrumbs(cx, cy){
    for (let i = 0; i < 6; i++) {
      const crumb = document.createElement("div");
      crumb.className = "crumb";
      crumb.style.left = `${cx}px`;
      crumb.style.top = `${cy}px`;
      crumb.style.setProperty("--crumb-x", `${(Math.random() - 0.5) * 60}px`);
      crumb.style.animationDelay = `${i * 40}ms`;
      document.body.appendChild(crumb);
      setTimeout(() => crumb.remove(), 900 + i * 40);
    }
  }

  // presentBite() is called after the candle is blown out (see blowOut() above)
  function presentBite(){ enableEating(); }
}