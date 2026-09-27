/*==================== AUTOMOTIVE DATA & TELEMETRY ====================*/
const CAR_DATABASE = {
  apex: {
    name: "Apex GT-V",
    class: "Formula E-Hypercar Division",
    tagline: "Quad permanent-magnet synchronous motors with millisecond dynamic torque distribution.",
    color: "hsl(36, 95%, 52%)",
    colorName: "orange",
    img: "assets/img/hypercar_orange_iso_1790510958544.jpg",
    speed: "302 MPH",
    accel: "1.9s",
    power: "1,470 HP",
    torque: "1,680 Nm",
    weight: "1,380 kg",
    brakes: "Carbon 420mm",
    downforce: "1,240 kg",
    dragCd: "0.27 Cd",
    downforcePct: "98%",
    brakingPct: "95%",
    brakingDist: "28.4 m",
    gripPct: "92%",
    gripG: "1.95 G",
    soundType: "hyper"
  },
  vulcan: {
    name: "Vulcan CR-1",
    class: "Nürburgring Record Edition",
    tagline: "Twin-turbocharged flat-plane V8 pushing 1,620 HP with carbon ground-effect venturi channels.",
    color: "hsl(354, 90%, 54%)",
    colorName: "red",
    img: "assets/img/hypercar_side_red_1790510875639.jpg",
    speed: "318 MPH",
    accel: "1.82s",
    power: "1,620 HP",
    torque: "1,850 Nm",
    weight: "1,240 kg",
    brakes: "Carbon-Ceramic 420mm",
    downforce: "1,450 kg",
    dragCd: "0.26 Cd",
    downforcePct: "99%",
    brakingPct: "98%",
    brakingDist: "27.1 m",
    gripPct: "97%",
    gripG: "2.15 G",
    soundType: "v8"
  },
  phantom: {
    name: "Phantom GT",
    class: "Grand Touring Aero Edition",
    tagline: "Long-tail active venturi diffuser with tri-motor all-weather traction vectoring.",
    color: "hsl(208, 95%, 52%)",
    colorName: "blue",
    img: "assets/img/hypercar_cyan_stealth_1790510977010.jpg",
    speed: "245 MPH",
    accel: "2.1s",
    power: "1,150 HP",
    torque: "1,340 Nm",
    weight: "1,440 kg",
    brakes: "Silicon-Carbide 410mm",
    downforce: "1,120 kg",
    dragCd: "0.25 Cd",
    downforcePct: "92%",
    brakingPct: "90%",
    brakingDist: "30.2 m",
    gripPct: "90%",
    gripG: "1.88 G",
    soundType: "turbine"
  },
  solstice: {
    name: "Centurion 99",
    class: "Titanium Bespoke Division",
    tagline: "Champagne titanium monocoque with dual-matrix laser optical aero active vectoring.",
    color: "hsl(43, 90%, 55%)",
    colorName: "gold",
    img: "assets/img/hypercar_front_gold_1790510894538.jpg",
    speed: "260 MPH",
    accel: "2.0s",
    power: "1,320 HP",
    torque: "1,520 Nm",
    weight: "1,350 kg",
    brakes: "Carbon-Silicon 410mm",
    downforce: "1,180 kg",
    dragCd: "0.28 Cd",
    downforcePct: "94%",
    brakingPct: "93%",
    brakingDist: "29.2 m",
    gripPct: "93%",
    gripG: "1.92 G",
    soundType: "hyper"
  },
  verdant: {
    name: "Verdant RS",
    class: "Le Mans Hybrid Cup Spec",
    tagline: "Twin-turbocharged 4.0L flat-plane V8 paired with dual front-axle kinetic recovery motors.",
    color: "hsl(160, 92%, 40%)",
    colorName: "green",
    img: "assets/img/hypercar_studio_front_1790509359129.jpg",
    speed: "224 MPH",
    accel: "2.4s",
    power: "890 HP",
    torque: "980 Nm",
    weight: "1,290 kg",
    brakes: "Brembo 390mm",
    downforce: "980 kg",
    dragCd: "0.31 Cd",
    downforcePct: "88%",
    brakingPct: "92%",
    brakingDist: "29.8 m",
    gripPct: "96%",
    gripG: "2.05 G",
    soundType: "v8"
  }
};

