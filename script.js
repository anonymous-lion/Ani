const countdownParts = {
  days: document.getElementById("days"),
  hours: document.getElementById("hours"),
  minutes: document.getElementById("minutes"),
  seconds: document.getElementById("seconds")
};

const celebrateBtn = document.getElementById("celebrateBtn");
const messageBtn = document.getElementById("messageBtn");
const countdownLabel = document.getElementById("countdownLabel");
const birthdayContent = document.getElementById("birthdayContent");
const surpriseTitle = document.getElementById("surpriseTitle");
const surpriseMessage = document.getElementById("surpriseMessage");
const balloonsContainer = document.querySelector(".floating-balloons");
const canvas = document.getElementById("confettiCanvas");
const ctx = canvas.getContext("2d");

const birthdayConfig = {
  name: "Ani",
  month: 4,
  day: 06
};

const surpriseNotes = [
  {
    title: "Birthday boy, this one is yours",
    message: "Your year is packed with big wins, fearless moves, full-volume laughter, and memories that get retold forever."
  },
  {
    title: "Go bigger this year",
    message: "Take the shot, chase the wild idea, trust your instincts, and let this year feel louder, stronger, and better than the last one. We definitely got to have a trip somewhere together."
  },
  {
    title: "Stay sharp and stay legendary",
    message: "Keep the brave heart, the strong mind, and the fire that makes you impossible to ignore when you decide to go all in. And keep inspiring likee you always do... Srsly"
  },
  {
    title: "My message",
    message: "Yoooooo big boy huhhh!! I'm older so respect me anyway... I still remember you being the cool one with one drop of sanitizer for everyone during lunch break guy in 7th LOLLL... looking back I never thought you would be such a golden friend to me... Like seriously man, thank you for existinggg.... YOU ARE MY BEST FRIEND!!! and we will grow old together... I'm sooo looking forward to meet you and making more moments roasting each other."
  }
];

let noteIndex = -1;
let confettiPieces = [];
let confettiAnimationId = null;
let confettiBurstUntil = 0;
let isContentRevealed = false;

function getNextBirthday() {
  const now = new Date();
  const nextBirthday = new Date(
    now.getFullYear(),
    birthdayConfig.month,
    birthdayConfig.day,
    0,
    0,
    0
  );

  if (now > nextBirthday) {
    nextBirthday.setFullYear(nextBirthday.getFullYear() + 1);
  }

  return nextBirthday;
}

function updateCountdown() {
  const now = new Date();
  const difference = getNextBirthday() - now;

  const days = Math.floor(difference / (1000 * 60 * 60 * 24));
  const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((difference / (1000 * 60)) % 60);
  const seconds = Math.floor((difference / 1000) % 60);

  countdownParts.days.textContent = String(days).padStart(2, "0");
  countdownParts.hours.textContent = String(hours).padStart(2, "0");
  countdownParts.minutes.textContent = String(minutes).padStart(2, "0");
  countdownParts.seconds.textContent = String(seconds).padStart(2, "0");
}

function updateCountdownLabel() {
  const formattedDate = new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric"
  }).format(new Date(2026, birthdayConfig.month, birthdayConfig.day));

  countdownLabel.textContent = `Countdown to ${formattedDate}`;
}

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

function createConfettiBurst(amount) {
  const colors = ["#ff5e78", "#ffb347", "#3dd2ff", "#c13b69", "#ffffff"];

  for (let index = 0; index < amount; index += 1) {
    confettiPieces.push({
      x: Math.random() * canvas.width,
      y: -20 - Math.random() * canvas.height * 0.3,
      size: 6 + Math.random() * 10,
      speedX: -2 + Math.random() * 4,
      speedY: 2 + Math.random() * 5,
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: -0.2 + Math.random() * 0.4,
      color: colors[Math.floor(Math.random() * colors.length)],
      gravity: 0.04,
      drag: 0.998,
      opacity: 1,
      fade: 0
    });
  }
}

function createPopBurst(x, y, amount = 24) {
  const colors = ["#6ed5ff", "#86d8ff", "#4eb6cb", "#1a84d6", "#eefbff"];

  for (let index = 0; index < amount; index += 1) {
    confettiPieces.push({
      x: x + (-10 + Math.random() * 20),
      y: y + (-10 + Math.random() * 20),
      size: 4 + Math.random() * 7,
      speedX: -5 + Math.random() * 10,
      speedY: -7 + Math.random() * 5,
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: -0.3 + Math.random() * 0.6,
      color: colors[Math.floor(Math.random() * colors.length)],
      gravity: 0.18,
      drag: 0.985,
      opacity: 1,
      fade: 0.022 + Math.random() * 0.018
    });
  }
}

function createBalloonShardBurst(x, y, color, amount = 10) {
  for (let index = 0; index < amount; index += 1) {
    confettiPieces.push({
      x: x + (-6 + Math.random() * 12),
      y: y + (-8 + Math.random() * 16),
      size: 5 + Math.random() * 6,
      speedX: -6 + Math.random() * 12,
      speedY: -8 + Math.random() * 7,
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: -0.34 + Math.random() * 0.68,
      color,
      gravity: 0.2,
      drag: 0.984,
      opacity: 0.95,
      fade: 0.024 + Math.random() * 0.016
    });
  }
}

