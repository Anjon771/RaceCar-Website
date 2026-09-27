/*==================== VEHICLE DATABASE & TELEMETRY ====================*/
const CAR_DATABASE = {
  apex: {
    name: "Apex GT-V",
    class: "Formula E-Hypercar Division",
    edition: "Solid-State Quad-Motor Hypercar",
    colorName: "Solar Amber",
    color: "hsl(38, 98%, 52%)",
    colorGlow: "rgba(250, 150, 20, 0.4)",
    img: "assets/img/car-1.png",
    speed: "302 MPH",
    accel: "1.89 SEC",
    power: "1,470 HP",
    torque: "1,680 NM",
    weight: "1,380 KG",
    brakes: "420mm Carbon Ceramic",
    downforce: "1,240 KG",
    dragCd: "0.24 Cd",
    price: "$2,850,000",
    soundType: "hyper",
    silhouetteType: "longtail"
  },
  verdant: {
    name: "Verdant RS",
    class: "Le Mans Hybrid Cup Spec",
    edition: "Twin-Turbo Flat-Plane V8 Hybrid",
    colorName: "Emerald Racing",
    color: "hsl(156, 95%, 42%)",
    colorGlow: "rgba(12, 210, 130, 0.4)",
    img: "assets/img/car-2.png",
    speed: "224 MPH",
    accel: "2.38 SEC",
    power: "890 HP",
    torque: "980 NM",
    weight: "1,290 KG",
    brakes: "390mm Brembo Carbon",
    downforce: "1,420 KG",
    dragCd: "0.29 Cd",
    price: "$2,400,000",
    soundType: "v8",
    silhouetteType: "track"
  },
  phantom: {
    name: "Phantom GT",
    class: "Grand Touring Aero Edition",
    edition: "Active Venturi Long-Tail Gran Turismo",
    colorName: "Cobalt Sapphire",
    color: "hsl(212, 100%, 54%)",
    colorGlow: "rgba(30, 140, 255, 0.4)",
    img: "assets/img/car-3.png",
    speed: "245 MPH",
    accel: "2.08 SEC",
    power: "1,150 HP",
    torque: "1,340 NM",
    weight: "1,440 KG",
    brakes: "410mm Silicon-Carbide",
    downforce: "1,180 KG",
    dragCd: "0.26 Cd",
    price: "$2,650,000",
    soundType: "turbine",
    silhouetteType: "aero"
  }
};

/*==================== WEB AUDIO API REAL-TIME ENGINE SYNTHESIZER ====================*/
let audioCtx = null;
let soundEnabled = true;
let activeHoldEngine = null;