/*==================== WEB AUDIO API ENGINE SOUND SYNTHESIZER ====================*/
let audioCtx = null;
let soundEnabled = true;

function initAudio() {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
}

function playEngineSound(type = 'hyper') {
  if (!soundEnabled) {
    showToast("Sound FX is currently muted. Click 'Sound FX' in header to unmute.");
    return;
  }

  try {
    initAudio();
    if (!audioCtx) return;

    const now = audioCtx.currentTime;
    const masterGain = audioCtx.createGain();
    masterGain.gain.setValueAtTime(0.001, now);
    masterGain.connect(audioCtx.destination);

    if (type === 'v8') {
      // V8 Rumble + Throttle roar
      const osc1 = audioCtx.createOscillator();
      const osc2 = audioCtx.createOscillator();
      const sub = audioCtx.createOscillator();

      osc1.type = 'sawtooth';
      osc2.type = 'sawtooth';
      sub.type = 'triangle';

      osc1.frequency.setValueAtTime(55, now);
      osc2.frequency.setValueAtTime(57, now);
      sub.frequency.setValueAtTime(27.5, now);

      // Rev up
      osc1.frequency.exponentialRampToValueAtTime(320, now + 0.35);
      osc2.frequency.exponentialRampToValueAtTime(326, now + 0.35);
      sub.frequency.exponentialRampToValueAtTime(160, now + 0.35);

      // Rev down
      osc1.frequency.exponentialRampToValueAtTime(65, now + 1.2);
      osc2.frequency.exponentialRampToValueAtTime(67, now + 1.2);
      sub.frequency.exponentialRampToValueAtTime(32, now + 1.2);

      const filter = audioCtx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(250, now);
      filter.frequency.exponentialRampToValueAtTime(2400, now + 0.35);
      filter.frequency.exponentialRampToValueAtTime(350, now + 1.2);

      masterGain.gain.linearRampToValueAtTime(0.22, now + 0.1);
      masterGain.gain.exponentialRampToValueAtTime(0.001, now + 1.35);

      osc1.connect(filter);
      osc2.connect(filter);
      sub.connect(filter);
      filter.connect(masterGain);

      osc1.start(now);
      osc2.start(now);
      sub.start(now);
      osc1.stop(now + 1.4);
      osc2.stop(now + 1.4);
      sub.stop(now + 1.4);

    } else if (type === 'turbine') {
      // High-speed Jet / Electric Aero Turbine
      const osc = audioCtx.createOscillator();
      const noise = audioCtx.createOscillator();
      osc.type = 'sine';
      noise.type = 'sawtooth';

      osc.frequency.setValueAtTime(220, now);
      osc.frequency.exponentialRampToValueAtTime(950, now + 0.45);
      osc.frequency.exponentialRampToValueAtTime(340, now + 1.2);

      noise.frequency.setValueAtTime(110, now);
      noise.frequency.exponentialRampToValueAtTime(480, now + 0.45);
      noise.frequency.exponentialRampToValueAtTime(160, now + 1.2);

      const filter = audioCtx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.Q.value = 4;
      filter.frequency.setValueAtTime(400, now);
      filter.frequency.exponentialRampToValueAtTime(1600, now + 0.45);
      filter.frequency.exponentialRampToValueAtTime(500, now + 1.2);

      masterGain.gain.linearRampToValueAtTime(0.18, now + 0.08);
      masterGain.gain.exponentialRampToValueAtTime(0.001, now + 1.3);

      osc.connect(filter);
      noise.connect(filter);
      filter.connect(masterGain);

      osc.start(now);
      noise.start(now);
      osc.stop(now + 1.35);
      noise.stop(now + 1.35);

    } else {
      // Hyper Electric Instant Torque Scream (Apex)
      const osc = audioCtx.createOscillator();
      const fm = audioCtx.createOscillator();
      const fmGain = audioCtx.createGain();

      osc.type = 'sawtooth';
      fm.type = 'sine';

      fm.frequency.setValueAtTime(120, now);
      fm.frequency.exponentialRampToValueAtTime(650, now + 0.4);
      fmGain.gain.setValueAtTime(80, now);
      fmGain.gain.exponentialRampToValueAtTime(320, now + 0.4);

      osc.frequency.setValueAtTime(140, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.4);
      osc.frequency.exponentialRampToValueAtTime(190, now + 1.25);

      fm.connect(fmGain);
      fmGain.connect(osc.frequency);

      const filter = audioCtx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(600, now);
      filter.frequency.exponentialRampToValueAtTime(3600, now + 0.4);
      filter.frequency.exponentialRampToValueAtTime(700, now + 1.25);

      masterGain.gain.linearRampToValueAtTime(0.2, now + 0.08);
      masterGain.gain.exponentialRampToValueAtTime(0.001, now + 1.35);

      osc.connect(filter);
      filter.connect(masterGain);

      fm.start(now);
      osc.start(now);
      fm.stop(now + 1.4);
      osc.stop(now + 1.4);
    }

    showToast(`Engine Roar: ${type.toUpperCase()} Revved!`);
  } catch (err) {
    console.warn("Audio playback notice:", err);
  }
}