function drawConfetti() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  confettiPieces = confettiPieces.filter((piece) => {
    return (
      piece.y < canvas.height + 40 &&
      piece.x > -40 &&
      piece.x < canvas.width + 40 &&
      piece.opacity > 0.04
    );
  });

  confettiPieces.forEach((piece) => {
    piece.speedX *= piece.drag;
    piece.speedY = piece.speedY * piece.drag + piece.gravity;
    piece.x += piece.speedX;
    piece.y += piece.speedY;
    piece.rotation += piece.rotationSpeed;
    piece.opacity -= piece.fade;

    ctx.save();
    ctx.translate(piece.x, piece.y);
    ctx.rotate(piece.rotation);
    ctx.globalAlpha = Math.max(piece.opacity, 0);
    ctx.fillStyle = piece.color;
    ctx.fillRect(-piece.size / 2, -piece.size / 2, piece.size, piece.size * 0.6);
    ctx.restore();
  });

  if (Date.now() < confettiBurstUntil) {
    createConfettiBurst(8);
  }

  if (confettiPieces.length > 0 || Date.now() < confettiBurstUntil) {
    confettiAnimationId = window.requestAnimationFrame(drawConfetti);
  } else {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    confettiAnimationId = null;
  }
}

function ensureConfettiLoop() {
  if (!confettiAnimationId) {
    drawConfetti();
  }
}

function startConfetti(duration = 2200) {
  confettiBurstUntil = Date.now() + duration;

  if (!confettiAnimationId) {
    createConfettiBurst(80);
    ensureConfettiLoop();
  }
}

function revealBirthdayContent() {
  if (isContentRevealed) {
    return;
  }

  isContentRevealed = true;
  birthdayContent.hidden = false;
  birthdayContent.classList.remove("content-entrance");
  void birthdayContent.offsetWidth;
  birthdayContent.classList.add("content-entrance");
  messageBtn.textContent = "Open Another Wish";
  birthdayContent.scrollIntoView({ behavior: "smooth", block: "start" });
}

function showBalloonBurst(rect, color) {
  const burst = document.createElement("div");
  burst.className = "balloon-burst";
  burst.style.left = `${rect.left}px`;
  burst.style.top = `${rect.top}px`;
  burst.style.width = `${rect.width}px`;
  burst.style.height = `${rect.height}px`;
  burst.style.color = color;

  const ring = document.createElement("div");
  ring.className = "balloon-ring";
  burst.appendChild(ring);

  const scaleX = rect.width / 74;
  const scaleY = rect.height / 92;
  const fragments = [
    { className: "fragment-a", tx: -34, ty: -46, rot: -32, scale: 0.94, duration: 440 },
    { className: "fragment-b", tx: 34, ty: -48, rot: 30, scale: 0.92, duration: 430 },
    { className: "fragment-c", tx: -46, ty: -8, rot: -56, scale: 0.88, duration: 520 },
    { className: "fragment-d", tx: 46, ty: -4, rot: 56, scale: 0.88, duration: 520 },
    { className: "fragment-e", tx: -18, ty: 44, rot: -38, scale: 0.78, duration: 560 },
    { className: "fragment-f", tx: 20, ty: 62, rot: 88, scale: 0.64, duration: 610 }
  ];

  fragments.forEach((piece) => {
    const fragment = document.createElement("span");
    fragment.className = `balloon-fragment ${piece.className}`;
    fragment.style.setProperty("--tx", `${piece.tx * scaleX}px`);
    fragment.style.setProperty("--ty", `${piece.ty * scaleY}px`);
    fragment.style.setProperty("--rot", `${piece.rot}deg`);
    fragment.style.setProperty("--scale", piece.scale);
    fragment.style.setProperty("--duration", `${piece.duration}ms`);
    burst.appendChild(fragment);
  });

  document.body.appendChild(burst);
  window.setTimeout(() => burst.remove(), 700);
}

function prepareBalloon(balloon) {
  balloon.addEventListener("click", () => {
    const rect = balloon.getBoundingClientRect();
    const computedStyle = window.getComputedStyle(balloon);
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const replacement = balloon.cloneNode(false);

    showBalloonBurst(rect, computedStyle.backgroundColor);
    createBalloonShardBurst(centerX, centerY, computedStyle.backgroundColor, 12);
    createPopBurst(centerX, centerY, 14);
    ensureConfettiLoop();

    balloon.replaceWith(replacement);
    prepareBalloon(replacement);
  });
}

function revealNextMessage() {
  noteIndex = (noteIndex + 1) % surpriseNotes.length;
  const nextNote = surpriseNotes[noteIndex];

  surpriseTitle.textContent = nextNote.title;
  surpriseMessage.textContent = nextNote.message;

  surpriseTitle.classList.remove("message-flash");
  surpriseMessage.classList.remove("message-flash");

  window.requestAnimationFrame(() => {
    surpriseTitle.classList.add("message-flash");
    surpriseMessage.classList.add("message-flash");
  });
}

celebrateBtn.addEventListener("click", () => {
  startConfetti();
  document.querySelector(".hero").scrollIntoView({ behavior: "smooth", block: "start" });
});

messageBtn.addEventListener("click", () => {
  revealBirthdayContent();
  revealNextMessage();
  startConfetti(1400);
});

balloonsContainer.querySelectorAll(".balloon").forEach(prepareBalloon);
window.addEventListener("resize", resizeCanvas);

resizeCanvas();
updateCountdownLabel();
updateCountdown();
window.setInterval(updateCountdown, 1000);
