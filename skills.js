document.addEventListener("DOMContentLoaded", function () {
  // Device Detection
  const detectDevice = () => {
    const ua = navigator.userAgent;
    if (/mobile/i.test(ua)) return "mobile";
    if (/tablet/i.test(ua)) return "tablet";
    return "desktop";
  };
  document.body.setAttribute("data-device", detectDevice());

  // Cloud Storage Integration
  const CLOUD_STORAGE_KEY = "eduPathCareer";
  const saveToCloud = (data) => localStorage.setItem(CLOUD_STORAGE_KEY, JSON.stringify(data));
  const loadFromCloud = () => JSON.parse(localStorage.getItem(CLOUD_STORAGE_KEY) || "{}");

  // Job Matching
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

    const filterJobs = () => {
      const category = jobCategory.value;
      const level = jobLevel.value;
      jobList.innerHTML = "";

      jobs.filter(job => 
        (category === "all" || job.category === category) &&
        (level === "all" || job.level === level)
      ).forEach(job => {
        const jobItem = document.createElement("div");
        jobItem.className = "job-item";
        jobItem.innerHTML = `<h3>${job.title}</h3><p>Category: ${job.category} | Level: ${job.level}</p>`;
        jobList.appendChild(jobItem);
      });

      useTool("Job Finder", 10);
    };

    searchJobs.addEventListener("click", filterJobs);
    jobCategory.addEventListener("change", filterJobs);
    jobLevel.addEventListener("change", filterJobs);
    filterJobs(); // Initial load
  }

  // Resume Builder
  window.generateResume = function () {
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
      saveToCloud({ name, email, skills, template, timestamp: new Date().toISOString() });
      alert("Resume generated and saved! View your preview above.");
      useTool("Resume Creator", 20);
    } else {
      alert("Please fill in all required fields.");
    }
  };

  // Career Resource Center
  window.openResource = function (type) {
    alert(`Opening ${type}... (This would link to actual resources in a full implementation)`);
    useTool("Career Explorer", 5);
  };

  window.openAssessment = function () {
    document.getElementById("start-assessment-btn").click();
  };

  // Industry Partners
  window.connectPartner = function (partner) {
    alert(`Connecting with ${partner}... (This would initiate a connection in a full implementation)`);
    useTool("Partner Connector", 15);
  };

  // Gamification
  const useTool = (badgeName, pointsToAdd) => {
    let data = loadFromCloud();
    data.points = (data.points || 0) + pointsToAdd;
    data.badges = data.badges || [];

    if (pointsToAdd > 0) {
      document.getElementById("user-points").textContent = data.points;
    }

    if (badgeName === "Career Explorer" && !data.badges.includes("Career Explorer")) {
      data.badges.push("Career Explorer");
      document.getElementById("career-explorer").style.display = "inline-block";
      alert("Congratulations! You've earned the Career Explorer badge!");
    } else if (badgeName === "Resume Creator" && !data.badges.includes("Resume Creator")) {
      data.badges.push("Resume Creator");
      document.getElementById("resume-creator").style.display = "inline-block";
      alert("Congratulations! You've earned the Resume Creator badge!");
    } else if (badgeName === "Job Finder" && !data.badges.includes("Job Finder")) {
      data.badges.push("Job Finder");
      document.getElementById("job-finder").style.display = "inline-block";
      alert("Congratulations! You've earned the Job Finder badge!");
    } else if (badgeName === "Partner Connector" && !data.badges.includes("Partner Connector")) {
      data.badges.push("Partner Connector");
      document.getElementById("partner-connector").style.display = "inline-block";
      alert("Congratulations! You've earned the Partner Connector badge!");
    }

    saveToCloud(data);
  };

  // Initialize Gamification Display
  const initGamification = () => {
    const data = loadFromCloud();
    if (data.points) {
      document.getElementById("user-points").textContent = data.points;
    }
    if (data.badges) {
      data.badges.forEach(badge => {
        if (badge === "Career Explorer") document.getElementById("career-explorer").style.display = "inline-block";
        if (badge === "Resume Creator") document.getElementById("resume-creator").style.display = "inline-block";
        if (badge === "Job Finder") document.getElementById("job-finder").style.display = "inline-block";
        if (badge === "Partner Connector") document.getElementById("partner-connector").style.display = "inline-block";
      });
    }
  };

  initGamification();

  // Calendar Integration
  const calendar = document.getElementById("calendar");
  const taskName = document.getElementById("task-name");
  const taskDate = document.getElementById("task-date");
  const taskTime = document.getElementById("task-time");
  const taskSelect = document.getElementById("task-select");
  const newDeadline = document.getElementById("new-deadline");
  const reminderTask = document.getElementById("reminder-task");
  const reminderInterval = document.getElementById("reminder-interval");

  let events = loadFromCloud().events || [];

  const updateCalendar = () => {
    if (calendar) {
      const today = new Date();
      calendar.innerHTML = `<h3>${today.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</h3>`;
      events.forEach(event => {
        const eventDate = new Date(event.date + " " + event.time);
        if (eventDate.toDateString() === today.toDateString()) {
          const eventDiv = document.createElement("div");
          eventDiv.className = "calendar-event" + (event.isDeadline ? " deadline" : "");
          eventDiv.textContent = `${event.name} ${event.isDeadline ? "(Deadline)" : ""} at ${event.time}`;
          calendar.appendChild(eventDiv);
        }
      });
    }
  };

  // Scheduling Options
  window.scheduleTask = function () {
    const name = taskName.value.trim();
    const date = taskDate.value;
    const time = taskTime.value;
    if (name && date && time) {
      events.push({ name, date, time, isDeadline: false });
      saveToCloud({ ...loadFromCloud(), events });
      taskName.value = "";
      taskDate.value = "";
      taskTime.value = "";
      updateCalendar();
      updateTaskSelect();
      useTool("Scheduler", 10);
    } else {
      alert("Please fill in all fields.");
    }
  };

  // Deadline Adjustment
  window.adjustDeadline = function () {
    const selectedTask = taskSelect.value;
    const newDate = newDeadline.value;
    if (selectedTask && newDate) {
      const event = events.find(e => e.name === selectedTask);
      if (event) {
        event.date = newDate;
        event.isDeadline = true;
        saveToCloud({ ...loadFromCloud(), events });
        updateCalendar();
        updateTaskSelect();
        alert("Deadline updated successfully!");
      }
    } else {
      alert("Please select a task and provide a new date.");
    }
  };

  // Flexible Reminder System
  window.setReminder = function () {
    const task = reminderTask.value;
    const interval = reminderInterval.value;
    if (task && interval) {
      const event = events.find(e => e.name === task);
      if (event) {
        const reminderTime = new Date(event.date + " " + event.time);
        reminderTime.setMinutes(reminderTime.getMinutes() - interval);
        const now = new Date();
        const timeDiff = reminderTime - now;
        if (timeDiff > 0) {
          setTimeout(() => {
            const notification = document.getElementById("feedback-message");
            notification.textContent = `Reminder: ${task} is due at ${event.time}!`;
            notification.className = "reminder-notification";
            notification.style.display = "block";
            setTimeout(() => {
              notification.style.display = "none";
            }, 10000);
          }, timeDiff);
          alert(`Reminder set for ${task} ${interval} minutes before due time.`);
        } else {
          alert("Cannot set reminder for a past time.");
        }
      }
    } else {
      alert("Please select a task and reminder interval.");
    }
  };

  const updateTaskSelect = () => {
    taskSelect.innerHTML = "<option value=''>Select Task</option>";
    reminderTask.innerHTML = "<option value=''>Select Task</option>";
    events.forEach(event => {
      taskSelect.innerHTML += `<option value="${event.name}">${event.name}</option>`;
      reminderTask.innerHTML += `<option value="${event.name}">${event.name}</option>`;
    });
  };

  updateCalendar();
  updateTaskSelect();
});