function getAudioContext() {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

function playEngineRev(soundType = 'hyper', duration = 1.35) {
  if (!soundEnabled) {
    showToast("Audio FX muted. Click 'FX: MUTED' in header to unmute.");
    return;
  }

  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const masterGain = ctx.createGain();
  masterGain.gain.setValueAtTime(0.001, now);
  masterGain.connect(ctx.destination);

  if (soundType === 'v8') {
    // Twin-Turbo Flat-Plane V8 Engine roar
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const sub = ctx.createOscillator();

    osc1.type = 'sawtooth';
    osc2.type = 'sawtooth';
    sub.type = 'triangle';

    osc1.frequency.setValueAtTime(65, now);
    osc2.frequency.setValueAtTime(68, now);
    sub.frequency.setValueAtTime(32, now);

    // Throttle rev ramp
    osc1.frequency.exponentialRampToValueAtTime(380, now + 0.38);
    osc2.frequency.exponentialRampToValueAtTime(388, now + 0.38);
    sub.frequency.exponentialRampToValueAtTime(190, now + 0.38);

    // Overrun burble & decel
    osc1.frequency.exponentialRampToValueAtTime(75, now + duration);
    osc2.frequency.exponentialRampToValueAtTime(78, now + duration);
    sub.frequency.exponentialRampToValueAtTime(38, now + duration);

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(300, now);
    filter.frequency.exponentialRampToValueAtTime(2800, now + 0.38);
    filter.frequency.exponentialRampToValueAtTime(450, now + duration);

    masterGain.gain.linearRampToValueAtTime(0.24, now + 0.08);
    masterGain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    osc1.connect(filter);
    osc2.connect(filter);
    sub.connect(filter);
    filter.connect(masterGain);

    osc1.start(now);
    osc2.start(now);
    sub.start(now);
    osc1.stop(now + duration);
    osc2.stop(now + duration);
    sub.stop(now + duration);

  } else if (soundType === 'turbine') {
    // High-pitched Tri-motor Jet Turbine scream
    const osc = ctx.createOscillator();
    const noise = ctx.createOscillator();
    osc.type = 'sine';
    noise.type = 'sawtooth';

    osc.frequency.setValueAtTime(240, now);
    osc.frequency.exponentialRampToValueAtTime(1100, now + 0.45);
    osc.frequency.exponentialRampToValueAtTime(360, now + duration);

    noise.frequency.setValueAtTime(120, now);
    noise.frequency.exponentialRampToValueAtTime(550, now + 0.45);
    noise.frequency.exponentialRampToValueAtTime(180, now + duration);

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.Q.value = 5;
    filter.frequency.setValueAtTime(450, now);
    filter.frequency.exponentialRampToValueAtTime(2100, now + 0.45);
    filter.frequency.exponentialRampToValueAtTime(600, now + duration);

    masterGain.gain.linearRampToValueAtTime(0.18, now + 0.08);
    masterGain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    osc.connect(filter);
    noise.connect(filter);
    filter.connect(masterGain);

    osc.start(now);
    noise.start(now);
    osc.stop(now + duration);
    noise.stop(now + duration);

  } else {
    // Apex GT-V: Instant-Torque Electric Inverter Screamer + FM synthesis
    const osc = ctx.createOscillator();
    const fm = ctx.createOscillator();
    const fmGain = ctx.createGain();

    osc.type = 'sawtooth';
    fm.type = 'sine';

    fm.frequency.setValueAtTime(140, now);
    fm.frequency.exponentialRampToValueAtTime(780, now + 0.42);
    fmGain.gain.setValueAtTime(90, now);
    fmGain.gain.exponentialRampToValueAtTime(360, now + 0.42);

    osc.frequency.setValueAtTime(160, now);
    osc.frequency.exponentialRampToValueAtTime(960, now + 0.42);
    osc.frequency.exponentialRampToValueAtTime(220, now + duration);

    fm.connect(fmGain);
    fmGain.connect(osc.frequency);

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(700, now);
    filter.frequency.exponentialRampToValueAtTime(4200, now + 0.42);
    filter.frequency.exponentialRampToValueAtTime(800, now + duration);

    masterGain.gain.linearRampToValueAtTime(0.22, now + 0.08);
    masterGain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    osc.connect(filter);
    filter.connect(masterGain);

    fm.start(now);
    osc.start(now);
    fm.stop(now + duration);
    osc.stop(now + duration);
  }

  showToast(`Engine Roar: ${soundType.toUpperCase()} Model Revved`);
}

// Continuous Throttle Hold Simulator
function startContinuousThrottle(soundType = 'hyper') {
  if (!soundEnabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  stopContinuousThrottle();

  const now = ctx.currentTime;
  const osc1 = ctx.createOscillator();
  const osc2 = ctx.createOscillator();
  const filter = ctx.createBiquadFilter();
  const gain = ctx.createGain();

  osc1.type = soundType === 'v8' ? 'sawtooth' : 'triangle';
  osc2.type = 'sawtooth';

  osc1.frequency.setValueAtTime(90, now);
  osc2.frequency.setValueAtTime(95, now);

  // Ramp to 9,500 RPM screaming pitch
  osc1.frequency.exponentialRampToValueAtTime(soundType === 'hyper' ? 1200 : 750, now + 1.2);
  osc2.frequency.exponentialRampToValueAtTime(soundType === 'hyper' ? 1240 : 770, now + 1.2);

  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(400, now);
  filter.frequency.exponentialRampToValueAtTime(3800, now + 1.2);

  gain.gain.setValueAtTime(0.01, now);
  gain.gain.linearRampToValueAtTime(0.2, now + 0.1);

  osc1.connect(filter);
  osc2.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);

  osc1.start(now);
  osc2.start(now);

  activeHoldEngine = { osc1, osc2, gain, filter };
}

function stopContinuousThrottle() {
  if (activeHoldEngine && audioCtx) {
    const now = audioCtx.currentTime;
    try {
      activeHoldEngine.gain.linearRampToValueAtTime(0.001, now + 0.35);
      activeHoldEngine.osc1.stop(now + 0.4);
      activeHoldEngine.osc2.stop(now + 0.4);
    } catch (e) {
      // Ignored if already stopped
    }
    activeHoldEngine = null;
  }
}

/*==================== NOTIFICATION TOAST ====================*/
let toastTimer = null;
function showToast(msg) {
  const toast = document.getElementById('sound-toast');
  const toastText = document.getElementById('sound-toast-text');
  if (!toast || !toastText) return;

  toastText.textContent = msg;
  toast.classList.add('show');

  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.classList.remove('show');
  }, 2500);
}

