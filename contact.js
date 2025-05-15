document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("contact-form");
  const feedback = document.getElementById("form-feedback");

  // Device Detection
  const detectDevice = () => {
    const ua = navigator.userAgent;
    if (/mobile/i.test(ua)) return "mobile";
    if (/tablet/i.test(ua)) return "tablet";
    return "desktop";
  };
  document.body.setAttribute("data-device", detectDevice());

  // Cloud Storage Integration (Simulated with localStorage)
  const CLOUD_STORAGE_KEY = "eduPathContact";
  const saveToCloud = (data) => localStorage.setItem(CLOUD_STORAGE_KEY, JSON.stringify(data));

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    feedback.classList.remove("error", "success");
    feedback.textContent = "";

    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const phone = form.phone.value.trim();
    const subject = form.subject.value.trim();
    const message = form.message.value.trim();
    const consent = form.consent.checked;

    // Basic Validation
    if (!name || !email || !message || !consent) {
      feedback.textContent = "Please fill in all required fields and agree to the privacy policy.";
      feedback.classList.add("error");
      feedback.style.color = "#c0392b";
      feedback.style.padding = "1rem 0";
      return;
    }

    // Simulate successful submission
    feedback.textContent = "Thank you for contacting us! We'll get back to you soon.";
    feedback.classList.add("success");
    feedback.style.color = "#2e7d32";
    feedback.style.padding = "1rem 0";
    saveToCloud({ name, email, phone, subject, message, timestamp: new Date().toISOString() });

    // Reset form
    form.reset();
  });

  // Accessibility: Shift focus to feedback if error/success
  const observer = new MutationObserver(() => {
    if (feedback.textContent.length > 0) {
      feedback.focus();
    }
  });

  observer.observe(feedback, { childList: true });
});