export function filterJobs() {
  const jobCategory = document.getElementById("job-category");
  const jobLevel = document.getElementById("job-level");
  const searchJobs = document.getElementById("search-jobs");
  const jobList = document.getElementById("job-list");

  if (jobCategory && jobLevel && searchJobs && jobList) {
    const jobs = [
      { title: "Web Developer", category: "web", level: "entry" },
      { title: "Data Analyst", category: "data", level: "mid" },
      { title: "Graphic Designer", category: "design", level: "entry" },
      { title: "Marketing Specialist", category: "marketing", level: "senior" },
    ];

    const filterJobsInternal = () => {
      import('./career-core.js').then(module => module.trackEvent("Job Matching", "Filter", `${jobCategory.value}-${jobLevel.value}`));
      const category = jobCategory.value;
      const level = jobLevel.value;
      jobList.innerHTML = "";

      jobs.filter(job => 
        (category === "all" || job.category === category) &&
        (level === "all" || job.level === level)
      ).forEach(job => {
        const jobItem = document.createElement("div");
        jobItem.className = "job-item";
        jobItem.setAttribute("role", "listitem");
        jobItem.innerHTML = `<h3>${job.title}</h3><p>Category: ${job.category} | Level: ${job.level}</p>`;
        jobList.appendChild(jobItem);
      });

      import('./career-core.js').then(module => module.useTool("Job Finder", 10));
      jobList.focus();
    };

    searchJobs.addEventListener("click", filterJobsInternal);
    jobCategory.addEventListener("change", filterJobsInternal);
    jobLevel.addEventListener("change", filterJobsInternal);
    filterJobsInternal(); // Initial load
  }
}