/*==================== HEADER NAVIGATION & SOUND TOGGLE ====================*/
const header = document.getElementById('header');
const navToggle = document.getElementById('nav-toggle');
const navClose = document.getElementById('nav-close');
const navMenu = document.getElementById('nav-menu');
const navLinks = document.querySelectorAll('.nav__link');
const soundToggleBtn = document.getElementById('sound-toggle-btn');
const soundStatusLabel = document.getElementById('sound-status-label');

if (navToggle && navMenu) {
  navToggle.addEventListener('click', () => navMenu.classList.add('show-menu'));
}
if (navClose && navMenu) {
  navClose.addEventListener('click', () => navMenu.classList.remove('show-menu'));
}
navLinks.forEach((link) => {
  link.addEventListener('click', () => {
    if (navMenu) navMenu.classList.remove('show-menu');
  });
});

window.addEventListener('scroll', () => {
  if (header) {
    if (window.scrollY >= 40) {
      header.classList.add('blur-header');
    } else {
      header.classList.remove('blur-header');
    }
  }

  // Scroll active section highlighter
  const sections = document.querySelectorAll('section[id]');
  const scrollY = window.pageYOffset;

  sections.forEach((current) => {
    const sectionHeight = current.offsetHeight;
    const sectionTop = current.offsetTop - 120;
    const sectionId = current.getAttribute('id');
    const linkEl = document.querySelector(`.nav__menu a[href*='${sectionId}']`);

    if (linkEl) {
      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        linkEl.classList.add('active');
      } else {
        linkEl.classList.remove('active');
      }
    }
  });
});

if (soundToggleBtn) {
  soundToggleBtn.addEventListener('click', () => {
    getAudioContext();
    soundEnabled = !soundEnabled;
    soundToggleBtn.classList.toggle('active', soundEnabled);
    if (soundStatusLabel) {
      soundStatusLabel.textContent = soundEnabled ? 'FX: ON' : 'FX: MUTED';
    }
    if (soundEnabled) {
      playEngineRev('hyper');
    } else {
      stopContinuousThrottle();
      showToast("Audio FX Muted");
    }
  });
}

/*==================== SWIPER SHOWROOM SLIDER ====================*/
let swiperHome = null;
if (typeof Swiper !== 'undefined') {
  swiperHome = new Swiper('.home__swiper', {
    speed: 1100,
    effect: 'fade',
    fadeEffect: { crossFade: true },
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
      renderBullet: (idx, cls) => `<button class="${cls}" aria-label="Slide ${idx + 1}">${String(idx + 1).padStart(2, '0')}</button>`
    },
    on: {
      slideChange: function () {
        const slide = this.slides[this.activeIndex];
        const carKey = slide ? slide.getAttribute('data-car') : null;
        if (carKey && CAR_DATABASE[carKey]) {
          if (soundEnabled && audioCtx) {
            playEngineRev(CAR_DATABASE[carKey].soundType, 0.9);
          }
        }
      }
    }
  });
}

/* GSAP Hero Entrance */
if (typeof gsap !== 'undefined') {
  gsap.from('.home__panel-1', { y: -800, duration: 1.5, ease: 'power3.out' });
  gsap.from('.home__panel-2', { y: 800, duration: 1.5, ease: 'power3.out' });
  gsap.from('.home__img', { x: 300, opacity: 0, duration: 1.6, delay: 0.2, ease: 'power2.out' });
  gsap.from('.home__titles', { y: 50, opacity: 0, duration: 1.2, delay: 0.5, ease: 'power2.out' });
  gsap.from('.home__specs', { y: 40, opacity: 0, duration: 1.2, delay: 0.8, ease: 'power2.out' });
  gsap.from('.home__controls-wrap', { y: 30, opacity: 0, duration: 1.2, delay: 1, ease: 'power2.out' });
}

