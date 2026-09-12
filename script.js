const openBtn = document.getElementById("openBtn");
const surprise = document.getElementById("surprise");

/* =========================================
   OPEN SURPRISE
========================================= */

openBtn.addEventListener("click", () => {

  surprise.classList.remove("hidden");

  openBtn.textContent = "The surprise is open ❤️";
  openBtn.disabled = true;

  // Small burst of hearts
  for (let i = 0; i < 28; i++) {
    setTimeout(createHeart, i * 80);
  }

  // Reveal cards one after another
  const cards = surprise.querySelectorAll(".card, .final-card");

  cards.forEach((card, index) => {
    setTimeout(() => {
      card.classList.add("reveal");
    }, 150 + index * 180);
  });

  // Scroll elegantly to first message
  setTimeout(() => {
    surprise.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  }, 80);
});


/* =========================================
   FLOATING HEARTS
========================================= */

function createHeart() {

  const heart = document.createElement("div");

  heart.className = "heart";

  const symbols = [
    "♥",
    "♡",
    "✦",
    "✧",
    "⋆"
  ];

  heart.textContent =
    symbols[Math.floor(Math.random() * symbols.length)];

  heart.style.left =
    Math.random() * 100 + "vw";

  heart.style.fontSize =
    10 + Math.random() * 23 + "px";

  heart.style.animationDuration =
    6 + Math.random() * 5 + "s";

  heart.style.animationDelay =
    Math.random() * 1.5 + "s";

  heart.style.opacity =
    .15 + Math.random() * .45;

  document.querySelector(".hearts").appendChild(heart);

  setTimeout(() => {
    heart.remove();
  }, 12000);
}


/* Initial subtle floating particles */
for (let i = 0; i < 12; i++) {
  setTimeout(createHeart, i * 400);
}


/* Continue subtle hearts */
setInterval(createHeart, 1300);


/* =========================================
   COUNTDOWN
   Birthday = 22 September
========================================= */

function updateCountdown() {

  const now = new Date();

  let year = now.getFullYear();

  let birthday = new Date(
    year,
    8,       // September
    22,
    0,
    0,
    0
  );

  // If this year's birthday has passed,
  // count toward next year's birthday.
  if (now >= birthday) {
    birthday = new Date(
      year + 1,
      8,
      22,
      0,
      0,
      0
    );
  }

  const diff = birthday - now;

  const days =
    Math.floor(diff / 86400000);

  const hours =
    Math.floor(diff / 3600000) % 24;

  const minutes =
    Math.floor(diff / 60000) % 60;

  const seconds =
    Math.floor(diff / 1000) % 60;


  document.getElementById("days").textContent =
    days;

  document.getElementById("hours").textContent =
    String(hours).padStart(2, "0");

  document.getElementById("minutes").textContent =
    String(minutes).padStart(2, "0");

  document.getElementById("seconds").textContent =
    String(seconds).padStart(2, "0");
}

updateCountdown();

setInterval(updateCountdown, 1000);


/* =========================================
   SCROLL REVEAL
   Makes cards appear naturally when
   scrolling, while preserving the
   surprise effect.
========================================= */

const observer =
  new IntersectionObserver(
    (entries) => {

      entries.forEach((entry) => {

        if (entry.isIntersecting) {

          entry.target.classList.add("reveal");

          observer.unobserve(entry.target);
        }

      });

    },
    {
      threshold: 0.16
    }
  );


document
  .querySelectorAll(".card, .final-card")
  .forEach((card) => {

    observer.observe(card);

  });


/* =========================================
   BUTTON CLICK RIPPLE
========================================= */

openBtn.addEventListener("click", function (event) {

  const ripple =
    document.createElement("span");

  ripple.style.position = "absolute";
  ripple.style.width = "10px";
  ripple.style.height = "10px";
  ripple.style.borderRadius = "50%";
  ripple.style.background = "rgba(255,255,255,.35)";
  ripple.style.transform = "translate(-50%, -50%)";
  ripple.style.left = event.offsetX + "px";
  ripple.style.top = event.offsetY + "px";
  ripple.style.pointerEvents = "none";
  ripple.style.animation = "rippleEffect .7s ease-out forwards";

  this.appendChild(ripple);

  setTimeout(() => {
    ripple.remove();
  }, 700);
});


/* =========================================
   ADD RIPPLE ANIMATION DYNAMICALLY
========================================= */

const rippleStyle =
  document.createElement("style");

rippleStyle.textContent = `
@keyframes rippleEffect {
  from {
    width: 10px;
    height: 10px;
    opacity: .8;
  }

  to {
    width: 260px;
    height: 260px;
    opacity: 0;
  }
}
`;

document.head.appendChild(rippleStyle);


/* =========================================
   GENTLE PARALLAX EFFECT
   Only on larger screens.
========================================= */

if (window.innerWidth > 700) {

  window.addEventListener(
    "scroll",
    () => {

      const hero =
        document.querySelector(".hero");

      if (!hero) return;

      const scroll =
        window.scrollY;

      hero.style.transform =
        `translateY(${scroll * 0.08}px)`;

      hero.style.opacity =
        Math.max(
          0,
          1 - scroll / 700
        );

    },
    { passive: true }
  );

}


/* =========================================
   PAGE LOAD POLISH
========================================= */

window.addEventListener("load", () => {

  document.body.classList.add("loaded");

});