/* ============================================================================
   PROTOCOL: PREMIUM UTILITARIAN MINIMALISM & EDITORIAL UI (script.js)
   - Uses IntersectionObserver exclusively for scroll-entry reveals (Zero scroll listeners)
   - Handles container-less accordion toggles (+ / −)
   - Handles <kbd> 1-4 keyboard micro-UI shortcuts
   ============================================================================ */

(function () {
  "use strict";

  // 1. Scroll Entry via IntersectionObserver (600ms cubic-bezier(0.16, 1, 0.3, 1))
  const revealElements = document.querySelectorAll(".reveal-block");
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      function (entries, obs) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px -24px 0px" }
    );

    revealElements.forEach(function (el) {
      observer.observe(el);
    });
  } else {
    revealElements.forEach(function (el) {
      el.classList.add("is-visible");
    });
  }

  // 2. Container-less Accordion Toggles (+ / −)
  const triggers = document.querySelectorAll(".accordion-trigger");
  triggers.forEach(function (btn) {
    btn.addEventListener("click", function () {
      const item = btn.closest(".accordion-item");
      const icon = btn.querySelector(".accordion-icon");
      const isOpen = item.classList.contains("open");

      if (isOpen) {
        item.classList.remove("open");
        btn.setAttribute("aria-expanded", "false");
        if (icon) icon.textContent = "+";
      } else {
        item.classList.add("open");
        btn.setAttribute("aria-expanded", "true");
        if (icon) icon.textContent = "−";
      }
    });
  });

  // 3. Keystroke Micro-UI Shortcuts (<kbd>1</kbd> - <kbd>4</kbd>)
  document.addEventListener("keydown", function (event) {
    if (event.target.tagName === "INPUT" || event.target.tagName === "TEXTAREA") {
      return;
    }
    if (["1", "2", "3", "4"].indexOf(event.key) !== -1) {
      const targetCard = document.getElementById("skill-cluster-" + event.key);
      if (targetCard) {
        targetCard.scrollIntoView({ behavior: "smooth", block: "center" });
        targetCard.style.borderColor = "#111111";
        setTimeout(function () {
          targetCard.style.borderColor = "#EAEAEA";
        }, 1200);
      }
    }
  });
})();
