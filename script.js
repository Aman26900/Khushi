/* =========================================
   ELEMENTS
========================================= */

const openBtn =
  document.getElementById("openBtn");

const surprise =
  document.getElementById("surprise");

const hero =
  document.querySelector(".hero");

const heartsContainer =
  document.querySelector(".hearts");

const photoLightbox =
  document.getElementById("photoLightbox");

const lightboxImage =
  document.getElementById("lightboxImage");

const closePhoto =
  document.getElementById("closePhoto");

const countdownMessage =
  document.getElementById("countdownMessage");


/* =========================================
   OPEN SURPRISE + INTERACTIVE JOURNEY
========================================= */

const birthdayJourney =
  document.getElementById("birthdayJourney");

const journeyScreens =
  birthdayJourney
    ? birthdayJourney.querySelectorAll(".journey-screen")
    : [];

const birthdayAudio =
  document.getElementById("birthdayAudio");

let journeyStep = 1;
let balloonsStarted = false;

openBtn.addEventListener(
  "click",
  (event) => {

    createRipple(event);
    createCinematicFlash();

    openBtn.disabled = true;
    openBtn.textContent = "The surprise is opening... ❤️";

    createHeartBurst();

    setTimeout(() => {
      hero.classList.add("hero-fade");

      if (birthdayJourney) {
        birthdayJourney.classList.add("journey-visible");
        birthdayJourney.setAttribute("aria-hidden", "false");
        showJourneyStep(1);
      }
    }, 500);
  }
);


/* =========================================
   JOURNEY NAVIGATION
========================================= */

function showJourneyStep(step) {
  journeyStep = step;

  journeyScreens.forEach((screen) => {
    const isActive =
      Number(screen.dataset.step) === step;

    screen.classList.toggle("active", isActive);
  });

  if (step === 6) {
    const cakeScreen = document.querySelector(".cake-screen");

    if (cakeScreen) {
      cakeScreen.classList.add("candles-blown");
    }
  }

  if (step === 5 && !balloonsStarted) {
    balloonsStarted = true;
    startBalloonCelebration();
  }
}


document.addEventListener("click", (event) => {
  const nextButton = event.target.closest("[data-next]");

  if (!nextButton || !birthdayJourney) {
    return;
  }

  const nextStep = Number(nextButton.dataset.next);

  if (nextStep) {
    showJourneyStep(nextStep);
  }
});


/* =========================================
   LIGHTS
========================================= */

const lightsBtn =
  document.getElementById("lightsBtn");

if (lightsBtn) {
  lightsBtn.addEventListener("click", () => {

    /*
       Start the birthday music only when the user turns on
       the lights. This is intentionally NOT started by
       the initial "Open Your Surprise" button.
    */
    if (birthdayAudio) {
      birthdayAudio.volume = 0.18;
      birthdayAudio.currentTime = 0;

      birthdayAudio.play().catch((error) => {
        console.log("Audio could not start:", error);
      });
    }

    document.body.classList.add("lights-on");
    birthdayJourney.classList.add("celebration-lights-on");

    lightsBtn.disabled = true;
    lightsBtn.innerHTML = "The lights are on <span>✨</span>";

    setTimeout(() => {
      showJourneyStep(5);
    }, 1050);
  });
}


/* =========================================
   BALLOON CELEBRATION
========================================= */