/*==================== TOAST NOTIFICATION ====================*/
let toastTimeout = null;
function showToast(message) {
  const toast = document.getElementById('sound-toast');
  const toastText = document.getElementById('sound-toast-text');
  if (!toast || !toastText) return;

  toastText.textContent = message;
  toast.classList.add('show');

  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    toast.classList.remove('show');
  }, 2600);
}

/*==================== NAVIGATION & MENU ====================*/
const navMenu = document.getElementById('nav-menu');
const navToggle = document.getElementById('nav-toggle');
const navClose = document.getElementById('nav-close');
const navLinks = document.querySelectorAll('.nav__link');

if (navToggle && navMenu) {
  navToggle.addEventListener('click', () => {
    navMenu.classList.add('show-menu');
  });
}

if (navClose && navMenu) {
  navClose.addEventListener('click', () => {
    navMenu.classList.remove('show-menu');
  });
}

navLinks.forEach((link) => {
  link.addEventListener('click', () => {
    if (navMenu) navMenu.classList.remove('show-menu');
  });
});

/*==================== BLUR HEADER ON SCROLL ====================*/
function blurHeader() {
  const header = document.getElementById('header');
  if (header) {
    if (window.scrollY >= 40) {
      header.classList.add('blur-header');
    } else {
      header.classList.remove('blur-header');
    }
  }
}
window.addEventListener('scroll', blurHeader);

/*==================== ACTIVE LINK ON SCROLL ====================*/
const sections = document.querySelectorAll('section[id]');
function scrollActive() {
  const scrollY = window.pageYOffset;

  sections.forEach((current) => {
    const sectionHeight = current.offsetHeight;
    const sectionTop = current.offsetTop - 120;
    const sectionId = current.getAttribute('id');
    const sectionsClass = document.querySelector(`.nav__menu a[href*='${sectionId}']`);

    if (sectionsClass) {
      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        sectionsClass.classList.add('active');
      } else {
        sectionsClass.classList.remove('active');
      }
    }
  });
}
window.addEventListener('scroll', scrollActive);

/*==================== SOUND TOGGLE IN HEADER ====================*/
const soundToggleBtn = document.getElementById('sound-toggle-btn');
const soundStatusLabel = document.getElementById('sound-status-label');

if (soundToggleBtn) {
  soundToggleBtn.addEventListener('click', () => {
    initAudio();
    soundEnabled = !soundEnabled;
    if (soundEnabled) {
      soundToggleBtn.classList.add('active');
      if (soundStatusLabel) soundStatusLabel.textContent = "Sound: ON";
      playEngineSound('hyper');
    } else {
      soundToggleBtn.classList.remove('active');
      if (soundStatusLabel) soundStatusLabel.textContent = "Sound: Muted";
      showToast("Sound FX Muted");
    }
  });
}