/* Throttle Pedal Buttons (Hold to Rev) */
document.querySelectorAll('.throttle-pedal-btn').forEach((btn) => {
  const getSound = () => btn.getAttribute('data-sound') || 'hyper';

  // Desktop Mouse Events
  btn.addEventListener('mousedown', (e) => {
    e.preventDefault();
    btn.classList.add('holding');
    startContinuousThrottle(getSound());
  });

  window.addEventListener('mouseup', () => {
    if (btn.classList.contains('holding')) {
      btn.classList.remove('holding');
      stopContinuousThrottle();
      playEngineRev(getSound(), 0.6); // Pop on release
    }
  });

  // Mobile Touch Events
  btn.addEventListener('touchstart', (e) => {
    btn.classList.add('holding');
    startContinuousThrottle(getSound());
  }, { passive: true });

  btn.addEventListener('touchend', () => {
    btn.classList.remove('holding');
    stopContinuousThrottle();
  });
});

/* Simple Rev sound buttons */
document.querySelectorAll('.rev-sound-trigger:not(.throttle-pedal-btn)').forEach((btn) => {
  btn.addEventListener('click', function () {
    const sound = this.getAttribute('data-sound') || 'hyper';
    playEngineRev(sound);
  });
});

/*==================== 360° BESPOKE CONFIGURATOR STUDIO ====================*/
const cfgSwatches = document.querySelectorAll('.cfg-swatch');
const cfgDisplayImg = document.getElementById('cfg-display-img');
const cfgDisplayName = document.getElementById('cfg-display-name');
const cfgDisplayLivery = document.getElementById('cfg-display-livery');
const cfgColorName = document.getElementById('cfg-color-name');
const cfgGlow = document.getElementById('cfg-glow');
const cfgWeight = document.getElementById('cfg-weight');
const cfgDownforceVal = document.getElementById('cfg-downforce-val');
const cfgPrice = document.getElementById('cfg-price');
const cfgModeCards = document.querySelectorAll('.cfg-mode-card');
const cfgPlaySoundBtn = document.getElementById('cfg-play-sound-btn');
const sillTextInput = document.getElementById('sill-text-input');

let currentConfig = {
  carKey: 'apex',
  colorTitle: 'Solar Amber',
  colorTone: 'orange',
  mode: 'track'
};

function updateConfiguratorStudio() {
  const data = CAR_DATABASE[currentConfig.carKey] || CAR_DATABASE.apex;

  // Image update with subtle morph
  if (cfgDisplayImg) {
    cfgDisplayImg.style.opacity = '0.2';
    cfgDisplayImg.style.transform = 'scale(0.96)';

    setTimeout(() => {
      cfgDisplayImg.src = data.img;
      cfgDisplayImg.alt = `${data.name} ${currentConfig.colorTitle}`;

      // Color tint / filter emulation
      if (currentConfig.colorTone === 'stealth') {
        cfgDisplayImg.style.filter = 'grayscale(1) contrast(1.2) drop-shadow(0 25px 35px rgba(0, 0, 0, 0.95))';
      } else if (currentConfig.colorTone === 'frost') {
        cfgDisplayImg.style.filter = 'brightness(1.2) contrast(1.1) drop-shadow(0 25px 35px rgba(0, 0, 0, 0.85))';
      } else {
        cfgDisplayImg.style.filter = 'drop-shadow(0 25px 35px rgba(0, 0, 0, 0.85))';
      }

      cfgDisplayImg.style.opacity = '1';
      cfgDisplayImg.style.transform = 'scale(1)';
    }, 180);
  }

  // Text updates
  if (cfgDisplayName) cfgDisplayName.textContent = data.name;
  if (cfgDisplayLivery) cfgDisplayLivery.textContent = `${currentConfig.colorTitle} · Atelier Commission`;
  if (cfgColorName) {
    cfgColorName.textContent = currentConfig.colorTitle;
    cfgColorName.style.color = data.color;
  }
  if (cfgGlow) cfgGlow.style.backgroundColor = data.color;

  // Aero package impacts
  let calculatedWeight = parseInt(data.weight) || 1380;
  let calculatedDownforce = parseInt(data.downforce) || 1240;

  if (currentConfig.mode === 'vmax') {
    calculatedDownforce = Math.round(calculatedDownforce * 0.72);
  } else if (currentConfig.mode === 'airbrake') {
    calculatedDownforce = Math.round(calculatedDownforce * 1.25);
  }

  if (cfgWeight) cfgWeight.textContent = `${calculatedWeight} KG`;
  if (cfgDownforceVal) cfgDownforceVal.textContent = `${calculatedDownforce} KG`;
  if (cfgPrice) cfgPrice.textContent = data.price;
}

