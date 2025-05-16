// Wasi Anower (S381758)
export function toggleBrowserNotifications() {
  import('./career-core.js').then(module => module.trackEvent("Notifications", "Toggle", "Browser Notifications"));
  const checkbox = document.getElementById("browser-notifications");
  if (checkbox.checked) {
    if (confirm("Enable browser notifications? This will allow reminders to pop up.")) {
      import('./career-core.js').then(module => {
        let data = module.loadFromCloud();
        data.browserNotifications = true;
        module.saveToCloud(data);
      });
    } else {
      checkbox.checked = false;
    }
  } else {
    import('./career-core.js').then(module => {
      let data = module.loadFromCloud();
      data.browserNotifications = false;
      module.saveToCloud(data);
    });
  }
}

export function toggleEmailReminders() {
  import('./career-core.js').then(module => module.trackEvent("Notifications", "Toggle", "Email Reminders"));
  const checkbox = document.getElementById("email-reminders");
  import('./career-core.js').then(module => {
    let data = module.loadFromCloud();
    data.emailReminders = checkbox.checked;
    module.saveToCloud(data);
  });
}

export function setReminder() {
  import('./career-core.js').then(module => module.trackEvent("Notifications", "Set", "Reminder Added"));
  const task = document.getElementById("reminder-task").value;
  const interval = document.getElementById("reminder-interval").value;
  if (task && interval) {
    const events = module.loadFromCloud().events || [];
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
          if (module.loadFromCloud().browserNotifications) {
            sendBrowserNotification(`Reminder: ${task}`, `Due at ${event.time}`);
          }
          if (module.loadFromCloud().emailReminders) {
            simulateEmailReminder(task, event.time);
          }
        }, timeDiff);
        alert(`Reminder set for ${task} ${interval} minutes before due time.`);
      } else {
        alert("Cannot set reminder for a past time.");
      }
    }
  } else {
    alert("Please select a task and reminder interval.");
    document.getElementById("reminder-task").focus();
  }
}

function trackEngagement(type) {
  import('./career-core.js').then(module => module.trackEvent("Engagement", type, "Tracked"));
  let data = module.loadFromCloud();
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
  module.saveToCloud(data);
}

function sendBrowserNotification(title, body) {
  if ("Notification" in window && Notification.permission === "granted") {
    new Notification(title, { body });
  }
}

function simulateEmailReminder(task, time) {
  console.log(`Simulating email reminder for ${task} at ${time}`);
}