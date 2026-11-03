
/* Kuttachi Romantic Website
   Memories gallery enhancement only */

(() => {
  const captions = [
    "A little moment, a lifetime of happiness",
    "My favourite smile, my favourite person",
    "Every memory with you is special",
    "You make my ordinary days beautiful",
    "A moment I wish I could relive",
    "With you, everything feels right",
    "One more memory, one more reason to love you"
  ];

  function enhanceMemories() {
    const gallery = document.getElementById("strip");
    if (!gallery) return;

    const cards = gallery.querySelectorAll(".pol");

    cards.forEach((card, index) => {
      // Add captions without duplicating existing captions.
      let caption = card.querySelector(".memory-caption");

      if (!caption) {
        caption = document.createElement("div");
        caption.className = "memory-caption";
        caption.textContent = captions[index % captions.length];
        card.appendChild(caption);
      }

      // Animate cards when they enter the screen.
      if (!card.dataset.memoryEnhanced) {
        card.dataset.memoryEnhanced = "true";

        if ("IntersectionObserver" in window) {
          observer.observe(card);
        } else {
          card.classList.add("memory-visible");
        }
      }
    });
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("memory-visible");
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12
  });

  function start() {
    enhanceMemories();

    // Also handle gallery cards added later by the existing script.
    const gallery = document.getElementById("strip");
    if (!gallery) return;

    const mutationObserver = new MutationObserver(() => {
      enhanceMemories();
    });

    mutationObserver.observe(gallery, {
      childList: true
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start);
  } else {
    start();
  }
})();