cfgSwatches.forEach((swatch) => {
  swatch.addEventListener('click', () => {
    cfgSwatches.forEach((s) => s.classList.remove('active'));
    swatch.classList.add('active');

    currentConfig.carKey = swatch.getAttribute('data-car') || 'apex';
    currentConfig.colorTone = swatch.getAttribute('data-color') || 'orange';
    currentConfig.colorTitle = swatch.getAttribute('data-title') || 'Solar Amber';

    updateConfiguratorStudio();
    playEngineRev(CAR_DATABASE[currentConfig.carKey]?.soundType || 'hyper', 0.6);
  });
});

cfgModeCards.forEach((card) => {
  card.addEventListener('click', () => {
    cfgModeCards.forEach((c) => c.classList.remove('active'));
    card.classList.add('active');
    currentConfig.mode = card.getAttribute('data-mode') || 'track';
    updateConfiguratorStudio();
    showToast(`Active Aerodynamics: ${card.querySelector('.cfg-mode-title').textContent} Deployed`);
  });
});

if (cfgPlaySoundBtn) {
  cfgPlaySoundBtn.addEventListener('click', () => {
    playEngineRev(CAR_DATABASE[currentConfig.carKey]?.soundType || 'hyper');
  });
}

if (sillTextInput) {
  sillTextInput.addEventListener('input', () => {
    showToast(`Sill Inscription updated: "${sillTextInput.value}"`);
  });
}

/*==================== VIRTUAL WIND TUNNEL STREAMLINES SIMULATOR ====================*/
const tunnelCanvas = document.getElementById('tunnel-canvas');
let tunnelCtx = null;
let tunnelParticles = [];
let windVelocity = 250;
let tunnelMode = 'stream'; // 'stream' or 'smoke'
let activeTunnelCarIndex = 0;
const tunnelCarImages = ['assets/img/car-1.png', 'assets/img/car-2.png', 'assets/img/car-3.png'];
let loadedCarImg = null;