function startBalloonCelebration() {
  const balloonStage = document.getElementById("balloonStage");
  const balloonMessage = document.getElementById("balloonMessage");
  const balloonHeading = document.getElementById("balloonHeading");

  if (!balloonStage) return;

  balloonStage.innerHTML = "";

  // The balloon sequence is the main visual. Keep the normal message hidden
  // while the four balloons are being popped one by one.
  if (balloonHeading) {
    balloonHeading.style.opacity = "0";
    balloonHeading.style.visibility = "hidden";
  }
  if (balloonMessage) {
    balloonMessage.style.opacity = "0";
    balloonMessage.style.visibility = "hidden";
  }

  // Remove any words left by a previous run.
  document.querySelectorAll(".balloon-word-pop").forEach((word) => word.remove());

  const balloonPositions = [
    { x: "16%", burstDelay: 2200 },
    { x: "38%", burstDelay: 3200 },
    { x: "62%", burstDelay: 4200 },
    { x: "84%", burstDelay: 5200 }
  ];

  const balloonWords = ["You", "are", "so", "special"];

  balloonPositions.forEach((item, index) => {
    const balloon = document.createElement("div");
    balloon.className = `celebration-balloon balloon-${index + 1}`;
    balloon.style.left = item.x;
    balloon.style.animationDelay = "0ms";

    balloon.innerHTML = `
      <div class="balloon-body">
        <span class="balloon-shine"></span>
      </div>
      <div class="balloon-knot"></div>
      <div class="balloon-string"></div>
    `;

    balloonStage.appendChild(balloon);

    // All four balloons first rise to their own positions. Then each one
    // bursts separately, and its own word replaces it at that exact spot.
    setTimeout(() => {
      const balloonBody = balloon.querySelector(".balloon-body");
      const bodyRect = balloonBody
        ? balloonBody.getBoundingClientRect()
        : balloon.getBoundingClientRect();

      // balloonStage is position:absolute, so its coordinates start at its
      // own top-left corner. Convert the balloon's viewport coordinates into
      // stage coordinates before placing the word.
      const stageRect = balloonStage.getBoundingClientRect();
      const centerX = bodyRect.left + bodyRect.width / 2 - stageRect.left;
      const centerY = bodyRect.top + bodyRect.height / 2 - stageRect.top;

      const burstWord = document.createElement("div");
      burstWord.className = "balloon-word-pop";
      burstWord.textContent = balloonWords[index];
      burstWord.style.left = `${centerX}px`;
      burstWord.style.top = `${centerY}px`;

      // Size the word from this balloon's real dimensions.
      // The longest word is automatically scaled down to stay inside it.
      const widthLimit = bodyRect.width * 0.72;
      const heightLimit = bodyRect.height * 0.34;
      const characterFactor = balloonWords[index].length * 0.52;
      const calculatedSize = Math.min(
        heightLimit,
        widthLimit / Math.max(1, characterFactor)
      );

      const fontMultiplier = index === 3 ? 1.85 : 1;
      burstWord.style.fontSize = `${Math.max(14, calculatedSize * fontMultiplier)}px`;
      burstWord.style.width = `${Math.max(30, bodyRect.width * 0.86)}px`;
      burstWord.style.maxWidth = `${Math.max(30, bodyRect.width * 0.86)}px`;

      balloonStage.appendChild(burstWord);

      // FIRST the balloon bursts. ONLY after the burst animation finishes
      // does its own word become visible in the exact same position.
      balloon.classList.add("balloon-bursting");
      createBalloonBurst(balloon);

      setTimeout(() => {
        burstWord.classList.add("balloon-word-pop-visible");
      }, 500);
    }, item.burstDelay);
  });

  // After the fourth balloon has burst, show only the Next button.
  setTimeout(() => {
    createConfettiBurst();

    const nextBtn = document.getElementById("balloonNextBtn");
    if (nextBtn) {
      nextBtn.classList.remove("hidden-control");
      nextBtn.onclick = () => showJourneyStep(6);
    }
  }, 6100);
}


function createBalloonBurst(balloon) {
  const rect = balloon.getBoundingClientRect();
  const originX = rect.left + rect.width / 2;
  const originY = rect.top + rect.height / 2;

  const symbols = ["✦", "✧", "•", "♡", "⋆"];

  for (let i = 0; i < 18; i++) {
    const particle = document.createElement("span");

    particle.className = "balloon-burst-particle";
    particle.textContent =
      symbols[Math.floor(Math.random() * symbols.length)];

    particle.style.left = `${originX}px`;
    particle.style.top = `${originY}px`;

    const angle = Math.random() * Math.PI * 2;
    const distance = 45 + Math.random() * 95;

    particle.style.setProperty("--burst-x", `${Math.cos(angle) * distance}px`);
    particle.style.setProperty("--burst-y", `${Math.sin(angle) * distance}px`);

    document.body.appendChild(particle);

    setTimeout(() => particle.remove(), 900);
  }
}


function createConfettiBurst(targetId = "balloonConfetti") {
  const container =
    document.getElementById(targetId);

  if (!container) {
    return;
  }

  container.innerHTML = "";

  for (let i = 0; i < 55; i++) {
    const piece = document.createElement("span");

    piece.className = "confetti-piece";
    piece.style.left = `${45 + Math.random() * 10}%`;
    piece.style.top = `${35 + Math.random() * 10}%`;
    piece.style.setProperty("--confetti-x", `${(Math.random() - .5) * 85}vw`);
    piece.style.setProperty("--confetti-y", `${45 + Math.random() * 48}vh`);
    piece.style.setProperty("--confetti-rotate", `${Math.random() * 720 - 360}deg`);
    piece.style.animationDelay = `${Math.random() * .35}s`;

    container.appendChild(piece);
  }

  setTimeout(() => {
    container.innerHTML = "";
  }, 2500);
}


/* =========================================
   CAKE CUTTING
========================================= */

const cutCakeBtn =
  document.getElementById("cutCakeBtn");

const specialMessageBtn =
  document.getElementById("specialMessageBtn");

const cakeScreen =
  document.querySelector('.cake-screen');

const cakeMessage =
  document.getElementById("cakeMessage");

