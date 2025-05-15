document.addEventListener("DOMContentLoaded", function () {
  const CLOUD_STORAGE_KEY = "eduPathCareer";
  const saveToCloud = (data) => localStorage.setItem(CLOUD_STORAGE_KEY, JSON.stringify(data));
  const loadFromCloud = () => JSON.parse(localStorage.getItem(CLOUD_STORAGE_KEY) || "{}");

  window.trackEvent = function (category, action, label) {
    const eventData = {
      event: "userInteraction",
      category: category,
      action: action,
      label: label,
      timestamp: new Date().toISOString(),
      page: window.location.pathname
    };
    console.log("Analytics Event:", eventData);
  };

  trackEvent("Page View", "Load", "Career Tools");

  // Keyboard Navigation for Menu Toggle
  const menuToggle = document.querySelector(".menu-toggle");
  const navMenu = document.getElementById("nav-menu");
  menuToggle.addEventListener("click", () => {
    const expanded = menuToggle.getAttribute("aria-expanded") === "true";
    menuToggle.setAttribute("aria-expanded", !expanded);
    navMenu.style.display = expanded ? "none" : "flex";
  });

  menuToggle.addEventListener("keypress", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      const expanded = menuToggle.getAttribute("aria-expanded") === "true";
      menuToggle.setAttribute("aria-expanded", !expanded);
      navMenu.style.display = expanded ? "none" : "flex";
    }
  });
});