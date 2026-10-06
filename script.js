document.addEventListener('DOMContentLoaded', () => {

  /* =========================================
     PASSWORD
     ========================================= */

  const PASSWORD = 'my princess marina';


  /* =========================================
     YOUR DATES
     
     Started talking:
     April 28, 2026

     First met:
     June 13, 2026
     ========================================= */

  const TALKED_DATE = new Date(2026, 3, 28);
  const MET_DATE = new Date(2026, 5, 13);


  /* =========================================
     SHORTCUT
     ========================================= */

  const $ = (id) => document.getElementById(id);

  const show = (element) => {
    if (element) {
      element.classList.add('active');
    }
  };

  const hide = (element) => {
    if (element) {
      element.classList.remove('active');
    }
  };


  /* =========================================
     SCREENS
     ========================================= */

  const welcome = $('welcome');
  const lock = $('lock');
  const unlocked = $('unlocked');
  const main = $('main');


  /* =========================================
     PASSWORD ELEMENTS
     ========================================= */

  const enterBtn = $('enterBtn');
  const pwForm = $('pwForm');
  const pwInput = $('pwInput');
  const pwMsg = $('pwMsg');
  const pwToggle = $('pwToggle');
  const hintBtn = $('hintBtn');
  const hintText = $('hintText');


  /* =========================================
     MAIN BUTTONS
     ========================================= */

  const openBtn = $('openBtn');
  const musicBtn = $('musicBtn');
  const bgm = $('bgm');


  /* =========================================
     ROMANTIC MUSIC
     
     You DON'T need music.mp3.

     This creates a soft romantic
     piano-style melody directly
     in the browser.
     ========================================= */

  let audioCtx = null;
  let masterGain = null;
  let musicTimer = null;
  let musicPlaying = false;

  function startRomanticMusic() {

    if (musicPlaying) {
      return;
    }

    try {

      audioCtx =
        audioCtx ||
        new (window.AudioContext ||
          window.webkitAudioContext)();

      if (audioCtx.state === 'suspended') {
        audioCtx.resume();
      }

      masterGain = audioCtx.createGain();

      masterGain.gain.value = 0.035;

      masterGain.connect(audioCtx.destination);


      const melody = [

        [261.63, 0.55],
        [329.63, 0.55],
        [392.00, 0.80],
        [329.63, 0.55],

        [293.66, 0.55],
        [349.23, 0.55],
        [440.00, 0.80],
        [349.23, 0.55],

        [261.63, 0.55],
        [329.63, 0.55],
        [392.00, 0.80],
        [523.25, 0.90],

        [493.88, 0.55],
        [440.00, 0.55],
        [392.00, 0.80],
        [329.63, 1.00]

      ];


      let index = 0;


      function playNote() {

        if (!musicPlaying) {
          return;
        }

        if (!audioCtx || !masterGain) {
          return;
        }


        const note =
          melody[index % melody.length];

        const frequency = note[0];
        const duration = note[1];

        const now =
          audioCtx.currentTime;


        const oscillator =
          audioCtx.createOscillator();

        const gain =
          audioCtx.createGain();


        oscillator.type = 'sine';

        oscillator.frequency.value =
          frequency;


        gain.gain.setValueAtTime(
          0.0001,
          now
        );

        gain.gain.exponentialRampToValueAtTime(
          0.18,
          now + 0.035
        );

        gain.gain.exponentialRampToValueAtTime(
          0.0001,
          now + duration
        );


        oscillator.connect(gain);

        gain.connect(masterGain);


        oscillator.start(now);

        oscillator.stop(
          now + duration + 0.03
        );


        index++;


        musicTimer = setTimeout(
          playNote,
          duration * 1000
        );
      }


      musicPlaying = true;

      playNote();


      if (musicBtn) {
        musicBtn.textContent =
          '🎵 Music On';
      }

    } catch (error) {

      showToast(
        'Tap the music button once to start the music ❤️'
      );

    }
  }


  function stopRomanticMusic() {

    musicPlaying = false;

    clearTimeout(musicTimer);

    musicTimer = null;


    if (masterGain && audioCtx) {

      masterGain.gain.cancelScheduledValues(
        audioCtx.currentTime
      );

      masterGain.gain.setTargetAtTime(
        0.0001,
        audioCtx.currentTime,
        0.05
      );
    }


    if (musicBtn) {
      musicBtn.textContent =
        '🎵 Music Off';
    }
  }


  /*
    The original index.html contains:

    <audio id="bgm">
      <source src="music.mp3">
    </audio>

    We don't need music.mp3 because we're
    generating the music above.
  */

  if (bgm) {
    bgm.removeAttribute('src');
  }


  /* =========================================
     HEART EXPLOSION
     ========================================= */

  function burstHearts(x, y, amount = 16) {

    for (let i = 0; i < amount; i++) {

      const heart =
        document.createElement('span');

      heart.className =
        'burst-heart';


      heart.textContent =
        [
          '❤️',
          '💗',
          '💖',
          '💕',
          '✨'
        ][
          Math.floor(
            Math.random() * 5
          )
        ];


      heart.style.left =
        `${x}px`;

      heart.style.top =
        `${y}px`;


      heart.style.setProperty(
        '--dx',
        `${(Math.random() - 0.5) * 260}px`
      );

      heart.style.setProperty(
        '--dy',
        `${(Math.random() - 0.75) * 260}px`
      );

      heart.style.setProperty(
        '--rot',
        `${(Math.random() - 0.5) * 90}deg`
      );


      document.body.appendChild(
        heart
      );


      setTimeout(() => {
        heart.remove();
      }, 1200);
    }
  }


  /* =========================================
     TOAST MESSAGE
     ========================================= */

  function showToast(message) {

    let toast = $('toast');


    if (!toast) {

      toast =
        document.createElement('div');

      toast.id = 'toast';

      toast.className = 'toast';

      document.body.appendChild(
        toast
      );
    }


    toast.textContent = message;

    toast.classList.add('show');


    clearTimeout(
      showToast.timer
    );


    showToast.timer =
      setTimeout(() => {

        toast.classList.remove(
          'show'
        );

      }, 2600);
  }


  /* =========================================
     ENTER PASSWORD SCREEN
     ========================================= */

  function goToLock() {

    hide(welcome);

    show(lock);


    setTimeout(() => {

      if (pwInput) {
        pwInput.focus();
      }

    }, 250);
  }


  if (enterBtn) {

    enterBtn.addEventListener(
      'click',
      goToLock
    );
  }


  /* =========================================
     SHOW / HIDE PASSWORD
     ========================================= */

  if (pwToggle && pwInput) {

    pwToggle.addEventListener(
      'click',
      () => {

        const hidden =
          pwInput.type === 'password';


        pwInput.type =
          hidden
            ? 'text'
            : 'password';


        pwToggle.textContent =
          hidden
            ? 'Hide'
            : 'Show';
      }
    );
  }


  /* =========================================
     PASSWORD HINT
     ========================================= */

  if (hintBtn && hintText) {

    hintBtn.addEventListener(
      'click',
      () => {

        hintText.classList.toggle(
          'hidden'
        );


        if (
          hintText.classList.contains(
            'hidden'
          )
        ) {

          hintBtn.textContent =
            'Need a hint? 🤍';

        } else {

          hintBtn.textContent =
            'Hide hint';
        }
      }
    );
  }


  /* =========================================
     UNLOCK
     ========================================= */

  function unlock() {

    hide(lock);

    show(unlocked);


    burstHearts(
      window.innerWidth / 2,
      window.innerHeight / 2,
      24
    );
  }


  /* =========================================
     PASSWORD FORM
     ========================================= */

  if (pwForm) {

    pwForm.addEventListener(
      'submit',
      (event) => {

        event.preventDefault();


        const value =
          (pwInput?.value || '')
            .trim()
            .toLowerCase();


        if (value === PASSWORD) {

          if (pwMsg) {

            pwMsg.textContent =
              'Correct password ❤️';

            pwMsg.style.color =
              '#e83e73';
          }


          unlock();

        } else {

          if (pwMsg) {

            pwMsg.textContent =
              'Hmm… only my princess knows this one ❤️';
          }


          if (pwInput) {

            pwInput.value = '';

            pwInput.focus();
          }


          burstHearts(
            window.innerWidth / 2,
            window.innerHeight / 2,
            5
          );
        }
      }
    );
  }


  /* =========================================
     OPEN THE MAIN WEBSITE
     ========================================= */

  if (openBtn) {

    openBtn.addEventListener(
      'click',
      () => {

        hide(unlocked);

        show(main);


        if (musicBtn) {

          musicBtn.classList.remove(
            'hidden'
          );
        }


        /*
          Because this happens after
          a user click, mobile browsers
          allow the music to start.
        */

        startRomanticMusic();


        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });


        burstHearts(
          window.innerWidth / 2,
          120,
          35
        );


        setTimeout(() => {

          document
            .querySelectorAll(
              '.reveal,.reveal-line'
            )
            .forEach(element => {

              if (
                element.getBoundingClientRect()
                  .top <
                window.innerHeight * 0.9
              ) {

                element.classList.add(
                  'visible'
                );
              }
            });

        }, 250);
      }
    );
  }


  /* =========================================
     MUSIC BUTTON
     ========================================= */

  if (musicBtn) {

    musicBtn.addEventListener(
      'click',
      () => {

        if (musicPlaying) {

          stopRomanticMusic();

        } else {

          startRomanticMusic();
        }
      }
    );
  }


  /* =========================================
     SCROLL REVEAL
     ========================================= */

  const revealObserver =
    new IntersectionObserver(
      (entries) => {

        entries.forEach(entry => {

          if (entry.isIntersecting) {

            entry.target.classList.add(
              'visible'
            );
          }
        });

      },
      {
        threshold: 0.12
      }
    );


  document
    .querySelectorAll(
      '.reveal,.reveal-line'
    )
    .forEach(element => {

      revealObserver.observe(
        element
      );
    });


  /* =========================================
     DAYS SINCE RELATIONSHIP EVENTS
     ========================================= */

  function daysSince(date) {

    const now =
      new Date();


    return Math.max(
      0,
      Math.floor(
        (now - date) /
        86400000
      )
    );
  }


  const countTalk =
    $('countTalk');

  const countMet =
    $('countMet');


  if (countTalk) {

    countTalk.textContent =
      `${daysSince(TALKED_DATE).toLocaleString()} days of us ❤️`;
  }


  if (countMet) {

    countMet.textContent =
      `${daysSince(MET_DATE).toLocaleString()} days since I first met you ❤️`;
  }


  /* =========================================
     REASONS WHY I LOVE YOU
     ========================================= */

  const reasons =
    [
      ...document.querySelectorAll(
        '.reason'
      )
    ];


  const reasonCount =
    $('reasonCount');

  const reasonDone =
    $('reasonDone');


  if (reasonCount) {

    reasonCount.textContent =
      `0 / ${reasons.length} reasons discovered ❤️`;
  }


  reasons.forEach(
    (card) => {

      card.addEventListener(
        'click',
        () => {

          card.classList.add(
            'discovered'
          );


          const discovered =
            document.querySelectorAll(
              '.reason.discovered'
            ).length;


          if (reasonCount) {

            reasonCount.textContent =
              `${discovered} / ${reasons.length} reasons discovered ❤️`;
          }


          if (
            discovered === reasons.length &&
            reasonDone
          ) {

            reasonDone.classList.remove(
              'hidden'
            );


            reasonDone.textContent =
              'And honestly… I could keep going forever. ❤️';
          }


          burstHearts(
            card.getBoundingClientRect()
              .left +
            card.offsetWidth / 2,

            card.getBoundingClientRect()
              .top +
            card.offsetHeight / 2,

            7
          );
        }
      );
    }
  );


  /* =========================================
     LOVE LETTER ENVELOPE
     ========================================= */

  const envelope =
    $('envelope');


  if (envelope) {

    envelope.addEventListener(
      'click',
      () => {

        const opened =
          envelope.classList.toggle(
            'open'
          );


        if (opened) {

          burstHearts(
            envelope.getBoundingClientRect()
              .left +
            envelope.offsetWidth / 2,

            envelope.getBoundingClientRect()
              .top +
            envelope.offsetHeight / 2,

            12
          );
        }
      }
    );
  }


  /* =========================================
     SECRET CARDS
     ========================================= */

  const secrets =
    [
      ...document.querySelectorAll(
        '.secret'
      )
    ];


  const secretCount =
    $('secretCount');


  secrets.forEach(
    (secret) => {

      secret.addEventListener(
        'click',
        () => {

          secret.classList.toggle(
            'revealed'
          );


          const opened =
            document.querySelectorAll(
              '.secret.revealed'
            ).length;


          if (secretCount) {

            secretCount.textContent =
              `${opened} / ${secrets.length} little secrets opened 💗`;
          }


          burstHearts(
            secret.getBoundingClientRect()
              .left +
            secret.offsetWidth / 2,

            secret.getBoundingClientRect()
              .top +
            secret.offsetHeight / 2,

            5
          );
        }
      );
    }
  );


  /* =========================================
     CLICK ME SURPRISE
     ========================================= */

  const clickMe =
    $('clickMe');

  const bubble =
    $('bubble');


  if (clickMe && bubble) {

    clickMe.addEventListener(
      'click',
      (event) => {

        bubble.classList.toggle(
          'show'
        );


        burstHearts(
          event.clientX,
          event.clientY,
          18
        );
      }
    );
  }


  /* =========================================
     FLOWER GARDEN
     ========================================= */

  const garden =
    $('garden');


  if (garden) {

    garden.addEventListener(
      'click',
      (event) => {

        const flower =
          document.createElement(
            'span'
          );


        flower.className =
          'garden-flower';


        flower.textContent =
          [
            '🌷',
            '🌸',
            '🌹',
            '🌺',
            '💐',
            '🌼'
          ][
            Math.floor(
              Math.random() * 6
            )
          ];


        const rect =
          garden.getBoundingClientRect();


        flower.style.left =
          `${event.clientX - rect.left - 16}px`;


        flower.style.top =
          `${event.clientY - rect.top - 16}px`;


        garden.appendChild(
          flower
        );


        const prompt =
          garden.querySelector(
            '.garden-prompt'
          );


        if (prompt) {
          prompt.style.opacity =
            '.25';
        }
      }
    );
  }


  /* =========================================
     RANDOM HEARTS WHEN CLICKING
     ========================================= */

  document.addEventListener(
    'click',
    (event) => {

      if (
        event.target.closest(
          'button,input,a,.envelope,.secret,.garden'
        ) ||
        event.target.classList.contains(
          'garden-flower'
        )
      ) {

        return;
      }


      if (Math.random() < 0.35) {

        burstHearts(
          event.clientX,
          event.clientY,
          3
        );
      }
    }
  );


  /* =========================================
     BACK TO TOP
     ========================================= */

  const topBtn =
    $('topBtn');


  if (topBtn) {

    topBtn.addEventListener(
      'click',
      () => {

        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      }
    );
  }


  /* =========================================
     START WITH WELCOME SCREEN
     ========================================= */

  hide(lock);
  hide(unlocked);
  hide(main);

  show(welcome);

});