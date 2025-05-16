// Sayem Alvi (S371489)
export function generateResume() {
  import('./career-core.js').then(module => module.trackEvent("Resume Builder", "Generate", "Resume Created"));
  const name = document.getElementById("resume-name").value.trim();
  const email = document.getElementById("resume-email").value.trim();
  const skills = document.getElementById("resume-skills").value.trim();
  const template = document.getElementById("template-select").value;
  const preview = document.getElementById("resume-preview");

  if (name && email && skills) {
    preview.innerHTML = `
      <h3>${name}'s Resume</h3>
      <p>Email: ${email}</p>
      <p>Skills: ${skills}</p>
      <p>Template: ${template}</p>
    `;
    import('./career-core.js').then(module => {
      module.saveToCloud({ name, email, skills, template, timestamp: new Date().toISOString() });
      alert("Resume generated and saved! View your preview above.");
      module.useTool("Resume Creator", 20);
    });
    preview.focus();
  } else {
    alert("Please fill in all required fields.");
    document.getElementById("resume-name").focus();
  }
}