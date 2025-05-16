//Fahim Abdullah

// Simulating DOMPurify for XSS mitigation (replace with actual library in production)
const sanitizeInput = (input) => {
  const div = document.createElement('div');
  div.textContent = input;
  return div.innerHTML;
};

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

  // Analytics Tracking
  window.trackEvent = function (category, action, label) {
    const eventData = {
      event: "userInteraction",
      category: category,
      action: action,
      label: label,
      timestamp: new Date().toISOString(),
      page: window.location.pathname
    };
    console.log("Analytics Event:", eventData); // Simulating analytics call
  };

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
      trackEvent("Job Matching", "Filter", `${jobCategory.value}-${jobLevel.value}`);
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

      useTool("Job Finder", 10);
      jobList.focus();
    };

    searchJobs.addEventListener("click", filterJobs);
    jobCategory.addEventListener("change", filterJobs);
    jobLevel.addEventListener("change", filterJobs);
    filterJobs(); // Initial load
    trackEvent("Page View", "Load", "Career Tools");
  }

  // Resume Builder with Inline Validation and Reset Confirmation
  window.generateResume = function () {
    trackEvent("Resume Builder", "Generate", "Resume Created");
    const name = document.getElementById("resume-name");
    const email = document.getElementById("resume-email");
    const skills = document.getElementById("resume-skills");
    const template = document.getElementById("template-select").value;
    const preview = document.getElementById("resume-preview");

    const validateField = (element, messageId) => {
      if (!element.value.trim()) {
        element.setCustomValidity(messageId);
        element.reportValidity();
        return false;
      }
      element.setCustomValidity('');
      return true;
    };

    if (validateField(name, "Please enter your full name.") &&
        validateField(email, "Please enter a valid email.") &&
        validateField(skills, "Please list your skills.")) {
      const sanitizedName = sanitizeInput(name.value.trim());
      const sanitizedEmail = sanitizeInput(email.value.trim());
      const sanitizedSkills = sanitizeInput(skills.value.trim());
      preview.innerHTML = `
        <h3>${sanitizedName}'s Resume</h3>
        <p>Email: ${sanitizedEmail}</p>
        <p>Skills: ${sanitizedSkills}</p>
        <p>Template: ${template}</p>
      `;
      saveToCloud({ name: sanitizedName, email: sanitizedEmail, skills: sanitizedSkills, template, timestamp: new Date().toISOString() });
      alert("Resume generated and saved! View your preview above.");
      useTool("Resume Creator", 20);
      preview.focus();
    } else {
      name.focus();
    }
  };

  // Reset Form with Confirmation
  window.resetResumeForm = function () {
    trackEvent("Resume Builder", "Reset", "Form Reset Attempted");
    if (confirm("Are you sure you want to reset the form? All unsaved data will be lost.")) {
      document.getElementById("resume-name").value = "";
      document.getElementById("resume-email").value = "";
      document.getElementById("resume-skills").value = "";
      document.getElementById("resume-preview").innerHTML = "";
      trackEvent("Resume Builder", "Reset", "Form Reset Confirmed");
      alert("Form has been reset.");
    }
  };

  // Career Resource Center
  window.openResource = function (type) {
    trackEvent("Career Resource", "Open", type);
    alert(`Opening ${type}... (This would link to actual resources in a full implementation)`);
    useTool("Career Explorer", 5);
  };

  window.openAssessment = function () {
    trackEvent("Skill Assessment", "Start", "Assessment Initiated");
    document.getElementById("start-assessment-btn").click();
  };

  // Industry Partners
  window.connectPartner = function (partner) {
    trackEvent("Industry Partners", "Connect", partner);
    alert(`Connecting with ${partner}... (This would initiate a connection in a full implementation)`);
    useTool("Partner Connector", 15);
  };

  // Gamification
  const useTool = (badgeName, pointsToAdd) => {
    trackEvent("Gamification", "Earn", badgeName);
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
    } else if (badgeName === "Scheduler" && !data.badges.includes("Scheduler")) {
      data.badges.push("Scheduler");
      alert("Congratulations! You've earned the Scheduler badge!");
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
    trackEvent("Calendar", "Update", "Calendar Refreshed");
    if (calendar) {
      const today = new Date();
      calendar.innerHTML = `<h3>${today.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</h3>`;
      events.forEach(event => {
        const eventDate = new Date(event.date + " " + event.time);
        if (eventDate.toDateString() === today.toDateString()) {
          const eventDiv = document.createElement("div");
          eventDiv.className = "calendar-event" + (event.isDeadline ? " deadline" : "");
          eventDiv.setAttribute("role", "listitem");
          eventDiv.setAttribute("tabindex", "0");
          eventDiv.textContent = `${event.name} ${event.isDeadline ? "(Deadline)" : ""} at ${event.time}`;
          eventDiv.addEventListener("click", () => {
            trackEngagement("task_completion");
            eventDiv.style.textDecoration = "line-through";
            eventDiv.setAttribute("aria-label", `${event.name} completed`);
          });
          eventDiv.addEventListener("keypress", (e) => {
            if (e.key === "Enter" || e.key === " ") {
              trackEngagement("task_completion");
              eventDiv.style.textDecoration = "line-through";
              eventDiv.setAttribute("aria-label", `${event.name} completed`);
            }
          });
          calendar.appendChild(eventDiv);
        }
      });
    }
  };

  // Scheduling Options with Inline Validation
  window.scheduleTask = function () {
    trackEvent("Calendar", "Schedule", "Task Added");
    const name = document.getElementById("task-name");
    const date = document.getElementById("task-date");
    const time = document.getElementById("task-time");

    const validateField = (element, messageId) => {
      if (!element.value.trim()) {
        element.setCustomValidity(messageId);
        element.reportValidity();
        return false;
      }
      element.setCustomValidity('');
      return true;
    };

    if (validateField(name, "Please enter a task name.") &&
        validateField(date, "Please select a date.") &&
        validateField(time, "Please select a time.")) {
      events.push({ name: name.value.trim(), date: date.value, time: time.value, isDeadline: false });
      saveToCloud({ ...loadFromCloud(), events });
      name.value = "";
      date.value = "";
      time.value = "";
      updateCalendar();
      updateTaskSelect();
      useTool("Scheduler", 10);
      calendar.focus();
    } else {
      name.focus();
    }
  };

  // Deadline Adjustment with Inline Validation
  window.adjustDeadline = function () {
    trackEvent("Calendar", "Adjust", "Deadline Updated");
    const selectedTask = document.getElementById("task-select");
    const newDate = document.getElementById("new-deadline");

    const validateField = (element, messageId) => {
      if (!element.value) {
        element.setCustomValidity(messageId);
        element.reportValidity();
        return false;
      }
      element.setCustomValidity('');
      return true;
    };

    if (validateField(selectedTask, "Please select a task.") &&
        validateField(newDate, "Please select a new deadline.")) {
      const event = events.find(e => e.name === selectedTask.value);
      if (event) {
        event.date = newDate.value;
        event.isDeadline = true;
        saveToCloud({ ...loadFromCloud(), events });
        updateCalendar();
        updateTaskSelect();
        alert("Deadline updated successfully!");
        calendar.focus();
      }
    } else {
      selectedTask.focus();
    }
  };

  // Flexible Reminder System with Inline Validation
  // Fahim Abdullah
  window.setReminder = function () {
    trackEvent("Notifications", "Set", "Reminder Added");
    const reminderTask = document.getElementById("reminder-task");
    const reminderInterval = document.getElementById("reminder-interval");

    const validateField = (element, messageId) => {
      if (!element.value) {
        element.setCustomValidity(messageId);
        element.reportValidity();
        return false;
      }
      element.setCustomValidity('');
      return true;
    };
    if (validateField(reminderTask, "Please select a task.") &&
        validateField(reminderInterval, "Please select a reminder interval.")) {
      const task = reminderTask.value;
      const interval = reminderInterval.value;
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
            notification.setAttribute("tabindex", "0");
            notification.addEventListener("click", () => trackEngagement("notification_click"));
            notification.addEventListener("keypress", (e) => {
              if (e.key === "Enter" || e.key === " ") {
                trackEngagement("notification_click");
              }
            });
            notification.focus();
            setTimeout(() => {
              notification.style.display = "none";
            }, 10000);
            if (loadFromCloud().browserNotifications) {
              sendBrowserNotification(`Reminder: ${task}`, `Due at ${event.time}`);
            }
            if (loadFromCloud().emailReminders) {
              simulateEmailReminder(task, event.time);
            }
          }, timeDiff);
          alert(`Reminder set for ${task} ${interval} minutes before due time.`);
        } else {
          alert("Cannot set reminder for a past time.");
        }
      }
    } else {
      reminderTask.focus();
    }
  };

  // Notification Preferences with Opt-In Confirmation
  window.toggleBrowserNotifications = function () {
    trackEvent("Notifications", "Toggle", "Browser Notifications");
    const checkbox = document.getElementById("browser-notifications");
    if (checkbox.checked) {
      if (confirm("Enable browser notifications? This will allow reminders to pop up.")) {
        let data = loadFromCloud();
        data.browserNotifications = true;
        saveToCloud(data);
      } else {
        checkbox.checked = false;
      }
    } else {
      let data = loadFromCloud();
      data.browserNotifications = false;
      saveToCloud(data);
    }
  };

  window.toggleEmailReminders = function () {
    trackEvent("Notifications", "Toggle", "Email Reminders");
    const checkbox = document.getElementById("email-reminders");
    let data = loadFromCloud();
    data.emailReminders = checkbox.checked;
    saveToCloud(data);
  };

  const sendBrowserNotification = (title, body) => {
    if ("Notification" in window && Notification.permission === "granted") {
      new Notification(title, { body });
    }
  };

  const simulateEmailReminder = (task, time) => {
    console.log(`Simulating email reminder for ${task} at ${time}`);
  };

  const updateTaskSelect = () => {
    taskSelect.innerHTML = "<option value=''>Select Task</option>";
    reminderTask.innerHTML = "<option value=''>Select Task</option>";
    events.forEach(event => {
      taskSelect.innerHTML += `<option value="${event.name}">${event.name}</option>`;
      reminderTask.innerHTML += `<option value="${event.name}">${event.name}</option>`;
    });
  };

  // Engagement Tracking
  const trackEngagement = (type) => {
    trackEvent("Engagement", type, "Tracked");
    let data = loadFromCloud();
    data.engagement = data.engagement || { notificationClicks: 0, totalNotifications: 0, taskCompletions: 0 };

    if (type === "notification_click") {
      data.engagement.notificationClicks = (data.engagement.notificationClicks || 0) + 1;
      data.engagement.totalNotifications = (data.engagement.totalNotifications || 0) + 1;
    } else if (type === "task_completion") {
      data.engagement.taskCompletions = (data.engagement.taskCompletions || 0) + 1;
    }

    const ctr = data.engagement.totalNotifications > 0 
      ? ((data.engagement.notificationClicks / data.engagement.totalNotifications) * 100).toFixed(2) 
      : 0;
    document.getElementById("ctr").textContent = `${ctr}%`;
    document.getElementById("task-completion").textContent = data.engagement.taskCompletions || 0;

    saveToCloud(data);
  };
  // Fahim Abdullah
  // Initialize Engagement Stats
  const initEngagementStats = () => {
    const data = loadFromCloud();
    if (data.engagement) {
      const ctr = data.engagement.totalNotifications > 0 
        ? ((data.engagement.notificationClicks / data.engagement.totalNotifications) * 100).toFixed(2) 
        : 0;
      document.getElementById("ctr").textContent = `${ctr}%`;
      document.getElementById("task-completion").textContent = data.engagement.taskCompletions || 0;
    }
  };

  updateCalendar();
  updateTaskSelect();
  initEngagementStats();

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

  // Back-to-Top Button Functionality (Simulated)
  window.scrollToTop = function () {
    trackEvent("Navigation", "Scroll", "Back to Top");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
});