/*==================== SWIPER CAR SLIDER ====================*/
const CAR_BULLET_DATA = [
  { num: '01', name: 'APEX GT-V', img: 'assets/img/hypercar_orange_iso_1790510958544.jpg' },
  { num: '02', name: 'VULCAN CR-1', img: 'assets/img/hypercar_side_red_1790510875639.jpg' },
  { num: '03', name: 'PHANTOM GT', img: 'assets/img/hypercar_cyan_stealth_1790510977010.jpg' },
  { num: '04', name: 'CENTURION 99', img: 'assets/img/hypercar_front_gold_1790510894538.jpg' },
  { num: '05', name: 'VERDANT RS', img: 'assets/img/hypercar_studio_front_1790509359129.jpg' }
];

let swiperHome = null;
if (typeof Swiper !== 'undefined') {
  swiperHome = new Swiper('.home__swiper', {
    speed: 850,
    effect: 'fade',
    fadeEffect: {
      crossFade: true
    },
    keyboard: {
      enabled: true
    },
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
      renderBullet: (index, className) => {
        const item = CAR_BULLET_DATA[index] || { num: String(index + 1).padStart(2, '0'), name: 'HYPERCAR', img: '' };
        return `<button type="button" class="${className}" aria-label="Select ${item.name}" data-index="${index}">
          <span class="bullet-thumb"><img src="${item.img}" alt="${item.name}" loading="lazy"></span>
          <span class="bullet-body">
            <span class="bullet-num">${item.num}</span>
            <span class="bullet-name">${item.name}</span>
          </span>
          <span class="bullet-bar"></span>
        </button>`;
      }
    },
    on: {
      slideChange: function () {
        const activeSlide = this.slides[this.activeIndex];
        const carKey = activeSlide ? activeSlide.getAttribute('data-car') : null;
        if (carKey && CAR_DATABASE[carKey]) {
          if (soundEnabled && audioCtx) {
            playEngineSound(CAR_DATABASE[carKey].soundType);
          }
        }
      }
    }
  });

  // Previous & Next Navigation Buttons
  const prevBtn = document.getElementById('home-prev-btn');
  const nextBtn = document.getElementById('home-next-btn');
  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      if (swiperHome) swiperHome.slidePrev();
    });
  }
  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      if (swiperHome) swiperHome.slideNext();
    });
  }
}

/*==================== CAMERA ANGLE SWITCHER ====================*/
document.querySelectorAll('.home__article').forEach((slide) => {
  const angleBtns = slide.querySelectorAll('.angle-btn');
  const carImg = slide.querySelector('.home__main-car-photo');
  if (!carImg || !angleBtns.length) return;

  angleBtns.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      angleBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const targetSrc = btn.getAttribute('data-target-img');
      if (targetSrc) {
        const isDesktop = window.innerWidth >= 1150;
        const baseTranslateY = isDesktop ? -32 : -24;
        carImg.style.opacity = '0';
        carImg.style.transform = `translateY(${baseTranslateY}px) scale(0.96)`;

        setTimeout(() => {
          carImg.src = targetSrc;
          carImg.style.opacity = '1';
          carImg.style.transform = `translateY(${baseTranslateY}px) scale(1)`;
        }, 180);
      }
    });
  });
});

