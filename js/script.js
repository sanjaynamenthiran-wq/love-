(() => {
  "use strict";

  const $ = (id) => document.getElementById(id);
  const settings = window.CONFIG || {};

  const loverName = String(settings.loverName || "Kuttachi");
  const secretDOB = String(settings.secretDOB || "01012000")
    .replace(/\D/g, "");
  const relationshipStart = settings.relationshipStart || "2025-01-01";
  const photos = Array.isArray(settings.photos) ? settings.photos : [];
  const musicPath = settings.music || "";

  let currentScreen = 0;
  let musicStarted = false;
  let noClicks = 0;

  const captions = [
    "Namma first memory 💗",
    "Un smile en favourite 😊",
    "Namma happy moments 💕",
    "Un kooda irukkura neram ✨",
    "En favourite person 🫶",
    "Namma memories forever 💖",
    "Innum neraya memories create pannuvom 💝"
  ];

  const reasons = [
    "Un smile enna happy aakkum 😊",
    "Nee enna purinjukkuva 💗",
    "Un kooda pesurathu pudikkum 💬",
    "Un care romba special 🫶",
    "Un presence enakku happiness 🌸",
    "Un kooda memories create panna pudikkum 📸",
    "Nee nee-ah irukkurathu pudikkum 💕",
    "En life-la nee special 💖"
  ];

  function showScreen(number) {
    const target = $("s" + number);
    if (!target) return;

    document.querySelectorAll(".screen").forEach((screen) => {
      screen.classList.remove("on");
    });

    target.classList.add("on");
    currentScreen = number;
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function setText(id, value) {
    const element = $(id);
    if (element) element.textContent = value;
  }

  function startMusic() {
    const audio = $("au");
    if (!audio || !musicPath) return;

    if (!audio.src || !musicStarted) {
      audio.src = musicPath;
    }

    audio.play()
      .then(() => {
        musicStarted = true;
        setText("music", "♫");
      })
      .catch(() => {
        setText("music", "♫");
      });
  }

  function toggleMusic() {
    const audio = $("au");
    if (!audio) return;

    if (audio.paused) {
      startMusic();
    } else {
      audio.pause();
      setText("music", "♪");
    }
  }

  function validDate(value) {
    if (!/^\d{8}$/.test(value)) return false;

    const day = Number(value.slice(0, 2));
    const month = Number(value.slice(2, 4));
    const year = Number(value.slice(4, 8));
    const date = new Date(year, month - 1, day);

    return date.getFullYear() === year &&
      date.getMonth() === month - 1 &&
      date.getDate() === day;
  }

  function unlock() {
    const enteredName = ($("nm")?.value || "").trim();
    const enteredDOB = ($("db")?.value || "").replace(/\D/g, "");
    const error = $("err");

    if (enteredName.toLowerCase() !== loverName.toLowerCase()) {
      if (error) error.textContent = "Name correct-ah enter pannu 💗";
      return;
    }

    if (!validDate(enteredDOB)) {
      if (error) error.textContent = "DOB DDMMYYYY format-la enter pannu 🎂";
      return;
    }

    if (enteredDOB !== secretDOB) {
      if (error) error.textContent = "DOB match aagala. Marubadi try pannu 💕";
      return;
    }

    if (error) error.textContent = "";

    setText("lkn", loverName + " 💗");
    showScreen(2);
    startMusic();
  }

  function openLetter() {
    setText("lt", "En " + loverName + "-ku 💌");

    const letter = [
      "En chellame,",
      "",
      "Unna en life-la meet pannadhu enakku romba special.",
      "Un smile, un care, un kooda pesura moments ellame enakku precious.",
      "",
      "Namma rendu perukkum happy moments mattum illaama, kashtamaana days-um varalaam. Aana orutharukku oruthar support panni, nalla memories create pannuvom.",
      "",
      "Un happiness enakku mukkiyam. Eppavum unmaiyaana anbum respect-um oda un kooda irukkanum-nu aasai.",
      "",
      "With lots of love,",
      "Un special person 💗"
    ].join("\n");

    setText("lp", letter);
    setText("ls", "Always smile, " + loverName + " 💕");
    showScreen(3);
  }

  function formatDuration() {
    const start = new Date(relationshipStart + "T00:00:00");
    const now = new Date();

    if (Number.isNaN(start.getTime()) || start > now) {
      return null;
    }

    const totalSeconds = Math.floor((now - start) / 1000);
    const totalDays = Math.floor(totalSeconds / 86400);

    return {
      days: totalDays,
      hours: Math.floor((totalSeconds % 86400) / 3600),
      minutes: Math.floor((totalSeconds % 3600) / 60),
      seconds: totalSeconds % 60
    };
  }

  function updateCounter() {
    const container = $("cd");
    if (!container) return;

    const duration = formatDuration();

    if (!duration) {
      container.textContent = "Namma special date-ai config.js-la check pannu 💗";
      return;
    }

    const units = [
      ["Days", duration.days],
      ["Hours", duration.hours],
      ["Minutes", duration.minutes],
      ["Seconds", duration.seconds]
    ];

    container.replaceChildren();

    units.forEach(([label, value]) => {
      const box = document.createElement("div");
      box.className = "timebox";

      const strong = document.createElement("strong");
      strong.textContent = String(value);

      const span = document.createElement("span");
      span.textContent = label;

      box.append(strong, span);
      container.appendChild(box);
    });
  }

  function showMemories() {
    const strip = $("strip");
    if (!strip) return;

    strip.replaceChildren();

    photos.forEach((path, index) => {
      const wrapper = document.createElement("div");
      wrapper.className = "pol";

      const img = document.createElement("img");
      img.src = path;
      img.alt = captions[index] || "Namma memory";
      img.loading = "lazy";
      img.addEventListener("click", () => {
        openLightbox(path, captions[index] || "Namma memory", "");
      });

      img.addEventListener("error", () => {
        img.alt = "Photo load aagala: " + path;
      });

      const caption = document.createElement("b");
      caption.className = "sc";
      caption.textContent = captions[index] || "Our memory 💗";

      wrapper.append(img, caption);
      strip.appendChild(wrapper);
    });

    updateCounter();
    showScreen(4);
  }

  function showReasons() {
    const container = $("rs");
    if (!container) return;

    container.replaceChildren();

    reasons.forEach((reason, index) => {
      const card = document.createElement("div");
      card.className = "reason";
      card.tabIndex = 0;
      card.setAttribute("role", "button");
      card.setAttribute("aria-label", "Reason " + (index + 1));

      const heart = document.createElement("div");
      heart.className = "heart";
      heart.textContent = "💝";

      const text = document.createElement("p");
      text.className = "reason-text";
      text.textContent = reason;

      const reveal = () => card.classList.toggle("revealed");

      card.addEventListener("click", reveal);
      card.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          reveal();
        }
      });

      card.append(heart, text);
      container.appendChild(card);
    });

    setText("rt", "Unna pudikka " + reasons.length + " reasons 💕");
    showScreen(5);
  }

  function openLightbox(path, title, description) {
    const lightbox = $("lb");
    const imageContainer = $("lbi");

    if (!lightbox || !imageContainer) return;

    imageContainer.replaceChildren();

    const img = document.createElement("img");
    img.src = path;
    img.alt = title;

    imageContainer.appendChild(img);
    setText("lbt", title);
    setText("lbl", description);

    lightbox.classList.add("show");
    lightbox.setAttribute("aria-hidden", "false");
  }

  function closeLightbox() {
    const lightbox = $("lb");
    if (!lightbox) return;

    lightbox.classList.remove("show");
    lightbox.setAttribute("aria-hidden", "true");
  }

  function showFinal() {
    const answer = $("ans");
    const final = $("fin");

    if (answer) answer.style.display = "none";
    if (final) final.style.display = "block";

    setText("ft", "Yay! Love you, " + loverName + " 💗");

    const photoContainer = $("fp");
    if (photoContainer) {
      photoContainer.replaceChildren();

      if (photos.length > 0) {
        const img = document.createElement("img");
        img.src = photos[0];
        img.alt = "Our special memory";
        photoContainer.appendChild(img);
      }

      const message = document.createElement("p");
      message.textContent =
        "Namma bond eppavum love, trust, respect-oda irukkattum 💕";

      photoContainer.appendChild(message);
    }

    burstHearts();
  }

  function burstHearts() {
    const canvas = $("fx");
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = Array.from({ length: 45 }, () => ({
      x: Math.random() * canvas.width,
      y: -Math.random() * canvas.height,
      speed: 1 + Math.random() * 3,
      size: 10 + Math.random() * 12,
      symbol: Math.random() > 0.5 ? "💗" : "💕"
    }));

    let frames = 0;

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((particle) => {
        ctx.font = particle.size + "px sans-serif";
        ctx.fillText(particle.symbol, particle.x, particle.y);
        particle.y += particle.speed;
      });

      frames += 1;

      if (frames < 180) {
        requestAnimationFrame(animate);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }

    animate();
  }

  function resetWebsite() {
    if ($("ans")) $("ans").style.display = "flex";
    if ($("fin")) $("fin").style.display = "none";
    if ($("nm")) $("nm").value = "";
    if ($("db")) $("db").value = "";
    if ($("err")) $("err").textContent = "";

    noClicks = 0;
    showScreen(0);
  }

  function init() {
    setText("g1", "Just for You, " + loverName + " 💗");
    setText("g2", "Unakkaga oru chinna surprise...");
    setText("q", "En kooda indha beautiful journey-la iruppiya, " + loverName + "? 💍");

    $("open")?.addEventListener("click", () => showScreen(1));
    $("gift")?.addEventListener("click", () => showScreen(1));
    $("unlock")?.addEventListener("click", unlock);
    $("n3")?.addEventListener("click", openLetter);
    $("n4")?.addEventListener("click", showMemories);
    $("n5")?.addEventListener("click", showReasons);
    $("n6")?.addEventListener("click", () => showScreen(6));
    $("yes")?.addEventListener("click", showFinal);
    $("again")?.addEventListener("click", resetWebsite);
    $("music")?.addEventListener("click", toggleMusic);

    $("db")?.addEventListener("keydown", (event) => {
      if (event.key === "Enter") unlock();
    });

    $("nm")?.addEventListener("keydown", (event) => {
      if (event.key === "Enter") $("db")?.focus();
    });

    $("no")?.addEventListener("click", () => {
      noClicks += 1;

      const messages = [
        "Konjam yosichu paaru 🙈",
        "Please? Oru cute Yes sollu 💗",
        "Un answer enakku romba special 🥹",
        "Seri, un choice-ai naan respect panren 💕"
      ];

      const button = $("no");
      if (button) button.textContent = messages[Math.min(noClicks - 1, messages.length - 1)];
    });

    $("lb")?.addEventListener("click", (event) => {
      if (event.target === $("lb")) closeLightbox();
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeLightbox();
    });

    window.addEventListener("resize", () => {
      const canvas = $("fx");
      if (canvas) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      }
    });

    showScreen(0);
  }

  document.addEventListener("DOMContentLoaded", init);
})();