function initWindTunnel() {
  if (!tunnelCanvas) return;
  tunnelCtx = tunnelCanvas.getContext('2d');

  function resizeCanvas() {
    tunnelCanvas.width = tunnelCanvas.parentElement.clientWidth || 900;
    tunnelCanvas.height = 480;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  // Preload car image
  loadedCarImg = new Image();
  loadedCarImg.src = tunnelCarImages[activeTunnelCarIndex];

  // Initialize particles
  const particleCount = 180;
  tunnelParticles = [];
  for (let i = 0; i < particleCount; i++) {
    tunnelParticles.push(createParticle());
  }

  requestAnimationFrame(renderWindTunnel);
}

function createParticle() {
  return {
    x: Math.random() * (tunnelCanvas ? tunnelCanvas.width : 800),
    y: Math.random() * (tunnelCanvas ? tunnelCanvas.height : 480),
    speed: 1 + Math.random() * 2,
    length: 12 + Math.random() * 28,
    opacity: 0.15 + Math.random() * 0.75,
    hue: 190 + Math.random() * 25
  };
}

function renderWindTunnel() {
  if (!tunnelCtx || !tunnelCanvas) return;

  const w = tunnelCanvas.width;
  const h = tunnelCanvas.height;

  // Dark motion blur trail
  tunnelCtx.fillStyle = 'rgba(8, 12, 18, 0.22)';
  tunnelCtx.fillRect(0, 0, w, h);

  // Draw grid lines
  tunnelCtx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
  tunnelCtx.lineWidth = 1;
  for (let x = 0; x < w; x += 60) {
    tunnelCtx.beginPath();
    tunnelCtx.moveTo(x, 0);
    tunnelCtx.lineTo(x, h);
    tunnelCtx.stroke();
  }
  for (let y = 0; y < h; y += 40) {
    tunnelCtx.beginPath();
    tunnelCtx.moveTo(0, y);
    tunnelCtx.lineTo(w, y);
    tunnelCtx.stroke();
  }

  // Draw Car Silhouette in center
  if (loadedCarImg && loadedCarImg.complete) {
    const imgWidth = Math.min(w * 0.72, 700);
    const imgHeight = imgWidth * (loadedCarImg.naturalHeight / loadedCarImg.naturalWidth || 0.45);
    const imgX = (w - imgWidth) / 2;
    const imgY = h * 0.52 - imgHeight / 2;

    // Glowing underfloor Venturi laser
    const grad = tunnelCtx.createLinearGradient(imgX, imgY + imgHeight, imgX + imgWidth, imgY + imgHeight);
    grad.addColorStop(0, 'transparent');
    grad.addColorStop(0.5, 'rgba(0, 240, 255, 0.35)');
    grad.addColorStop(1, 'transparent');
    tunnelCtx.fillStyle = grad;
    tunnelCtx.fillRect(imgX, imgY + imgHeight - 4, imgWidth, 8);

    tunnelCtx.drawImage(loadedCarImg, imgX, imgY, imgWidth, imgHeight);
  }

  // Speed multiplier based on slider
  const speedMult = (windVelocity / 180) * 4;

  // Render Streamlines
  tunnelParticles.forEach((p) => {
    p.x += p.speed * speedMult;

    // Boundary flow simulation around car center
    const carCenterY = h * 0.52;
    const carCenterX = w * 0.5;

    // If approaching car, curve airflow smoothly above and below
    if (Math.abs(p.x - carCenterX) < w * 0.32 && Math.abs(p.y - carCenterY) < 110) {
      if (p.y < carCenterY) {
        p.y -= 1.2 * (speedMult * 0.35); // Over the roof & rear wing
      } else {
        p.y += 0.9 * (speedMult * 0.35); // Underfloor venturi
      }
    }

    if (p.x > w + 40) {
      p.x = -p.length;
      p.y = Math.random() * h;
    }

    tunnelCtx.beginPath();
    if (tunnelMode === 'smoke') {
      // Smoke puff circle
      tunnelCtx.fillStyle = `hsla(${p.hue}, 90%, 60%, ${p.opacity * 0.45})`;
      tunnelCtx.arc(p.x, p.y, p.length * 0.35, 0, Math.PI * 2);
      tunnelCtx.fill();
    } else {
      // Laser streamline
      tunnelCtx.strokeStyle = `hsla(${p.hue}, 95%, 65%, ${p.opacity})`;
      tunnelCtx.lineWidth = 1.8;
      tunnelCtx.moveTo(p.x, p.y);
      tunnelCtx.lineTo(p.x - p.length, p.y);
      tunnelCtx.stroke();
    }
  });

  requestAnimationFrame(renderWindTunnel);
}

// Wind speed slider listener
const windSpeedSlider = document.getElementById('wind-speed-slider');
const windSpeedDisplay = document.getElementById('wind-speed-display');
const hudDragForce = document.getElementById('hud-drag-force');
const hudDownforce = document.getElementById('hud-downforce');
const hudEfficiency = document.getElementById('hud-efficiency');

if (windSpeedSlider) {
  windSpeedSlider.addEventListener('input', (e) => {
    windVelocity = parseInt(e.target.value) || 250;
    if (windSpeedDisplay) windSpeedDisplay.textContent = `${windVelocity} KM/H`;

    // Dynamic aerodynamic physics approximation (F = 0.5 * rho * v^2 * Cd * A)
    const vMps = windVelocity / 3.6;
    const dragN = Math.round(0.5 * 1.225 * Math.pow(vMps, 2) * 0.24 * 1.95);
    const downforceKg = Math.round(dragN * 0.52);
    const lOverD = (downforceKg * 9.81 / Math.max(dragN, 1)).toFixed(2);

    if (hudDragForce) hudDragForce.textContent = `${dragN.toLocaleString()} N`;
    if (hudDownforce) hudDownforce.textContent = `${downforceKg.toLocaleString()} KG`;
    if (hudEfficiency) hudEfficiency.textContent = lOverD;
  });
}

// Toggle Streamlines vs Smoke
const toggleStreamlines = document.getElementById('toggle-streamlines');
const toggleSmoke = document.getElementById('toggle-smoke');
const tunnelCarToggle = document.getElementById('tunnel-car-toggle');

if (toggleStreamlines && toggleSmoke) {
  toggleStreamlines.addEventListener('click', () => {
    tunnelMode = 'stream';
    toggleStreamlines.classList.add('active');
    toggleSmoke.classList.remove('active');
  });

  toggleSmoke.addEventListener('click', () => {
    tunnelMode = 'smoke';
    toggleSmoke.classList.add('active');
    toggleStreamlines.classList.remove('active');
  });
}

if (tunnelCarToggle) {
  tunnelCarToggle.addEventListener('click', () => {
    activeTunnelCarIndex = (activeTunnelCarIndex + 1) % tunnelCarImages.length;
    if (loadedCarImg) {
      loadedCarImg.src = tunnelCarImages[activeTunnelCarIndex];
      const modelNames = ['Apex GT-V', 'Verdant RS', 'Phantom GT'];
      showToast(`Tunnel Model Changed: ${modelNames[activeTunnelCarIndex]}`);
    }
  });
}

window.addEventListener('load', initWindTunnel);

/*==================== CIRCUIT GHOST LAP SIMULATION ====================*/
const simulateLapBtn = document.getElementById('simulate-lap-btn');
const telemetryListenBtn = document.getElementById('telemetry-listen-btn');
const teleGforce = document.getElementById('tele-gforce');
const teleApexSpeed = document.getElementById('tele-apex-speed');

if (simulateLapBtn) {
  simulateLapBtn.addEventListener('click', () => {
    showToast("Ghost lap simulation running: Sector 1 -> Sector 2 -> Sector 3");
    playEngineRev('hyper', 1.8);

    let step = 0;
    const timer = setInterval(() => {
      step++;
      if (teleGforce) {
        teleGforce.textContent = `${(1.8 + Math.random() * 0.6).toFixed(2)} G`;
      }
      if (teleApexSpeed) {
        teleApexSpeed.textContent = `${Math.floor(270 + Math.random() * 45)} KM/H`;
      }
      if (step >= 6) {
        clearInterval(timer);
        showToast("Ghost Lap Completed: Benchmark lap delta validated");
      }
    }, 400);
  });
}

if (telemetryListenBtn) {
  telemetryListenBtn.addEventListener('click', () => {
    playEngineRev('hyper', 2.0);
    showToast("Telemetry audio stream: Quad-inverter high-frequency modulation");
  });
}

/*==================== CHASSIS HOTSPOTS ====================*/
const hotspotDots = document.querySelectorAll('.hotspot-dot');
const hotspotLabel = document.getElementById('hotspot-label');

hotspotDots.forEach((dot) => {
  dot.addEventListener('click', function () {
    const info = this.getAttribute('data-info');
    if (hotspotLabel && info) {
      hotspotLabel.textContent = info;
      playEngineRev('turbine', 0.5);
      showToast("Chassis Hotspot Inspected");
    }
  });
});

/*==================== TECHNICAL DOSSIER INSPECTOR MODAL ====================*/
const inspectorModal = document.getElementById('inspector-modal');
const inspectorModalClose = document.getElementById('inspector-modal-close');
const inspectorTitle = document.getElementById('inspector-title');
const inspectorClass = document.getElementById('inspector-class');
const inspectorRevBtn = document.getElementById('inspector-rev-btn');
const inspectorConfigureCta = document.getElementById('inspector-configure-cta');

function openInspectorModal(carKey = 'apex') {
  const data = CAR_DATABASE[carKey] || CAR_DATABASE.apex;

  if (inspectorTitle) inspectorTitle.textContent = data.name;
  if (inspectorClass) inspectorClass.textContent = data.class;

  const setVal = (id, val) => {
    const el = document.getElementById(id);
    if (el) el.textContent = val;
  };

  setVal('insp-speed', data.speed);
  setVal('insp-accel', data.accel);
  setVal('insp-power', data.power);
  setVal('insp-torque', data.torque);
  setVal('insp-weight', data.weight);
  setVal('insp-brakes', data.brakes);
  setVal('insp-downforce', data.downforce);
  setVal('insp-aero', data.dragCd);

  if (inspectorRevBtn) inspectorRevBtn.setAttribute('data-sound', data.soundType);

  if (inspectorModal) {
    inspectorModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
}

function closeInspectorModal() {
  if (inspectorModal) {
    inspectorModal.classList.remove('active');
    document.body.style.overflow = '';
  }
}

document.querySelectorAll('.open-inspector-btn').forEach((btn) => {
  btn.addEventListener('click', function () {
    const model = this.getAttribute('data-model') || 'apex';
    openInspectorModal(model);
  });
});

if (inspectorModalClose) inspectorModalClose.addEventListener('click', closeInspectorModal);
if (inspectorModal) {
  inspectorModal.addEventListener('click', (e) => {
    if (e.target === inspectorModal) closeInspectorModal();
  });
}

if (inspectorConfigureCta) {
  inspectorConfigureCta.addEventListener('click', () => {
    closeInspectorModal();
  });
}

/*==================== VIP PADDOCK PASS BOOKING MODAL ====================*/
const bookingForm = document.getElementById('booking-form');
const bookingModal = document.getElementById('booking-modal');
const bookingModalClose = document.getElementById('booking-modal-close');
const modalConfirmBtn = document.getElementById('modal-confirm-btn');

// Pre-fill date input with 10 days in future
const dateSelect = document.getElementById('date-select');
if (dateSelect) {
  const future = new Date();
  future.setDate(future.getDate() + 14);
  dateSelect.value = future.toISOString().split('T')[0];
  dateSelect.min = new Date().toISOString().split('T')[0];
}

if (bookingForm) {
  bookingForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const carSelect = document.getElementById('car-select');
    const circuitSelect = document.getElementById('circuit-select');
    const clientName = document.getElementById('client-name');
    const clientEmail = document.getElementById('client-email');

    if (!clientName.value.trim() || !clientEmail.value.trim()) {
      showToast("Please enter your driver name and email address.");
      return;
    }

    const ticketCar = document.getElementById('ticket-car');
    const ticketCircuit = document.getElementById('ticket-circuit');
    const ticketDate = document.getElementById('ticket-date');
    const ticketGuest = document.getElementById('ticket-guest');
    const ticketCode = document.getElementById('ticket-code');

    if (ticketCar && carSelect) ticketCar.textContent = carSelect.value;
    if (ticketCircuit && circuitSelect) ticketCircuit.textContent = circuitSelect.value;
    if (ticketDate && dateSelect) ticketDate.textContent = dateSelect.value;
    if (ticketGuest && clientName) ticketGuest.textContent = clientName.value;
    if (ticketCode) {
      ticketCode.textContent = `RC-${Math.floor(1000 + Math.random() * 9000)}-VIP`;
    }

    if (bookingModal) {
      bookingModal.classList.add('active');
      document.body.style.overflow = 'hidden';
      playEngineRev('hyper');
    }
  });
}

function closeBookingModal() {
  if (bookingModal) {
    bookingModal.classList.remove('active');
    document.body.style.overflow = '';
  }
}

if (bookingModalClose) bookingModalClose.addEventListener('click', closeBookingModal);
if (modalConfirmBtn) modalConfirmBtn.addEventListener('click', closeBookingModal);
if (bookingModal) {
  bookingModal.addEventListener('click', (e) => {
    if (e.target === bookingModal) closeBookingModal();
  });
}

/*==================== BROADCAST STREAM REMINDERS ====================*/
document.querySelectorAll('.stream-modal-btn').forEach((btn) => {
  btn.addEventListener('click', function () {
    const eventName = this.getAttribute('data-event') || 'Championship Race';
    showToast(`Connected: ${eventName} 4K Onboard Telemetry Stream`);
    playEngineRev('v8', 0.9);
  });
});

/* Keyboard Escape to dismiss modals */
window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeInspectorModal();
    closeBookingModal();
    if (navMenu) navMenu.classList.remove('show-menu');
  }
});