if (cutCakeBtn) {
  cutCakeBtn.addEventListener("click", () => {

    cakeScreen.classList.add("cake-cut");
    cutCakeBtn.disabled = true;
    cutCakeBtn.classList.add("button-clicked-hide");

    if (cakeMessage) {
      cakeMessage.textContent =
        "A little sweetness for your special day. ❤️";
    }

    createConfettiBurst("cakeConfetti");

    setTimeout(() => {
      if (specialMessageBtn) {
        specialMessageBtn.classList.remove("hidden-control");
      }
    }, 900);
  });
}


/* =========================================
   ENTER EXISTING WEBSITE
========================================= */

if (specialMessageBtn) {
  specialMessageBtn.addEventListener("click", () => {

    birthdayJourney.classList.add("journey-exit");

    setTimeout(() => {
      birthdayJourney.classList.remove("journey-visible");
      birthdayJourney.setAttribute("aria-hidden", "true");

      surprise.classList.remove("hidden");

      openBtn.textContent =
        "The surprise is open ❤️";

      revealSections();
      revealPhotos();

      setTimeout(() => {
        surprise.scrollIntoView({
          behavior: "smooth",
          block: "start"
        });
      }, 120);

      birthdayJourney.classList.remove("journey-exit");
    }, 850);
  });
}


/* =========================================
   REVEAL MAIN SECTIONS
========================================= */

function revealSections() {

  const cards =
    surprise.querySelectorAll(
      ".card, .final-card"
    );


  cards.forEach(
    (card, index) => {

      setTimeout(
        () => {

          card.classList.add(
            "reveal"
          );

        },
        650 +
        index * 520
      );

    }
  );

}


/* =========================================
   REVEAL PHOTOS
========================================= */

function revealPhotos() {

  const photos =
    document.querySelectorAll(
      ".photo-placeholder"
    );


  photos.forEach(
    (photo, index) => {

      setTimeout(
        () => {

          photo.classList.add(
            "photo-reveal"
          );

        },
        2500 +
        index * 420
      );

    }
  );

}


/* =========================================
   CINEMATIC FLASH
========================================= */

function createCinematicFlash() {

  const flash =
    document.createElement(
      "div"
    );


  flash.className =
    "cinematic-flash";


  document.body.appendChild(
    flash
  );


  setTimeout(
    () => {

      flash.remove();

    },
    1300
  );

}


/* =========================================
   BUTTON RIPPLE
========================================= */

function createRipple(event) {

  const ripple =
    document.createElement(
      "span"
    );


  ripple.style.position =
    "absolute";

  ripple.style.width =
    "10px";

  ripple.style.height =
    "10px";

  ripple.style.borderRadius =
    "50%";

  ripple.style.background =
    "rgba(255,255,255,.38)";

  ripple.style.transform =
    "translate(-50%, -50%)";

  ripple.style.left =
    event.offsetX + "px";

  ripple.style.top =
    event.offsetY + "px";

  ripple.style.pointerEvents =
    "none";

  ripple.style.animation =
    "rippleEffect .8s ease-out forwards";


  openBtn.appendChild(
    ripple
  );


  setTimeout(
    () => {

      ripple.remove();

    },
    800
  );

}


/* =========================================
   PARTICLES
========================================= */

function createHeart() {

  if (!heartsContainer) {
    return;
  }


  const particle =
    document.createElement(
      "div"
    );


  particle.className =
    "heart";


  const symbols = [
    "♡",
    "✦",
    "✧",
    "⋆",
    "♥"
  ];


  particle.textContent =
    symbols[
      Math.floor(
        Math.random() *
        symbols.length
      )
    ];


  particle.style.left =
    Math.random() *
      100 +
    "vw";


  particle.style.fontSize =
    10 +
    Math.random() *
      22 +
    "px";


  particle.style.animationDuration =
    7 +
    Math.random() *
      5 +
    "s";


  particle.style.opacity =
    .15 +
    Math.random() *
      .38;


  heartsContainer.appendChild(
    particle
  );


  setTimeout(
    () => {

      particle.remove();

    },
    13000
  );

}


/*
   Very small number initially.
*/

for (
  let i = 0;
  i < 8;
  i++
) {

  setTimeout(
    createHeart,
    i * 500
  );

}


/*
   Slow background particles.
*/

setInterval(
  createHeart,
  1700
);


/* =========================================
   HEART BURST
========================================= */

function createHeartBurst() {

  for (
    let i = 0;
    i < 35;
    i++
  ) {

    setTimeout(
      createHeart,
      i * 60
    );

  }

}


/* =========================================
   COUNTDOWN
========================================= */

