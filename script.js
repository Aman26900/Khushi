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
   OPEN SURPRISE
========================================= */

openBtn.addEventListener(
  "click",
  (event) => {

    // Start birthday music
    const birthdayAudio =
      document.getElementById("birthdayAudio");

    if (birthdayAudio) {
      birthdayAudio.volume = 0.18;
      birthdayAudio.currentTime = 0;

      birthdayAudio.play().catch((error) => {
        console.log("Audio could not start:", error);
      });
    }

    createRipple(event);

    createCinematicFlash();

    openBtn.disabled =
      true;

    createHeartBurst();


    setTimeout(
      () => {

        surprise.classList.remove(
          "hidden"
        );


        hero.classList.add(
          "hero-fade"
        );


        openBtn.textContent =
          "The surprise is open ❤️";


        revealSections();

        revealPhotos();


        setTimeout(
          () => {

            surprise.scrollIntoView({
              behavior:
                "smooth",

              block:
                "start"
            });

          },
          180
        );

      },
      500
    );

  }
);


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