/*==================== 3D TILT EFFECT ON CAR VISUAL ====================*/
document.querySelectorAll('.home__image-container').forEach((container) => {
  const img = container.querySelector('.home__main-car-photo');
  if (!img) return;

  container.addEventListener('mousemove', (e) => {
    const rect = container.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    const tiltX = (y / (rect.height / 2)) * -5;
    const tiltY = (x / (rect.width / 2)) * 7;
    const isDesktop = window.innerWidth >= 1150;
    const baseTranslateY = isDesktop ? -32 : -24;
    img.style.transform = `perspective(1000px) translateY(${baseTranslateY}px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale3d(1.02, 1.02, 1.02)`;
  });

  container.addEventListener('mouseleave', () => {
    const isDesktop = window.innerWidth >= 1150;
    const baseTranslateY = isDesktop ? -32 : -24;
    img.style.transform = `perspective(1000px) translateY(${baseTranslateY}px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
  });
});

/*==================== GSAP ENTRANCE ANIMATIONS ====================*/
if (typeof gsap !== 'undefined') {
  gsap.from('.home__panel-1', { y: -400, duration: 1.4, ease: 'power3.out' });
  gsap.from('.home__stage-backdrop', { y: 400, duration: 1.4, ease: 'power3.out' });
  gsap.from('.home__main-car-photo', { x: 300, opacity: 0, duration: 1.6, delay: 0.2, ease: 'power2.out' });
  gsap.from('.home__titles', { y: 50, opacity: 0, duration: 1.2, delay: 0.5, ease: 'power2.out' });
  gsap.from('.home__specs', { y: 40, opacity: 0, duration: 1.2, delay: 0.8, ease: 'power2.out' });
  gsap.from('.home__actions-row', { y: 40, opacity: 0, duration: 1.2, delay: 1.0, ease: 'power2.out' });
}

/*==================== REV SOUND BUTTONS ====================*/
document.querySelectorAll('.rev-sound-trigger').forEach((btn) => {
  btn.addEventListener('click', function (e) {
    e.stopPropagation();
    const soundType = this.getAttribute('data-sound') || 'hyper';
    this.classList.add('is-revving');
    playEngineSound(soundType);

    setTimeout(() => {
      this.classList.remove('is-revving');
    }, 600);
  });
});

/*==================== VEHICLE COMPARISON SHOWCASE MATRIX ====================*/
const vehicleTabs = document.querySelectorAll('.vehicle__tab-btn');
const showcaseName = document.getElementById('showcase-name');
const showcaseClass = document.getElementById('showcase-class');
const showcaseTagline = document.getElementById('showcase-tagline');
const showcaseMainImg = document.getElementById('showcase-main-img');
const showcaseGlow = document.getElementById('showcase-glow');
const showcaseValSpeed = document.getElementById('showcase-val-speed');
const showcaseValAccel = document.getElementById('showcase-val-accel');
const showcaseValPower = document.getElementById('showcase-val-power');
const statDownforceBar = document.getElementById('stat-downforce-bar');
const statDownforceLabel = document.getElementById('stat-downforce-label');
const statBrakingBar = document.getElementById('stat-braking-bar');
const statBrakingLabel = document.getElementById('stat-braking-label');
const statGripBar = document.getElementById('stat-grip-bar');
const statGripLabel = document.getElementById('stat-grip-label');
const showcaseInspectBtn = document.getElementById('showcase-inspect-btn');

function updateVehicleShowcase(carKey) {
  const data = CAR_DATABASE[carKey];
  if (!data) return;

  // Active tab indicator
  vehicleTabs.forEach((tab) => {
    const isTarget = tab.getAttribute('data-target') === carKey;
    tab.classList.toggle('active', isTarget);
    tab.setAttribute('aria-selected', isTarget ? 'true' : 'false');
  });

  // Smooth image swap
  if (showcaseMainImg) {
    showcaseMainImg.style.opacity = '0';
    showcaseMainImg.style.transform = 'scale(0.96) translateY(6px)';

    setTimeout(() => {
      showcaseMainImg.src = data.img;
      showcaseMainImg.alt = data.name;
      showcaseMainImg.style.opacity = '1';
      showcaseMainImg.style.transform = 'scale(1) translateY(0)';
    }, 200);
  }

  // Update text & telemetry
  if (showcaseName) showcaseName.textContent = data.name;
  if (showcaseClass) {
    showcaseClass.textContent = data.class;
    showcaseClass.style.color = data.color;
  }
  if (showcaseTagline) showcaseTagline.textContent = data.tagline;
  if (showcaseGlow) showcaseGlow.style.backgroundColor = data.color;

  if (showcaseValSpeed) showcaseValSpeed.textContent = data.speed;
  if (showcaseValAccel) showcaseValAccel.textContent = data.accel;
  if (showcaseValPower) showcaseValPower.textContent = data.power;

  // Progress bars
  if (statDownforceBar) {
    statDownforceBar.style.width = data.downforcePct;
    statDownforceBar.style.backgroundColor = data.color;
  }
  if (statDownforceLabel) statDownforceLabel.textContent = `${data.downforce} (${data.downforcePct})`;

  if (statBrakingBar) {
    statBrakingBar.style.width = data.brakingPct;
    statBrakingBar.style.backgroundColor = data.color;
  }
  if (statBrakingLabel) statBrakingLabel.textContent = `${data.brakingDist} (${data.brakingPct})`;

  if (statGripBar) {
    statGripBar.style.width = data.gripPct;
    statGripBar.style.backgroundColor = data.color;
  }
  if (statGripLabel) statGripLabel.textContent = `${data.gripG} (${data.gripPct})`;

  if (showcaseInspectBtn) showcaseInspectBtn.setAttribute('data-model', carKey);
}

vehicleTabs.forEach((tab) => {
  tab.addEventListener('click', () => {
    const target = tab.getAttribute('data-target');
    if (target) {
      updateVehicleShowcase(target);
      playEngineSound(CAR_DATABASE[target]?.soundType || 'hyper');
    }
  });
});

/*==================== TELEMETRY INSPECTOR MODAL ====================*/
const inspectorModal = document.getElementById('inspector-modal');
const inspectorModalClose = document.getElementById('inspector-modal-close');
const inspectorTitle = document.getElementById('inspector-title');
const inspectorClass = document.getElementById('inspector-class');
const inspectorRevBtn = document.getElementById('inspector-rev-btn');
const inspectorBookCta = document.getElementById('inspector-book-cta');

let currentInspectedCar = 'apex';

function openInspectorModal(carKey = 'apex') {
  currentInspectedCar = carKey;
  const data = CAR_DATABASE[carKey] || CAR_DATABASE.apex;

  if (inspectorTitle) inspectorTitle.textContent = data.name;
  if (inspectorClass) inspectorClass.textContent = data.class;

  const setField = (id, val) => {
    const el = document.getElementById(id);
    if (el) el.textContent = val;
  };

  setField('insp-speed', data.speed);
  setField('insp-accel', data.accel);
  setField('insp-power', data.power);
  setField('insp-torque', data.torque);
  setField('insp-weight', data.weight);
  setField('insp-brakes', data.brakes);
  setField('insp-downforce', data.downforce);
  setField('insp-aero', data.dragCd);

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

if (inspectorModalClose) {
  inspectorModalClose.addEventListener('click', closeInspectorModal);
}

if (inspectorModal) {
  inspectorModal.addEventListener('click', (e) => {
    if (e.target === inspectorModal) closeInspectorModal();
  });
}

if (inspectorBookCta) {
  inspectorBookCta.addEventListener('click', () => {
    closeInspectorModal();
    const carSelect = document.getElementById('car-select');
    if (carSelect && CAR_DATABASE[currentInspectedCar]) {
      const targetName = CAR_DATABASE[currentInspectedCar].name;
      for (let i = 0; i < carSelect.options.length; i++) {
        if (carSelect.options[i].value.includes(targetName)) {
          carSelect.selectedIndex = i;
          break;
        }
      }
    }
  });
}

/*==================== CIRCUIT TEST DRIVE BOOKING FORM ====================*/
const bookingForm = document.getElementById('booking-form');
const bookingModal = document.getElementById('booking-modal');
const bookingModalClose = document.getElementById('booking-modal-close');
const modalConfirmBtn = document.getElementById('modal-confirm-btn');

// Pre-fill tomorrow's date for date input
const dateSelect = document.getElementById('date-select');
if (dateSelect) {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 7);
  dateSelect.value = tomorrow.toISOString().split('T')[0];
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
      showToast("Please enter your name and email address.");
      return;
    }

    // Populate confirmation ticket
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
      const randomId = Math.floor(1000 + Math.random() * 9000);
      ticketCode.textContent = `RC-${randomId}-VIP`;
    }

    if (bookingModal) {
      bookingModal.classList.add('active');
      document.body.style.overflow = 'hidden';
      playEngineSound('hyper');
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

/*==================== BROADCAST NOTIFICATION REMINDERS ====================*/
document.querySelectorAll('.stream-modal-btn').forEach((btn) => {
  btn.addEventListener('click', function () {
    const eventName = this.getAttribute('data-event') || 'Championship Race';
    const car = this.getAttribute('data-car') || 'RaceCar';
    showToast(`Connected: ${eventName} telemetry & stream buffer initialized`);
    playEngineSound('v8');
  });
});

/*==================== KEYBOARD SHORTCUTS ====================*/
window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeInspectorModal();
    closeBookingModal();
    if (navMenu) navMenu.classList.remove('show-menu');
  }
});