function updateCountdown() {

  const now =
    new Date();


  const currentMonth =
    now.getMonth();


  const currentDay =
    now.getDate();


  /*
     September 22 = birthday.

     On September 22, the countdown
     remains at zero for the entire day
     instead of immediately starting
     next year's countdown.
  */

  if (
    currentMonth === 8 &&
    currentDay === 22
  ) {

    document.getElementById(
      "days"
    ).textContent =
      "00";


    document.getElementById(
      "hours"
    ).textContent =
      "00";


    document.getElementById(
      "minutes"
    ).textContent =
      "00";


    document.getElementById(
      "seconds"
    ).textContent =
      "00";


    if (countdownMessage) {

      countdownMessage.textContent =
        "Today is your special day. Happy Birthday, Khushi! ❤️";

    }


    return;

  }


  let year =
    now.getFullYear();


  /*
     September = month 8
  */

  let birthday =
    new Date(
      year,
      8,
      22,
      0,
      0,
      0
    );


  /*
     After September 22,
     count toward next year's birthday.
  */

  if (
    now >= birthday
  ) {

    birthday =
      new Date(
        year + 1,
        8,
        22,
        0,
        0,
        0
      );

  }


  const difference =
    birthday - now;


  const days =
    Math.floor(
      difference /
      86400000
    );


  const hours =
    Math.floor(
      difference /
      3600000
    ) % 24;


  const minutes =
    Math.floor(
      difference /
      60000
    ) % 60;


  const seconds =
    Math.floor(
      difference /
      1000
    ) % 60;


  document.getElementById(
    "days"
  ).textContent =
    days;


  document.getElementById(
    "hours"
  ).textContent =
    String(hours)
      .padStart(
        2,
        "0"
      );


  document.getElementById(
    "minutes"
  ).textContent =
    String(minutes)
      .padStart(
        2,
        "0"
      );


  document.getElementById(
    "seconds"
  ).textContent =
    String(seconds)
      .padStart(
        2,
        "0"
      );


  if (countdownMessage) {

    countdownMessage.textContent =
      "Counting down to your birthday ✨";

  }

}


updateCountdown();


setInterval(
  updateCountdown,
  1000
);


/* =========================================
   LIGHTBOX
========================================= */

const photos =
  document.querySelectorAll(
    ".photo-placeholder img"
  );


photos.forEach(
  (photo) => {

    photo.addEventListener(
      "click",
      (event) => {

        event.stopPropagation();


        lightboxImage.src =
          photo.src;


        lightboxImage.alt =
          photo.alt;


        /*
           IMPORTANT:
           Remove the HTML hidden attribute
           when opening the lightbox.
        */

        photoLightbox.hidden =
          false;


        photoLightbox.classList.add(
          "active"
        );


        photoLightbox.setAttribute(
          "aria-hidden",
          "false"
        );


        document.body.style.overflow =
          "hidden";

      }
    );

  }
);


/* =========================================
   CLOSE LIGHTBOX
========================================= */

function closeLightbox() {

  photoLightbox.classList.remove(
    "active"
  );


  photoLightbox.setAttribute(
    "aria-hidden",
    "true"
  );


  lightboxImage.src =
    "";


  /*
     IMPORTANT:
     Hide it again after closing.
     This prevents "Expanded memory"
     from appearing on the page.
  */

  photoLightbox.hidden =
    true;


  document.body.style.overflow =
    "";

}


closePhoto.addEventListener(
  "click",
  closeLightbox
);


/* =========================================
   CLICK OUTSIDE IMAGE
========================================= */

photoLightbox.addEventListener(
  "click",
  (event) => {

    if (
      event.target ===
      photoLightbox
    ) {

      closeLightbox();

    }

  }
);


/* =========================================
   ESC KEY
========================================= */

document.addEventListener(
  "keydown",
  (event) => {

    if (
      event.key ===
      "Escape"
    ) {

      if (
        photoLightbox.classList.contains(
          "active"
        )
      ) {

        closeLightbox();

      }

    }

  }
);


/* =========================================
   SCROLL REVEAL
========================================= */

const revealObserver =
  new IntersectionObserver(
    (entries) => {

      entries.forEach(
        (entry) => {

          if (
            entry.isIntersecting
          ) {

            entry.target.classList.add(
              "reveal"
            );

            revealObserver.unobserve(
              entry.target
            );

          }

        }
      );

    },
    {
      threshold:
        0.12
    }
  );


document
  .querySelectorAll(
    ".card, .final-card"
  )
  .forEach(
    (card) => {

      revealObserver.observe(
        card
      );

    }
  );


/* =========================================
   DESKTOP HERO PARALLAX
========================================= */

if (
  window.innerWidth >
  700
) {

  window.addEventListener(
    "scroll",
    () => {

      /*
         Don't interfere once
         the hero has faded out.
      */

      if (
        hero.classList.contains(
          "hero-fade"
        )
      ) {

        return;

      }


      const scroll =
        window.scrollY;


      if (
        scroll <
        window.innerHeight
      ) {

        hero.style.transform =
          `translateY(${scroll * .06}px)`;

      }

    },
    {
      passive:
        true
    }
  );

}