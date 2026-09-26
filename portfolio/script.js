// Minimalist Editorial Portfolio Script
document.addEventListener("DOMContentLoaded", () => {
  const sections = document.querySelectorAll("main section[id]");
  const navLinks = document.querySelectorAll(".nav-links a");

  if ("IntersectionObserver" in window && sections.length && navLinks.length) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute("id");
            navLinks.forEach((link) => {
              if (link.getAttribute("href") === `#${id}`) {
                link.style.color = "#111111";
                link.style.fontWeight = "600";
              } else {
                link.style.color = "";
                link.style.fontWeight = "";
              }
            });
          }
        });
      },
      { rootMargin: "-20% 0px -65% 0px" }
    );

    sections.forEach((section) => observer.observe(section));
  }
});
