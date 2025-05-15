document.addEventListener("DOMContentLoaded", function () {
  // Device Detection
  const detectDevice = () => {
    const ua = navigator.userAgent;
    if (/mobile/i.test(ua)) return "mobile";
    if (/tablet/i.test(ua)) return "tablet";
    return "desktop";
  };
  document.body.setAttribute("data-device", detectDevice());

  // Cloud Storage Integration (Simulated with localStorage)
  const CLOUD_STORAGE_KEY = "eduPathAbout";
  const saveToCloud = (data) => localStorage.setItem(CLOUD_STORAGE_KEY, JSON.stringify(data));
  const loadFromCloud = () => JSON.parse(localStorage.getItem(CLOUD_STORAGE_KEY) || "{}");

  // Enable keyboard interaction on team members with sync
  const teamMembers = document.querySelectorAll(".team-member");

  teamMembers.forEach(member => {
    member.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        const name = member.querySelector("h3").textContent;
        alert(`You're viewing details for ${name}.`);
        saveToCloud({ viewedTeam: name, timestamp: new Date().toISOString() });
      }
    });
  });

  // Highlight section headings on focus (for accessibility demo)
  const headings = document.querySelectorAll("h2");

  headings.forEach(heading => {
    heading.setAttribute("tabindex", "-1");
    heading.addEventListener("focus", () => {
      heading.style.outline = "2px solid #2e5fb2";
    });
    heading.addEventListener("blur", () => {
      heading.style.outline = "none";
    });
  });
});